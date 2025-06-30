import React, { useRef, useState, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Typography, TextField, Checkbox, FormControlLabel, Link, IconButton, Tooltip, Divider } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faTimes, faUpload } from '@fortawesome/free-solid-svg-icons';
import strings from '../../translations';

// Styled Components
const StyledMainContainer = styled.div`
  background: #f6f7fa;
  border-radius: 16px;
`;

const StyledTabs = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  max-height: 100px;
  background-color: #F2F2F2;
`;

const StyledTab = styled.div`
  z-index: 2;
  user-select: none;
  width: 50%;
  cursor: pointer;
  color: ${props => props.isSelected ? props.theme.colors.mainColor1 || '#0067b1' : "#656565"};
  text-align: center;
  transition: color 0.2s ease-out;
  display: flex;
  justify-content: center;
  background: ${props => props.isSelected ? "#fff" : "#F2F2F2"};
  border-radius: 4px 4px 0 0;
  font-weight: ${props => props.isSelected ? "bold" : "normal"};
  box-shadow: ${props => props.isSelected ? "0px -1px 11px rgba(0, 99, 175, 0.08)" : "none"};
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

const StyledFileLabel = styled(Typography)`
  font-weight: 600 !important;
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
`;

const StyledLanguageGroup = styled.div`
  margin-top: 32px;
  margin-bottom: 16px;
`;

const StyledSectionTitle = styled(Typography)`
  font-weight: bold !important;
  margin-bottom: 18px !important;
  margin-top: 0;
`;

const StyledLanguageDivider = styled(Divider)`
  margin-bottom: 12px !important;
`;

const StyledButtonRow = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 32px;
  margin-bottom: 8px;
  gap: 18px;
`;

const StyledPrimaryButton = styled.div`
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
  &:hover {
    background-color: ${({ theme }) => theme.colors.buttonActive};
  }
  svg {
    margin-right: 7px;
    font-size: 18px;
  }
  border: none;
`;

const StyledSecondaryButton = styled(StyledPrimaryButton)`
  background-color: ${({ theme }) => theme.colors.mainWhite};
  color: ${({ theme }) => theme.colors.mainColor1};
  border: 2px solid ${({ theme }) => theme.colors.mainColor1};
  font-weight: 600;
  &:hover {
    background-color: ${({ theme }) => theme.colors.hover};
    color: ${({ theme }) => theme.colors.buttonActive};
  }
  svg {
    color: ${({ theme }) => theme.colors.mainColor1};
  }
`;

const GeneralTabContent = ({
  fi, setFI, sv, setSV, en, setEN, lang, setLang,
  uploadedFile, setUploadedFile, handleFileUpload, fileInput
}) => (
  <>
    <StyledFormGroup>
      <Typography variant="body2" style={{ marginBottom: 16 }}>
        {strings.datasetImport.infoText}
        <ul style={{ marginBlock: 0 }}>
          <li>Shapefile (.shp, .shx, .dbf ja .prj sekä mahdollinen .cpg)</li>
          <li>GPX-siirtotiedosto (.gpx)</li>
          <li>GeoPackage-tiedosto (.gpkg)</li>
          <li>MapInfo (.mif ja .mid)</li>
          <li>Google Maps (.kml)</li>
        </ul>
        {strings.datasetImport.fileNote}
      </Typography>
    </StyledFormGroup>
    <StyledUploadBox onClick={() => fileInput.current.click()}>
      <input
        ref={fileInput}
        type="file"
        accept=".zip"
        hidden
        onChange={handleFileUpload}
      />
      <FontAwesomeIcon icon={faUpload} style={{ fontSize: 32, color: '#4a90e2', marginBottom: 6 }} />
      <Typography style={{ color: '#2285d7', fontWeight: 500 }}>
        {strings.datasetImport.uploadTip}
      </Typography>
    </StyledUploadBox>
    {uploadedFile && (
      <StyledUploadedFileWrapper>
        <StyledFileLabel component="span">
          {strings.datasetImport.uploadedFile}&nbsp;
        </StyledFileLabel>
        <Link href="#" style={{ color: '#2285d7', fontWeight: 500 }}>
          {uploadedFile.name}
        </Link>
        <IconButton size="small" style={{ marginLeft: 8, color: '#c00' }} onClick={() => setUploadedFile(null)}>
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>
      </StyledUploadedFileWrapper>
    )}
    <StyledFormGroup>
      <Typography style={{ fontWeight: 500, marginBottom: 4 }}>
        {strings.datasetImport.layerName} <span style={{ color: '#c00' }}>*</span>
      </Typography>
      <TextField
        value={fi.name}
        onChange={e => setFI({ ...fi, name: e.target.value })}
        fullWidth
        size="small"
        variant="outlined"
        InputLabelProps={{ shrink: true }}
        style={{ marginBottom: 16, background: '#fff' }}
      />
    </StyledFormGroup>
    <StyledFormGroup>
      <Typography style={{ fontWeight: 500, marginBottom: 4 }}>{strings.datasetImport.desc}</Typography>
      <TextField
        value={fi.desc}
        onChange={e => setFI({ ...fi, desc: e.target.value })}
        fullWidth
        size="small"
        variant="outlined"
        InputLabelProps={{ shrink: true }}
        style={{ marginBottom: 16, background: '#fff' }}
      />
    </StyledFormGroup>
    <StyledFormGroup>
      <Typography style={{ fontWeight: 500, marginBottom: 4 }}>{strings.datasetImport.source}</Typography>
      <TextField
        value={fi.source}
        onChange={e => setFI({ ...fi, source: e.target.value })}
        fullWidth
        size="small"
        variant="outlined"
        InputLabelProps={{ shrink: true }}
        style={{ marginBottom: 16, background: '#fff' }}
      />
    </StyledFormGroup>
    <StyledFlexRow>
      <Typography style={{ marginRight: 8 }}>{strings.datasetImport.languages}</Typography>
      <Tooltip title={strings.datasetImport.languagesTooltip}>
        <FontAwesomeIcon icon={faInfoCircle} style={{ color: '#2285d7' }} />
      </Tooltip>
    </StyledFlexRow>
    <StyledLanguageCheckboxGroup>
      <FormControlLabel
        control={
          <Checkbox
            checked={lang.en}
            onChange={e => setLang({ ...lang, en: e.target.checked })}
          />
        }
        label={strings.datasetImport.english}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={lang.sv}
            onChange={e => setLang({ ...lang, sv: e.target.checked })}
          />
        }
        label={strings.datasetImport.swedish}
      />
    </StyledLanguageCheckboxGroup>

    {lang.sv && (
      <StyledLanguageGroup>
        <StyledLanguageDivider />
        <StyledSectionTitle variant="subtitle2">
          {strings.datasetImport.swedishSectionTitle}
        </StyledSectionTitle>
        <Typography style={{ fontWeight: 500, marginBottom: 4 }}>
          {strings.datasetImport.swedishLayerName} <span style={{ color: '#c00' }}>*</span>
        </Typography>
        <TextField
          value={sv.name}
          onChange={e => setSV({ ...sv, name: e.target.value })}
          fullWidth
          size="small"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          style={{ marginBottom: 16, background: '#fff' }}
        />
        <Typography style={{ fontWeight: 500, marginBottom: 4 }}>{strings.datasetImport.swedishDesc}</Typography>
        <TextField
          value={sv.desc}
          onChange={e => setSV({ ...sv, desc: e.target.value })}
          fullWidth
          size="small"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          style={{ marginBottom: 16, background: '#fff' }}
        />
        <Typography style={{ fontWeight: 500, marginBottom: 4 }}>{strings.datasetImport.swedishSource}</Typography>
        <TextField
          value={sv.source}
          onChange={e => setSV({ ...sv, source: e.target.value })}
          fullWidth
          size="small"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          style={{ marginBottom: 16, background: '#fff' }}
        />
      </StyledLanguageGroup>
    )}
    {lang.en && (
      <StyledLanguageGroup>
        <StyledLanguageDivider />
        <StyledSectionTitle variant="subtitle2">
          {strings.datasetImport.englishSectionTitle}
        </StyledSectionTitle>
        <Typography style={{ fontWeight: 500, marginBottom: 4 }}>
          {strings.datasetImport.englishLayerName} <span style={{ color: '#c00' }}>*</span>
        </Typography>
        <TextField
          value={en.name}
          onChange={e => setEN({ ...en, name: e.target.value })}
          fullWidth
          size="small"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          style={{ marginBottom: 16, background: '#fff' }}
        />
        <Typography style={{ fontWeight: 500, marginBottom: 4 }}>{strings.datasetImport.englishDesc}</Typography>
        <TextField
          value={en.desc}
          onChange={e => setEN({ ...en, desc: e.target.value })}
          fullWidth
          size="small"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          style={{ marginBottom: 16, background: '#fff' }}
        />
        <Typography style={{ fontWeight: 500, marginBottom: 4 }}>{strings.datasetImport.englishSource}</Typography>
        <TextField
          value={en.source}
          onChange={e => setEN({ ...en, source: e.target.value })}
          fullWidth
          size="small"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          style={{ marginBottom: 16, background: '#fff' }}
        />
      </StyledLanguageGroup>
    )}
    <StyledButtonRow>
      <StyledSecondaryButton tabIndex={0}>
        {strings.datasetImport.cancel}
      </StyledSecondaryButton>
      <StyledPrimaryButton tabIndex={0}>
        <FontAwesomeIcon icon={faUpload} />
        {strings.datasetImport.import}
      </StyledPrimaryButton>
    </StyledButtonRow>
  </>
);

const VisualisointiTabContent = () => (
  <Typography variant="body2" style={{ color: '#888' }}>
    {strings.datasetImport.visTabText}
  </Typography>
);

const DatasetImport = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fi, setFI] = useState({ name: '', desc: '', source: '' });
  const [sv, setSV] = useState({ name: '', desc: '', source: '' });
  const [en, setEN] = useState({ name: '', desc: '', source: '' });
  const [lang, setLang] = useState({ en: false, sv: true });
  const fileInput = useRef();
  const swiperRef = useRef();

  const handleFileUpload = event => {
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
        <StyledTab isSelected={selectedTab === 0} color="mainColor1" onClick={() => setSelectedTab(0)}>
          <p>{strings.datasetImport.tabGeneral}</p>
        </StyledTab>
        <StyledTab isSelected={selectedTab === 1} color="mainColor1" onClick={() => setSelectedTab(1)}>
          <p>{strings.datasetImport.tabVisualization}</p>
        </StyledTab>
      </StyledTabs>
      <StyledSwiper
        ref={swiperRef}
        allowTouchMove={false}
        speed={250}
        onSlideChange={swiper => setSelectedTab(swiper.activeIndex)}
      >
        <SwiperSlide>
          <GeneralTabContent
            fi={fi}
            setFI={setFI}
            sv={sv}
            setSV={setSV}
            en={en}
            setEN={setEN}
            lang={lang}
            setLang={setLang}
            uploadedFile={uploadedFile}
            setUploadedFile={setUploadedFile}
            handleFileUpload={handleFileUpload}
            fileInput={fileInput}
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
