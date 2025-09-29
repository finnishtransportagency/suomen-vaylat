import { useContext } from 'react';
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

const DrawingTools = ({ setPanelIndex, geoJsonArray, drawToolMarkers }) => {
  const { store } = useContext(ReactReduxContext);
  const { channel } = useSelector((state) => state.rpc);
  const { activeTool } = useSelector((state) => state.ui);

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
      if (activeTool) channel?.postRequest('DrawTools.StopDrawingRequest', [activeTool]);
      channel?.postRequest('DrawTools.StartDrawingRequest', [
        tool.id,
        tool.type,
        { showMeasureOnMap: true }
      ]);
      store.dispatch(setActiveTool(tool.id));
    } else {
      channel?.postRequest('DrawTools.StopDrawingRequest', [activeTool]);
      resetTools();
    }
  };

  const addMarker = (tool) => {
    if (tool.id !== activeTool) {
      if (activeTool) channel?.postRequest('DrawTools.StopDrawingRequest', [activeTool]);
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
      <PillButton
        id={'drawing-tools-linestring'}
        key={'linestring'}
        onClick={() => startStopTool(drawingToolsData.linestring)}
        icon={svLinestring}
        color={
          activeTool === 'linestring' ? theme.colors.buttonSelected : undefined
        }
        text={strings.tooltips.drawingTools.linestring}
        aria-label={strings.tooltips.drawingTools.linestring}
      />
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
        color={theme.colors.secondaryColorDarkOrange}
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
        text={strings.general.save}
        aria-label={strings.general.save}
      />
    </>
  );
};

export default DrawingTools;
