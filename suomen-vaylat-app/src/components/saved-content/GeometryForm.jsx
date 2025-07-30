import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isMobile } from '../../theme/theme';

const MAX_NAME_LENGTH = 80;
const MAX_DESC_LENGTH = 200;

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
    border-color: ${(props) => props.theme?.colors?.mainColor1};
    background: ${(props) => props.theme?.colors?.mainColor3transparent30};
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
    border-color: ${(props) => props.theme?.colors?.mainColor1};
    background: ${(props) => props.theme?.colors?.mainColor3transparent30};
  }
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

const StyledSubtitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.mainColor1};
  margin-top: 1em;
  margin-bottom: 1em;
`;

const StyledCharCounter = styled.span`
  font-size: 12px;
  align-self: flex-end;
  margin-top: 3px;
  color: ${(props) => (props.atMax ? props.theme?.colors?.secondaryColorDarkOrange : props.theme?.colors?.black )};
  font-weight: ${({ atMax }) => (atMax ? 700 : 400)};
  letter-spacing: 0.5px;
`;

const GeometryForm = ({
  initialData = {},
  onSave,
  onCancel,
  itemsToSave,
  strings
}) => {
  const [geometryName, setGeometryName] = useState(initialData.name || '');
  const [geometryDescription, setGeometryDescription] = useState(
    initialData.description || ''
  );

  useEffect(() => {
    setGeometryName(initialData.name || '');
    setGeometryDescription(initialData.description || '');
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (geometryName && itemsToSave) {
      onSave({
        name: geometryName,
        description: geometryDescription
      });
    }
  };

  return (
    <>
      <StyledSubtitle id="geometry-form-title">
        {strings.savedContent.saveGeometry.saveNewGeometry}
      </StyledSubtitle>

      <StyledForm
        onSubmit={handleSubmit}
        autoComplete="off"
        aria-labelledby="geometry-form-title"
        id="geometry-form-main"
      >
        <StyledFormGroup>
          <StyledLabel htmlFor="geometry-form-name">
            {strings.savedContent.saveGeometry.geometryName} *
          </StyledLabel>
          <StyledInput
            id="geometry-form-name"
            name="geometry-form-name"
            type="text"
            value={geometryName}
            placeholder={
              !itemsToSave ? strings.savedContent.saveGeometry.noGeometry : ""
            }
            onChange={(e) => setGeometryName(e.target.value)}
            disabled={!itemsToSave}
            maxLength={80}
            aria-required="true"
            aria-invalid={!geometryName && itemsToSave ? 'true' : 'false'}
          />
          <StyledCharCounter
            id="geometry-form-name-counter"
            atMax={geometryName.length >= MAX_NAME_LENGTH}
            aria-live="polite"
          >
            {geometryName.length} / {MAX_NAME_LENGTH}
          </StyledCharCounter>
        </StyledFormGroup>
        <StyledFormGroup>
          <StyledLabel htmlFor="geometry-form-description">
            {strings.savedContent.description}
          </StyledLabel>
          <StyledTextarea
            id="geometry-form-description"
            name="geometry-form-description"
            value={geometryDescription}
            placeholder={
              !itemsToSave ? strings.savedContent.saveGeometry.noGeometry : ""
            }
            disabled={!itemsToSave}
            onChange={(e) => setGeometryDescription(e.target.value)}
            maxLength={200}
          />
          <StyledCharCounter
            id="geometry-form-desc-counter"
            atMax={geometryDescription.length >= MAX_DESC_LENGTH}
            aria-live="polite"
          >
            {geometryDescription.length} / {MAX_DESC_LENGTH}
          </StyledCharCounter>
        </StyledFormGroup>
        {isMobile ? (
          <StyledButtonsRow>
            <StyledSave
              id="geometry-form-submit-btn"
              type="submit"
              disabled={!geometryName || !itemsToSave}
            >
              <FontAwesomeIcon icon={faSave} />
              {strings.savedContent.saveGeometry.saveGeometryButton}
            </StyledSave>
            <StyledCancel
              id="geometry-form-cancel-btn"
              type="cancel"
              onClick={onCancel}
            >
              {strings.general.cancel}
            </StyledCancel>
          </StyledButtonsRow>
        ) : (
          <StyledButtonsRow>
            <StyledCancel
              id="geometry-form-cancel-btn"
              type="cancel"
              onClick={onCancel}
            >
              {strings.general.cancel}
            </StyledCancel>
            <StyledSave
              id="geometry-form-submit-btn"
              type="submit"
              disabled={!geometryName || !itemsToSave}
            >
              <FontAwesomeIcon icon={faSave} />
              {strings.savedContent.saveGeometry.saveGeometryButton}
            </StyledSave>
          </StyledButtonsRow>
        )}
      </StyledForm>
    </>
  );
};

export default GeometryForm;
