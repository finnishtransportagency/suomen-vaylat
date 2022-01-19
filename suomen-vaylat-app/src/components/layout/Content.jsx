import React, { useState, useContext, useEffect, useRef } from 'react';
import { ReactReduxContext } from 'react-redux';
import { useAppSelector } from '../../state/hooks';
import styled from 'styled-components';
import AnnouncementsModal from '../announcements-modal/AnnouncementsModal';
import AppInfoModalContent from '../app-info-modal/AppInfoModalContent';
import UserGuideModalContent from '../user-guide-modal/UserGuideModalContent';
import MenuBar from './menu-bar/MenuBar';
import MapLayersDialog from '../dialog/MapLayersDialog';
import WarningDialog from '../dialog/WarningDialog';
import PublishedMap from '../published-map/PublishedMap';
import Search from '../search/Search';
import ActionButtons from '../action-button/ActionButtons';
import { ShareWebSitePopup } from '../share-web-site/ShareWebSitePopup';
import ZoomMenu from '../zoom-features/ZoomMenu';
import strings from '../../translations';
import {
    setSelectError,
    clearLayerMetadata,
    resetGFILocations
} from '../../state/slices/rpcSlice';
import {
    setShareUrl,
    setIsInfoOpen,
    setIsUserGuideOpen,
    setMinimizeGfi,
} from '../../state/slices/uiSlice';
import { GFIPopup } from '../infobox/GFIPopup';
import MetadataModal from '../metadata-modal/MetadataModal';

import {
    faShareAlt,
    faInfoCircle,
    faQuestion,
    faBullhorn,
    faExclamationCircle,
    faMapMarkedAlt
} from '@fortawesome/free-solid-svg-icons';

import Modal from '../modals/Modal';

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
    @media ${props => props.theme.device.desktop} {

    };
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
    @media ${props => props.theme.device.mobileL} {
        padding: 8px;
        grid-template-columns: 48px 1fr;
    };
`;

const Content = () => {

    const constraintsRef = useRef(null);

    const {
        warnings
    } = useAppSelector((state) => state.rpc);

    const {
        shareUrl,
        isInfoOpen,
        isUserGuideOpen,
        minimizeGfi
    } = useAppSelector((state) => state.ui);

    const search = useAppSelector((state) => state.search)
    const { store } = useContext(ReactReduxContext);
    const isShareOpen = shareUrl && shareUrl.length > 0 ? true : false;

    const announcements = useAppSelector((state) => state.rpc.activeAnnouncements);
    const metadata = useAppSelector((state) => state.rpc.layerMetadata);
    let {
        channel,
        gfiLocations
    } = useAppSelector((state) => state.rpc);
    //const channel = useSelector(state => state.rpc.channel);

    const ANNOUNCEMENTS_LOCALSTORAGE = "oskari-announcements";

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
        };
        announcements.length > currentAnnouncement + 1 && setCurrentAnnouncement(currentAnnouncement + 1);
    };

    const hideWarn = () => {
        store.dispatch(setSelectError({ show: false, type: '', filteredLayers: [], indeterminate: false }));
    };

    function handleCloseAppInfoModal() {
        store.dispatch(setIsInfoOpen(false));
    };

    const handleCloseShareWebSite = () => {
        store.dispatch(setShareUrl(''));
    };

    const handleCloseUserGuide = () => {
        store.dispatch(setIsUserGuideOpen(false));
    };

    const handleCloseMetadataModal = () => {
            store.dispatch(clearLayerMetadata());
    };

    const handleCloseGFIModal = () => {
            store.dispatch(resetGFILocations([]));
            store.dispatch(setMinimizeGfi(false));
            channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', []);
            //channel.postRequest('MapModulePlugin.RemoveMarkersRequest', ['gfi_location']);
    };

    return (
        <>
            <StyledContent
                ref={constraintsRef}
            >
                <PublishedMap />
                {
                currentAnnouncement !== null && announcements[currentAnnouncement] && (
                    <Modal
                        key={'announcement-modal-'+announcements[currentAnnouncement].id}
                        constraintsRef={constraintsRef} /* Reference div for modal drag boundaries */
                        drag={false} /* Enable (true) or disable (false) drag */
                        resize={false}
                        backdrop={true} /* Is backdrop enabled (true) or disabled (false) */
                        fullScreenOnMobile={false} /* Scale modal full width / height when using mobile device */
                        titleIcon={faBullhorn} /* Use icon on title or null */
                        title={announcements[currentAnnouncement].title} /* Modal header title */
                        type={"announcement"} /* Modal type */
                        closeAction={closeAnnouncement} /* Action when pressing modal close button or backdrop */
                        isOpen={null} /* Modal state */
                        id={announcements[currentAnnouncement].id}
                >
                        <AnnouncementsModal
                            id={announcements[currentAnnouncement].id}
                            title={announcements[currentAnnouncement].title}
                            content={announcements[currentAnnouncement].content}
                            key={'announcement_modal_'+announcements[currentAnnouncement].id}
                        />
                    </Modal>
                    )
                }
                <Modal
                    constraintsRef={constraintsRef} /* Reference div for modal drag boundaries */
                    drag={true} /* Enable (true) or disable (false) drag */
                    resize={true}
                    backdrop={false} /* Is backdrop enabled (true) or disabled (false) */
                    fullScreenOnMobile={true} /* Scale modal full width / height when using mobile device */
                    titleIcon={faMapMarkedAlt} /* Use icon on title or null */
                    title={strings.gfi.title} /* Modal header title */
                    type={"gfi"} /* Modal type */
                    closeAction={handleCloseGFIModal} /* Action when pressing modal close button or backdrop */
                    isOpen={gfiLocations.length > 0 && minimizeGfi === false} /* Modal state */
                    id={null}
                    minWidth={600}
                    maxWidth={1200}
                    //overflow={"auto"}
                >
                    <GFIPopup gfiLocations={gfiLocations}/>
                </Modal>
                <Modal
                    constraintsRef={constraintsRef} /* Reference div for modal drag boundaries */
                    drag={false} /* Enable (true) or disable (false) drag */
                    resize={false}
                    backdrop={true} /* Is backdrop enabled (true) or disabled (false) */
                    fullScreenOnMobile={true} /* Scale modal full width / height when using mobile device */
                    titleIcon={faQuestion} /* Use icon on title or null */
                    title={strings.appGuide.title} /* Modal header title */
                    type={"normal"} /* Modal type */
                    closeAction={handleCloseUserGuide} /* Action when pressing modal close button or backdrop */
                    isOpen={isUserGuideOpen} /* Modal state */
                    id={null}
                >
                    <UserGuideModalContent />
                </Modal>
                <Modal
                    constraintsRef={constraintsRef} /* Reference div for modal drag boundaries */
                    drag={false} /* Enable (true) or disable (false) drag */
                    resize={false}
                    backdrop={true} /* Is backdrop enabled (true) or disabled (false) */
                    fullScreenOnMobile={true} /* Scale modal full width / height when using mobile device */
                    titleIcon={faInfoCircle} /* Use icon on title or null */
                    title={strings.appInfo.title} /* Modal header title */
                    type={"normal"} /* Modal type */
                    closeAction={handleCloseAppInfoModal} /* Action when pressing modal close button or backdrop */
                    isOpen={isInfoOpen} /* Modal state */
                    id={null}
                >
                    <AppInfoModalContent />
                </Modal>
                <Modal
                    constraintsRef={constraintsRef} /* Reference div for modal drag boundaries */
                    drag={false} /* Enable (true) or disable (false) drag */
                    resize={false}
                    backdrop={true} /* Is backdrop enabled (true) or disabled (false) */
                    fullScreenOnMobile={true} /* Scale modal full width / height when using mobile device */
                    titleIcon={faInfoCircle} /* Use icon on title or null */
                    title={strings.formatString(strings.metadata.title, metadata.layer ? metadata.layer.name : '')} /* Modal header title */
                    type={"normal"} /* Modal type */
                    closeAction={handleCloseMetadataModal} /* Action when pressing modal close button or backdrop */
                    isOpen={metadata.data !== null} /* Modal state */
                    id={null}
                    maxWidth={800}
                    overflow={"auto"}
                >
                    <MetadataModal metadata={metadata}/>
                </Modal>
                <Modal
                    constraintsRef={constraintsRef} /* Reference div for modal drag boundaries */
                    drag={false} /* Enable (true) or disable (false) drag */
                    resize={false}
                    backdrop={true} /* Is backdrop enabled (true) or disabled (false) */
                    fullScreenOnMobile={false} /* Scale modal full width / height when using mobile device */
                    titleIcon={faShareAlt} /* Use icon on title or null */
                    title={strings.share.title} /* Modal header title */
                    type={"normal"} /* Modal type */
                    closeAction={handleCloseShareWebSite} /* Action when pressing modal close button or backdrop */
                    isOpen={isShareOpen} /* Modal state */
                    id={null}
                >
                    <ShareWebSitePopup />
                </Modal>
                <Modal
                    constraintsRef={constraintsRef} /* Reference div for modal drag boundaries */
                    drag={false} /* Enable (true) or disable (false) drag */
                    resize={false}
                    backdrop={true} /* Is backdrop enabled (true) or disabled (false) */
                    fullScreenOnMobile={false} /* Scale modal full width / height when using mobile device */
                    titleIcon={faExclamationCircle} /* Use icon on title or null */
                    title={strings.general.warning} /* Modal header title */
                    type={"warning"} /* Modal type */
                    warningType={warnings.type}
                    closeAction={hideWarn} /* Action when pressing modal close button or backdrop */
                    isOpen={warnings.show && warnings.type === 'multipleLayersWarning'} /* Modal state */
                    id={null}
                >
                    <WarningDialog
                        hideWarn={hideWarn}
                        message={strings.multipleLayersWarning}
                        filteredLayers={warnings.filteredLayers}
                        warningType={warnings.type}
                        closeAction={hideWarn} /* Action when pressing modal close button or backdrop */
                        isOpen={warnings.show && warnings.type === 'multipleLayersWarning'} /* Modal state */
                        id={null}
                    />
                </Modal>
                <Modal
                    constraintsRef={constraintsRef} /* Reference div for modal drag boundaries */
                    drag={false} /* Enable (true) or disable (false) drag */
                    resize={false}
                    backdrop={true} /* Is backdrop enabled (true) or disabled (false) */
                    fullScreenOnMobile={false} /* Scale modal full width / height when using mobile device */
                    titleIcon={faExclamationCircle} /* Use icon on title or null */
                    title={search.selected === 'vkm' ? strings.search.vkm.error.title : strings.search.address.error.title} /* Modal header title */
                    type={"warning"} /* Modal type */
                    warningType={warnings.type}
                    closeAction={hideWarn} /* Action when pressing modal close button or backdrop */
                    isOpen={warnings.show && warnings.type === 'searchWarning'} /* Modal state */
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
                <StyledContentGrid>
                    <MenuBar />
                    <MapLayersDialog />
                    <Search />
                    <ZoomMenu />
                    <ActionButtons
                        closeAction={handleCloseGFIModal}
                    />
                </StyledContentGrid>
            </StyledContent>
        </>
    );
}

export default Content;
