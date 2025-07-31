import { useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ReactReduxContext } from 'react-redux';
import { debounce } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt,
  faMapPin,
  faFlag,
  faCircle,
  faArrowDown,
  faCommentAlt,
  faThumbtack,
  faTimes,
  faTrash
} from '@fortawesome/free-solid-svg-icons';

import { useSelector } from 'react-redux';
import strings from '../../translations';
import {
  setSelectedMarker,
  setMarkerLabel
} from '../../state/slices/uiSlice';

import { theme } from '../../theme/theme';

const StyledOptionsWrapper = styled.div`
  background-color: ${(props) => props.theme.colors.mainWhite};
  z-index: 100;
  display: flex;
  flex-direction: column;
  padding: 10px;
  white-space: nowrap;
  box-shadow: 0px 2px 4px #0000004d;
  border-radius: 6px;
  color: ${(props) => props.theme.colors.mainColor1};
  font-weight: 600;
  overflow: visible; // Ensure children visible outside constraints
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

const StyledInputWrapper = styled.div`
  padding-top: 8px;
  display: flex;
  align-items: center;
`;

const StyledLabelInput = styled.input`
  width: 200px;
  padding: 5px 25px 5px 5px;
  border: 1px solid ${theme.colors.mainColor1};
  border-radius: 5%;
`;

const StyledTrashIconWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  text-align: end;
  margin: 1em 0 1em 0;
  border: none;
  background: none;
  cursor: pointer;
  color: ${(props) => props.theme.colors.mainColor1};
  svg {
    font-size: 20px;
  }
  &:hover {
    svg {
      color: ${(props) => props.theme.colors.mainColor2};
    }
  }
`;

export const DrawtoolMarkers = () => {
  const { store } = useContext(ReactReduxContext);
  const { activeTool, selectedMarker } = useSelector((state) => state.ui);
  const [label, setLabel] = useState('');

  const updateMarkerLabel = (label) => store.dispatch(setMarkerLabel(label));
  const debouncedChangeHandler = useCallback(
    debounce(updateMarkerLabel, 300),
    []
  );

  const handleChange = (e) => setLabel(e.target.value);
  const handleKeyUp = (e) => e.keyCode === 13 && e.target.blur();

  useEffect(() => {
    if (activeTool === 'marker') setLabel('');
  }, [activeTool]);

  useEffect(() => {
    debouncedChangeHandler(label);
  }, [label]);

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

  return (
    <StyledOptionsWrapper>
      <StyledOptionButtonsWrapper>
        {markerShapes.map((shape) => (
          <StyledOptionsButton
            key={shape.id}
            onClick={() => store.dispatch(setSelectedMarker(shape.id))}
            style={{
              backgroundColor:
                shape.id === selectedMarker
                  ? theme.colors.buttonSelected
                  : shape.id === 7
                  ? theme.colors.secondaryColorDarkOrange
                  : theme.colors.button
            }}
          >
            <StyledOptionsIcon icon={shape.icon} />
          </StyledOptionsButton>
        ))}
      </StyledOptionButtonsWrapper>
      <StyledInputWrapper>
        <StyledLabelInput
          id="markers-label-input"
          value={label}
          onChange={handleChange}
          onKeyUp={handleKeyUp}
          placeholder={strings.tooltips.drawingTools.labelPlaceholder}
        />
        <StyledTrashIconWrapper onClick={() => setLabel('')}>
          <FontAwesomeIcon
            icon={faTrash}
            size="6x"
            style={{ marginLeft: '.5em' }}
          />
        </StyledTrashIconWrapper>
      </StyledInputWrapper>
    </StyledOptionsWrapper>
  );
};

export default DrawtoolMarkers;
