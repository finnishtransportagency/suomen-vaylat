import React, { useRef } from 'react';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';

// Import dialogs from their components
import LayerFilterDialog from '../layer-filter/dialog/LayerFilterDialog';
import FeatureDataDialog from '../feature-data-window/dialog/FeatureDataDialog';
import FeatureDataDownloadDialog from '../feature-data-window/dialog/FeatureDataDownloadDialog';
import UserGuideDialog from '../user-guide/dialog/UserGuideDialog';
import AppInfoDialog from '../app-info/dialog/AppInfoDialog';
import CustomLayerDialog from '../layerlists/hierarchical-layerlist/custom-filter/dialog/CustomLayerDialog';
import FeedbackFormDialog from '../feedback-form/dialog/FeedbackFormDialog';
import DatasetImportDialog from '../dataset-import/dialog/DatasetImportDialog';
import AnnouncementsDialog from '../announcements/dialog/AnnouncementsDialog';
import MetadataDialog from '../metadata-dialog/dialog/MetadataDialog';
import ShareWebsiteDialog from '../share-website/dialog/ShareWebsiteDialog';
import LayerDownloadButtonLinkDialog from '../layerlists/hierarchical-layerlist/dialog/LayerDownloadButtonLinkDialog';
import FeatureDataToolsDialog from '../feature-data-window/dialog/FeatureDataToolsDialog';
import FeatureDataDownloadToolsDialog from '../feature-data-window/dialog/FeatureDataDownloadToolsDialog';
import CoordinateToolDialog from '../coordinate-tool/dialog/CoordinateToolDialog';
import CoordinateToolMobile from '../coordinate-tool/CoordinateToolMobile';
import Crosshair from '../crosshair/Crosshair';

import MenuBar from './menu-bar/MenuBar';
import HierarchicalLayerlistDialog from '../layerlists/hierarchical-layerlist/dialog/HierarchicalLayerlistDialog';
import PublishedMap from './published-map/PublishedMap';
import Search from '../search/Search';
import ScaleBar from '../scalebar/ScaleBar';
import ZoomBar from '../zoom-features/ZoomBar';
import WarningDialog from '../warning-dialog/dialog/WarningDialog';
import ThemeMenu from '../layerlists/theme-layerlist/ThemeMenu';
import BaseLayerSelector from '../base-layers-selector/BaseLayersSelector';
import BaseLayerSelectorDialog from '../base-layers-selector/dialog/BaseLayersSelectorDialog';
import { isMobile } from '../../theme/theme';
import { useAppSelector } from '../../state/hooks';
import DrawtoolMarkersDialog from '../measurement-tools/dialog/DrawtoolMarkersDialog';
import SaveViewDialog from '../saved-content-dialogs/dialogs/SaveViewDialog';
import SaveGeometriesDialog from '../saved-content-dialogs/dialogs/SaveGeometriesDialog';
import ProfileInfoDialog from '../profile-info/dialog/ProfileInfoDialog';
import { IS_EXTRANET } from '../../utils/appInfoUtil';

const StyledContent = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .Toastify {
    z-index: 9999 !important;
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
  padding: 80px 16px 16px 16px;
  pointer-events: none;
  @media ${(props) => props.theme.device.mobileL} {
    padding: 8px;
    padding-top: 70px;
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
  const { isCoordinateToolOpen } = useAppSelector((state) => state.ui);

  return (
    <>
      <StyledContent ref={constraintsRef}>
        <PublishedMap />

        <AnnouncementsDialog constraintsRef={constraintsRef} />

        <FeatureDataDialog constraintsRef={constraintsRef} />

        <FeatureDataDownloadDialog constraintsRef={constraintsRef} />

        <UserGuideDialog constraintsRef={constraintsRef} />

        <AppInfoDialog constraintsRef={constraintsRef} />

        <CustomLayerDialog constraintsRef={constraintsRef} />

        <FeedbackFormDialog constraintsRef={constraintsRef} />

        {IS_EXTRANET && 
          <>
            <DatasetImportDialog constraintsRef={constraintsRef} />
            <ProfileInfoDialog constraintsRef={constraintsRef} />
          </>
        }

        <MetadataDialog constraintsRef={constraintsRef} />

        <ShareWebsiteDialog constraintsRef={constraintsRef} />

        <SaveGeometriesDialog constraintsRef={constraintsRef} />

        <SaveViewDialog constraintsRef={constraintsRef} />

        <LayerDownloadButtonLinkDialog constraintsRef={constraintsRef} />

        <WarningDialog constraintsRef={constraintsRef} />

        <FeatureDataToolsDialog constraintsRef={constraintsRef} />

        <FeatureDataDownloadToolsDialog constraintsRef={constraintsRef} />

        <LayerFilterDialog constraintsRef={constraintsRef} />

        <ScaleBar />
        {!isMobile && (
          <BaseLayerSelectorDialog constraintsRef={constraintsRef} />
        )}
        {!isMobile && (
          <>
            <BaseLayerSelector />
            <CoordinateToolDialog constraintsRef={constraintsRef} />
          </>
        )}

        {isMobile && isCoordinateToolOpen && <CoordinateToolMobile />}

        {isCoordinateToolOpen && <Crosshair />}

        <DrawtoolMarkersDialog />
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
            <HierarchicalLayerlistDialog />
          </StyledLeftSection>
          <StyledRightSection>
            <Search />
            <ZoomBar />
          </StyledRightSection>
        </StyledContentGrid>
      </StyledContent>
    </>
  );
};

export default Content;
