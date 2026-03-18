import { useContext, useState, useEffect } from 'react';
import { ReactReduxContext } from 'react-redux';
import PillButton from '../../utils/components/PillButton';
import {
  faArrowLeft,
  faMapMarkerAlt,
  faEraser,
  faCloudUploadAlt
} from '@fortawesome/free-solid-svg-icons';
import svCircle from '../../theme/icons/drawtools_circle.svg';
import svPolygon from '../../theme/icons/drawtools_polygon.svg';
import svLinestring from '../../theme/icons/drawtools_linestring.svg';
import strings from '../../translations';
import { theme } from '../../theme/theme';
import {
  setActiveTool,
  setGeoJsonArray,
  removeFromDrawToolMarkers,
  setIsSaveGeometriesOpen
} from '../../state/slices/uiSlice';
import { removeMarkerRequest } from '../../state/slices/rpcSlice';
import { useSelector } from 'react-redux';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';

const DrawingTools = ({
  setPanelIndex,
  geoJsonArray,
  drawToolMarkers,
  onLineUnitChange
}) => {
  const { store } = useContext(ReactReduxContext);
  const { channel } = useSelector((state) => state.rpc);
  const { activeTool } = useSelector((state) => state.ui);

  const LOCAL_STORAGE_KEY = 'lineUnitPreference';
  const [lineUnit, setLineUnit] = useState('metric');

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved === 'metric' || saved === 'nautical') {
        setLineUnit(saved === 'nautical' ? 'nautical' : 'metric');
      }
    } catch (e) {
      // ignore localStorage errors
    }
  }, []);

  const measurementFormatForApi = (unit) =>
    unit === 'metric' ? 'metric' : 'nauticalMiles';

  const drawingToolsData = {
    linestring: {
      id: 'linestring',
      name: strings.tooltips.drawingTools.linestring,
      style: { icon: svLinestring },
      type: 'LineString'
    },
    polygon: {
      id: 'polygon',
      name: strings.tooltips.drawingTools.polygon,
      style: { icon: svPolygon },
      type: 'Polygon'
    },
    circle: {
      id: 'circle',
      name: strings.tooltips.drawingTools.circle,
      style: { icon: svCircle },
      type: 'Circle'
    },
    marker: {
      id: 'marker',
      name: strings.tooltips.drawingTools.marker,
      style: { icon: faMapMarkerAlt }
    }
  };

  const resetTools = () => {
    store.dispatch(setActiveTool(null));
  };

  const startStopTool = (tool) => {
    if (!tool) return;
    if (tool.id !== activeTool) {
      if (activeTool)
        channel?.postRequest('DrawTools.StopDrawingRequest', [activeTool]);
      channel?.postRequest('DrawTools.StartDrawingRequest', [
        tool.id,
        tool.type,
        {
          showMeasureOnMap: true,
          measurementFormat: measurementFormatForApi(lineUnit)
        }
      ]);
      store.dispatch(setActiveTool(tool.id));
    } else {
      channel?.postRequest('DrawTools.StopDrawingRequest', [activeTool]);
      resetTools();
    }
  };

  const addMarker = (tool) => {
    if (tool.id !== activeTool) {
      if (activeTool)
        channel?.postRequest('DrawTools.StopDrawingRequest', [activeTool]);
      store.dispatch(setActiveTool(tool.id));
    } else {
      resetTools();
    }
  };

  const eraseDrawing = () => {
    channel?.postRequest('DrawTools.StopDrawingRequest', []);
    store.dispatch(setGeoJsonArray([]));
    store.dispatch(removeFromDrawToolMarkers(true));
    drawToolMarkers.forEach((marker) => {
      store.dispatch(removeMarkerRequest({ markerId: marker.markerId }));
      store.dispatch(removeFromDrawToolMarkers(marker.markerId));
    });
    if (activeTool !== 'marker') {
      store.dispatch(setActiveTool(null));
    }
    startStopTool(drawingToolsData[activeTool]);
  };

  const handleAddGeometry = () => {
    store.dispatch(setIsSaveGeometriesOpen(true));
    startStopTool(drawingToolsData[activeTool]);
  };

  // When user changes the unit, persist and (if the active tool is linestring) restart it so the new
  // measurementFormat is applied immediately.
  const handleLineUnitChange = (event) => {
    const value = event.target.value; // 'metric' or 'nautical'
    setLineUnit(value);
    try {
      window.localStorage.setItem(
        LOCAL_STORAGE_KEY,
        value === 'nautical' ? 'nautical' : 'metric'
      );
    } catch (e) {
      // ignore localStorage write errors
    }

    // If the currently active tool is the linestring, restart it with new measurementFormat
    if (activeTool === 'linestring') {
      // stop then start again so measurement format updates
      channel?.postRequest('DrawTools.StopDrawingRequest', [activeTool]);
      channel?.postRequest('DrawTools.StartDrawingRequest', [
        'linestring',
        drawingToolsData.linestring.type,
        {
          showMeasureOnMap: true,
          measurementFormat: measurementFormatForApi(value)
        }
      ]);
      // keep store in sync
      store.dispatch(setActiveTool('linestring'));
    }
    // notify parent ToolsPanel so it can update swiper autoHeight
    onLineUnitChange?.(value);
  };

  // Styles for the expanding radio container (light blue background + transition)
  const radioContainerBase = {
    borderRadius: 8,
    padding: activeTool === 'linestring' ? '8px 8px 0 8px' : '0 8px',
    overflow: 'hidden',
    transition: 'opacity 220ms ease, padding 220ms ease',
    maxHeight: activeTool === 'linestring' ? 'none' : 0,
    opacity: activeTool === 'linestring' ? 1 : 0
  };

  return (
    <>
      <PillButton
        id={'return-to-menubar-tools-panel'}
        key={'menubar-tools-panel'}
        onClick={() => {
          startStopTool(drawingToolsData[activeTool]);
          setPanelIndex(0);
        }}
        icon={faArrowLeft}
        text={strings.back}
        aria-label={'return-to-menubar-tools-panel'}
      />

      {/* Linestring button */}
      <div>
        <PillButton
          id={'drawing-tools-linestring'}
          key={'linestring'}
          onClick={() => startStopTool(drawingToolsData.linestring)}
          icon={svLinestring}
          color={
            activeTool === 'linestring'
              ? theme.colors.buttonSelected
              : undefined
          }
          text={strings.tooltips.drawingTools.linestring}
          aria-label={strings.tooltips.drawingTools.linestring}
          style={{width: '100%'}}
        />

        {/* Radio container appears only when linestring is active; it transitions in/out */}
        <div
          style={radioContainerBase}
          aria-hidden={activeTool !== 'linestring'}
        >
          <RadioGroup
            row
            aria-label="line-unit"
            name="line-unit-group"
            value={lineUnit}
            onChange={handleLineUnitChange}
            sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
          >
            <FormControlLabel
              sx={{ marginLeft: '0px' }}
              value="metric"
              control={<Radio size="small" sx={{ padding: '0px' }} />}
              label="Metrit"
            />
            <FormControlLabel
              sx={{ marginLeft: '0px' }}
              value="nautical"
              control={<Radio size="small" sx={{ padding: '0px' }} />}
              label="Merimailit"
            />
          </RadioGroup>
        </div>
      </div>
      <PillButton
        id={'drawing-tools-polygon'}
        key={'polygon'}
        onClick={() => startStopTool(drawingToolsData.polygon)}
        icon={svPolygon}
        color={
          activeTool === 'polygon' ? theme.colors.buttonSelected : undefined
        }
        text={strings.tooltips.drawingTools.polygon}
        aria-label={strings.tooltips.drawingTools.polygon}
      />
      <PillButton
        id={'drawing-tools-circle'}
        key={'circle'}
        onClick={() => startStopTool(drawingToolsData.circle)}
        icon={svCircle}
        color={
          activeTool === 'circle' ? theme.colors.buttonSelected : undefined
        }
        text={strings.tooltips.drawingTools.circle}
        aria-label={strings.tooltips.drawingTools.circle}
      />
      <PillButton
        id={'drawing-tools-add-marker'}
        key={'marker'}
        icon={faMapMarkerAlt}
        onClick={() => {
          startStopTool(drawingToolsData[activeTool]);
          setPanelIndex(2);
          addMarker(drawingToolsData.marker);
        }}
        text={strings.tooltips.drawingTools.marker}
        aria-label={strings.tooltips.drawingTools.marker}
      />
      <PillButton
        id={'drawing-tools-erase-drawing'}
        key={'erase'}
        disabled={geoJsonArray.length === 0 && drawToolMarkers.length <= 0}
        onClick={eraseDrawing}
        icon={faEraser}
        color={theme.colors.secondaryColorOrange}
        hoverColor={theme.colors.secondaryColorDarkOrange}
        text={strings.tooltips.drawingTools.erase}
        aria-label={strings.tooltips.drawingTools.erase}
      />
      <PillButton
        id={'drawing-tools-save-geometry'}
        key={'save-geometry-button'}
        onClick={handleAddGeometry}
        disabled={!geoJsonArray.length && drawToolMarkers.length <= 0}
        icon={faCloudUploadAlt}
        color={theme.colors.secondaryColorGreen}
        hoverColor={theme.colors.secondaryColorGreenSelected}
        text={strings.general.save}
        aria-label={strings.general.save}
      />
    </>
  );
};

export default DrawingTools;
