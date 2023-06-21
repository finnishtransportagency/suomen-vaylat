import { useState, useContext, useEffect, useRef, useCallback } from 'react';
import { ReactReduxContext } from 'react-redux';
import { ToastContainer, Slide, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useAppSelector } from '../../state/hooks';
import styled from 'styled-components';
import strings from '../../translations';
import GfiToolsMenu from '../gfi/GfiToolsMenu';
import GfiDownloadMenu from '../gfi/GfiDownloadMenu';
import Dropdown from '../select/Dropdown';
import { faPlus, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
    setActiveSelectionTool,
    setIsGfiToolsOpen
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
import ThemeMenu from '../menus/theme-menu/ThemeMenu';

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
    };
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
    };
    @media ${props => props.theme.device.tablet} {
        .Toastify__toast-container--top-right {
            top: 9em;
        }
    };
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
    };



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
    };
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

const StyledModalContainer = styled.div`
    :after {
        content: "";
        display: table;
        clear: both;
    }
    padding-left: 20px;
    padding-right: 20px;
    margin-top: 30px;
    margin-bottom: 30px;
    min-height: 160px;
    min-width: 800px;
    position: relative;
    //left: calc(-50vw + 50%);
`;

const StyledModalFloatingChapter = styled.div`
    float: left;
    width: 29%;
    margin-left: 6px;
    //z-index: 1;
    position: relative; 
`;
const StyledModalFloatingActionChapter = styled.div`
    width: 7%;
    margin-left: 6px;
    float: left;
    //z-index: 1;
    position: relative; 
`;


const StyledInput = styled.input`
    width: 100%;
    padding-left: 12px;
    font-size: 16px;
    padding-top: 10px;
    border-radius: 4px;
    border: 2px solid;
    border-color: hsl(0, 0%, 80%);
    padding: 5px 10px;
`;

const StyledFilterContainer = styled.div`
    margin-left: 6px;
    //position: relative;
    width: 100%;
    height: 100%;
    
`;

const StyledFilter = styled.div`
    background-color: #f2f2f2;
    width: 300px;
    float: left;
    border: solid 1px black;
    border-radius: 7px;
    //margin-left: 5px;
    margin-bottom: 5px;
    padding-left: 3px;
    padding-right: 3px;
    :nth-child(odd) {
        background-color: white;
        margin-left: 5px;
    }
    :nth-child(3) {
        //float: none;
    }
`;

const StyledSelectedTabTitle = styled.div`
    padding: 8px;
    p {
        color: ${(props) => props.theme.colors.mainColor1};
        margin: 0;
        font-size: 16px;
        font-weight: 600;
    }
`;

const StyledSelectedTabDisplayOptionsButton = styled.div`
    position: relative;
    right: 0px;
    padding: 8px;
    cursor: pointer;
    color: ${(props) => props.theme.colors.mainColor1};
    svg {
        font-size: 24px;
    };
`;

const StyledToastContainer = styled(ToastContainer)`
`;

const StyledLayerNamesListItem = styled.li``;

const StyledIconWrapper = styled.div`
    border: none;
    background: none;
    cursor: pointer;
    svg {
        color: ${props => props.theme.colors.mainColor1};
        font-size: 20px;
        transition: all 0.1s ease-out;
    };
    &:hover {
        svg {
            color: ${props => props.theme.colors.mainColor2};
        }
    };
    float: right;
    margin-right: 8px;
`;

const StyledFloatingDiv = styled.div`
    :after {
        content: "";
        display: table;
        clear: both;
    }
`;

const StyledFilterProp = styled.div`
    margin-left: 6px;
`;  

const StyledFilterPropContainer = styled.div`
    width: 80%;
    float: left;
`;  


const StyledFilterHeader = styled.div`
    font-size: 16px;
    //color: '0064AF
`;  


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
        isGfiToolsOpen
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

    const [isGfiDownloadToolsOpen, setIsGfiDownloadToolsOpen] = useState(false);

    const [isGfiToolsOpenLocal, setIsGfiToolsOpenLocal] = useState(false);


    const [downloadUuids, setDownloadUuids] = useState([]);

    const [websocketFirstTimeTryConnecting, setWebsocketFirstTimeTryConnecting] = useState(false);
    const [filters, setFilters] = useState([]);

    useEffect(() => {
        const filtersFromLocalStorage = JSON.parse(localStorage.getItem('filters'));
        if (filtersFromLocalStorage) {
            setFilters(filtersFromLocalStorage);
        }
      }, []);

    useEffect(() => {
        localStorage.setItem('filters', JSON.stringify(filters));
    }, [filters]);    

    useEffect(() => {
        announcements && setCurrentAnnouncement(0);
    }, [announcements]);

    useEffect(() => {
        setIsGfiToolsOpenLocal(isGfiToolsOpen);
    }, [isGfiToolsOpen])

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

    const handleCloseGfiDownloadTools = () => {
        setIsGfiDownloadToolsOpen(false);
        store.dispatch(resetGFILocations([]));
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
    }

    const handleCloseGfiLocations = () => {
        store.dispatch(setIsGfiToolsOpen(false));
    };

    const viewHelp = () => {
        return (
            <ul>
                <li>{strings.savedContent.saveView.saveViewDescription1}</li>
                <li>{strings.savedContent.saveView.saveViewDescription2}</li>
            </ul>
        )
    }

    const handleGfiToolsMenu = () => {
        store.dispatch(setIsGfiToolsOpen(false));
        channel &&
            channel.postRequest('DrawTools.StopDrawingRequest', [
                'gfi-selection-tool',
                true,
            ]);

        isGfiToolsOpen && channel &&
            channel.postRequest('VectorLayerRequest', [
                {
                    layerId: 'download-tool-layer',
                    remove: true,
                },
            ]);
        store.dispatch(setActiveSelectionTool(null));
        setIsGfiDownloadToolsOpen(!isGfiDownloadToolsOpen);
    };


    const handleGfiDownload = (format, layers, croppingArea) => {
        // Open websocket if is not already opened
        if(supportsWebSockets) {
            !websocketFirstTimeTryConnecting && connectWebsocket(0);
        } else {
            toast.error(strings.downloads.noWebSocketSupport, {position: "top-center"});
        }

        let sessionId = '';

        let layerIds = layers.map((layer) => {
            return layer.id;
        });

        channel.downloadFeaturesByGeoJSON && channel.downloadFeaturesByGeoJSON([layerIds, croppingArea, format.format, sessionId], (data) => {

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
                    errorLayers: []
                };

                store.dispatch(setIsGfiDownloadOpen(true));
                store.dispatch(setDownloadActive(newDownload));
            }
            return;
        });

        if (!isGfiOpen) {
            store.dispatch(resetGFILocations([]));
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
        }
        isGfiDownloadToolsOpen && setIsGfiDownloadToolsOpen(false);

    };

    const supportsWebSockets = 'WebSocket' in window || 'MozWebSocket' in window;

    const simplifyGeometry = () => {
        console.log("simplify");
    }

    const connectWebsocket = (count) => {
        const MAX_RECONNECTIONS_TRY = 20;

        setWebsocketFirstTimeTryConnecting(true);

        // Open WebSocket
        const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

        const handleDownloadFailure = () => {
            handleCloseGfiDownloadModal();
            handleCloseSaveViewModal();
            ws.close();
            toast.error(strings.downloads.downloadFailure, {position: "top-center"});
        };

        ws.onopen = function ()
        {
            // when opened connection send resend download status message
            if (downloadUuids.length > 0) {
                var json = {type:'resendDownloadStatuses', data: {uuids:downloadUuids}};
                ws.send(JSON.stringify(json));
            }

            // ping 10 min interval
            const sendPing = () => {
                var json = {type:'ping', data: {}};
                ws.send(JSON.stringify(json));
            }

            setInterval(() => {
                sendPing();
            }, 1000 * 60 * 10);
        };
        ws.onmessage = function (evt)
        {
            let data = JSON.parse(evt.data);
            
            if(data.type === 'BODY_SIZE_EXCEEDED') {
                store.dispatch(setWarning({
                    title: strings.bodySizeWarning,
                    subtitle: null,
                    cancel: {
                        text: strings.general.cancel,
                        action: () => {
                            store.dispatch(setWarning(null))
                        }
                    },
                    confirm: {
                        text: strings.general.continue,
                        action: () => {
                            simplifyGeometry();
                            store.dispatch(setWarning(null));
                        }
                    },
                }))
            }

            if(data.type === 'DOWNLOAD_READY') {
                if (data.data && data.data.uuid && downloadUuids.includes(data.data.uuid)) {
                    var index = downloadUuids.indexOf(data.data.uuid);
                    let newArray = downloadUuids;
                    if (index > -1) {
                        newArray.splice(index, 1);
                    }
                    setDownloadUuids(newArray);

                    store.dispatch(setDownloadFinished({
                        id: data.data.uuid,
                        url: data.data.url,
                        fileSize: data.data.fileSize !== null && data.data.fileSize,
                        errorLayers: data.data.errorLayers
                    }));
                }
            }
        }
        ws.onerror = () => {
            handleDownloadFailure();
        };
        ws.onclose = () => {
            if (count < MAX_RECONNECTIONS_TRY) {
                setTimeout(() => {
                    connectWebsocket(count + 1);
                }, 1000 * 30);
            }
            else {
                handleDownloadFailure();
            };
        };
    }

    //useEffect(() => {
    //  console.info("filterit päivittyneet", filters)
    //  forceUpdate();
    //}, [filters, setFilters]);
    //const [state, updateState] = useState();
    //const forceUpdate = useCallback(() => updateState({}), []);
    const [ operatorValue,  setOperatorValue] = useState({});
    const [ filterValue, setFilterValue] = useState("");
    const [ propValue, setPropValue] = useState({});
    const addFilter = () => {
        const prop = propValue.value;
        const value = filterValue;
        const oper = operatorValue.value;
        const layer = filteringInfo.title; //TODO tähän oikea layer title jostain

        if (!prop || !value || !oper){
            return
        }
        setFilters(
            [...filters,
            {   
                "layer" : layer,
                "property": prop,
                "operator": oper,
                "value": value
            }
        ]
        )
        setPropValue({})
        setFilterValue("")
        setOperatorValue({})
    }
    const gfiFilteringOptions = [
    { value: 'equals', label: 'Yhtäsuuri kuin' },
    { value: 'notEquals', label: 'Erisuuri kuin' },
    { value: 'smallerThan', label: 'Pienempi kuin' },
    { value: 'biggerThan', label: 'Suurempi kuin' },
    ];

    const [filteringInfo, setFilteringInfo] = useState({ modalOpen: false });
    
    const propOptions =  
        filteringInfo?.tableProps?.columns.map( column => {  
        return { value: column.key, label: column.title}
    } )
    const handleCloseFilteringModal = useCallback(() => {
        setFilteringInfo({...filteringInfo, modalOpen: false}) 
    }, [filteringInfo]);

    //const handleCloseFilteringModal = () => {
    //    setFilteringInfo({...filteringInfo, modalOpen: false}) 
    //}

    /*const handleOpenFilteringModal = () => {
        setFilteringInfo({...filteringInfo, modalOpen: true}) 
    }*/
    const handleOpenFilteringModal = useCallback(() => {
        console.info("setFilteringInfo ")
        setFilteringInfo({...filteringInfo, modalOpen: true}) 
     }, [filteringInfo]);

    const [activeFilters, setActiveFilters] = useState();
    useEffect(() => {
        if (filteringInfo && filteringInfo?.title && filters){
            const updatedActivefilters = filters.filter(filter => filter.layer === filteringInfo?.title)
            setActiveFilters(updatedActivefilters)
        }
     }, [filters, filteringInfo]);
   
    const handleRemoveFilter = (filter) => {
        if (filters && filters.length > 0 && filters.includes(filter)){
            const updatedFilters = filters.filter(existingFilter => existingFilter !== filter )
            setFilters(updatedFilters)
        }
    }

    const handleRemoveAllFilters = () => {
        if (filters && filters.length > 0){
            setFilters([])
        }
    }

    

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
                    minimize={minimizeGfi}
                    maximize={maximizeGfi}
                >
                    <GFIPopup
                        handleGfiDownload={handleGfiDownload}
                        filteringInfo={filteringInfo}
                        setFilteringInfo={setFilteringInfo}
                        filters={filters}
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
                    titleIcon={
                        null
                    } /* Use icon on title or null */
                    title={strings.gfi.selectLocations} /* Modal header title */
                    type={'normal'} /* Modal type */
                    closeAction={
                        handleCloseGfiLocations
                    } /* Action when pressing modal close button or backdrop */
                    isOpen={isGfiToolsOpenLocal} /* Modal state */
                    id={null}
                    minimize={minimizeGfi}
                    maximize={maximizeGfi}
                >
                    <GfiToolsMenu 
                        handleGfiToolsMenu={handleGfiToolsMenu} 
                        closeButton={false} 
                        filters={filters}
                    />
                </Modal>
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
                    titleIcon={
                        null
                    } /* Use icon on title or null */
                    title={strings.gfi.downloadMaterials} /* Modal header title */
                    type={'normal'} /* Modal type */
                    closeAction={
                        handleCloseGfiDownloadTools
                    } /* Action when pressing modal close button or backdrop */
                    isOpen={isGfiDownloadToolsOpen} /* Modal state */
                    id={null}
                >
                    <GfiDownloadMenu closeButton={false} handleGfiDownload={handleGfiDownload}></GfiDownloadMenu>
                </Modal>
                <Modal
                    constraintsRef={
                        {constraintsRef}
                    } /* Reference div for modal drag boundaries */
                    drag={true} /* Enable (true) or disable (false) drag */
                    resize={true}
                    backdrop={
                        false
                    } /* Is backdrop enabled (true) or disabled (false) */
                    fullScreenOnMobile={
                        true
                    } /* Scale modal full width / height when using mobile device */
                    titleIcon={
                        null
                    } /* Use icon on title or null */
                    title={strings.gfi.filter} /* Modal header title */
                    type={'normal'} /* Modal type */
                    closeAction={
                        handleCloseFilteringModal
                    } /* Action when pressing modal close button or backdrop */
                    isOpen={filteringInfo.modalOpen} /* Modal state */
                    id={null}
                    minimize={minimizeGfi}
                    maximize={maximizeGfi}
                    height='240px'
                    width='840px'
                >
                    <StyledModalContainer>
                        <StyledModalFloatingChapter>
                        <Dropdown 
                            options={propOptions}
                            placeholder={strings.gfifiltering.placeholders.chooseProp}
                            value={propValue}
                            setValue={setPropValue}
                        />
                        </StyledModalFloatingChapter>
                        <StyledModalFloatingChapter>
                        <Dropdown 
                            options={gfiFilteringOptions}
                            placeholder={strings.gfifiltering.placeholders.chooseOperator}
                            value={operatorValue}
                            setValue={setOperatorValue}
                        />
                        </StyledModalFloatingChapter>
                        <StyledModalFloatingChapter>
                        <StyledInput
                            type="text"
                            value={filterValue}
                            placeholder={strings.gfifiltering.placeholders.chooseValue}
                            onChange={e => setFilterValue(e.target.value)}
                            onKeyPress={e => {
                                if (e.key === 'Enter') {
                                    addFilter();
                                }
                            }}
                        />
                        </StyledModalFloatingChapter>
                        <StyledModalFloatingActionChapter>
                            <StyledSelectedTabDisplayOptionsButton
                                onClick={() =>  addFilter()}
                            >
                            <FontAwesomeIcon icon={faPlus} />
                            </StyledSelectedTabDisplayOptionsButton>
                        </StyledModalFloatingActionChapter>
                    
                        {activeFilters && activeFilters.length > 0 && (
                            <StyledFilterContainer>
                                <StyledFilterHeader>{strings.gfifiltering.activeFilters}</StyledFilterHeader>
                                <StyledIconWrapper 
                                 onClick={() => {
                                    handleRemoveAllFilters();
                                }}>
                                <StyledFloatingDiv><FontAwesomeIcon icon={faTrash} size="6x" style={{}}/>Poista kaikki suodattimet</StyledFloatingDiv>
                                </StyledIconWrapper>
                                {
                                activeFilters.map( (filter) =>  
                                <StyledFilter>
                                <StyledFilterPropContainer>      
                                    <StyledFilterProp>{strings.gfifiltering.property}: {filter.property}</StyledFilterProp> 
                                    <StyledFilterProp>{strings.gfifiltering.operator}:  {filter.operator}</StyledFilterProp> 
                                    <StyledFilterProp>{strings.gfifiltering.value}: {filter.value}</StyledFilterProp> 
                                </StyledFilterPropContainer>
                                <StyledIconWrapper
                                onClick={() => {
                                    handleRemoveFilter(filter);
                                }}>
                                <StyledFloatingDiv><FontAwesomeIcon icon={faTimes} size="6x" style={{}}/></StyledFloatingDiv>
                                </StyledIconWrapper>
                                </StyledFilter>
                                )}                        
                            </StyledFilterContainer>
                        )
                        }
                    </StyledModalContainer>
                </Modal>
                <ScaleBar />
                <StyledToastContainer position="bottom-left" pauseOnFocusLoss={false} transition={Slide} autoClose={false} closeOnClick={false} />
                <StyledContentGrid>
                    <StyledLeftSection>
                        <MenuBar filters={filters} />
                        <ThemeMenu />
                        <MapLayersDialog 
                            filters={filters}
                            handleOpenFilteringModal={handleOpenFilteringModal}
                        />
                    </StyledLeftSection>
                    <StyledRightSection>
                        <Search />
                        <ZoomMenu  filters={filters}/>
                        <ActionButtons closeAction={handleCloseGFIModal} />
                    </StyledRightSection>
                </StyledContentGrid>
            </StyledContent>
        </>
    );
};

export default Content;
