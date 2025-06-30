import React, { useRef, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Box, Typography, Button, TextField, Checkbox, FormControlLabel, Link, IconButton, Tooltip, Divider, Grid } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faTimes, faUpload } from '@fortawesome/free-solid-svg-icons';

/* Styled tab system for swiper-based tabs */
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
    p {
        font-size: 15px;
        font-weight: bold;
        margin: 0;
        padding: 10px;
    }
    box-shadow: ${props => props.isSelected ? "0px -1px 11px rgba(0, 99, 175, 0.08)" : "none"};
`;

const StyledSwiper = styled(Swiper)`
    .swiper-slide {
        background-color: #fff;
        padding: 32px 32px 24px 32px;
        min-height: 200px;
    };
    transition: box-shadow 0.3s ease-out;
`;

const FILE_NAME = "ladattu_tiedosto.zip";

const GeneralTabContent = ({
  fi, setFI, sv, setSV, lang, setLang, uploaded, setUploaded, handleFileUpload, fileInput
}) => (
  <>
    <Typography variant="body2" sx={{ mb: 2 }}>
      Lataa aineisto tietokoneeltasi yhdeksi zip-tiedostoksi pakattuna, joka sisältää tarvittavat tiedostot
      jostain seuraavasta tiedostomuodosta:
      <ul style={{ marginBlock: 0 }}>
        <li>Shapefile (.shp, .shx, .dbf ja .prj sekä mahdollinen .cpg)</li>
        <li>GPX-siirtotiedosto (.gpx)</li>
        <li>GeoPackage-tiedosto (.gpkg)</li>
        <li>MapInfo (.mif ja .mid)</li>
        <li>Google Maps (.kml)</li>
      </ul>
      Zip-tiedosto saa sisältää vain yhden karttatason ja sen maksimikoko on 10 Mt. Purettuna tiedoston koko saa olla korkeintaan 150 Mt.
    </Typography>
    <Box
      sx={{
        py: 3,
        mb: 1,
        background: '#eaf3fa',
        borderRadius: 2,
        border: '2px dashed #6daae2',
        textAlign: 'center',
        position: 'relative'
      }}
      onClick={() => fileInput.current.click()}
      style={{ cursor: 'pointer' }}
    >
      <input
        ref={fileInput}
        type="file"
        accept=".zip"
        hidden
        onChange={handleFileUpload}
      />
      <FontAwesomeIcon icon={faUpload} style={{ fontSize: 32, color: '#4a90e2' }} />
      <Typography sx={{ color: '#2285d7', fontWeight: 500 }}>
        Raahaa tiedosto tähän ja valitse selaamalla
      </Typography>
    </Box>
    {uploaded && (
      <Box sx={{ mb: 2 }}>
        <Typography component="span" sx={{ fontWeight: 600 }}>
          Ladattu tiedosto:&nbsp;
        </Typography>
        <Link href="#" sx={{ color: '#2285d7', fontWeight: 500 }}>
          {FILE_NAME}
        </Link>
        <IconButton size="small" sx={{ ml: 1, color: 'error.main' }} onClick={() => setUploaded(false)}>
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>
      </Box>
    )}
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography sx={{ fontWeight: 500, mb: 0.5 }}>Karttatason nimi <span style={{ color: '#c00' }}>*</span></Typography>
        <TextField
          value={fi.nimi}
          onChange={e => setFI({ ...fi, nimi: e.target.value })}
          fullWidth
          size="small"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2, background: '#fff' }}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography sx={{ fontWeight: 500, mb: 0.5 }}>Kuvaus</Typography>
        <TextField
          value={fi.kuvaus}
          onChange={e => setFI({ ...fi, kuvaus: e.target.value })}
          fullWidth
          size="small"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2, background: '#fff' }}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography sx={{ fontWeight: 500, mb: 0.5 }}>Tietolähde</Typography>
        <TextField
          value={fi.lahe}
          onChange={e => setFI({ ...fi, lahe: e.target.value })}
          fullWidth
          size="small"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2, background: '#fff' }}
        />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography sx={{ mr: 1 }}>Muut kielet</Typography>
          <Tooltip title="Valitse lisäkielet, joille aineiston metatiedot annetaan.">
            <FontAwesomeIcon icon={faInfoCircle} style={{ color: '#2285d7' }} />
          </Tooltip>
        </Box>
        <FormControlLabel
          control={
            <Checkbox
              checked={lang.en}
              onChange={e => setLang({ ...lang, en: e.target.checked })}
            />
          }
          label="Englanti"
          sx={{ mr: 2 }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={lang.sv}
              onChange={e => setLang({ ...lang, sv: e.target.checked })}
            />
          }
          label="Ruotsi"
        />
      </Grid>
    </Grid>
    <Divider sx={{ my: 2 }} />
    {lang.sv && (
      <Box>
        <Typography sx={{ fontWeight: 500, mb: 0.5 }}>
          Karttatason nimi ruotsiksi <span style={{ color: '#c00' }}>(pakollinen)</span>
        </Typography>
        <TextField
          value={sv.nimi}
          onChange={e => setSV({ ...sv, nimi: e.target.value })}
          fullWidth
          size="small"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2, background: '#fff' }}
        />
        <Typography sx={{ fontWeight: 500, mb: 0.5 }}>Kuvaus ruotsiksi</Typography>
        <TextField
          value={sv.kuvaus}
          onChange={e => setSV({ ...sv, kuvaus: e.target.value })}
          fullWidth
          size="small"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2, background: '#fff' }}
        />
        <Typography sx={{ fontWeight: 500, mb: 0.5 }}>Tietolähde ruotsiksi</Typography>
        <TextField
          value={sv.lahe}
          onChange={e => setSV({ ...sv, lahe: e.target.value })}
          fullWidth
          size="small"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2, background: '#fff' }}
        />
      </Box>
    )}
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, mb: 1, mr: 0 }}>
      <Button variant="outlined" sx={{ mr: 2 }}>
        PERUUTA
      </Button>
      <Button
        variant="contained"
        startIcon={<FontAwesomeIcon icon={faUpload} />}
        sx={{ background: '#0067b1', color: '#fff', fontWeight: 700 }}
      >
        TUO AINEISTO
      </Button>
    </Box>
  </>
);

// Visualisointi tab stub (replace with your content)
const VisualisointiTabContent = () => (
  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
    Visualisointi-asetukset tähän...
  </Typography>
);

const DatasetImport = () => {
  const theme = useTheme();
  const [selectedTab, setSelectedTab] = useState(0);
  const [uploaded, setUploaded] = useState(true);
  const [fi, setFI] = useState({ nimi: '', kuvaus: '', lahe: '' });
  const [sv, setSV] = useState({ nimi: '', kuvaus: '', lahe: '' });
  const [lang, setLang] = useState({ en: false, sv: true });
  const fileInput = useRef();
  const swiperRef = useRef();

  const handleFileUpload = event => setUploaded(!!event.target.files.length);

  // When tab changes, move swiper
  React.useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(selectedTab);
    }
  }, [selectedTab]);

  return (
    <Box sx={{ background: '#f6f7fa', borderRadius: 2 }}>
      <StyledTabs>
        <StyledTab
          isSelected={selectedTab === 0}
          color="mainColor1"
          onClick={() => setSelectedTab(0)}
        >
          <p>Yleiset</p>
        </StyledTab>
        <StyledTab
          isSelected={selectedTab === 1}
          color="mainColor1"
          onClick={() => setSelectedTab(1)}
        >
          <p>Visualisointi</p>
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
            lang={lang}
            setLang={setLang}
            uploaded={uploaded}
            setUploaded={setUploaded}
            handleFileUpload={handleFileUpload}
            fileInput={fileInput}
          />
        </SwiperSlide>
        <SwiperSlide>
          <VisualisointiTabContent />
        </SwiperSlide>
      </StyledSwiper>
    </Box>
  );
};

export default DatasetImport;
