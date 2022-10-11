import React, { useState, useContext, useEffect, useRef } from 'react';
import { ReactReduxContext } from 'react-redux';
import { ToastContainer, Slide} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useAppSelector } from '../../state/hooks';
import styled from 'styled-components';
import strings from '../../translations';
import { v4 as uuidv4 } from 'uuid';

import {
    setSelectError,
    clearLayerMetadata,
    resetGFILocations,
    setDownloadActive,
    setDownloadFinished,
    removeMarkerRequest,
    setVKMData
} from '../../state/slices/rpcSlice';

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
    setGeoJsonArray
} from '../../state/slices/uiSlice';

import {
    faShareAlt,
    faInfoCircle,
    faQuestion,
    faBullhorn,
    faExclamationCircle,
    faMapMarkedAlt,
    faSave,
    faDownload,
} from '@fortawesome/free-solid-svg-icons';

import Modal from '../modals/Modal';
import AnnouncementsModal from '../announcements-modal/AnnouncementsModal';
import LayerDownloadLinkButtonModal from '../menus/hierarchical-layerlist/LayerDownloadLinkButtonModal';
import AppInfoModalContent from '../app-info-modal/AppInfoModalContent';
import UserGuideModalContent from '../user-guide-modal/UserGuideModalContent';
import MenuBar from './menu-bar/MenuBar';
import MapLayersDialog from '../dialog/MapLayersDialog';
import WarningDialog from '../dialog/WarningDialog';
import SavedModalContent from '../views/Views';
import PublishedMap from '../published-map/PublishedMap';
import Search from '../search/Search';
import ActionButtons from '../action-button/ActionButtons';
import ScaleBar from '../scalebar/ScaleBar';
import { ShareWebSitePopup } from '../share-web-site/ShareWebSitePopup';
import ZoomMenu from '../zoom-features/ZoomMenu';
import WarningModalContent from '../warning/WarningModalContent';
import GFIPopup from '../gfi/GFIPopup';
import GFIDownload from '../gfi/GFIDownload';
import MetadataModal from '../metadata-modal/MetadataModal';
import { ANNOUNCEMENTS_LOCALSTORAGE } from '../../utils/constants';

const StyledContent = styled.div`
    z-index: 1;
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .Toastify__toast-container {

    }
    .Toastify__toast-container--top-right {
        top: 9em;
        width: 400px;
    }
    @media ${(props) => props.theme.device.desktop} {
        .Toastify__toast-container {

        }
        .Toastify__toast-container--top-right {
            top: 9em;
        }
    };
    @media ${props => props.theme.device.tablet} {
        .Toastify__toast-container {
            width: 80%;
        }
        .Toastify__toast-container--top-right {
            top: 9em;
        }
    };

    @media ${(props) => props.theme.device.mobileL} {
        .Toastify__toast-container {
            width: 100%;
        }
        .Toastify__toast-container--top-right {
            top: 7em;
        }
    };



    .Toastify {
        z-index: 2;
    }

    .Toastify__toast-icon {
        display: none;
    }
`;

const StyledContentGrid = styled.div`
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: grid;
    grid-template-columns: 48px 344px 1fr;
    grid-template-rows: 48px 1fr;
    padding: 16px;
    pointer-events: none;
    @media ${(props) => props.theme.device.mobileL} {
        padding: 8px;
        grid-template-columns: 48px 1fr;
    };
`;

const StyledLayerNamesList = styled.ul`
    padding-inline-start: 20px;
`;

const StyledToastContainer = styled(ToastContainer)`
`;

const StyledLayerNamesListItem = styled.li``;

const Content = () => {
    const constraintsRef = useRef(null);

    const { warnings } = useAppSelector((state) => state.rpc);

    const {
        shareUrl,
        isInfoOpen,
        isUserGuideOpen,
        isSaveViewOpen,
        isGfiOpen,
        isGfiDownloadOpen,
        minimizeGfi,
        maximizeGfi,
        warning,
    } = useAppSelector((state) => state.ui);

    const search = useAppSelector((state) => state.search);
    const { store } = useContext(ReactReduxContext);
    const isShareOpen = shareUrl && shareUrl.length > 0 ? true : false;
    const downloadLink = useAppSelector((state) => state.ui.downloadLink);

    const announcements = useAppSelector(
        (state) => state.rpc.activeAnnouncements
    );
    const metadata = useAppSelector((state) => state.rpc.layerMetadata);

    let { channel, gfiLocations } = useAppSelector((state) => state.rpc);

    const addToLocalStorageArray = (name, value) => {
        // Get the existing data
        let existing = localStorage.getItem(name);

        // If no existing data, create an array
        // Otherwise, convert the localStorage string to an array
        existing = existing ? existing.split(',') : [];

        // Add new data to localStorage Array
        existing.push(value);

        // Save back to localStorage
        localStorage.setItem(name, existing.toString());
    };

    const [currentAnnouncement, setCurrentAnnouncement] = useState(null);

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
                type: '',
                filteredLayers: [],
                indeterminate: false,
            })
        );
    };

    const handleCloseAppInfoModal = () => {
        store.dispatch(setIsInfoOpen(false));
    };

    const handleCloseShareWebSite = () => {
        store.dispatch(setShareUrl(''));
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

    const handleCloseGFIModal = () => {
        store.dispatch(setGeoJsonArray({}));
        store.dispatch(resetGFILocations([]));
        store.dispatch(setIsGfiOpen(false));
        store.dispatch(setMinimizeGfi(false));
        store.dispatch(setMaximizeGfi(false));
        setTimeout(() => {store.dispatch(setVKMData(null))}, 500) ; // VKM info does not disappear during modal close animation.
        store.dispatch(removeMarkerRequest({markerId: "VKM_MARKER"}));
        channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [
            null,
            null,
            'download-tool-layer',
        ]);
        channel.postRequest('DrawTools.StopDrawingRequest', [
            'gfi-selection-tool',
            true,
        ]);
    };

    const handleCloseGfiDownloadModal = () => {
        store.dispatch(setIsGfiDownloadOpen(false));
    };

    const handleCloseSaveViewModal = () => {
        store.dispatch(setIsSaveViewOpen(false));
    };

    const handleCloseWarning = () => {
        store.dispatch(setWarning(null));
    };

    const viewHelp = () => {
        return (
            <ul>
                <li>{strings.savedContent.saveView.saveViewDescription1}</li>
                <li>{strings.savedContent.saveView.saveViewDescription2}</li>
            </ul>
        )
    }

    const handleGfiDownload = (format, layers, croppingArea) => {
        let sessionId = '';
        let finishedDownload = null;
        const supportsWebSockets = 'WebSocket' in window || 'MozWebSocket' in window;
        
        let layerIds = layers.map((layer) => {
            return layer.id;
        });

        var newDownload = {
            id: uuidv4(),
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
        };

        store.dispatch(setIsGfiDownloadOpen(true));
        store.dispatch(setDownloadActive(newDownload));

        channel.downloadFeaturesByGeoJSON && channel.downloadFeaturesByGeoJSON([layerIds, croppingArea, format.format, sessionId], () => {
            return;
        });

        const connectWebsocket = (count) =>
        {
            const MAX_RECONNECTIONS_TRY = 50;
            let isDownloadReady = false;
            if (supportsWebSockets) {
                // Open WebSocket
                const ws = new WebSocket("wss://paikkatietodev.testivaylapilvi.fi/sv-kartta/ws-suomen-vaylat");
                ws.onopen = function ()
                {
                    const sendPing = () => {
                        var json = {type:'ping', data: {}};
                        ws.send(JSON.stringify(json));
                    }
                    setInterval(() => {
                        sendPing();
                    }, 1000 * 60 * 30);
                };
                ws.onmessage = function (evt)
                {
                    let data = JSON.parse(evt.data);

                    if(data.type === "DOWNLOAD_READY") {
                        let data = JSON.parse(evt.data);
                        finishedDownload = {
                            ...newDownload,
                            url: data.data.url !== null && data.data.url,
                            fileSize: data.data.fileSize !== null && data.data.fileSize,
                            loading: false,
                        };
                        store.dispatch(setDownloadFinished(finishedDownload));
                        isDownloadReady = true;
                        ws.close();
                    }
                }
                ws.onclose = () => {
                    // If the download is ready don't try to reconnect
                    if(isDownloadReady) return;

                    if (count < MAX_RECONNECTIONS_TRY) {
                        setTimeout(() => {
                            connectWebsocket(count + 1);
                        }, 1000);
                    }
                };
            }
                else alert(strings.downloads.noWebSocketSupport);
            }
            connectWebsocket(0);
    };

    return (
        <>
            <StyledContent ref={constraintsRef}>
                <PublishedMap />
                {currentAnnouncement !== null &&
                    announcements[currentAnnouncement] && (
                        <Modal
                            key={
                                'announcement-modal-' +
                                announcements[currentAnnouncement].id
                            }
                            constraintsRef={
                                constraintsRef
                            } /* Reference div for modal drag boundaries */
                            drag={
                                false
                            } /* Enable (true) or disable (false) drag */
                            resize={false}
                            backdrop={
                                true
                            } /* Is backdrop enabled (true) or disabled (false) */
                            fullScreenOnMobile={
                                false
                            } /* Scale modal full width / height when using mobile device */
                            titleIcon={
                                faBullhorn
                            } /* Use icon on title or null */
                            title={
                                announcements[currentAnnouncement].title
                            } /* Modal header title */
                            type={'announcement'} /* Modal type */
                            closeAction={
                                closeAnnouncement
                            } /* Action when pressing modal close button or backdrop */
                            isOpen={null} /* Modal state */
                            id={announcements[currentAnnouncement].id}
                        >
                            <AnnouncementsModal
                                id={announcements[currentAnnouncement].id}
                                title={announcements[currentAnnouncement].title}
                                content={
                                    announcements[currentAnnouncement].content
                                }
                                key={
                                    'announcement_modal_' +
                                    announcements[currentAnnouncement].id
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
                    backdrop={
                        false
                    } /* Is backdrop enabled (true) or disabled (false) */
                    fullScreenOnMobile={
                        true
                    } /* Scale modal full width / height when using mobile device */
                    titleIcon={faMapMarkedAlt} /* Use icon on title or null */
                    title={strings.gfi.title} /* Modal header title */
                    type={'gfi'} /* Modal type */
                    closeAction={
                        handleCloseGFIModal
                    } /* Action when pressing modal close button or backdrop */
                    isOpen={isGfiOpen} /* Modal state */
                    id={null}
                    minWidth={'600px'}
                    minHeight={'530px'}
                    height='100vw'
                    width='50vw'
                    //maxWidth={'1000px'}
                    //maxWidth={'calc(100vw - 100px)'}
                    minimize={minimizeGfi}
                    maximize={maximizeGfi}
                >
                    <GFIPopup
                        gfiLocations={gfiLocations}
                        handleGfiDownload={handleGfiDownload}
                    />
                </Modal>
                <Modal
                    constraintsRef={
                        constraintsRef
                    } /* Reference div for modal drag boundaries */
                    drag={false} /* Enable (true) or disable (false) drag */
                    resize={false}
                    backdrop={
                        true
                    } /* Is backdrop enabled (true) or disabled (false) */
                    fullScreenOnMobile={
                        true
                    } /* Scale modal full width / height when using mobile device */
                    titleIcon={faDownload} /* Use icon on title or null */
                    title={strings.downloads.downloads} /* Modal header title */
                    type={'normal'} /* Modal type */
                    closeAction={
                        handleCloseGfiDownloadModal
                    } /* Action when pressing modal close button or backdrop */
                    isOpen={isGfiDownloadOpen} /* Modal state */
                    id={null}
                    minWidth={'600px'}
                >
                    <GFIDownload />
                </Modal>
                <Modal
                    constraintsRef={
                        constraintsRef
                    } /* Reference div for modal drag boundaries */
                    drag={false} /* Enable (true) or disable (false) drag */
                    resize={false}
                    backdrop={
                        true
                    } /* Is backdrop enabled (true) or disabled (false) */
                    fullScreenOnMobile={
                        true
                    } /* Scale modal full width / height when using mobile device */
                    titleIcon={faQuestion} /* Use icon on title or null */
                    title={strings.appGuide.title} /* Modal header title */
                    type={'normal'} /* Modal type */
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
                    drag={false} /* Enable (true) or disable (false) drag */
                    resize={false}
                    backdrop={
                        true
                    } /* Is backdrop enabled (true) or disabled (false) */
                    fullScreenOnMobile={
                        true
                    } /* Scale modal full width / height when using mobile device */
                    titleIcon={faInfoCircle} /* Use icon on title or null */
                    title={strings.appInfo.title} /* Modal header title */
                    type={'normal'} /* Modal type */
                    closeAction={
                        handleCloseAppInfoModal
                    } /* Action when pressing modal close button or backdrop */
                    isOpen={isInfoOpen} /* Modal state */
                    id={null}
                    maxWidth={'800px'}
                >
                    <AppInfoModalContent/>
                </Modal>
                <Modal
                    constraintsRef={
                        constraintsRef
                    } /* Reference div for modal drag boundaries */
                    drag={false} /* Enable (true) or disable (false) drag */
                    resize={false}
                    backdrop={
                        true
                    } /* Is backdrop enabled (true) or disabled (false) */
                    fullScreenOnMobile={
                        true
                    } /* Scale modal full width / height when using mobile device */
                    titleIcon={faInfoCircle} /* Use icon on title or null */
                    title={strings.formatString(
                        strings.metadata.title,
                        metadata.layer ? metadata.layer.name : ''
                    )} /* Modal header title */
                    type={'normal'} /* Modal type */
                    closeAction={
                        handleCloseMetadataModal
                    } /* Action when pressing modal close button or backdrop */
                    isOpen={metadata.data !== null} /* Modal state */
                    id={null}
                    maxWidth={'800px'}
                    overflow={'auto'}
                >
                    <MetadataModal metadata={metadata} />
                </Modal>
                <Modal
                    constraintsRef={
                        constraintsRef
                    } /* Reference div for modal drag boundaries */
                    drag={false} /* Enable (true) or disable (false) drag */
                    resize={false}
                    backdrop={
                        true
                    } /* Is backdrop enabled (true) or disabled (false) */
                    fullScreenOnMobile={
                        false
                    } /* Scale modal full width / height when using mobile device */
                    titleIcon={faShareAlt} /* Use icon on title or null */
                    title={strings.share.title} /* Modal header title */
                    type={'normal'} /* Modal type */
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
                    backdrop={
                        true
                    } /* Is backdrop enabled (true) or disabled (false) */
                    fullScreenOnMobile={
                        false
                    } /* Scale modal full width / height when using mobile device */
                    titleIcon={
                        faExclamationCircle
                    } /* Use icon on title or null */
                    title={
                        search.selected === 'vkm'
                            ? strings.search.vkm.error.title
                            : strings.search.address.error.title
                    } /* Modal header title */
                    type={'warning'} /* Modal type */
                    warningType={warnings.type}
                    closeAction={
                        hideWarn
                    } /* Action when pressing modal close button or backdrop */
                    isOpen={
                        warnings.show && warnings.type === 'searchWarning'
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
                    backdrop={
                        false
                    } /* Is backdrop enabled (true) or disabled (false) */
                    fullScreenOnMobile={
                        true
                    } /* Scale modal full width / height when using mobile device */
                    titleIcon={faSave} /* Use icon on title or null */
                    title={strings.savedContent.savedContent} /* Modal header title */
                    type={'normal'} /* Modal type */
                    closeAction={
                        handleCloseSaveViewModal
                    } /* Action when pressing modal close button or backdrop */
                    isOpen={isSaveViewOpen} /* Modal state */
                    id={null}
                    minWidth={'600px'}
                    hasHelp={true}
                    helpId={'show_view_help'}
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
                    backdrop={
                        true
                    } /* Is backdrop enabled (true) or disabled (false) */
                    fullScreenOnMobile={
                        true
                    } /* Scale modal full width / height when using mobile device */
                    titleIcon={null} /* Use icon on title or null */
                    title={
                        strings.downloadLink.downloadLinkModalHeader
                    } /* Modal header title */
                    type={'normal'} /* Modal type */
                    closeAction={
                        handleCloseDownloadLinkModal
                    } /* Action when pressing modal close button or backdrop */
                    isOpen={
                        downloadLink.layerDownloadLinkModalOpen
                    } /* Modal state */
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
                    backdrop={
                        true
                    } /* Is backdrop enabled (true) or disabled (false) */
                    fullScreenOnMobile={
                        false
                    } /* Scale modal full width / height when using mobile device */
                    titleIcon={
                        faExclamationCircle
                    } /* Use icon on title or null */
                    title={strings.general.warning} /* Modal header title */
                    type={'warning'} /* Modal type */
                    closeAction={
                        handleCloseWarning
                    } /* Action when pressing modal close button or backdrop */
                    isOpen={warning !== null} /* Modal state */
                    id={null}
                >
                    <WarningModalContent warning={warning} />
                </Modal>
                <ScaleBar />
                <StyledToastContainer position="bottom-left" pauseOnFocusLoss={false} transition={Slide} autoClose={false} closeOnClick={false} />
                <StyledContentGrid>
                    <MenuBar />
                    <MapLayersDialog />
                    <Search />
                    <ZoomMenu />
                    <ActionButtons closeAction={handleCloseGFIModal} />
                </StyledContentGrid>
            </StyledContent>
        </>
    );
};

export default Content;
