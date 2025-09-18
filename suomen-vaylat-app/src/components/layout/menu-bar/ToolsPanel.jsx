import { useState, useContext, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ReactReduxContext, useSelector } from 'react-redux';
import {
  faEraser,
  faCloudUploadAlt,
  faCamera,
  faDownload,
  faCompress,
  faExpand,
  faRulerHorizontal,
  faArrowLeft,
  faUpload
} from '@fortawesome/free-solid-svg-icons';

import strings from '../../../translations';
import {
  setActiveTool,
  setIsSaveViewOpen,
  setGeoJsonArray,
  setIsGfiDownloadOpen,
  removeFromDrawToolMarkers,
  setIsSaveGeometriesOpen,
  setIsDatasetImportOpen
} from '../../../state/slices/uiSlice';
import { removeMarkerRequest } from '../../../state/slices/rpcSlice';
import DrawtoolMarkers from '../../measurement-tools/DrawtoolMarkers';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import { isMobile, theme } from '../../../theme/theme';
import { toast } from 'react-toastify';
import PillButton from '../../../utils/components/PillButton';
import DrawingTools from '../../measurement-tools/DrawingTools';

const IS_EXTRANET = process.env.REACT_APP_IS_EXTRANET || false;

const StyledTools = styled(motion.div)`
  display: flex;
  flex-direction: column;
  margin: 0;
  border-radius: 12px;
  transition: all 0.3s ease;
  pointer-events: auto;
  gap: 8px;
  width: 180px;
  max-width: 95vw;
  box-sizing: border-box;

  @media ${(props) => props.theme.device.mobileL} {
    gap: 6px;
    width: 150px;
  }

  @media ${(props) => props.theme.device.lowResDesktop} {
    gap: 6px;
  }

  &[data-hidden='true'] {
    max-height: 0;
    opacity: 0;
    padding: 0;
    overflow: hidden;
    pointer-events: none;
  }
`;

const PanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  box-sizing: border-box;
`;

const variants = {
  show: {
    height: 'auto',
    opacity: 1,
    transition: { duration: 0.3 },
    pointerEvents: 'auto'
  },
  hidden: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.2 },
    pointerEvents: 'none'
  }
};

export const ToolsPanel = ({ isOpen }) => {
  const [panelIndex, setPanelIndex] = useState(0); // 0: Left, 1: Middle, 2: Right
  const swiperRef = useRef(null);

  const { store } = useContext(ReactReduxContext);
  const { channel, selectedLayersByType } = useSelector((state) => state.rpc);
  const {
    activeTool,
    geoJsonArray,
    drawToolMarkers,
    isGfiDownloadOpen,
    isFullScreen,
    isDatasetImportOpen
  } = useSelector((state) => state.ui);

  const [noDownloadableLayers, setNoDownloadableLayers] = useState(false);

  useEffect(() => {
    const onlyUserLayers =
      selectedLayersByType.mapLayers?.length === 0 ||
      (selectedLayersByType.mapLayers?.length > 0 &&
        selectedLayersByType.mapLayers.filter(
          (l) => typeof l.id === 'string' && l.id.startsWith('userlayer_')
        ).length === selectedLayersByType.mapLayers.length);
    setNoDownloadableLayers(onlyUserLayers);
  }, [selectedLayersByType]);

  const resetTools = () => {
    store.dispatch(setActiveTool(null));
  };

  if (activeTool === null) toast.dismiss('drawToast');

  const eraseDrawing = () => {
    channel?.postRequest('DrawTools.StopDrawingRequest', []);
    store.dispatch(setGeoJsonArray([]));
    store.dispatch(removeFromDrawToolMarkers(true));
    drawToolMarkers.forEach((marker) => {
      store.dispatch(removeMarkerRequest({ markerId: marker.markerId }));
      store.dispatch(removeFromDrawToolMarkers(marker.markerId));
    });
    if (activeTool !== 'marker') {
      store.dispatch(setActiveTool(null));
    }
  };

  const handleAddGeometry = () => {
    store.dispatch(setIsSaveGeometriesOpen(true));
  };

  // Swiper sync: synchronize state with slide index
  const handleSlideChange = (swiper) => {
    setPanelIndex(swiper.activeIndex);
  };

  const handleSaveView = () => {
    store.dispatch(setIsSaveViewOpen(true));
  };

  // When panelIndex changes through controls, update Swiper
  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      if (swiperRef.current.swiper.activeIndex !== panelIndex) {
        swiperRef.current.swiper.slideTo(panelIndex);
      }
    }
  }, [panelIndex]);

  return (
    <StyledTools
      id="drawing-tools-buttons-wrapper"
      data-hidden={!isOpen}
      animate={isOpen ? 'show' : 'hidden'}
      variants={variants}
    >
      <Swiper
        autoHeight={true}
        spaceBetween={0}
        resistanceRatio={0.7}
        speed={350}
        onSlideChange={handleSlideChange}
        initialSlide={0}
        slidesPerView={1}
        allowTouchMove={true}
        ref={swiperRef}
        style={{ width: '100%' }}
      >
        {/* Panel 0: LEFT */}
        <SwiperSlide id={'swiper-slide-0'}>
          <PanelContainer id={'menubar-tools-panel'}>
            <PillButton
              id={'menubar-tools-drawing-tools-btn'}
              key={'drawing-tools-btn'}
              icon={faRulerHorizontal}
              text={strings.tooltips.drawingTools.drawingToolsButton}
              onClick={() => setPanelIndex(1)}
              aria-label={strings.tooltips.drawingTools.drawingToolsButton}
            />
            <PillButton
              id={'menubar-tools-save-btn'}
              icon={faCamera}
              text={strings.savedContent.saveView.saveView}
              onClick={handleSaveView}
              aria-label={strings.savedContent?.saveView?.saveView}
            />
            <PillButton
              id={'menubar-tools-download-btn'}
              icon={faDownload}
              text={strings.downloads.downloads}
              disabled={noDownloadableLayers}
              onClick={() =>
                store.dispatch(setIsGfiDownloadOpen(!isGfiDownloadOpen))
              }
              aria-label={strings.downloads?.downloads}
            />
            { IS_EXTRANET &&
              <PillButton
                id="menubar-tools-dataset-import-button"
                icon={faUpload}
                text={strings.datasetImport.menuButtonTitle}
                onClick={() =>
                  store.dispatch(setIsDatasetImportOpen(!isDatasetImportOpen))
                }
                aria-label={strings.datasetImport?.menuButtonTitle}
              />
            }
            {!isMobile && (
              <PillButton
                id={'menubar-tools-fullscreen-btn'}
                icon={isFullScreen ? faCompress : faExpand}
                text={strings.tooltips.fullscreenButton}
                onClick={() => {
                  const elem = document.documentElement;
                  isFullScreen
                    ? document.exitFullscreen?.()
                    : elem.requestFullscreen?.();
                }}
                aria-label={strings.tooltips?.fullscreenButton}
              />
            )}
          </PanelContainer>
        </SwiperSlide>
        {/* Panel 1: MIDDLE */}
        <SwiperSlide id={'swiper-slide-1'}>
          <PanelContainer id={'drawing-tools-panel'}>
            <DrawingTools
              setPanelIndex={setPanelIndex}
              geoJsonArray={geoJsonArray}
              drawToolMarkers={drawToolMarkers}
            />
          </PanelContainer>
        </SwiperSlide>
        {/* Panel 2: RIGHT */}
        <SwiperSlide id={'swiper-slide-2'}>
          <PanelContainer id={'markers-panel'}>
            <PillButton
              id={'return-to-drawing-tools-panel'}
              key={'drawing-tools-panel'}
              onClick={() => {
                resetTools();
                setPanelIndex(1);
              }}
              icon={faArrowLeft}
              text={strings.back}
              aria-label={'return-to-drawing-tools-panel'}
            />
            <DrawtoolMarkers />
            <PillButton
              id={'drawing-tools-erase-drawing'}
              key={'erase'}
              disabled={
                geoJsonArray.length === 0 && drawToolMarkers.length <= 0
              }
              onClick={eraseDrawing}
              icon={faEraser}
              color={theme.colors.secondaryColorDarkOrange}
              hoverColor={theme.colors.secondaryColorDarkOrange}
              text={strings.tooltips.drawingTools.erase}
              aria-label={strings.tooltips.drawingTools.erase}
            />
            <PillButton
              id={'drawing-tools-save-geometry'}
              key="save-geometry-button"
              onClick={handleAddGeometry}
              disabled={!geoJsonArray.length && drawToolMarkers.length <= 0}
              icon={faCloudUploadAlt}
              color={theme.colors.secondaryColorGreen}
              text={strings.general.save}
              aria-label={strings.general.save}
            />
          </PanelContainer>
        </SwiperSlide>
      </Swiper>
    </StyledTools>
  );
};

export default ToolsPanel;
