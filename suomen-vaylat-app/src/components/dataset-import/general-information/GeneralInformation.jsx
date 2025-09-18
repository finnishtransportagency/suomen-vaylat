import React from 'react';
import styled from 'styled-components';

import {
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Tooltip,
  Divider
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import strings from '../../../translations';
import ZipFileInput from '../ZipFileInput';

const StyledFlexRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  margin-top: 16px;
`;

const StyledLanguageCheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 28px;
  margin-left: 6px;
`;

const StyledFormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledTextField = styled(TextField)`
  &.MuiTextField-root {
    margin-bottom: 4px;
    background: #fff;
  }
`;

const StyledLabel = styled(Typography)`
  font-weight: 500 !important;
  margin-bottom: 4px !important;
`;

const StyledLangSectionTitle = styled(Typography)`
  font-weight: bold !important;
  margin-bottom: 18px !important;
  margin-top: 0 !important;
`;

const StyledLanguageDivider = styled(Divider)`
  margin-bottom: 12px !important;
`;

const StyledLanguageGroup = styled.div`
  margin-top: 24px;
  margin-bottom: 16px;
`;

const StyledErrorMsg = styled(Typography)`
  color: #d32f2f !important;
  font-size: 12px !important;
  margin: 0 0 10px 0 !important;
  padding: 0 !important;
`;

const GeneralInformation = ({
  fields,
  errors,
  lang,
  setLang,
  uploadedFile,
  setUploadedFile,
  fileError,
  setFileError,
  handleInput,
  isSubmitting
}) => {
  return (
    <div>
      <ZipFileInput
        value={uploadedFile}
        onFileChange={setUploadedFile}
        error={fileError}
        setError={setFileError}
        disabled={isSubmitting}
        id="import-dataset-zipfile"
        aria-labelledby="import-dataset-zipfile-label"
      >
        <StyledFormGroup>
          <Typography
            id="import-dataset-zipfile-label"
            variant="body2"
            component="div"
            style={{ marginBottom: 16 }}
          >
            {strings.datasetImport.infoText}
            <ul style={{ marginBlock: 0 }}>
              {strings.datasetImport.fileList.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            {strings.datasetImport.fileNote}
          </Typography>
        </StyledFormGroup>
      </ZipFileInput>
      {/* Finnish fields */}
      <StyledFormGroup>
        <StyledLabel as="label" htmlFor="import-dataset-finnish-layerName">
          {strings.datasetImport.layerName}
          <span style={{ color: '#c00' }}>*</span>
        </StyledLabel>
        <StyledTextField
          id="import-dataset-finnish-layerName"
          value={fields.fi.name}
          onChange={(e) => handleInput('fi', 'name', e.target.value)}
          fullWidth
          size="small"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
        />
        {errors.fi.name && (
          <StyledErrorMsg id="import-dataset-finnish-layerName-error">
            {strings.datasetImport.validationMsg}
          </StyledErrorMsg>
        )}
      </StyledFormGroup>
      <StyledFormGroup>
        <StyledLabel as="label" htmlFor="import-dataset-finnish-desc">
          {strings.datasetImport.desc}
        </StyledLabel>
        <StyledTextField
          id="import-dataset-finnish-desc"
          value={fields.fi.desc}
          onChange={(e) => handleInput('fi', 'desc', e.target.value)}
          fullWidth
          size="small"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
        />
        {errors.fi.desc && (
          <StyledErrorMsg id="import-dataset-finnish-desc-error">
            {strings.datasetImport.validationMsg}
          </StyledErrorMsg>
        )}
      </StyledFormGroup>
      <StyledFormGroup>
        <StyledLabel as="label" htmlFor="import-dataset-finnish-source">
          {strings.datasetImport.source}
        </StyledLabel>
        <StyledTextField
          id="import-dataset-finnish-source"
          value={fields.fi.source}
          onChange={(e) => handleInput('fi', 'source', e.target.value)}
          fullWidth
          size="small"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
        />
        {errors.fi.source && (
          <StyledErrorMsg id="import-dataset-finnish-source-error">
            {strings.datasetImport.validationMsg}
          </StyledErrorMsg>
        )}
      </StyledFormGroup>
      {/* Language selection */}
      <StyledFlexRow id="import-dataset-language-checkbox-row">
        <Typography style={{ marginRight: 8 }}>
          {strings.datasetImport.languages}
        </Typography>
        <Tooltip title={strings.datasetImport.languagesTooltip}>
          <span>
            <FontAwesomeIcon icon={faInfoCircle} style={{ color: '#0064af' }} />
          </span>
        </Tooltip>
      </StyledFlexRow>
      <StyledLanguageCheckboxGroup
        role="group"
        aria-labelledby="import-dataset-language-checkbox-row"
      >
        <FormControlLabel
          control={
            <Checkbox
              id="import-dataset-lang-en"
              checked={lang.en}
              onChange={(e) => setLang((l) => ({ ...l, en: e.target.checked }))}
            />
          }
          label={strings.datasetImport.english}
          htmlFor="import-dataset-lang-en"
        />
        <FormControlLabel
          control={
            <Checkbox
              id="import-dataset-lang-sv"
              checked={lang.sv}
              onChange={(e) => setLang((l) => ({ ...l, sv: e.target.checked }))}
            />
          }
          label={strings.datasetImport.swedish}
          htmlFor="import-dataset-lang-sv"
        />
      </StyledLanguageCheckboxGroup>
      {/* Swedish fields */}
      {lang.sv && (
        <StyledLanguageGroup>
          <StyledLanguageDivider />
          <StyledLangSectionTitle
            variant="subtitle2"
            id="import-dataset-swedish-section"
          >
            {strings.datasetImport.swedishSectionTitle}
          </StyledLangSectionTitle>
          <StyledLabel as="label" htmlFor="import-dataset-swedish-layerName">
            {strings.datasetImport.swedishLayerName}
            <span style={{ color: '#c00' }}>*</span>
          </StyledLabel>
          <StyledTextField
            id="import-dataset-swedish-layerName"
            value={fields.sv.name}
            onChange={(e) => handleInput('sv', 'name', e.target.value)}
            fullWidth
            size="small"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
          {errors.sv.name && (
            <StyledErrorMsg id="import-dataset-swedish-layerName-error">
              {strings.datasetImport.validationMsg}
            </StyledErrorMsg>
          )}
          <StyledLabel as="label" htmlFor="import-dataset-swedish-desc">
            {strings.datasetImport.swedishDesc}
          </StyledLabel>
          <StyledTextField
            id="import-dataset-swedish-desc"
            value={fields.sv.desc}
            onChange={(e) => handleInput('sv', 'desc', e.target.value)}
            fullWidth
            size="small"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
          {errors.sv.desc && (
            <StyledErrorMsg id="import-dataset-swedish-desc-error">
              {strings.datasetImport.validationMsg}
            </StyledErrorMsg>
          )}
          <StyledLabel as="label" htmlFor="import-dataset-swedish-source">
            {strings.datasetImport.swedishSource}
          </StyledLabel>
          <StyledTextField
            id="import-dataset-swedish-source"
            value={fields.sv.source}
            onChange={(e) => handleInput('sv', 'source', e.target.value)}
            fullWidth
            size="small"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
          {errors.sv.source && (
            <StyledErrorMsg id="import-dataset-swedish-source-error">
              {strings.datasetImport.validationMsg}
            </StyledErrorMsg>
          )}
        </StyledLanguageGroup>
      )}
      {/* English fields */}
      {lang.en && (
        <StyledLanguageGroup>
          <StyledLanguageDivider />
          <StyledLangSectionTitle
            variant="subtitle2"
            id="import-dataset-english-section"
          >
            {strings.datasetImport.englishSectionTitle}
          </StyledLangSectionTitle>
          <StyledLabel as="label" htmlFor="import-dataset-english-layerName">
            {strings.datasetImport.englishLayerName}
            <span style={{ color: '#c00' }}>*</span>
          </StyledLabel>
          <StyledTextField
            id="import-dataset-english-layerName"
            value={fields.en.name}
            onChange={(e) => handleInput('en', 'name', e.target.value)}
            fullWidth
            size="small"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
          {errors.en.name && (
            <StyledErrorMsg id="import-dataset-english-layerName-error">
              {strings.datasetImport.validationMsg}
            </StyledErrorMsg>
          )}
          <StyledLabel as="label" htmlFor="import-dataset-english-desc">
            {strings.datasetImport.englishDesc}
          </StyledLabel>
          <StyledTextField
            id="import-dataset-english-desc"
            value={fields.en.desc}
            onChange={(e) => handleInput('en', 'desc', e.target.value)}
            fullWidth
            size="small"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
          {errors.en.desc && (
            <StyledErrorMsg id="import-dataset-english-desc-error">
              {strings.datasetImport.validationMsg}
            </StyledErrorMsg>
          )}
          <StyledLabel as="label" htmlFor="import-dataset-english-source">
            {strings.datasetImport.englishSource}
          </StyledLabel>
          <StyledTextField
            id="import-dataset-english-source"
            value={fields.en.source}
            onChange={(e) => handleInput('en', 'source', e.target.value)}
            fullWidth
            size="small"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
          {errors.en.source && (
            <StyledErrorMsg id="import-dataset-english-source-error">
              {strings.datasetImport.validationMsg}
            </StyledErrorMsg>
          )}
        </StyledLanguageGroup>
      )}
    </div>
  );
};

export default GeneralInformation;
