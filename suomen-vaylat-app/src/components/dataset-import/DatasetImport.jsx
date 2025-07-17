import React, { useRef, useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Slide, toast } from 'react-toastify';

import {
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Link,
  Tooltip,
  Divider,
  CircularProgress
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faUpload } from '@fortawesome/free-solid-svg-icons';
import strings from '../../translations';
import { setIsDatasetImportOpen } from '../../state/slices/uiSlice';
import { ReactReduxContext } from 'react-redux';
import ZipFileInput from './ZipFileInput';
import { useAppSelector } from '../../state/hooks';
import StyleEditor from './style-editor/StyleEditor'; // <--- HERE

// --- Styled Components ---
const StyledMainContainer = styled.div`
  background: #f6f7fa;
  border-radius: 16px;
  position: relative;
`;

const OverlaySpinner = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.65);
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
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
    props['aria-selected'] ? props.theme.colors.mainColor1 || '#0067b1' : '#656565'};
  text-align: center;
  transition: color 0.2s ease-out;
  display: flex;
  justify-content: center;
  background: ${(props) => (props['aria-selected'] ? '#fff' : '#F2F2F2')};
  border-radius: 4px 4px 0 0;
  font-weight: ${(props) => (props['aria-selected'] ? 'bold' : 'normal')};
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
    height: auto;
  }
  transition: box-shadow 0.3s ease-out;
`;
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
const StyledLink = styled(Link)`
  color: #2285d7 !important;
  font-weight: 500 !important;
`;
const StyledSubmitButtonGroup = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 24px;
  margin-bottom: 8px;
  gap: 18px;
  @media ${(props) => props.theme.device.mobileL} {
    flex-direction: column;
  }
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

// -------------- GeneralTabContent ----------------
function GeneralTabContent({
  store,
  handleSubmitDataset,
  fields,
  errors,
  lang,
  setLang,
  uploadedFile,
  setUploadedFile,
  fileError,
  setFileError,
  handleInput,
  disableImport,
  isSubmitting
}) {
  return (
    <>
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
          aria-required="true"
        />
        {errors.fi.name && (
          <StyledErrorMsg id="import-dataset-finnish-layerName-error">{strings.datasetImport.validationMsg}</StyledErrorMsg>
        )}
      </StyledFormGroup>
      <StyledFormGroup>
        <StyledLabel as="label" htmlFor="import-dataset-finnish-desc">{strings.datasetImport.desc}</StyledLabel>
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
          <StyledErrorMsg id="import-dataset-finnish-desc-error">{strings.datasetImport.validationMsg}</StyledErrorMsg>
        )}
      </StyledFormGroup>
      <StyledFormGroup>
        <StyledLabel as="label" htmlFor="import-dataset-finnish-source">{strings.datasetImport.source}</StyledLabel>
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
          <StyledErrorMsg id="import-dataset-finnish-source-error">{strings.datasetImport.validationMsg}</StyledErrorMsg>
        )}
      </StyledFormGroup>
      {/* Language selection */}
      <StyledFlexRow id="import-dataset-language-checkbox-row">
        <Typography style={{ marginRight: 8 }}>
          {strings.datasetImport.languages}
        </Typography>
        <Tooltip title={strings.datasetImport.languagesTooltip}>
          <span>
            <FontAwesomeIcon icon={faInfoCircle} style={{ color: '#2285d7' }} />
          </span>
        </Tooltip>
      </StyledFlexRow>
      <StyledLanguageCheckboxGroup role="group" aria-labelledby="import-dataset-language-checkbox-row">
        <FormControlLabel
          control={
            <Checkbox
              id="import-dataset-lang-en"
              checked={lang.en}
              onChange={(e) => setLang((l) => ({ ...l, en: e.target.checked }))}
              inputProps={{ 'aria-checked': lang.en }}
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
              inputProps={{ 'aria-checked': lang.sv }}
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
          <StyledLangSectionTitle variant="subtitle2" id="import-dataset-swedish-section">
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
            aria-required="true"
          />
          {errors.sv.name && (
            <StyledErrorMsg id="import-dataset-swedish-layerName-error">
              {strings.datasetImport.validationMsg}
            </StyledErrorMsg>
          )}
          <StyledLabel as="label" htmlFor="import-dataset-swedish-desc">{strings.datasetImport.swedishDesc}</StyledLabel>
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
          <StyledLabel as="label" htmlFor="import-dataset-swedish-source">{strings.datasetImport.swedishSource}</StyledLabel>
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
          <StyledLangSectionTitle variant="subtitle2" id="import-dataset-english-section">
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
            aria-required="true"
          />
          {errors.en.name && (
            <StyledErrorMsg id="import-dataset-english-layerName-error">
              {strings.datasetImport.validationMsg}
            </StyledErrorMsg>
          )}
          <StyledLabel as="label" htmlFor="import-dataset-english-desc">{strings.datasetImport.englishDesc}</StyledLabel>
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
          <StyledLabel as="label" htmlFor="import-dataset-english-source">{strings.datasetImport.englishSource}</StyledLabel>
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
      {/* Bottom action bar */}
      <StyledSubmitButtonGroup id="import-dataset-submit-button-group">
        <StyledSecondaryButton
          type="button"
          tabIndex={0}
          id="import-dataset-cancel-button"
          disabled={isSubmitting}
          aria-disabled={isSubmitting}
          onClick={() => store.dispatch(setIsDatasetImportOpen(false))}
        >
          {strings.datasetImport.cancel}
        </StyledSecondaryButton>
        <StyledPrimaryButton
          type="button"
          tabIndex={0}
          id="import-dataset-import-button"
          disabled={disableImport || isSubmitting}
          aria-disabled={disableImport || isSubmitting}
          onClick={handleSubmitDataset}
        >
          <FontAwesomeIcon icon={faUpload} />
          {strings.datasetImport.import}
        </StyledPrimaryButton>
      </StyledSubmitButtonGroup>
    </>
  );
}

const allowedCharsExp = /^[A-Za-z0-9_\-()]*$/;
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
  const { store } = useContext(ReactReduxContext);

  const [selectedTab, setSelectedTab] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { channel } = useAppSelector((state) => state.rpc);

  const [fields, setFields] = useState(initialFields);
  const [errors, setErrors] = useState(initialErrors);
  const [lang, setLang] = useState({ en: false, sv: false });
  const [styleEditorKey, setStyleEditorKey] = useState(0);
  const [style, setStyle] = useState({});

  const swiperRef = useRef();

  const handleInput = (language, field, value) => {
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
  };

  const resetForm = () => {
    setUploadedFile(null);
    setFileError('');
    setFields(initialFields);
    setErrors(initialErrors);
    setLang({ en: false, sv: false });
    setSelectedTab(0);
    setStyle({});
    setStyleEditorKey(k => k + 1);
  };

  const handleSubmitDataset = () => {
    if (!disableImport && !isSubmitting) {
      setIsSubmitting(true);
      setTimeout(() => {
        const locale = {
          fi: fields.fi || {},
          sv: lang.sv ? fields.sv || {} : {},
          en: lang.en ? fields.en || {} : {}
        };

        const fileToBase64 = (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });

        fileToBase64(uploadedFile).then((base64str) => {
          const dataset = {
            fileName: uploadedFile.name,
            fileType: uploadedFile.type,
            fileDataUrl: base64str,
            locale,
            style
          };

          channel.importDataset(
            [dataset],
            (data) => {
              setIsSubmitting(false);
              resetForm();
              toast.success(`success`, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Slide
                });
            },
            (data) => {
              setIsSubmitting(false);
              setUploadedFile(null);
              toast.error(`${data}`, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Slide
                });
            }
          );
        });
      }, 1200);
    }
  };

  const requiredFi = !!fields.fi.name && !errors.fi.name;
  const requiredSv = !lang.sv || (!!fields.sv.name && !errors.sv.name);
  const requiredEn = !lang.en || (!!fields.en.name && !errors.en.name);
  const allFieldsValid = Object.values(errors).every((langObj) =>
    Object.values(langObj).every((val) => !val)
  );
  const disableImport = !(
    uploadedFile &&
    !fileError &&
    requiredFi &&
    requiredSv &&
    requiredEn &&
    allFieldsValid
  );

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(selectedTab);
    }
  }, [selectedTab]);

  return (
    <StyledMainContainer>
      {isSubmitting && (
        <OverlaySpinner id="import-dataset-spinner" role="status" aria-live="polite" aria-label="Uploading">
          <CircularProgress size={62} thickness={4} />
        </OverlaySpinner>
      )}
      <StyledTabs role="tablist" aria-label={strings.datasetImport.title} id="import-dataset-tablist">
        <StyledTab
          id="import-dataset-tab-general"
          type="button"
          role="tab"
          aria-selected={selectedTab === 0}
          aria-controls="import-dataset-panel-general"
          tabIndex={selectedTab === 0 ? 0 : -1}
          onClick={() => setSelectedTab(0)}
        >
          <p>{strings.datasetImport.tabGeneral}</p>
        </StyledTab>
        <StyledTab
          id="import-dataset-tab-visualization"
          type="button"
          role="tab"
          aria-selected={selectedTab === 1}
          aria-controls="import-dataset-panel-visualization"
          tabIndex={selectedTab === 1 ? 0 : -1}
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
        <SwiperSlide
          id="import-dataset-panel-general"
          role="tabpanel"
          aria-labelledby="import-dataset-tab-general"
        >
          <GeneralTabContent
            store={store}
            handleSubmitDataset={handleSubmitDataset}
            fields={fields}
            errors={errors}
            lang={lang}
            setLang={setLang}
            uploadedFile={uploadedFile}
            setUploadedFile={setUploadedFile}
            fileError={fileError}
            setFileError={setFileError}
            handleInput={handleInput}
            disableImport={disableImport}
            isSubmitting={isSubmitting}
          />
        </SwiperSlide>
        <SwiperSlide
          id="import-dataset-panel-visualization"
          role="tabpanel"
          aria-labelledby="import-dataset-tab-visualization"
        >
          <StyleEditor
            key={styleEditorKey}
            initialStyle={style}
            onChange={setStyle}
          />
        </SwiperSlide>
      </StyledSwiper>
    </StyledMainContainer>
  );
};

export default DatasetImport;
