import { useState, useContext, useEffect, useRef, useCallback } from "react";
import { ReactReduxContext } from "react-redux";
import { ToastContainer, Slide, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppSelector } from "../../state/hooks";
import styled from "styled-components";
import strings from "../../translations";
import GfiToolsMenu from "../gfi/GfiToolsMenu";
import GfiDownloadMenu from "../gfi/GfiDownloadMenu";

import {
  setSelectError,
  clearLayerMetadata,
  resetGFILocations,
  setDownloadActive,
  setDownloadFinished,
  removeMarkerRequest,
  setVKMData,
  setFilters,
  setFilteringInfo,
} from "../../state/slices/rpcSlice";

import {
  setShareUrl,
  setIsInfoOpen,
  setIsUserGuideOpen,
  setIsSaveViewOpen,
  setIsGfiOpen,
  setIsGfiDownloadOpen,
  setMinimizeGfi,
  setWarning,
  setIsDownloadLinkModalOpen,
  setMaximizeGfi,
  setIsGfiToolsOpen,
  setIsCustomFilterOpen,
  setUpdateCustomLayers,
  setIsFilterModalOpen,
  setMinimizeFilterModal,
  setMaximizeFilterModal,
  setShowSavedLayers,
  setIsFeedBackFormOpen
} from "../../state/slices/uiSlice";

import {
  faShareAlt,
  faInfoCircle,
  faQuestion,
  faBullhorn,
  faExclamationCircle,
  faMapMarkedAlt,
  faSave,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";

import Modal from "../modals/Modal";
import AnnouncementsModal from "../announcements-modal/AnnouncementsModal";
import LayerDownloadLinkButtonModal from "../menus/hierarchical-layerlist/LayerDownloadLinkButtonModal";
import AppInfoModalContent from "../app-info-modal/AppInfoModalContent";
import UserGuideModalContent from "../user-guide-modal/UserGuideModalContent";
import MenuBar from "./menu-bar/MenuBar";
import MapLayersDialog from "../dialog/MapLayersDialog";
import WarningDialog from "../dialog/WarningDialog";
import SavedModalContent from "../views/Views";
import PublishedMap from "../published-map/PublishedMap";
import Search from "../search/Search";
import ActionButtons from "../action-button/ActionButtons";
import ScaleBar from "../scalebar/ScaleBar";
import { ShareWebSitePopup } from "../share-web-site/ShareWebSitePopup";
import ZoomMenu from "../zoom-features/ZoomMenu";
import WarningModalContent from "../warning/WarningModalContent";
import GFIPopup from "../gfi/GFIPopup";
import GFIDownload from "../gfi/GFIDownload";
import MetadataModal from "../metadata-modal/MetadataModal";
import { ANNOUNCEMENTS_LOCALSTORAGE } from "../../utils/constants";
import ThemeMenu from "../menus/theme-menu/ThemeMenu";

import { CustomLayerModal } from "../menus/hierarchical-layerlist/CustomFilter/CustomLayerModal";
import { ModalContainer } from "../filter/ModalContainer";
import FeedbackForm from "../feedback-form/FeedbackForm";

const GFI_GEOMETRY_LAYER_ID = 'drawtools-geometry-layer';

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

const StyledLayerNamesList = styled.ul`
  padding-inline-start: 20px;
`;

const StyledToastContainer = styled(ToastContainer)``;

const StyledLayerNamesListItem = styled.li``;

const Content = () => {
  const constraintsRef = useRef(null);

  const { warnings, filteringInfo, filters } = useAppSelector(
    (state) => state.rpc
  );

  const {
    shareUrl,
    isInfoOpen,
    isUserGuideOpen,
    isSaveViewOpen,
    isGfiOpen,
    isGfiDownloadOpen,
    minimizeGfi,
    maximizeGfi,
    minimizeFilter,
    maximizeFilter,
    warning,
    isGfiToolsOpen,
  } = useAppSelector((state) => state.ui);

  const search = useAppSelector((state) => state.search);
  const { store } = useContext(ReactReduxContext);
  const isShareOpen = shareUrl && shareUrl.length > 0 ? true : false;
  let { downloadLink, isCustomFilterOpen, updateCustomLayer, isFeedbackFormOpen } = useAppSelector((state) => state.ui);

  const announcements = useAppSelector(
    (state) => state.rpc.activeAnnouncements
  );
  const metadata = useAppSelector((state) => state.rpc.layerMetadata);

  let { channel, selectedLayers, allLayers, allGroups } = useAppSelector((state) => state.rpc);

  const addToLocalStorageArray = (name, value) => {
    // Get the existing data
    let existing = localStorage.getItem(name);

    // If no existing data, create an array
    // Otherwise, convert the localStorage string to an array
    existing = existing ? existing.split(",") : [];

    // Add new data to localStorage Array
    existing.push(value);

    // Save back to localStorage
    localStorage.setItem(name, existing.toString());
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);

  const handleCustomFilterClose = () => {
    store.dispatch(setIsCustomFilterOpen(false));
    store.dispatch(setUpdateCustomLayers(false));
    const checkedLayers = localStorage.getItem('checkedLayers');
    if (!checkedLayers || JSON.parse(checkedLayers).length === 0) {
      store.dispatch(setShowSavedLayers(false));
    }
  };

  const [isGfiDownloadToolsOpen, setIsGfiDownloadToolsOpen] = useState(false);

  const [downloadUuids, setDownloadUuids] = useState([]);

  const [websocketFirstTimeTryConnecting, setWebsocketFirstTimeTryConnecting] =
    useState(false);

  useEffect(() => {
    announcements && setCurrentAnnouncement(0);
  }, [announcements]);

  const closeAnnouncement = (selected, id) => {
    if (selected) {
      addToLocalStorageArray(ANNOUNCEMENTS_LOCALSTORAGE, id);
    }
    announcements.length > currentAnnouncement + 1 &&
      setCurrentAnnouncement(currentAnnouncement + 1);
  };

  const hideWarn = () => {
    store.dispatch(
      setSelectError({
        show: false,
        type: "",
        filteredLayers: [],
        indeterminate: false,
      })
    );
  };

  const handleCloseAppInfoModal = () => {
    store.dispatch(setIsInfoOpen(false));
  };

  const handleCloseFeedbackForm = () => {
    store.dispatch(setIsFeedBackFormOpen(false));
  };

  const handleCloseShareWebSite = () => {
    store.dispatch(setShareUrl(""));
  };

  const handleCloseUserGuide = () => {
    store.dispatch(setIsUserGuideOpen(false));
  };

  const handleCloseDownloadLinkModal = () => {
    store.dispatch(
      setIsDownloadLinkModalOpen({
        layerDownloadLinkModalOpen: false,
        layerDownloadLink: null,
        layerDownloadLinkName: null,
      })
    );
  };

  const handleCloseMetadataModal = () => {
    store.dispatch(clearLayerMetadata());
  };

  const handleCloseFilterModal = () => {
    // reset map
    filteringInfo.forEach(filteringInfo => {
      filters.length > 0 && filteringInfo.layer && channel && channel.postRequest(
        'MapModulePlugin.MapLayerUpdateRequest',
        [filteringInfo.layer.id, true, { 'CQL_FILTER': null }]
        );
    })

    // reset states
    store.dispatch(setIsFilterModalOpen(false));
    store.dispatch(setMinimizeFilterModal({minimized: false}));
    store.dispatch(setMaximizeFilterModal(false));    
    store.dispatch(setFilters([]));
    store.dispatch(setFilteringInfo([]));

  }

  const handleCloseGFIModal = () => {
    store.dispatch(resetGFILocations([]));
    store.dispatch(setIsGfiOpen(false));
    store.dispatch(setMinimizeGfi(false));
    store.dispatch(setMaximizeGfi(false));
    setTimeout(() => {
      store.dispatch(setVKMData(null));
    }, 500); // VKM info does not disappear during modal close animation.
    store.dispatch(removeMarkerRequest({ markerId: "VKM_MARKER" }));
    channel.postRequest("MapModulePlugin.RemoveFeaturesFromMapRequest", [
      null,
      null,
      "download-tool-layer",
    ]);
    channel && channel.postRequest(
      'MapModulePlugin.RemoveFeaturesFromMapRequest',
      [null, null, GFI_GEOMETRY_LAYER_ID]
    );
    channel.postRequest("DrawTools.StopDrawingRequest", [
      "gfi-selection-tool",
      true,
    ]);
  };

  const handleCloseGfiDownloadModal = () => {
    store.dispatch(setIsGfiDownloadOpen(false));
    
    !isGfiOpen && channel && channel.postRequest(
      'MapModulePlugin.RemoveFeaturesFromMapRequest',
      [null, null, GFI_GEOMETRY_LAYER_ID]
    );
  };

  const handleCloseSaveViewModal = () => {
    store.dispatch(setIsSaveViewOpen(false));
  };

  const handleCloseWarning = () => {
    store.dispatch(setWarning(null));
  };

  const handleCloseGfiDownloadTools = () => {
    setIsGfiDownloadToolsOpen(false);
    if (!isGfiOpen) {
      store.dispatch(resetGFILocations([]));
      setTimeout(() => {
        store.dispatch(setVKMData(null));
      }, 500); // VKM info does not disappear during modal close animation.
      store.dispatch(removeMarkerRequest({ markerId: "VKM_MARKER" }));
      
      channel && channel.postRequest(
        'MapModulePlugin.RemoveFeaturesFromMapRequest',
        [null, null, GFI_GEOMETRY_LAYER_ID]
      );
      channel.postRequest("MapModulePlugin.RemoveFeaturesFromMapRequest", [
        null,
        null,
        "download-tool-layer",
      ]);
      channel.postRequest("DrawTools.StopDrawingRequest", [
        "gfi-selection-tool",
        true,
      ]);
    }
  };

  const handleCloseGfiLocations = () => {
    store.dispatch(setIsGfiToolsOpen(false));
  };

  const viewHelp = () => {
    return (
      <ul>
        <li>{strings.savedContent.saveView.saveViewDescription1}</li>
        <li>{strings.savedContent.saveView.saveViewDescription2}</li>
      </ul>
    );
  };

  const handleGfiToolsMenu = () => {
    store.dispatch(setIsGfiToolsOpen(false));
    channel &&
      channel.postRequest("DrawTools.StopDrawingRequest", [
        "gfi-selection-tool",
        true,
      ]);

    isGfiToolsOpen &&
      channel &&
      channel.postRequest("VectorLayerRequest", [
        {
          layerId: "download-tool-layer",
          remove: true,
        },
      ]);
    setIsGfiDownloadToolsOpen(!isGfiDownloadToolsOpen);
  };

  const handleGfiDownload = (format, layers, croppingArea) => {
    // Open websocket if is not already opened
    if (supportsWebSockets) {
      !websocketFirstTimeTryConnecting && connectWebsocket(0);
    } else {
      toast.error(strings.downloads.noWebSocketSupport, {
        position: "top-center",
      });
    }

    let sessionId = "";

    let layerIds = layers.map((layer) => {
      return layer.id;
    });

    //bit hackish way to force datatype when using with single geometry download
    if (!Array.isArray(croppingArea)) croppingArea = [croppingArea];
    channel.downloadFeaturesByGeoJSON &&
      channel.downloadFeaturesByGeoJSON(
        [layerIds, croppingArea, format.format, sessionId],
        (data) => {
          if (data && data.uuid && downloadUuids) {
            let newArray = downloadUuids;
            newArray.push(data.uuid);
            setDownloadUuids(newArray);

            var newDownload = {
              id: data.uuid,
              format: format.title,
              layers: layers,
              title: (
                <StyledLayerNamesList>
                  {layers.map((layer) => {
                    return (
                      <StyledLayerNamesListItem>
                        {layer.name}
                      </StyledLayerNamesListItem>
                    );
                  })}
                </StyledLayerNamesList>
              ),
              loading: true,
              date: Date.now(),
              url: null,
              errorLayers: [],
            };

            store.dispatch(setIsGfiDownloadOpen(true));
            store.dispatch(setDownloadActive(newDownload));
          }
          return;
        }
      );

    if (!isGfiOpen) {
      store.dispatch(resetGFILocations([]));
      store.dispatch(removeMarkerRequest({ markerId: "VKM_MARKER" }));
      channel.postRequest("MapModulePlugin.RemoveFeaturesFromMapRequest", [
        null,
        null,
        "download-tool-layer",
      ]);
      channel.postRequest("DrawTools.StopDrawingRequest", [
        "gfi-selection-tool",
        true,
      ]);
    }
    isGfiDownloadToolsOpen && setIsGfiDownloadToolsOpen(false);
  };

  const supportsWebSockets = "WebSocket" in window || "MozWebSocket" in window;

  const simplifyGeometry = () => {
    console.log("simplify");
  };

  const connectWebsocket = (count) => {
    const MAX_RECONNECTIONS_TRY = 20;

    setWebsocketFirstTimeTryConnecting(true);

    // Open WebSocket
    const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    const handleDownloadFailure = () => {
      handleCloseGfiDownloadModal();
      handleCloseSaveViewModal();
      ws.close();
      toast.error(strings.downloads.downloadFailure, {
        position: "top-center",
      });
    };

    ws.onopen = function () {
      // when opened connection send resend download status message
      if (downloadUuids.length > 0) {
        var json = {
          type: "resendDownloadStatuses",
          data: { uuids: downloadUuids },
        };
        ws.send(JSON.stringify(json));
      }

      // ping 10 min interval
      const sendPing = () => {
        var json = { type: "ping", data: {} };
        ws.send(JSON.stringify(json));
      };

      setInterval(() => {
        sendPing();
      }, 1000 * 60 * 10);
    };
    ws.onmessage = function (evt) {
      let data = JSON.parse(evt.data);
      if (data.type === "BODY_SIZE_EXCEEDED") {
        store.dispatch(
          setWarning({
            title: strings.bodySizeWarning,
            subtitle: null,
            cancel: {
              text: strings.general.cancel,
              action: () => {
                store.dispatch(setWarning(null));
              },
            },
            confirm: {
              text: strings.general.continue,
              action: () => {
                simplifyGeometry();
                store.dispatch(setWarning(null));
              },
            },
          })
        );
      }

      if (data.type === "DOWNLOAD_READY") {
        if (
          data.data &&
          data.data.uuid &&
          downloadUuids.includes(data.data.uuid)
        ) {
          var index = downloadUuids.indexOf(data.data.uuid);
          let newArray = downloadUuids;
          if (index > -1) {
            newArray.splice(index, 1);
          }
          setDownloadUuids(newArray);

          store.dispatch(
            setDownloadFinished({
              id: data.data.uuid,
              url: data.data.url,
              fileSize: data.data.fileSize !== null && data.data.fileSize,
              errorLayers: data.data.errorLayers,
            })
          );
        }
      }
    };
    ws.onerror = () => {
      handleDownloadFailure();
    };
    ws.onclose = () => {
      if (count < MAX_RECONNECTIONS_TRY) {
        setTimeout(() => {
          connectWebsocket(count + 1);
        }, 1000 * 30);
      } else {
        handleDownloadFailure();
      }
    };
  };

  return (
    <>
      <StyledContent ref={constraintsRef}>
        <PublishedMap />
        {currentAnnouncement !== null && announcements[currentAnnouncement] && (
          <Modal
            key={"announcement-modal-" + announcements[currentAnnouncement].id}
            constraintsRef={
              constraintsRef
            } /* Reference div for modal drag boundaries */
            drag={false} /* Enable (true) or disable (false) drag */
            resize={false}
            backdrop={true} /* Is backdrop enabled (true) or disabled (false) */
            fullScreenOnMobile={
              false
            } /* Scale modal full width / height when using mobile device */
            titleIcon={faBullhorn} /* Use icon on title or null */
            title={
              announcements[currentAnnouncement].title
            } /* Modal header title */
            type={"announcement"} /* Modal type */
            closeAction={
              closeAnnouncement
            } /* Action when pressing modal close button or backdrop */
            isOpen={null} /* Modal state */
            id={announcements[currentAnnouncement].id}
          >
            <AnnouncementsModal
              id={announcements[currentAnnouncement].id}
              title={announcements[currentAnnouncement].title}
              content={announcements[currentAnnouncement].content}
              key={
                "announcement_modal_" + announcements[currentAnnouncement].id
              }
            />
          </Modal>
        )}
        <Modal
          constraintsRef={
            constraintsRef
          } /* Reference div for modal drag boundaries */
          drag={true} /* Enable (true) or disable (false) drag */
          resize={true}
          backdrop={false} /* Is backdrop enabled (true) or disabled (false) */
          fullScreenOnMobile={
            true
          } /* Scale modal full width / height when using mobile device */
          titleIcon={faMapMarkedAlt} /* Use icon on title or null */
          title={strings.gfi.title} /* Modal header title */
          type={"gfi"} /* Modal type */
          closeAction={
            handleCloseGFIModal
          } /* Action when pressing modal close button or backdrop */
          isOpen={isGfiOpen} /* Modal state */
          id={null}
          minWidth={"600px"}
          minHeight={"530px"}
          height="100vw"
          width="50vw"
          minimize={minimizeGfi}
          maximize={maximizeGfi}
          minimizable={true}
          maximizable={true}
          minimizeAction={() => store.dispatch(setMinimizeGfi(!minimizeGfi))}
          maximizeAction={() => store.dispatch(setMaximizeGfi(!maximizeGfi))}
        >
          <GFIPopup handleGfiDownload={handleGfiDownload} />
        </Modal>
        <Modal
          constraintsRef={
            constraintsRef
          } /* Reference div for modal drag boundaries */
          drag={false} /* Enable (true) or disable (false) drag */
          resize={false}
          backdrop={true} /* Is backdrop enabled (true) or disabled (false) */
          fullScreenOnMobile={
            true
          } /* Scale modal full width / height when using mobile device */
          titleIcon={faDownload} /* Use icon on title or null */
          title={strings.downloads.downloads} /* Modal header title */
          type={"normal"} /* Modal type */
          closeAction={
            handleCloseGfiDownloadModal
          } /* Action when pressing modal close button or backdrop */
          isOpen={isGfiDownloadOpen} /* Modal state */
          id={null}
          minWidth={"600px"}
        >
          <GFIDownload />
        </Modal>
        <Modal
          constraintsRef={
            constraintsRef
          } /* Reference div for modal drag boundaries */
          drag={false} /* Enable (true) or disable (false) drag */
          resize={false}
          backdrop={true} /* Is backdrop enabled (true) or disabled (false) */
          fullScreenOnMobile={
            true
          } /* Scale modal full width / height when using mobile device */
          titleIcon={faQuestion} /* Use icon on title or null */
          title={strings.appGuide.title} /* Modal header title */
          type={"normal"} /* Modal type */
          closeAction={
            handleCloseUserGuide
          } /* Action when pressing modal close button or backdrop */
          isOpen={isUserGuideOpen} /* Modal state */
          id={null}
          height="860px"
        >
          <UserGuideModalContent />
        </Modal>
        <Modal
          constraintsRef={
            constraintsRef
          } /* Reference div for modal drag boundaries */
          drag={true} /* Enable (true) or disable (false) drag */
          resize={false}
          backdrop={true} /* Is backdrop enabled (true) or disabled (false) */
          fullScreenOnMobile={
            true
          } /* Scale modal full width / height when using mobile device */
          titleIcon={null} /* Use icon on title or null */
          title={
            strings.layerlist.customLayerInfo.infoTitle
          } /* Modal header title */
          type={"normal"} /* Modal type */
          closeAction={
            handleCustomFilterClose
          } /* Action when pressing modal close button or backdrop */
          isOpen={isCustomFilterOpen} /* Modal state */
          id={null}
          height="860px"
        >
          <CustomLayerModal />
        </Modal>
        <Modal
          constraintsRef={
            constraintsRef
          } /* Reference div for modal drag boundaries */
          drag={false} /* Enable (true) or disable (false) drag */
          resize={false}
          backdrop={true} /* Is backdrop enabled (true) or disabled (false) */
          fullScreenOnMobile={
            true
          } /* Scale modal full width / height when using mobile device */
          titleIcon={faInfoCircle} /* Use icon on title or null */
          title={strings.appInfo.title} /* Modal header title */
          type={"normal"} /* Modal type */
          closeAction={
            handleCloseAppInfoModal
          } /* Action when pressing modal close button or backdrop */
          isOpen={isInfoOpen} /* Modal state */
          id={null}
          maxWidth={"800px"}
        >
          <AppInfoModalContent />
        </Modal>
        <Modal
          constraintsRef={
            constraintsRef
          } /* Reference div for modal drag boundaries */
          drag={true} /* Enable (true) or disable (false) drag */
          resize={false}
          backdrop={true} /* Is backdrop enabled (true) or disabled (false) */
          fullScreenOnMobile={
            true
          } /* Scale modal full width / height when using mobile device */
          titleIcon={null} /* Use icon on title or null */
          title={
            strings.layerlist.customLayerInfo.infoTitle
          } /* Modal header title */
          type={"normal"} /* Modal type */
          closeAction={
            handleCustomFilterClose
          } /* Action when pressing modal close button or backdrop */
          isOpen={isCustomFilterOpen} /* Modal state */
          id={null}
          height="860px"
        >
          <CustomLayerModal />
        </Modal>
        <Modal
          constraintsRef={
            constraintsRef
          } /* Reference div for modal drag boundaries */
          drag={true} /* Enable (true) or disable (false) drag */
          resize={false}
          backdrop={true} /* Is backdrop enabled (true) or disabled (false) */
          fullScreenOnMobile={
            true
          } /* Scale modal full width / height when using mobile device */
          titleIcon={faInfoCircle} /* Use icon on title or null */
          title={strings.appInfo.feedbackForm.title} /* Modal header title */
          type={"normal"} /* Modal type */
          closeAction={
            handleCloseFeedbackForm
          } /* Action when pressing modal close button or backdrop */
          isOpen={isFeedbackFormOpen} /* Modal state */
          id={null}
          maxWidth={"800px"}
          overflow={"auto"}
        >
          <FeedbackForm layers={allLayers} groups={allGroups} />
        </Modal>
        <Modal
          constraintsRef={
            constraintsRef
          } /* Reference div for modal drag boundaries */
          drag={false} /* Enable (true) or disable (false) drag */
          resize={false}
          backdrop={true} /* Is backdrop enabled (true) or disabled (false) */
          fullScreenOnMobile={
            true
          } /* Scale modal full width / height when using mobile device */
          titleIcon={faInfoCircle} /* Use icon on title or null */
          title={strings.formatString(
            strings.metadata.title,
            metadata.layer ? metadata.layer.name : ""
          )} /* Modal header title */
          type={"normal"} /* Modal type */
          closeAction={
            handleCloseMetadataModal
          } /* Action when pressing modal close button or backdrop */
          isOpen={metadata.data !== null} /* Modal state */
          id={null}
          maxWidth={"800px"}
          overflow={"auto"}
        >
          <MetadataModal metadata={metadata} />
        </Modal>
        <Modal
          constraintsRef={
            constraintsRef
          } /* Reference div for modal drag boundaries */
          drag={false} /* Enable (true) or disable (false) drag */
          resize={false}
          backdrop={true} /* Is backdrop enabled (true) or disabled (false) */
          fullScreenOnMobile={
            false
          } /* Scale modal full width / height when using mobile device */
          titleIcon={faShareAlt} /* Use icon on title or null */
          title={strings.share.title} /* Modal header title */
          type={"normal"} /* Modal type */
          closeAction={
            handleCloseShareWebSite
          } /* Action when pressing modal close button or backdrop */
          isOpen={isShareOpen} /* Modal state */
          id={null}
        >
          <ShareWebSitePopup />
        </Modal>
        <Modal
          constraintsRef={
            constraintsRef
          } /* Reference div for modal drag boundaries */
          drag={false} /* Enable (true) or disable (false) drag */
          resize={false}
          backdrop={true} /* Is backdrop enabled (true) or disabled (false) */
          fullScreenOnMobile={
            false
          } /* Scale modal full width / height when using mobile device */
          titleIcon={faExclamationCircle} /* Use icon on title or null */
          title={
            search.selected === "vkm"
              ? strings.search.vkm.error.title
              : strings.search.address.error.title
          } /* Modal header title */
          type={"warning"} /* Modal type */
          warningType={warnings.type}
          closeAction={
            hideWarn
          } /* Action when pressing modal close button or backdrop */
          isOpen={
            warnings.show && warnings.type === "searchWarning"
          } /* Modal state */
          id={null}
        >
          <WarningDialog
            hideWarn={hideWarn}
            message={warnings.message}
            errors={warnings.errors}
            filteredLayers={[]}
            warningType={warnings.type}
          />
        </Modal>
        <Modal
          constraintsRef={
            constraintsRef
          } /* Reference div for modal drag boundaries */
          drag={true} /* Enable (true) or disable (false) drag */
          resize={false}
          backdrop={false} /* Is backdrop enabled (true) or disabled (false) */
          fullScreenOnMobile={
            true
          } /* Scale modal full width / height when using mobile device */
          titleIcon={faSave} /* Use icon on title or null */
          title={strings.savedContent.savedContent} /* Modal header title */
          type={"normal"} /* Modal type */
          closeAction={
            handleCloseSaveViewModal
          } /* Action when pressing modal close button or backdrop */
          isOpen={isSaveViewOpen} /* Modal state */
          id={null}
          minWidth={"600px"}
          hasHelp={true}
          helpId={"show_view_help"}
          helpContent={viewHelp()}
        >
          <SavedModalContent />
        </Modal>
        <Modal
          constraintsRef={
            constraintsRef
          } /* Reference div for modal drag boundaries */
          drag={false} /* Enable (true) or disable (false) drag */
          resize={false}
          backdrop={true} /* Is backdrop enabled (true) or disabled (false) */
          fullScreenOnMobile={
            true
          } /* Scale modal full width / height when using mobile device */
          titleIcon={null} /* Use icon on title or null */
          title={
            strings.downloadLink.downloadLinkModalHeader
          } /* Modal header title */
          type={"normal"} /* Modal type */
          closeAction={
            handleCloseDownloadLinkModal
          } /* Action when pressing modal close button or backdrop */
          isOpen={downloadLink.layerDownloadLinkModalOpen} /* Modal state */
          id={null}
        >
          <LayerDownloadLinkButtonModal downloadLink={downloadLink} />
        </Modal>
        <Modal
          constraintsRef={
            constraintsRef
          } /* Reference div for modal drag boundaries */
          drag={false} /* Enable (true) or disable (false) drag */
          resize={false}
          backdrop={true} /* Is backdrop enabled (true) or disabled (false) */
          fullScreenOnMobile={
            false
          } /* Scale modal full width / height when using mobile device */
          titleIcon={faExclamationCircle} /* Use icon on title or null */
          title={strings.general.warning} /* Modal header title */
          type={"warning"} /* Modal type */
          closeAction={
            handleCloseWarning
          } /* Action when pressing modal close button or backdrop */
          isOpen={warning !== null} /* Modal state */
          id={null}
        >
          <WarningModalContent warning={warning} />
        </Modal>
        <Modal
          constraintsRef={
            constraintsRef
          } /* Reference div for modal drag boundaries */
          drag={true} /* Enable (true) or disable (false) drag */
          resize={true}
          backdrop={false} /* Is backdrop enabled (true) or disabled (false) */
          fullScreenOnMobile={
            true
          } /* Scale modal full width / height when using mobile device */
          titleIcon={null} /* Use icon on title or null */
          title={strings.gfi.selectLocations} /* Modal header title */
          type={"normal"} /* Modal type */
          closeAction={
            handleCloseGfiLocations
          } /* Action when pressing modal close button or backdrop */
          isOpen={isGfiToolsOpen} /* Modal state */
          id={null}
        >
          <GfiToolsMenu
            handleGfiToolsMenu={handleGfiToolsMenu}
            closeButton={false}
          />
        </Modal>
        <Modal
          constraintsRef={
            constraintsRef
          } /* Reference div for modal drag boundaries */
          drag={true} /* Enable (true) or disable (false) drag */
          resize={true}
          backdrop={false} /* Is backdrop enabled (true) or disabled (false) */
          fullScreenOnMobile={
            true
          } /* Scale modal full width / height when using mobile device */
          titleIcon={null} /* Use icon on title or null */
          title={strings.gfi.downloadMaterials} /* Modal header title */
          type={"normal"} /* Modal type */
          closeAction={
            handleCloseGfiDownloadTools
          } /* Action when pressing modal close button or backdrop */
          isOpen={isGfiDownloadToolsOpen} /* Modal state */
          id={null}
        >
          <GfiDownloadMenu
            closeButton={false}
            handleGfiDownload={handleGfiDownload}
          ></GfiDownloadMenu>
        </Modal>
        <Modal
          constraintsRef={{
            constraintsRef,
          }} /* Reference div for modal drag boundaries */
          drag={true} /* Enable (true) or disable (false) drag */
          resize={true}
          backdrop={false} /* Is backdrop enabled (true) or disabled (false) */
          fullScreenOnMobile={
            true
          } /* Scale modal full width / height when using mobile device */
          titleIcon={null} /* Use icon on title or null */
          title={strings.gfi.filter} /* Modal header title */
          type={"normal"} /* Modal type */
          closeAction={
            handleCloseFilterModal
          } /* Action when pressing modal close button or backdrop */
          isOpen={filteringInfo.some(f => f.modalOpen)} /* Modal state */
          minimize={minimizeFilter.minimized}
          maximize={maximizeFilter}
          minimizable={true}
          maximizable={true}
          minimizeAction={() => store.dispatch(setMinimizeFilterModal({minimized: !minimizeFilter.minimized}))}
          maximizeAction={() => store.dispatch(setMaximizeFilterModal(!maximizeFilter))}
          maxWidth={maximizeFilter ? null : "40em"}
          minWidth={"25em"}
          minHeight={"30em"}
          overflow={"auto"}
        >
          <ModalContainer/>
        </Modal>
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
            <ActionButtons closeAction={handleCloseGFIModal} closeActionFilter={handleCloseFilterModal}/>
          </StyledRightSection>
        </StyledContentGrid>
      </StyledContent>
    </>
  );
};

export default Content;
