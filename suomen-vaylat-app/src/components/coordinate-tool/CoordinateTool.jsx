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
import {
  addToDrawToolMarkers,
  setIsSaveViewOpen,
  setSavedTab,
  setShowSavedContentGeometryForm
} from '../../state/slices/uiSlice';
import { theme } from '../../theme/theme';
import { faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const StyledCoordinateToolContainer = styled.div`
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StyledMapCenterButton = styled.button`
  display: flex;
  align-items: center;
  height: 2.5em;
  width: 100%;
  justify-content: center;
  color: ${(props) =>
    props.disabled
      ? props.theme.colors.disabledColor
      : props.theme.colors.mainWhite};
  background-color: ${(props) =>
    props.disabled
      ? props.theme.colors.disabledBg
      : props.theme.colors.mainColor1};
  border-radius: 20px;
  box-shadow: 0px 1px 3px #0000001f;
  border: none;
  margin: 0.5em 0 0.5em 0;
  padding: 12px;
  &:hover {
    background-color: ${(props) =>
      props.disabled
        ? props.theme.colors.disabledBg
        : props.theme.colors.mainColor1Selected};
  }
`;

const StyledMarkerAdditionButton = styled.button`
  display: flex;
  align-items: center;
  height: 2.5em;
  width: 100%;
  justify-content: center;
  color: ${(props) =>
    props.disabled
      ? props.theme.colors.disabledColor
      : props.theme.colors.mainWhite};
  background-color: ${(props) =>
    props.disabled
      ? props.theme.colors.disabledBg
      : props.theme.colors.mainColor1};
  border-radius: 20px;
  box-shadow: 0px 1px 3px #0000001f;
  border: none;
  margin: 0.5em 0 0.5em 0;
  padding: 12px;
  &:hover {
    background-color: ${(props) =>
      props.disabled
        ? props.theme.colors.disabledBg
        : props.theme.colors.mainColor1Selected};
  }
`;

const StyledCoordinateSelect = styled(ReactSelect)`
  .react-select__control {
    border-radius: 4px;
  }
`;

const StyledLabelControl = styled(FormControlLabel)`
  align-items: center;
  color: #333;
`;

const StyledButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
`;

const StyledInstructionText = styled.p`
  margin-bottom: 0px;
`;

const StyledCoordinateInput = styled.input`
  width: 100%;
  padding-left: 12px;
  font-size: 16px;
  padding-top: 10px;
  border-radius: 4px;
  border: 2px solid hsl(0, 0%, 80%);
  padding: 5px 10px;
`;

const StyledActionBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const StyledMarkerDeleteButton = styled.button`
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

const StyledMarkerSaveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  cursor: pointer;
  height: 2.5em;
  background-color: ${(props) => props.theme.colors.secondaryColorGreen};
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
      props.theme.colors.secondaryColorGreenSelected};
  }
`;

const StyledInputSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: 1em;
`;

const StyledInputField = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const StyledButtonLabel = styled.span`
  margin: 0px;
`;

const StyledWarningMessage = styled.p`
  font-size: 12px;
  color: red;
  margin: 0;
`;

const StyledCoordinateSystemSection = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

const StyledCoordinateIndicator = styled.span`
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

const CoordinateTool = () => {
  const { channel, center, currentZoomLevel, coordMarkerIndex } = useSelector(
    (state) => state.rpc
  );
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

  const handleSaveMarkers = () => {
    store.dispatch(setIsSaveViewOpen(true));
    store.dispatch(setSavedTab("geometry"));
    store.dispatch(setShowSavedContentGeometryForm(true));
  };

  const handleAddMarker = () => {
    const newMarkerId = `coordinate_tool_marker_${coordMarkerIndex}`;
    const customMarker = {
        x: mapCenter.x,
        y: mapCenter.y,
        msg: `${mapCenter.y}, ${mapCenter.x}`,
        markerId: newMarkerId,
        color: theme.colors.secondaryColorOrange,
        size: 5
      };
    store.dispatch(
      addMarkerRequest(customMarker)
    );
    store.dispatch(addToDrawToolMarkers(customMarker));
    
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
    <StyledCoordinateToolContainer
      id="coordinate-tool-container"
      role="region"
      aria-labelledby="coordinate-tool-title"
    >
      <h2 id="coordinate-tool-title" hidden>
        Coordinate Tool
      </h2>
      <StyledCoordinateSystemSection id="coordinate-tool-coordinate-system-section">
        <StyledInstructionText id="coordinate-tool-coordinate-system-title">
          {strings.coordinateTool.coordinateSystemTitle}
        </StyledInstructionText>
        <b id="coordinate-tool-coordinate-system-value">
          {strings.coordinateTool.coordinateSystem}
        </b>
      </StyledCoordinateSystemSection>

      {/* Do not add this option yet */}
      {/* <StyledCoordinateSelect id="coordinate-tool-coordinate-system-select" */}
      {/*   value={{ label: formData.coordinateSystem, value: formData.coordinateSystem }} */}
      {/*   onChange={(option) => handleChange('coordinateSystem', option.value)} */}
      {/*   options={[ */}
      {/*       { value: 'ETRS-TM35FIN', label: 'ETRS-TM35FIN' }, */}
      {/*   ]} */}
      {/*   aria-label="Select coordinate system" */}
      {/* /> */}

      <StyledInputSection id="coordinate-tool-input-section-y">
        <StyledCoordinateIndicator id="coordinate-tool-coordinate-indicator-n">
          {strings.coordinateTool.n}
        </StyledCoordinateIndicator>
        <StyledInputField id="coordinate-tool-input-field-y">
          <StyledCoordinateInput
            id="coordinate-tool-coordinate-input-y"
            type="text"
            aria-labelledby="coordinate-tool-coordinate-indicator-n"
            aria-describedby="coordinate-tool-warning-message-y"
            value={mapCenter.y}
            onChange={(e) => handleInputChange('y', e.target.value)}
            placeholder={strings.gfifiltering.placeholders.chooseValue}
          />
          {!isValidY && (
            <StyledWarningMessage id="coordinate-tool-warning-message-y">
              {strings.coordinateTool.onlyNumbers}
            </StyledWarningMessage>
          )}
        </StyledInputField>
      </StyledInputSection>

      <StyledInputSection id="coordinate-tool-input-section-x">
        <StyledCoordinateIndicator id="coordinate-tool-coordinate-indicator-e">
          {strings.coordinateTool.e}
        </StyledCoordinateIndicator>
        <StyledInputField id="coordinate-tool-input-field-x">
          <StyledCoordinateInput
            id="coordinate-tool-coordinate-input-x"
            type="text"
            aria-labelledby="coordinate-tool-coordinate-indicator-e"
            aria-describedby="coordinate-tool-warning-message-x"
            value={mapCenter.x}
            onChange={(e) => handleInputChange('x', e.target.value)}
            placeholder={strings.gfifiltering.placeholders.chooseValue}
          />
          {!isValidX && (
            <StyledWarningMessage id="coordinate-tool-warning-message-x">
              {strings.coordinateTool.onlyNumbers}
            </StyledWarningMessage>
          )}
        </StyledInputField>
      </StyledInputSection>

      {/* Not available through RPC yet */}
      {/* <StyledLabelControl */}
      {/*   id="coordinate-tool-label-control" */}
      {/*   control={ */}
      {/*     <Checkbox */}
      {/*       checked={formData.selectFromMap} */}
      {/*       onChange={(e) => handleChange('selectFromMap', e.target.checked)} */}
      {/*     /> */}
      {/*   } */}
      {/*   label="Show cursor coordinates on map" */}
      {/* /> */}

      <StyledActionBox id="coordinate-tool-action-box">
        <StyledButtonGroup id="coordinate-tool-button-group">
          <StyledMapCenterButton
            id="coordinate-tool-map-center-button"
            disabled={!hasCoordsChanged() || !isValidX || !isValidY}
            onClick={handleCenterMap}
            aria-label={strings.coordinateTool.centerMap}
          >
            <StyledButtonLabel>
              {strings.coordinateTool.centerMap}
            </StyledButtonLabel>
          </StyledMapCenterButton>
          <StyledMarkerAdditionButton
            id="coordinate-tool-marker-addition-button"
            onClick={handleAddMarker}
            disabled={!isValidX || !isValidY}
            aria-label={strings.coordinateTool.addMarker}
          >
            <StyledButtonLabel>
              {strings.coordinateTool.addMarker}
            </StyledButtonLabel>
          </StyledMarkerAdditionButton>
        </StyledButtonGroup>
        {coordMarkerIndex > 0 && (
          <>
            
            <StyledMarkerSaveButton
              id="coordinate-tool-marker-save-button"
              onClick={() => handleSaveMarkers()}
              aria-label={strings.coordinateTool.saveMarkers}
            >
              <FontAwesomeIcon
                icon={faSave}
                size="6x"
                style={{ marginRight: '1em' }}
              />
              <StyledButtonLabel>
                {strings.coordinateTool.saveMarkers}
              </StyledButtonLabel>
            </StyledMarkerSaveButton>
            <StyledMarkerDeleteButton
              id="coordinate-tool-marker-delete-button"
              onClick={() => handleDeleteMarkers()}
              aria-label={strings.coordinateTool.deleteMarkers}
            >
              <FontAwesomeIcon
                icon={faTrash}
                size="6x"
                style={{ marginRight: '1em' }}
              />
              <StyledButtonLabel>
                {strings.coordinateTool.deleteMarkers}
              </StyledButtonLabel>
            </StyledMarkerDeleteButton>
          </>
        )}
      </StyledActionBox>
    </StyledCoordinateToolContainer>
  );
};

export default CoordinateTool;
