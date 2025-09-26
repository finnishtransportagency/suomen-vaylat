import React from 'react';
import styled from 'styled-components';

import {
  Typography,
  TextField,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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

const StyledFormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledTextField = styled(TextField)`
  &.MuiTextField-root {
    margin-bottom: 8px;
    background: #fff;
  }
`;

const StyledLabel = styled(Typography)`
  font-weight: 500 !important;
  margin-bottom: 6px !important;
`;

const StyledErrorMsg = styled(Typography)`
  color: #d32f2f !important;
  font-size: 12px !important;
  margin: 0 0 10px 0 !important;
  padding: 0 !important;
`;

const StyledAccordion = styled(Accordion)`
  box-shadow: none;
`;

const AccordionSummaryLabel = styled(Typography)`
  font-weight: 600;
`;

const GeneralInformation = ({
  fields,
  errors,
  accordionOpen,
  setAccordionOpen,
  uploadedFile,
  setUploadedFile,
  fileError,
  setFileError,
  handleInput,
  isSubmitting,
  isEditing
}) => {
  return (
    <div>
      {!isEditing && (
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
      )}

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

      <StyledFlexRow id="import-dataset-language-help-row">
        <Typography style={{ marginRight: 8 }}>
          {strings.datasetImport.languages}
        </Typography>
        <Tooltip title={strings.datasetImport.languagesTooltip}>
          <span>
            <FontAwesomeIcon icon={faInfoCircle} style={{ color: '#0064af' }} />
          </span>
        </Tooltip>
      </StyledFlexRow>

      {/* Swedish accordion */}
      <StyledAccordion
        expanded={!!accordionOpen.sv}
        onChange={(_, isExpanded) =>
          setAccordionOpen((old) => ({ ...old, sv: isExpanded }))
        }
        id="accordion-sv"
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <AccordionSummaryLabel>
            {strings.datasetImport.swedishSectionTitle}
          </AccordionSummaryLabel>
        </AccordionSummary>
        <AccordionDetails>
          <StyledFormGroup>
            <StyledLabel as="label" htmlFor="import-dataset-swedish-layerName">
              {strings.datasetImport.swedishLayerName}
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
          </StyledFormGroup>
        </AccordionDetails>
      </StyledAccordion>

      {/* English accordion */}
      <StyledAccordion
        expanded={!!accordionOpen.en}
        onChange={(_, isExpanded) =>
          setAccordionOpen((old) => ({ ...old, en: isExpanded }))
        }
        id="accordion-en"
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <AccordionSummaryLabel>
            {strings.datasetImport.englishSectionTitle}
          </AccordionSummaryLabel>
        </AccordionSummary>
        <AccordionDetails>
          <StyledFormGroup>
            <StyledLabel as="label" htmlFor="import-dataset-english-layerName">
              {strings.datasetImport.englishLayerName}
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
          </StyledFormGroup>
        </AccordionDetails>
      </StyledAccordion>
    </div>
  );
};

export default GeneralInformation;
