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
// ... (other styled components omitted for brevity; use your originals) ...
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
    props.isSelected ? props.theme.colors.mainColor1 || '#0067b1' : '#656565'};
  text-align: center;
  transition: color 0.2s ease-out;
  display: flex;
  justify-content: center;
  background: ${(props) => (props.isSelected ? '#fff' : '#F2F2F2')};
  border-radius: 4px 4px 0 0;
  font-weight: ${(props) => (props.isSelected ? 'bold' : 'normal')};
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
const StyledButtonRow = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 24px;
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
      >
        <StyledFormGroup>
          <Typography
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
        {errors.fi.name && (
          <StyledErrorMsg>{strings.datasetImport.validationMsg}</StyledErrorMsg>
        )}
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
        {errors.fi.desc && (
          <StyledErrorMsg>{strings.datasetImport.validationMsg}</StyledErrorMsg>
        )}
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
        {errors.fi.source && (
          <StyledErrorMsg>{strings.datasetImport.validationMsg}</StyledErrorMsg>
        )}
      </StyledFormGroup>
      {/* Language selection */}
      <StyledFlexRow>
        <Typography style={{ marginRight: 8 }}>
          {strings.datasetImport.languages}
        </Typography>
        <Tooltip title={strings.datasetImport.languagesTooltip}>
          <span>
            <FontAwesomeIcon icon={faInfoCircle} style={{ color: '#2285d7' }} />
          </span>
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
          {errors.sv.name && (
            <StyledErrorMsg>
              {strings.datasetImport.validationMsg}
            </StyledErrorMsg>
          )}
          <StyledLabel>{strings.datasetImport.swedishDesc}</StyledLabel>
          <StyledTextField
            value={fields.sv.desc}
            onChange={(e) => handleInput('sv', 'desc', e.target.value)}
            fullWidth
            size="small"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
          {errors.sv.desc && (
            <StyledErrorMsg>
              {strings.datasetImport.validationMsg}
            </StyledErrorMsg>
          )}
          <StyledLabel>{strings.datasetImport.swedishSource}</StyledLabel>
          <StyledTextField
            value={fields.sv.source}
            onChange={(e) => handleInput('sv', 'source', e.target.value)}
            fullWidth
            size="small"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
          {errors.sv.source && (
            <StyledErrorMsg>
              {strings.datasetImport.validationMsg}
            </StyledErrorMsg>
          )}
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
          {errors.en.name && (
            <StyledErrorMsg>
              {strings.datasetImport.validationMsg}
            </StyledErrorMsg>
          )}
          <StyledLabel>{strings.datasetImport.englishDesc}</StyledLabel>
          <StyledTextField
            value={fields.en.desc}
            onChange={(e) => handleInput('en', 'desc', e.target.value)}
            fullWidth
            size="small"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
          {errors.en.desc && (
            <StyledErrorMsg>
              {strings.datasetImport.validationMsg}
            </StyledErrorMsg>
          )}
          <StyledLabel>{strings.datasetImport.englishSource}</StyledLabel>
          <StyledTextField
            value={fields.en.source}
            onChange={(e) => handleInput('en', 'source', e.target.value)}
            fullWidth
            size="small"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
          {errors.en.source && (
            <StyledErrorMsg>
              {strings.datasetImport.validationMsg}
            </StyledErrorMsg>
          )}
        </StyledLanguageGroup>
      )}
      {/* Bottom action bar */}
      <StyledButtonRow>
        <StyledSecondaryButton
          type="button"
          tabIndex={0}
          disabled={isSubmitting}
          aria-disabled={isSubmitting}
          onClick={() => store.dispatch(setIsDatasetImportOpen(false))}
        >
          {strings.datasetImport.cancel}
        </StyledSecondaryButton>
        <StyledPrimaryButton
          type="button"
          tabIndex={0}
          disabled={disableImport || isSubmitting}
          aria-disabled={disableImport || isSubmitting}
          onClick={handleSubmitDataset}
        >
          <FontAwesomeIcon icon={faUpload} />
          {strings.datasetImport.import}
        </StyledPrimaryButton>
      </StyledButtonRow>
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

  console.log("STYLE", style)
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
            () => {
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
        <OverlaySpinner>
          <CircularProgress size={62} thickness={4} />
        </OverlaySpinner>
      )}
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
        <SwiperSlide>
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
