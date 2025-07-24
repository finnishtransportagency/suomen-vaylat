import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { theme } from '../../theme/theme';
import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { FormControlLabel } from '@mui/material';
import ReactSelect from 'react-select';
import strings from '../../translations';
import { useSelector } from 'react-redux';
import { ReactReduxContext } from 'react-redux';
import {
  addMarkerRequest,
  removeMarkerRequest,
  setCoordMarkerIndex
} from '../../state/slices/rpcSlice';
import { setIsCoordinateToolOpen } from '../../state/slices/uiSlice';
import { useAppSelector } from '../../state/hooks';

const StyledMobileCoordsContainer = styled(motion.div)`
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  background: ${(props) => props.theme.colors.mainWhite};
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
  @media ${(props) => props.theme.device.mobileL} {
    font-size: 13px;
  }
`;

const StyledCoordToolsContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StyledCenterMapButton = styled.button`
  display: flex;
  align-items: center;
  height: 2.5em;
  width: 100%;
  justify-content: center;
  color: ${(props) => props.theme.colors.mainWhite};
  background-color: ${(props) =>
    props.disabled
      ? props.theme.colors.darkGrey
      : props.theme.colors.mainColor1};
  border-radius: 20px;
  box-shadow: 0px 1px 3px #0000001f;
  border: none;
  margin: 0.5em 0;
  padding: 12px;
  &:hover {
    background-color: ${(props) =>
      props.disabled
        ? props.theme.colors.darkGrey
        : props.theme.colors.mainColor1Selected};
  }
`;

const StyledAddMarkerButton = styled.button`
  display: flex;
  align-items: center;
  height: 2.5em;
  width: 100%;
  justify-content: center;
  color: ${(props) => props.theme.colors.mainWhite};
  background-color: ${(props) =>
    props.disabled
      ? props.theme.colors.darkGrey
      : props.theme.colors.mainColor1};
  border-radius: 20px;
  box-shadow: 0px 1px 3px #0000001f;
  border: none;
  margin: 0.5em 0;
  padding: 12px;
  &:hover {
    background-color: ${(props) =>
      props.disabled
        ? props.theme.colors.darkGrey
        : props.theme.colors.mainColor1Selected};
  }
`;

const StyledSelect = styled(ReactSelect)`
  .react-select__control {
    border-radius: 4px;
  }
`;

const StyledFormControlLabel = styled(FormControlLabel)`
  align-items: center;
  color: #333;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
`;

const StyledCoordinateToolText = styled.p`
  margin-bottom: 0px;
`;

const StyledInput = styled.input`
  width: 100%;
  padding-left: 12px;
  font-size: 16px;
  padding-top: 10px;
  border-radius: 4px;
  border: 2px solid hsl(0, 0%, 80%);
  padding: 5px 10px;
`;

const StyledButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledTrashButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  cursor: pointer;
  height: 2.5em;
  background-color: ${(props) => props.theme.colors.secondaryColorDarkOrange};
  color: ${(props) => props.theme.colors.mainWhite};
  svg {
    font-size: 16px;
  }
  border-radius: 20px;
  box-shadow: 0px 1px 3px #0000001f;
  border: none;
  padding: 12px;
  &:hover {
    background-color: ${(props) =>
      props.theme.colors.secondaryColorDarkOrangeSelected};
  }
`;

const StyledInputContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1em;
`;

const StyledInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const StyledButtonText = styled.span`
  margin: 0px;
`;

const ValidationMessage = styled.p`
  font-size: 12px;
  color: red;
  margin: 0;
`;

const StyledCoordinateSystemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

const StyledRoundedBox = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 45px;
  height: 35px;
  border-radius: 20%;
  background-color: ${(props) => props.theme.colors.mainColor3transparent30};
  color: black;
  font-weight: bold;
`;

const StyledHeaderContent = styled.div`
  height: 56px;
  z-index: 1;
  display: flex;
  border-radius: 4px 4px 0px 0px;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) => props.theme.colors.mainColor1};
  padding: 16px;
  box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.2);
  p {
    margin: 0px;
    font-size: 18px;
    font-weight: bold;
    color: ${(props) => props.theme.colors.mainWhite};
  }
  svg {
    color: ${(props) => props.theme.colors.mainWhite};
  }
`;

const StyledTitleContent = styled.div`
  display: flex;
  align-items: center;
  svg {
    font-size: 20px;
    margin-right: 8px;
  }
`;

const StyledCloseIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
  font-size: 20px;
`;

const StyledGroupsContainer = styled.div`
  overflow-y: auto;
  padding: 8px 4px 8px 8px;
`;

const listVariants = {
  visible: {
    y: 0,
    opacity: 1,
    pointerEvents: 'auto',
    filter: 'blur(0px)',
    transition: {
      duration: 0.3,
      type: 'tween'
    }
  },
  hidden: {
    y: '100%',
    opacity: 0,
    pointerEvents: 'none',
    filter: 'blur(10px)'
  }
};

const CoordinateToolMobile = () => {
  const { channel, center, currentZoomLevel, coordMarkerIndex } = useSelector(
    (state) => state.rpc
  );
  const { isCoordinateToolOpen } = useAppSelector((state) => state.ui);
  const { store } = useContext(ReactReduxContext);
  const [mapCenter, setMapCenter] = useState({
    x: Math.round(center.x),
    y: Math.round(center.y)
  });
  const [isValidX, setIsValidX] = useState(true);
  const [isValidY, setIsValidY] = useState(true);

  const handleDeleteMarkers = () => {
    for (let i = 0; i < coordMarkerIndex; i++) {
      const markerId = `coordinate_tool_marker_${i}`;
      store.dispatch(removeMarkerRequest({ markerId }));
      store.dispatch(setCoordMarkerIndex(0));
    }
  };

  useEffect(() => {
    if (!hasCoordsChanged()) {
      return;
    }

    setIsValidX(true);
    setIsValidY(true);

    setMapCenter({ x: Math.round(center.x), y: Math.round(center.y) });
  }, [center]);

  const handleInputChange = (key, value) => {
    const isNumeric = /^\d*$/.test(value);

    if (key === 'x') {
      setIsValidX(isNumeric);
    } else {
      setIsValidY(isNumeric);
    }

    setMapCenter((prevMapCenter) => ({
      ...prevMapCenter,
      [key]: value
    }));
  };

  const handleAddMarker = () => {
    const newMarkerId = `coordinate_tool_marker_${coordMarkerIndex}`;
    store.dispatch(
      addMarkerRequest({
        x: mapCenter.x,
        y: mapCenter.y,
        msg: `${mapCenter.y}, ${mapCenter.x}`,
        markerId: newMarkerId,
        color: theme.colors.secondaryColorOrange,
        size: 5
      })
    );
    store.dispatch(setCoordMarkerIndex(coordMarkerIndex + 1)); // Increment index after adding a marker
  };

  const handleCenterMap = () => {
    channel.postRequest('MapMoveRequest', [
      mapCenter.x,
      mapCenter.y,
      currentZoomLevel
    ]);
  };

  const hasCoordsChanged = () => {
    return (
      Math.round(center.x) !== Number(mapCenter.x) ||
      Math.round(center.y) !== Number(mapCenter.y)
    );
  };

  return (
    <StyledMobileCoordsContainer
      id="coordinate-tool-mobile-container"
      key="coordinate-tool-mobile-container"
      initial="hidden"
      animate={isCoordinateToolOpen ? 'visible' : 'hidden'}
      variants={listVariants}
      drag="y"
      dragConstraints={{ top: 0, bottom: 240 }}
      dragElastic={0.2}
      aria-labelledby="coordinate-tool-mobile-title"
    >
      <StyledHeaderContent>
        <StyledTitleContent>
          <p id="coordinate-tool-mobile-title">{strings.coordinateTool.title}</p>
        </StyledTitleContent>
        <StyledCloseIcon
          aria-label={strings.coordinateTool.closeCoordinateTool}
          icon={faTimes}
          onClick={() => store.dispatch(setIsCoordinateToolOpen(false))}
        />
      </StyledHeaderContent>
      <StyledCoordToolsContainer>
        <StyledCoordinateSystemWrapper>
          <StyledCoordinateToolText id="coordinate-tool-coordinate-system-title">
            {strings.coordinateTool.coordinateSystemTitle}
          </StyledCoordinateToolText>
          <b id="coordinate-tool-coordinate-system-value">
            {strings.coordinateTool.coordinateSystem}
          </b>
        </StyledCoordinateSystemWrapper>

        {/** Do not add this option yet
         <div>
            <Typography>Valitse koordinaatisto</Typography>
            <StyledSelect
            value={{ label: formData.coordinateSystem, value: formData.coordinateSystem }}
            onChange={(option) => handleChange('coordinateSystem', option.value)}
            options={[
                { value: 'ETRS-TM35FIN', label: 'ETRS-TM35FIN' },
            ]}
            />
        </div>
       */}

        <StyledInputContainer>
          <StyledRoundedBox id="coordinate-tool-lat-label">
            {strings.coordinateTool.n}
          </StyledRoundedBox>
          <StyledInputWrapper>
            <StyledInput
              id="coordinate-tool-lat-input"
              type="text"
              aria-labelledby="coordinate-tool-lat-label"
              value={mapCenter.y}
              onChange={(e) => handleInputChange('y', e.target.value)}
              placeholder={strings.gfifiltering.placeholders.chooseValue}
            />
            {!isValidY && (
              <ValidationMessage id="coordinate-tool-lat-validation">
                {strings.coordinateTool.onlyNumbers}
              </ValidationMessage>
            )}
          </StyledInputWrapper>
        </StyledInputContainer>

        <StyledInputContainer>
          <StyledRoundedBox id="coordinate-tool-lon-label">
            {strings.coordinateTool.e}
          </StyledRoundedBox>
          <StyledInputWrapper>
            <StyledInput
              id="coordinate-tool-lon-input"
              type="text"
              aria-labelledby="coordinate-tool-lon-label"
              value={mapCenter.x}
              onChange={(e) => handleInputChange('x', e.target.value)}
              placeholder={strings.gfifiltering.placeholders.chooseValue}
            />
            {!isValidX && (
              <ValidationMessage id="coordinate-tool-lon-validation">
                {strings.coordinateTool.onlyNumbers}
              </ValidationMessage>
            )}
          </StyledInputWrapper>
        </StyledInputContainer>

        <StyledButtonsContainer>
          <ButtonContainer>
            <StyledCenterMapButton
              id="coordinate-tool-center-map-button"
              disabled={!hasCoordsChanged() || !isValidX || !isValidY}
              onClick={handleCenterMap}
              aria-label={strings.coordinateTool.centerMap}
            >
              <StyledButtonText>
                {strings.coordinateTool.centerMap}
              </StyledButtonText>
            </StyledCenterMapButton>
            <StyledAddMarkerButton
              id="coordinate-tool-add-marker-button"
              onClick={handleAddMarker}
              disabled={!isValidX || !isValidY}
              aria-label={strings.coordinateTool.addMarker}
            >
              <StyledButtonText>
                {strings.coordinateTool.addMarker}
              </StyledButtonText>
            </StyledAddMarkerButton>
          </ButtonContainer>
          {coordMarkerIndex > 0 && (
            <StyledTrashButton
              id="coordinate-tool-delete-markers-button"
              onClick={() => handleDeleteMarkers()}
              aria-label={strings.coordinateTool.deleteMarkers}
            >
              <StyledButtonText>
                {strings.coordinateTool.deleteMarkers}
              </StyledButtonText>
              <FontAwesomeIcon icon={faTrash} style={{ marginLeft: '.5em' }} />
            </StyledTrashButton>
          )}
        </StyledButtonsContainer>
      </StyledCoordToolsContainer>
    </StyledMobileCoordsContainer>
  );
};

export default CoordinateToolMobile;