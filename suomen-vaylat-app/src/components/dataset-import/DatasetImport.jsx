import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Link,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInfoCircle,
  faTimes,
  faUpload
} from '@fortawesome/free-solid-svg-icons';
import strings from '../../translations';

const allowedCharsExp = /^[A-Za-z0-9_\-\(\)]*$/;
const allowedMsg =
  'Vain isot/pienet kirjaimet, numerot, alaviiva, väliviiva, ( ja ) sallitaan.';

// Styled components same as before...
const StyledMainContainer = styled.div`
  background: #f6f7fa;
  border-radius: 16px;
`;
const StyledTabs = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  max-height: 100px;
  background-color: #f2f2f2;
`;
const StyledTab = styled.div`
  z-index: 2;
  user-select: none;
  width: 50%;
  cursor: pointer;
  color: ${(props) =>
    props.isSelected ? props.theme.colors.mainColor1 || '#0067b1' : '#656565'};
  text-align: center;
  transition: color 0.2s ease-out;
  display: flex;
  justify-content: center;
  background: ${(props) => (props.isSelected ? '#fff' : '#F2F2F2')};
  border-radius: 4px 4px 0 0;
  font-weight: ${(props) => (props.isSelected ? 'bold' : 'normal')};
  box-shadow: ${(props) =>
    props.isSelected ? '0px -1px 11px rgba(0,99,175,0.08)' : 'none'};
  p {
    font-size: 15px;
    font-weight: bold;
    margin: 0;
    padding: 10px;
  }
`;
const StyledSwiper = styled(Swiper)`
  .swiper-slide {
    background-color: #fff;
    padding: 32px 32px 24px 32px;
    min-height: 200px;
  }
  transition: box-shadow 0.3s ease-out;
`;
const StyledUploadBox = styled.div`
  padding: 24px 0;
  margin-bottom: 16px;
  background: #eaf3fa;
  border-radius: 16px;
  border: 2px dashed #6daae2;
  text-align: center;
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const StyledUploadedFileWrapper = styled.div`
  margin-bottom: 16px;
  display: flex;
  align-items: center;
`;
const StyledFileLabel = styled.span`
  font-weight: 600;
`;
const StyledInfoText = styled(Typography)`
  margin-bottom: 16px !important;
`;
const StyledUploadButtonText = styled(Typography)`
  color: #2285d7;
  font-weight: 500 !important;
`;
const StyledFlexRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;
const StyledLanguageCheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 28px;
  margin-bottom: 24px;
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
  margin-top: 32px;
  margin-bottom: 16px;
`;
const StyledErrorMsg = styled(Typography)`
  color: #d32f2f !important;
  font-size: 12px !important;
  margin: 0 0 10px 0 !important;
  padding: 0 !important;
`;
const StyledLink = styled(Link)`
  color: #2285d7 !important;
  font-weight: 500 !important;
`;
const StyledButtonRow = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 32px;
  margin-bottom: 8px;
  gap: 18px;
`;
const StyledPrimaryButton = styled.button`
  min-width: 180px;
  height: 40px;
  cursor: pointer;
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.button};
  color: ${({ theme }) => theme.colors.mainWhite};
  border-radius: 20px;
  font-size: 15px;
  font-weight: 700;
  transition: background 0.2s;
  border: none;
  &:hover:enabled {
    background-color: ${({ theme }) => theme.colors.buttonActive};
  }
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};
  svg {
    margin-right: 7px;
    font-size: 18px;
  }
`;
const StyledSecondaryButton = styled(StyledPrimaryButton)`
  background-color: ${({ theme }) => theme.colors.mainWhite};
  color: ${({ theme }) => theme.colors.mainColor1};
  border: 2px solid ${({ theme }) => theme.colors.mainColor1};
  font-weight: 600;
  &:hover:enabled {
    background-color: ${({ theme }) => theme.colors.hover};
    color: ${({ theme }) => theme.colors.buttonActive};
  }
  svg {
    color: ${({ theme }) => theme.colors.mainColor1};
  }
`;

function GeneralTabContent({
  fields,
  errors,
  lang,
  setLang,
  fileInput,
  uploadedFile,
  setUploadedFile,
  handleFileUpload,
  handleInput,
  disableImport
}) {
  return (
    <>
      <StyledFormGroup>
        <StyledInfoText variant="body2">
          {strings.datasetImport.infoText}
          <ul style={{ marginBlock: 0 }}>
            <li>Shapefile (.shp, .shx, .dbf ja .prj sekä mahdollinen .cpg)</li>
            <li>GPX-siirtotiedosto (.gpx)</li>
            <li>GeoPackage-tiedosto (.gpkg)</li>
            <li>MapInfo (.mif ja .mid)</li>
            <li>Google Maps (.kml)</li>
          </ul>
          {strings.datasetImport.fileNote}
        </StyledInfoText>
      </StyledFormGroup>
      <StyledUploadBox onClick={() => fileInput.current.click()}>
        <input
          ref={fileInput}
          type="file"
          accept=".zip"
          hidden
          onChange={handleFileUpload}
        />
        <FontAwesomeIcon
          icon={faUpload}
          style={{ fontSize: 32, color: '#4a90e2', marginBottom: 6 }}
        />
        <StyledUploadButtonText>
          {strings.datasetImport.uploadTip}
        </StyledUploadButtonText>
      </StyledUploadBox>
      {uploadedFile && (
        <StyledUploadedFileWrapper>
          <StyledFileLabel>
            {strings.datasetImport.uploadedFile}&nbsp;
          </StyledFileLabel>
          <StyledLink href="#">{uploadedFile.name}</StyledLink>
          <IconButton
            size="small"
            sx={{ marginLeft: 1, color: '#c00' }}
            onClick={() => setUploadedFile(null)}
          >
            <FontAwesomeIcon icon={faTimes} />
          </IconButton>
        </StyledUploadedFileWrapper>
      )}
      {/* Finnish fields (always shown) */}
      <StyledFormGroup>
        <StyledLabel>
          {strings.datasetImport.layerName}{' '}
          <span style={{ color: '#c00' }}>*</span>
        </StyledLabel>
        <StyledTextField
          value={fields.fi.name}
          onChange={(e) => handleInput('fi', 'name', e.target.value)}
          fullWidth
          size="small"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
        />
        {errors.fi.name && <StyledErrorMsg>{allowedMsg}</StyledErrorMsg>}
      </StyledFormGroup>
      <StyledFormGroup>
        <StyledLabel>{strings.datasetImport.desc}</StyledLabel>
        <StyledTextField
          value={fields.fi.desc}
          onChange={(e) => handleInput('fi', 'desc', e.target.value)}
          fullWidth
          size="small"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
        />
        {errors.fi.desc && <StyledErrorMsg>{allowedMsg}</StyledErrorMsg>}
      </StyledFormGroup>
      <StyledFormGroup>
        <StyledLabel>{strings.datasetImport.source}</StyledLabel>
        <StyledTextField
          value={fields.fi.source}
          onChange={(e) => handleInput('fi', 'source', e.target.value)}
          fullWidth
          size="small"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
        />
        {errors.fi.source && <StyledErrorMsg>{allowedMsg}</StyledErrorMsg>}
      </StyledFormGroup>

      {/* Language selection */}
      <StyledFlexRow>
        <Typography style={{ marginRight: 8 }}>
          {strings.datasetImport.languages}
        </Typography>
        <Tooltip title={strings.datasetImport.languagesTooltip}>
          <FontAwesomeIcon icon={faInfoCircle} style={{ color: '#2285d7' }} />
        </Tooltip>
      </StyledFlexRow>
      <StyledLanguageCheckboxGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={lang.en}
              onChange={(e) => setLang((l) => ({ ...l, en: e.target.checked }))}
            />
          }
          label={strings.datasetImport.english}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={lang.sv}
              onChange={(e) => setLang((l) => ({ ...l, sv: e.target.checked }))}
            />
          }
          label={strings.datasetImport.swedish}
        />
      </StyledLanguageCheckboxGroup>

      {/* Swedish fields */}
      {lang.sv && (
        <StyledLanguageGroup>
          <StyledLanguageDivider />
          <StyledLangSectionTitle variant="subtitle2">
            {strings.datasetImport.swedishSectionTitle}
          </StyledLangSectionTitle>

          <StyledLabel>
            {strings.datasetImport.swedishLayerName}{' '}
            <span style={{ color: '#c00' }}>*</span>
          </StyledLabel>
          <StyledTextField
            value={fields.sv.name}
            onChange={(e) => handleInput('sv', 'name', e.target.value)}
            fullWidth
            size="small"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
          {errors.sv.name && <StyledErrorMsg>{allowedMsg}</StyledErrorMsg>}

          <StyledLabel>{strings.datasetImport.swedishDesc}</StyledLabel>
          <StyledTextField
            value={fields.sv.desc}
            onChange={(e) => handleInput('sv', 'desc', e.target.value)}
            fullWidth
            size="small"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
          {errors.sv.desc && <StyledErrorMsg>{allowedMsg}</StyledErrorMsg>}

          <StyledLabel>{strings.datasetImport.swedishSource}</StyledLabel>
          <StyledTextField
            value={fields.sv.source}
            onChange={(e) => handleInput('sv', 'source', e.target.value)}
            fullWidth
            size="small"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
          {errors.sv.source && <StyledErrorMsg>{allowedMsg}</StyledErrorMsg>}
        </StyledLanguageGroup>
      )}

      {/* English fields */}
      {lang.en && (
        <StyledLanguageGroup>
          <StyledLanguageDivider />
          <StyledLangSectionTitle variant="subtitle2">
            {strings.datasetImport.englishSectionTitle}
          </StyledLangSectionTitle>
          <StyledLabel>
            {strings.datasetImport.englishLayerName}{' '}
            <span style={{ color: '#c00' }}>*</span>
          </StyledLabel>
          <StyledTextField
            value={fields.en.name}
            onChange={(e) => handleInput('en', 'name', e.target.value)}
            fullWidth
            size="small"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
          {errors.en.name && <StyledErrorMsg>{allowedMsg}</StyledErrorMsg>}

          <StyledLabel>{strings.datasetImport.englishDesc}</StyledLabel>
          <StyledTextField
            value={fields.en.desc}
            onChange={(e) => handleInput('en', 'desc', e.target.value)}
            fullWidth
            size="small"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
          {errors.en.desc && <StyledErrorMsg>{allowedMsg}</StyledErrorMsg>}

          <StyledLabel>{strings.datasetImport.englishSource}</StyledLabel>
          <StyledTextField
            value={fields.en.source}
            onChange={(e) => handleInput('en', 'source', e.target.value)}
            fullWidth
            size="small"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
          {errors.en.source && <StyledErrorMsg>{allowedMsg}</StyledErrorMsg>}
        </StyledLanguageGroup>
      )}

      {/* Bottom action bar */}
      <StyledButtonRow>
        <StyledSecondaryButton type="button" tabIndex={0}>
          {strings.datasetImport.cancel}
        </StyledSecondaryButton>
        <StyledPrimaryButton
          type="button"
          tabIndex={0}
          disabled={disableImport}
          aria-disabled={disableImport}
        >
          <FontAwesomeIcon icon={faUpload} />
          {strings.datasetImport.import}
        </StyledPrimaryButton>
      </StyledButtonRow>
    </>
  );
}

const VisualisointiTabContent = () => (
  <Typography variant="body2" style={{ color: '#888' }}>
    {strings.datasetImport.visTabText}
  </Typography>
);

const initialLangObj = { name: '', desc: '', source: '' };
const initialFields = {
  fi: { ...initialLangObj },
  sv: { ...initialLangObj },
  en: { ...initialLangObj }
};
const initialErrors = {
  fi: { name: false, desc: false, source: false },
  sv: { name: false, desc: false, source: false },
  en: { name: false, desc: false, source: false }
};

const DatasetImport = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);

  const [fields, setFields] = useState(initialFields);
  const [errors, setErrors] = useState(initialErrors);
  const [lang, setLang] = useState({ en: false, sv: false });

  const fileInput = useRef();
  const swiperRef = useRef();

  // Universal handler for all fields/languages
  function handleInput(language, field, value) {
    setFields((old) => ({
      ...old,
      [language]: { ...old[language], [field]: value }
    }));
    setErrors((old) => ({
      ...old,
      [language]: {
        ...old[language],
        [field]: !!value && !allowedCharsExp.test(value)
      }
    }));
  }

  // Import button: only name fields of selected languages must be filled AND all errors must be false
  const requiredFi = !!fields.fi.name && !errors.fi.name;
  const requiredSv = !lang.sv || (!!fields.sv.name && !errors.sv.name);
  const requiredEn = !lang.en || (!!fields.en.name && !errors.en.name);
  // All error fields must be false (if empty, false; if filled/illegal, true)
  const allFieldsValid = Object.values(errors).every((langObj) =>
    Object.values(langObj).every((val) => !val)
  );
  const disableImport = !(
    uploadedFile && 
    requiredFi && 
    requiredSv && 
    requiredEn && 
    allFieldsValid
  );  

  const handleFileUpload = (event) => {
    const file = event.target.files && event.target.files[0];
    setUploadedFile(file ? file : null);
  };

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(selectedTab);
    }
  }, [selectedTab]);

  return (
    <StyledMainContainer>
      <StyledTabs>
        <StyledTab
          isSelected={selectedTab === 0}
          color="mainColor1"
          onClick={() => setSelectedTab(0)}
        >
          <p>{strings.datasetImport.tabGeneral}</p>
        </StyledTab>
        <StyledTab
          isSelected={selectedTab === 1}
          color="mainColor1"
          onClick={() => setSelectedTab(1)}
        >
          <p>{strings.datasetImport.tabVisualization}</p>
        </StyledTab>
      </StyledTabs>
      <StyledSwiper
        ref={swiperRef}
        allowTouchMove={false}
        speed={250}
        onSlideChange={(swiper) => setSelectedTab(swiper.activeIndex)}
      >
        <SwiperSlide>
          <GeneralTabContent
            fields={fields}
            errors={errors}
            lang={lang}
            setLang={setLang}
            fileInput={fileInput}
            uploadedFile={uploadedFile}
            setUploadedFile={setUploadedFile}
            handleFileUpload={handleFileUpload}
            handleInput={handleInput}
            disableImport={disableImport}
          />
        </SwiperSlide>
        <SwiperSlide>
          <VisualisointiTabContent />
        </SwiperSlide>
      </StyledSwiper>
    </StyledMainContainer>
  );
};

export default DatasetImport;
