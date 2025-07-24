import { useState, useEffect, useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import { useAppSelector } from '../../state/hooks';
import { updateLayers } from '../../utils/rpcUtil';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import strings from '../../translations';
import Moment from 'react-moment';
import { v4 as uuidv4 } from 'uuid';
import {
  setIsSaveViewOpen,
  setWarning,
  addToActiveGeometries,
  removeActiveGeometry,
  removeFromDrawToolMarkers
} from '../../state/slices/uiSlice';
import {
  faPlus,
  faSave,
  faTrash,
  faPen
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Switch } from '@mui/material';
import {
  addMarkerRequest,
  removeMarkerRequest
} from '../../state/slices/rpcSlice';

const StyledSave = styled.button`
  color: ${(props) => props.theme?.colors?.mainWhite};
  background-color: ${(props) => props.theme?.colors?.mainColor1};
  border: none;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 600;
  padding: 10px 36px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: 0.1s;
  svg {
    margin-right: 12px;
    font-size: 16px;
  }
  &:hover {
    background-color: ${(props) => props.theme?.colors?.mainColorselected1};
  }
  &:disabled {
    opacity: 0.45;
    cursor: default;
  }
`;


const StyledForm = styled.form`
  margin-bottom: 28px;
  display: flex;
  flex-direction: column;
`;

const StyledFormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
`;

const StyledLabel = styled.label`
  font-size: 15px;
  color: #292929;
  margin-bottom: 6px;
  font-weight: 500;
`;

const StyledInput = styled.input`
  font-size: 15px;
  padding: 8px 12px;
  border: 1px solid #c7c6c9;
  border-radius: 7px;
  width: 100%;
  background: #f6f7fa;
  outline: none;
  transition: border 0.13s;
  &:focus {
    border-color: #1964e0;
    background: #f0f2ff;
  }
`;

const StyledTextarea = styled.textarea`
  font-size: 15px;
  min-height: 36px;
  padding: 8px 12px;
  border: 1px solid #c7c6c9;
  border-radius: 7px;
  width: 100%;
  background: #f6f7fa;
  outline: none;
  transition: border 0.13s;
  resize: vertical;
  &:focus {
    border-color: #1964e0;
    background: #f0f2ff;
  }
`;

const StyledSwitchRow = styled.div`
  display: flex;
  align-items: center;
  margin-top: 3px;
  margin-bottom: 6px;
`;

const StyledSwitchLabel = styled.div`
  font-size: 15px;
  color: #292929;
  margin-left: 10px;
`;

const StyledButtonsRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-top: 19px;
`;

const StyledCancel = styled.button`
  background: transparent;
  color: #333;
  border: 1px solid #b7bfc8;
  border-radius: 24px;
  font-size: 15px;
  padding: 8px 26px;
  cursor: pointer;
  transition: 0.1s;
  &:hover {
    border-color: #1c478e;
    color: #1c478e;
  }
`;

const ViewForm = ({
  initialData = {},
  onSave,
  onCancel,
  isEditing,
  strings
}) => {
  const [viewName, setViewName] = useState(initialData?.name || '');
  const [viewDescription, setViewDescription] = useState(initialData?.description || '');
  const [includeGeometries, setIncludeGeometries] = useState(initialData?.includeGeometries || false);
  const [isDefault, setIsDefault] = useState(initialData?.isDefault || false);

  useEffect(() => {
    // Reset fields if initialData changes (for edit/new)
    setViewName(initialData?.name || '');
    setViewDescription(initialData?.description || '');
    setIncludeGeometries(initialData?.includeGeometries || false);
    setIsDefault(initialData?.isDefault || false);
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (viewName) {
      onSave({
        ...initialData,
        name: viewName,
        description: viewDescription,
        includeGeometries,
        isDefault
      });
    }
  };

  return (
    <StyledForm onSubmit={handleSubmit} autoComplete="off">
      <StyledFormGroup>
        <StyledLabel htmlFor="view-name">
          {strings.savedContent.saveView.viewName || 'Näkymän nimi'} *
        </StyledLabel>
        <StyledInput
          id="view-name"
          type="text"
          value={viewName}
          maxLength={80}
          onChange={(e) => setViewName(e.target.value)}
          required
        />
      </StyledFormGroup>
      <StyledFormGroup>
        <StyledLabel htmlFor="view-description">
          {strings.savedContent.saveView.description || 'Kuvaus'}
        </StyledLabel>
        <StyledTextarea
          id="view-description"
          value={viewDescription}
          maxLength={200}
          onChange={(e) => setViewDescription(e.target.value)}
        />
      </StyledFormGroup>
      <StyledSwitchRow>
        <Switch
          checked={includeGeometries}
          onChange={(e) => setIncludeGeometries(e.target.checked)}
          color="primary"
          inputProps={{
            'aria-label': strings.savedContent.saveView.includeGeometries
          }}
        />
        <StyledSwitchLabel>
          {strings.savedContent.saveView.includeGeometries ||
            'Tallenna omat geometriat mukaan.'}
        </StyledSwitchLabel>
      </StyledSwitchRow>
      <StyledSwitchRow style={{ alignItems: 'center', justifyContent: 'flex-start', marginBottom: 16 }}>
        <Switch
          checked={isDefault}
          onChange={(e) => setIsDefault(e.target.checked)}
          color="primary"
          inputProps={{
            'aria-label': isDefault
              ? strings.savedContent.saveView.defaultView || 'Poista oletusnäkymä'
              : strings.savedContent.saveView.setDefaultView || 'Aseta oletusnäkymä'
          }}
        />
        <StyledSwitchLabel>
          {isDefault
            ? strings.savedContent.saveView.defaultView || 'Oletusnäkymä'
            : strings.savedContent.saveView.setDefaultView || 'Aseta oletusnäkymä'}
        </StyledSwitchLabel>
      </StyledSwitchRow>
      <StyledButtonsRow>
        <StyledCancel type="button" onClick={onCancel}>
          {strings.general.cancel || 'Peruuta'}
        </StyledCancel>
        <StyledSave type="submit" disabled={!viewName}>
          <FontAwesomeIcon icon={isEditing ? faSave : faPlus} style={{ marginRight: 12 }} />
          {isEditing
            ? strings.savedContent.saveView.saveViewButton || 'Tallenna muutokset'
            : strings.savedContent.saveView.saveViewButton || 'Tallenna karttanäkymä'}
        </StyledSave>
      </StyledButtonsRow>
    </StyledForm>
  );
};

export default ViewForm;
