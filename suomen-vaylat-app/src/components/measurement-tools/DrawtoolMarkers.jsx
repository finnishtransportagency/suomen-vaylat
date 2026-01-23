import { useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'motion/react';
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
  faTimes
} from '@fortawesome/free-solid-svg-icons';

import { useSelector } from 'react-redux';
import strings from '../../translations';
import { setSelectedMarker, setMarkerLabel } from '../../state/slices/uiSlice';

import { theme } from '../../theme/theme';

const StyledOptionsWrapper = styled.div`
  z-index: 100;
  display: flex;
  flex-direction: column;
  padding: 0px;
  white-space: nowrap;
  border-radius: 6px;
  color: ${(props) => props.theme.colors.mainColor1};
  font-weight: 600;
  overflow: visible;
  width: 100%;
`;

const StyledOptionButtonsWrapper = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  @media ${({ theme }) => theme.device.mobileL} {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StyledOptionsButton = styled(motion.button)`
  font-weight: 600;
  font-size: 15px;
  display: flex;
  min-height: 38.5px;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 30px;
  padding: 8px 16px;
  transition: background-color 0.2s ease;
  background-color: ${({ shape, selected }) =>
    selected
      ? shape === 7
        ? theme.colors.secondaryColorDarkOrangeSelected
        : theme.colors.buttonSelected
      : shape === 7
      ? theme.colors.secondaryColorDarkOrange
      : theme.colors.button};

  svg,
  img {
    width: 16px !important;
    height: 16px !important;
    opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  }

  @media ${({ theme }) => theme.device.mobileL} {
    min-height: 31.5px;
    font-size: 13px;
    padding: 6px 12px;
    width: 20p svg, img {
      width: 10px !important;
      height: 10px !important;
    }
  }
`;

const StyledOptionsIcon = styled(FontAwesomeIcon)`
  font-size: 15px;
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
  width: 100%;
  position: relative; /* Needed for positioning the x button */
`;

const StyledLabelInput = styled.input`
  padding: 5px 28px 5px 5px; /* extra right padding for x button */
  border: 1px solid ${theme.colors.mainColor1};
  border-radius: 5%;
  width: 100%;
  @media ${({ theme }) => theme.device.mobileL} {
    font-size: 13px;
  }
`;

const StyledClearButton = styled.button`
  position: absolute;
  right: 4px;
  top: 60%;
  transform: translateY(-50%);
  height: 22px;
  width: 22px;
  border: none;
  background: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.mainColor1};
  opacity: 0.7;
  padding: 0;
  display: ${(props) => (props.show ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;

  &:hover,
  &:focus {
    opacity: 1;
    color: ${({ theme }) => theme.colors.secondaryColorDarkOrange};
  }

  svg {
    width: 18px;
    height: 18px;
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
  const clearLabel = () => setLabel('');

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
            selected={shape.id === selectedMarker}
            shape={shape.id}
          >
            <StyledOptionsIcon icon={shape.icon} />
          </StyledOptionsButton>
        ))}
      </StyledOptionButtonsWrapper>
      <StyledInputWrapper>
        <StyledLabelInput
          id={'markers-label-input'}
          key={'markers-label-input'}
          value={label}
          onChange={handleChange}
          onKeyUp={handleKeyUp}
          placeholder={strings.tooltips.drawingTools.labelPlaceholder}
          aria-label={strings.tooltips.drawingTools.labelPlaceholder}
        />
        <StyledClearButton
          type="button"
          show={!!label}
          onClick={clearLabel}
          tabIndex={label ? 0 : -1}
          aria-label={strings.tooltips.drawingTools.clearLabel ?? 'Clear label'}
        >
          <FontAwesomeIcon icon={faTimes} />
        </StyledClearButton>
      </StyledInputWrapper>
    </StyledOptionsWrapper>
  );
};

export default DrawtoolMarkers;
