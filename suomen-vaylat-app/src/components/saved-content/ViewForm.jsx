import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Switch } from '@mui/material';
import { isMobile } from '../../theme/theme';

const MAX_NAME_LENGTH = 80;
const MAX_DESC_LENGTH = 200;

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
  justify-content: center;
  transition: 0.1s;
  svg {
    margin-right: 12px;
    font-size: 16px;
  }
  &:hover {
    background-color: ${(props) => props.theme?.colors?.mainColor1Selected};
  }
  &:disabled {
    opacity: 0.45;
    cursor: default;
  }
  @media ${(props) => props.theme.device.mobileL} {
    margin: 18px 0px;
    width: 100%;
  }
`;

const StyledForm = styled.form`
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

const StyledCharCounter = styled.span`
  font-size: 12px;
  align-self: flex-end;
  margin-top: 3px;
  color: ${({ atMax }) => (atMax ? '#d83131' : '#888')};
  font-weight: ${({ atMax }) => (atMax ? 700 : 400)};
  letter-spacing: 0.5px;
`;

const StyledWarning = styled.div`
  color: #d83131;
  font-size: 12px;
  margin-top: 2px;
  align-self: flex-end;
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
  @media ${(props) => props.theme.device.mobileL} {
    flex-direction: column;
  }
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

const StyledSubtitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.mainColor1};
  margin-top: 1em;
  margin-bottom: 1em;
`;

const ViewForm = ({
  initialData = {},
  onSave,
  onCancel,
  isEditing,
  strings
}) => {
  const [viewName, setViewName] = useState(initialData?.name || '');
  const [viewDescription, setViewDescription] = useState(
    initialData?.description || ''
  );
  const [includeGeometries, setIncludeGeometries] = useState(
    initialData?.includeGeometries || false
  );
  const [isDefault, setIsDefault] = useState(initialData?.isDefault || false);

  useEffect(() => {
    setViewName(initialData?.name || '');
    setViewDescription(initialData?.description || '');
    setIncludeGeometries(initialData?.includeGeometries || false);
    setIsDefault(initialData?.isDefault || false);
  }, [initialData]);

  // Handle paste/overflow for name
  const handleNameChange = (e) => {
    let val = e.target.value;
    if (val.length > MAX_NAME_LENGTH) {
      val = val.slice(0, MAX_NAME_LENGTH);
    }
    setViewName(val);
  };

  // Handle paste/overflow for description
  const handleDescChange = (e) => {
    let val = e.target.value;
    if (val.length > MAX_DESC_LENGTH) {
      val = val.slice(0, MAX_DESC_LENGTH);
    }
    setViewDescription(val);
  };

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
    <>
      <StyledSubtitle>
        {strings.savedContent.saveView.saveNewView}
      </StyledSubtitle>

      <StyledForm onSubmit={handleSubmit} autoComplete="off">
        <StyledFormGroup>
          <StyledLabel htmlFor="view-name">
            {strings.savedContent.saveView.viewName} *
          </StyledLabel>
          <StyledInput
            id="view-name"
            type="text"
            value={viewName}
            maxLength={MAX_NAME_LENGTH}
            onChange={handleNameChange}
            required
            aria-describedby="name-char-counter"
          />
          <StyledCharCounter
            id="name-char-counter"
            atMax={viewName.length >= MAX_NAME_LENGTH}
          >
            {viewName.length} / {MAX_NAME_LENGTH}
          </StyledCharCounter>
        </StyledFormGroup>
        <StyledFormGroup>
          <StyledLabel htmlFor="view-description">
            {strings.savedContent.description}
          </StyledLabel>
          <StyledTextarea
            id="view-description"
            value={viewDescription}
            maxLength={MAX_DESC_LENGTH}
            onChange={handleDescChange}
            aria-describedby="desc-char-counter"
          />
          <StyledCharCounter
            id="desc-char-counter"
            atMax={viewDescription.length >= MAX_DESC_LENGTH}
          >
            {viewDescription.length} / {MAX_DESC_LENGTH}
          </StyledCharCounter>
        </StyledFormGroup>
        {/* Lets not add the geometries just yet
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
        */}
        <StyledSwitchRow
          style={{
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginBottom: 16
          }}
        >
          <Switch
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
            color="primary"
            inputProps={{
              'aria-label': isDefault
                ? strings.savedContent.saveView.defaultView
                : strings.savedContent.saveView.setDefaultView
            }}
          />
          <StyledSwitchLabel>
            {isDefault
              ? strings.savedContent.saveView.defaultView
              : strings.savedContent.saveView.setDefaultView
              }
          </StyledSwitchLabel>
        </StyledSwitchRow>
        {isMobile ? (
          <StyledButtonsRow>
            <StyledSave type="submit" disabled={!viewName}>
              <FontAwesomeIcon icon={faSave} style={{ marginRight: 12 }} />
              {isEditing
                ? strings.savedContent.saveView.saveViewButton
                : strings.savedContent.saveView.saveViewButton
                }
            </StyledSave>
            <StyledCancel type="button" onClick={onCancel}>
              {strings.general.cancel}
            </StyledCancel>
          </StyledButtonsRow>
        ) : (
          <StyledButtonsRow>
            <StyledCancel type="button" onClick={onCancel}>
              {strings.general.cancel}
            </StyledCancel>
            <StyledSave type="submit" disabled={!viewName}>
              <FontAwesomeIcon icon={faSave} style={{ marginRight: 12 }} />
              {isEditing
                ? strings.savedContent.saveView.saveViewButton
                : strings.savedContent.saveView.saveViewButton
                }
            </StyledSave>
          </StyledButtonsRow>
        )}
      </StyledForm>
    </>
  );
};

export default ViewForm;
