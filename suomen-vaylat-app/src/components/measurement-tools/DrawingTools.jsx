import { useContext } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ReactReduxContext } from 'react-redux';
import {
  faEraser,
  faMapMarkerAlt,
  faCloudUploadAlt
} from '@fortawesome/free-solid-svg-icons';
import svCircle from '../../theme/icons/drawtools_circle.svg';
import svSquare from '../../theme/icons/drawtools_square.svg';
import svRectangle from '../../theme/icons/drawtools_rectangle.svg';
import svPolygon from '../../theme/icons/drawtools_polygon.svg';
import svLinestring from '../../theme/icons/drawtools_linestring.svg';

import { useSelector } from 'react-redux';
import strings from '../../translations';
import {
  setActiveTool,
  setIsSaveViewOpen,
  setSavedTabIndex,
  setGeoJsonArray,
  removeFromDrawToolMarkers
} from '../../state/slices/uiSlice';
import { removeMarkerRequest } from '../../state/slices/rpcSlice';

import { theme } from '../../theme/theme';
import { toast } from 'react-toastify';
import PillButton from '../../utils/components/PillButton';

const StyledTools = styled(motion.div)`
  display: flex;
  flex-direction: column;
  margin: 0;
  border-radius: 12px;
  transition: all 0.3s ease;
  pointer-events: auto;
  gap: 8px;

  @media ${(props) => props.theme.device.mobileL} {
    gap: 6px;
  }

  @media ${(props) => props.theme.device.lowResDesktop} {
    gap: 6px;
  }

  &[data-hidden='true'] {
    max-height: 0;
    opacity: 0;
    padding: 0;
    overflow: hidden;
    pointer-events: none;
  }
`;

const variants = {
  show: {
    height: 'auto',
    opacity: 1,
    transition: { duration: 0.3 },
    pointerEvents: 'auto'
  },
  hidden: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.2 },
    pointerEvents: 'none'
  }
};

export const DrawingTools = ({ isOpen }) => {
  const { store } = useContext(ReactReduxContext);
  const { channel } = useSelector((state) => state.rpc);
  const { activeTool, geoJsonArray, drawToolMarkers } = useSelector(
    (state) => state.ui
  );
  const resetTools = () => {
    store.dispatch(setActiveTool(null));
  };

  if (activeTool === null) toast.dismiss('drawToast');

  const startStopTool = (tool) => {
    if (tool.id !== activeTool) {
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
    store.dispatch(setActiveTool(null));
  };

  const handleAddGeometry = () => {
    store.dispatch(setIsSaveViewOpen(true));
    store.dispatch(setSavedTabIndex(1));
  };

  const drawingToolsData = [
    {
      id: 'linestring',
      name: strings.tooltips.drawingTools.linestring,
      style: { icon: svLinestring },
      type: 'LineString'
    },
    {
      id: 'polygon',
      name: strings.tooltips.drawingTools.polygon,
      style: { icon: svPolygon },
      type: 'Polygon'
    },
    {
      id: 'square',
      name: strings.tooltips.drawingTools.square,
      style: { icon: svSquare },
      type: 'Square'
    },
    {
      id: 'box',
      name: strings.tooltips.drawingTools.box,
      style: { icon: svRectangle },
      type: 'Box'
    },
    {
      id: 'circle',
      name: strings.tooltips.drawingTools.circle,
      style: { icon: svCircle },
      type: 'Circle'
    },
    {
      id: 'marker',
      name: strings.tooltips.drawingTools.marker,
      style: { icon: faMapMarkerAlt }
    },
    {
      id: 'erase',
      name: strings.tooltips.drawingTools.erase,
      style: { icon: faEraser }
    }
  ];

  return (
    <StyledTools
      id="drawing-tools-buttons-wrapper"
      data-hidden={!isOpen}
      animate={isOpen ? 'show' : 'hidden'}
      variants={variants}
    >
      {drawingToolsData.map((tool) => {
        if (tool.id === 'marker') {
          return (
            <PillButton
              key={tool.id}
              id={'drawing-tools-add-marker'}
              icon={tool.style.icon}
              onClick={() => addMarker(tool)}
              aria-label={tool.name}
            >
              {tool.name}
            </PillButton>
          );
        }

        if (tool.id === 'erase') {
          return (
            <PillButton
              id={'drawing-tools-erase-drawing'}
              key={tool.id}
              disabled={geoJsonArray.length === 0}
              onClick={eraseDrawing}
              icon={tool.style.icon}
              color={theme.colors.secondaryColorDarkOrange}
              hoverColor={theme.colors.secondaryColorDarkOrange}
              aria-label={tool.name}
            >
              {tool.name}
            </PillButton>
          );
        }

        return (
          <PillButton
            id={`drawing-tools-${tool.id}`}
            key={tool.id}
            onClick={() => startStopTool(tool)}
            icon={tool.style.icon}
            color={
              tool.id === activeTool ? theme.colors.buttonActive : undefined
            }
            aria-label={tool.name}
          >
            {tool.name}
          </PillButton>
        );
      })}

      <PillButton
        id={'drawing-tools-save-geometry'}
        key="save-geometry-button"
        onClick={handleAddGeometry}
        disabled={!geoJsonArray.length && drawToolMarkers.length <= 0}
        icon={faCloudUploadAlt}
        color={theme.colors.secondaryColorGreen}
        aria-label={strings.savedContent.saveGeometry.saveGeometry}
      >
        {strings.savedContent.saveGeometry.saveGeometry}
      </PillButton>
    </StyledTools>
  );
};

export default DrawingTools;
