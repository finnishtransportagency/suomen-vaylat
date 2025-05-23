import { useContext, useRef } from 'react';
import { ReactReduxContext } from 'react-redux';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppSelector } from '../../state/hooks';
import styled from 'styled-components';

// Import modals from their components
import LayerFilterModal from '../layer-filter/modal/LayerFilterModal';
import FeatureDataModal from '../feature-data-window/modal/FeatureDataModal';
import FeatureDataDownloadModal from '../feature-data-window/modal/FeatureDataDownloadModal';
import UserGuideModal from '../user-guide/modal/UserGuideModal';
import AppInfoModal from '../app-info/modal/AppInfoModal';
import CustomLayerModal from '../layerlists/hierarchical-layerlist/custom-filter/modal/CustomLayerModal';
import FeedbackFormModal from '../feedback-form/modal/FeedbackFormModal';
import AnnouncementsModal from '../announcements/modal/AnnouncementsModal';
import MetadataModal from '../metadata-modal/modal/MetadataModal';
import ShareWebsiteModal from '../share-website/modal/ShareWebsiteModal';
import SavedContentModal from '../saved-content/modal/SavedContentModal';
import LayerDownloadButtonLinkModal from '../layerlists/hierarchical-layerlist/modal/LayerDownloadButtonLinkModal';
import FeatureDataToolsModal from '../feature-data-window/modal/FeatureDataToolsModal';
import FeatureDataDownloadMenuModal from '../feature-data-window/modal/FeatureDataDownloadToolsModal';

import {
  resetGFILocations,
  removeMarkerRequest,
  setVKMData,
  setFilters,
  setFilteringInfo
} from '../../state/slices/rpcSlice';

import {
  setIsGfiOpen,
  setMinimizeGfi,
  setMaximizeGfi,
  setIsFilterModalOpen,
  setMinimizeFilterModal,
  setMaximizeFilterModal,
  setActiveSelectionTool
} from '../../state/slices/uiSlice';

import MenuBar from './menu-bar/MenuBar';
import MapLayersDialog from '../dialog/MapLayersDialog';
import PublishedMap from './published-map/PublishedMap';
import Search from '../search/Search';
import ActionButtons from '../action-button/ActionButtons';
import ScaleBar from '../scalebar/ScaleBar';
import ZoomMenu from '../zoom-features/ZoomMenu';
import WarningModal from '../warning/modal/WarningModal';
import ThemeMenu from '../layerlists/theme-layerlist/ThemeMenu';
import { GFI_GEOMETRY_LAYER_ID } from '../../utils/constants';

const StyledContent = styled.div`
  z-index: 1;
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .Toastify {
    z-index: 99 !important;
  }
  .Toastify__toast-container {
  }
  .Toastify__toast-container--top-right {
    top: 9em;
    width: 400px;
  }
  @media ${(props) => props.theme.device.desktop} {
    .Toastify__toast-container--top-right {
      top: 9em;
    }
  }
  @media ${(props) => props.theme.device.tablet} {
    .Toastify__toast-container--top-right {
      top: 9em;
    }
  }
  @media only screen and (max-width: 480px) {
    .Toastify__toast-container--top-right {
      top: 8em;
      left: unset;
      rigth: 0;
      width: 75%;
    }
  }
  @media ${(props) => props.theme.device.mobileL} {
    .Toastify__toast-container--top-right {
      top: 7em;
      width: 75%;
    }
    @media only screen and (max-width: 370px) {
      .Toastify__toast-container--top-right {
        width: 100%;
        left: 0;
        right: 0;
      }
    }
  }

  .Toastify {
    z-index: 2;
  }
`;

const StyledContentGrid = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 16px;
  pointer-events: none;
  @media ${(props) => props.theme.device.mobileL} {
    padding: 8px;
  }
`;

const StyledLeftSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;

const StyledRightSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const StyledToastContainer = styled(ToastContainer)``;

const Content = () => {
  const constraintsRef = useRef(null);

  const { channel, filteringInfo, filters } = useAppSelector(
    (state) => state.rpc
  );

  const { store } = useContext(ReactReduxContext);

  


  return (
    <>
      <StyledContent ref={constraintsRef}>
        <PublishedMap />

        <AnnouncementsModal constraintsRef={constraintsRef} />

        <FeatureDataModal constraintsRef={constraintsRef} />

        <FeatureDataDownloadModal constraintsRef={constraintsRef} />

        <UserGuideModal constraintsRef={constraintsRef} />

        <AppInfoModal constraintsRef={constraintsRef} />

        <CustomLayerModal constraintsRef={constraintsRef} />

        <FeedbackFormModal constraintsRef={constraintsRef} />

        <MetadataModal constraintsRef={constraintsRef} />

        <ShareWebsiteModal constraintsRef={constraintsRef} />

        <SavedContentModal constraintsRef={constraintsRef} />

        <LayerDownloadButtonLinkModal constraintsRef={constraintsRef} />

        <WarningModal constraintsRef={constraintsRef} />

        <FeatureDataToolsModal constraintsRef={constraintsRef} />

        <FeatureDataDownloadMenuModal constraintsRef={constraintsRef} />

        <LayerFilterModal constraintsRef={constraintsRef}/>

        <ScaleBar />

        <StyledToastContainer
          position="bottom-left"
          pauseOnFocusLoss={false}
          transition={Slide}
          autoClose={false}
          closeOnClick={false}
        />
        <StyledContentGrid>
          <StyledLeftSection>
            <MenuBar />
            <ThemeMenu />
            <MapLayersDialog />
          </StyledLeftSection>
          <StyledRightSection>
            <Search />
            <ZoomMenu />
            <ActionButtons/>
          </StyledRightSection>
        </StyledContentGrid>
      </StyledContent>
    </>
  );
};

export default Content;
