import { useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ReactReduxContext } from 'react-redux';
import { debounce } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEraser,
  faMapMarkerAlt,
  faMapPin,
  faFlag,
  faCircle,
  faArrowDown,
  faCommentAlt,
  faThumbtack,
  faTimes,
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
  setHasToastBeenShown,
  setIsSaveViewOpen,
  setSavedTabIndex,
  setGeoJsonArray,
  setSelectedMarker,
  setMarkerLabel,
  removeFromDrawToolMarkers
} from '../../state/slices/uiSlice';
import { removeMarkerRequest } from '../../state/slices/rpcSlice';

import { theme } from '../../theme/theme';
import { toast } from 'react-toastify';
import { DRAWING_TIP_LOCALSTORAGE } from '../../utils/constants';
import PillButton from '../PillButton/PillButton';

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

  @media ${(props) => props.theme.device.lowresDesktop} {
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


const StyledOptionsWrapper = styled(motion.div)`
  position: absolute;
  left: 110%;
  top: 0;
  background-color: ${props => props.theme.colors.mainWhite};
  z-index: 100;
  display: flex;
  flex-direction: column;
  padding: 10px;
  white-space: nowrap;
  box-shadow: 0px 2px 4px #0000004D;
  border-radius: 6px;
  color: ${props => props.theme.colors.mainColor1};
  font-weight: 600;
`;

const StyledOptionButtonsWrapper = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;
`;

const StyledOptionsButton = styled(motion.button)`
  display: flex;
  height: 35px;
  width: 35px;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border: none;
  border-radius: 50%;
  margin: 0 auto;
  padding: 0;
`;

const StyledOptionsIcon = styled(FontAwesomeIcon)`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.mainWhite};
  margin: 0;
  line-height: 1;
  position: relative;
  top: 1px;
`;


const StyledLabelInput = styled.input`
  width: 200px;
  padding: 5px 25px 5px 5px;
  border: 1px solid ${theme.colors.mainColor1};
  border-radius: 5%;
`;

const StyledClearLabelButton = styled.button`
  position: absolute;
  background: none;
  border: none;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    font-size: 16px;
  }

  @media ${({ theme }) => theme.device.mobileL} {
    right: 6px;
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

export const DrawingTools = ({ isOpen, children  }) => {
  const { store } = useContext(ReactReduxContext);
  const { channel } = useSelector(state => state.rpc);
  const { activeTool, geoJsonArray, hasToastBeenShown, selectedMarker, drawToolMarkers } = useSelector(state => state.ui);
  const [showToast, setShowToast] = useState(JSON.parse(localStorage.getItem(DRAWING_TIP_LOCALSTORAGE)));
  const [label, setLabel] = useState('');

  const updateMarkerLabel = label => store.dispatch(setMarkerLabel(label));
  const debouncedChangeHandler = useCallback(debounce(updateMarkerLabel, 300), []);

  const handleChange = e => setLabel(e.target.value);
  const handleKeyUp = e => e.keyCode === 13 && e.target.blur();
  const resetTools = () => {
    store.dispatch(setActiveTool(null));
    setLabel('');
  };

  useEffect(() => {
    if (showToast === false) store.dispatch(setHasToastBeenShown({ toastId: 'drawToast', shown: true }));
  }, [showToast]);

  useEffect(() => {
    if (activeTool === strings.tooltips.drawingTools.marker) setLabel('');
  }, [activeTool]);

  useEffect(() => {
    debouncedChangeHandler(label);
  }, [label]);

  if (activeTool === null) toast.dismiss('drawToast');

  const startStopTool = tool => {
    if (tool.name !== activeTool) {
      channel?.postRequest('DrawTools.StartDrawingRequest', [tool.name, tool.type, { showMeasureOnMap: true }]);
      store.dispatch(setActiveTool(tool.name));
    } else {
      channel?.postRequest('DrawTools.StopDrawingRequest', [activeTool]);
      resetTools();
    }
  };

  const addMarker = tool => {
    if (tool.name !== activeTool) {
      store.dispatch(setActiveTool(tool.name));
    } else {
      resetTools();
    }
  };

  const eraseDrawing = () => {
    channel?.postRequest('DrawTools.StopDrawingRequest', [activeTool]);
    store.dispatch(setGeoJsonArray([]));
    store.dispatch(removeFromDrawToolMarkers(true));
    drawToolMarkers.forEach(marker => {
      store.dispatch(removeMarkerRequest({ markerId: marker.markerId }));
      store.dispatch(removeFromDrawToolMarkers(marker.markerId));
    });
    store.dispatch(setActiveTool(null));
  };

  const handleAddGeometry = () => {
    store.dispatch(setIsSaveViewOpen(true));
    store.dispatch(setSavedTabIndex(1));
  };

  const markerShapes = [
    { id: 0, icon: faThumbtack },
    { id: 1, icon: faCommentAlt },
    { id: 2, icon: faMapMarkerAlt },
    { id: 3, icon: faMapPin },
    { id: 4, icon: faFlag },
    { id: 5, icon: faCircle },
    { id: 6, icon: faArrowDown },
    { id: 7, icon: faTimes }
  ];

  const drawingToolsData = [
    { id: 'linestring', name: strings.tooltips.drawingTools.linestring, style: { icon: svLinestring }, type: 'LineString' },
    { id: 'polygon', name: strings.tooltips.drawingTools.polygon, style: { icon: svPolygon }, type: 'Polygon' },
    { id: 'square', name: strings.tooltips.drawingTools.square, style: { icon: svSquare }, type: 'Square' },
    { id: 'box', name: strings.tooltips.drawingTools.box, style: { icon: svRectangle }, type: 'Box' },
    { id: 'circle', name: strings.tooltips.drawingTools.circle, style: { icon: svCircle }, type: 'Circle' },
    { id: 'marker', name: strings.tooltips.drawingTools.marker, style: { icon: faMapMarkerAlt } },
    { id: 'erase', name: strings.tooltips.drawingTools.erase, style: { icon: faEraser } }
  ];

  return (
    <StyledTools data-hidden={!isOpen} animate={isOpen ? 'show' : 'hidden'} variants={variants}>
      {drawingToolsData.map(tool => {
        if (tool.id === 'marker') {
          return (
            <div key={tool.id} style={{ position: 'relative' }}>
              {tool.name === activeTool && (
                <StyledOptionsWrapper>
                  <StyledOptionButtonsWrapper>
                    {markerShapes.map(shape => (
                      <StyledOptionsButton
                        key={shape.id}
                        onClick={() => store.dispatch(setSelectedMarker(shape.id))}
                        style={{ backgroundColor: shape.id === selectedMarker ? theme.colors.buttonActive : shape.id === 7 ? theme.colors.secondaryColorDarkOrange : theme.colors.button }}
                      >
                        <StyledOptionsIcon icon={shape.icon} />
                      </StyledOptionsButton>
                    ))}
                  </StyledOptionButtonsWrapper>
                  <div style={{ position: 'relative' }}>
                    <StyledLabelInput
                      value={label}
                      onChange={handleChange}
                      onKeyUp={handleKeyUp}
                      placeholder={strings.tooltips.drawingTools.labelPlaceholder}
                    />
                    <StyledClearLabelButton onClick={() => setLabel('')}>
                      <FontAwesomeIcon style={{ color: 'rgba(0, 0, 0, 0.5)' }} icon={faTimes} />
                    </StyledClearLabelButton>
                  </div>
                </StyledOptionsWrapper>
              )}
              <PillButton icon={tool.style.icon} onClick={() => addMarker(tool)}>{tool.name}</PillButton>
            </div>
          );
        }

        if (tool.id === 'erase') {
          return (
            <PillButton
              key={tool.id}
              onClick={eraseDrawing}
              icon={tool.style.icon}
              color={theme.colors.secondaryColorDarkOrange}
              hoverColor={theme.colors.secondaryColorDarkOrange}
            >
              {tool.name}
            </PillButton>
          );
        }

        return (
          <PillButton
            key={tool.id}
            onClick={() => startStopTool(tool)}
            icon={tool.style.icon}
            color={tool.name === activeTool ? theme.colors.buttonActive : undefined}
          >
            {tool.name}
          </PillButton>
        );
      })}

      <PillButton
        key="save-geometry-button"
        onClick={handleAddGeometry}
        disabled={!geoJsonArray.length && drawToolMarkers.length <= 0}
        icon={faCloudUploadAlt}
        color={theme.colors.secondaryColorGreen}
      >
        {strings.savedContent.saveGeometry.saveGeometry}
      </PillButton>
      {children}
    </StyledTools>
  );
};

export default DrawingTools;
