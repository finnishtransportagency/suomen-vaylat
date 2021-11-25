import styled from 'styled-components';
import { useAppSelector } from '../../state/hooks';
import AppInfoModal from '../app-info-modal/AppInfoModal';
import MenuBar from '../layout/menu-bar/MenuBar';
import MapLayersDialog from '../dialog/MapLayersDialog';
import WarningDialog from '../dialog/WarningDialog';
import PublishedMap from '../published-map/PublishedMap';
import Search from '../search/Search';
import ThemeMapsActionButton from '../action-button/ThemeMapsActionButton';
import { ShareWebSitePopup } from '../share-web-site/ShareWebSitePopup';
import ZoomMenu from '../zoom-features/ZoomMenu';
import strings from '../../translations';
import {setSelectError} from '../../state/slices/rpcSlice';
import {useContext} from 'react';
import {ReactReduxContext} from 'react-redux';
import MetadataModal from '../metadata-modal/MetadataModal';

const StyledContent = styled.div`
    z-index: 1;
    position: relative;
    height: var(--app-height);
    overflow: hidden;
    @media ${(props: { theme: { device: { desktop: any; }; }; }) => props.theme.device.desktop} {
        height: calc(var(--app-height) - 60px);
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
    gap: 16px;
    grid-template-columns: 48px 344px 1fr;
    grid-template-rows: 48px 1fr;
    padding: 16px;
    pointer-events: none;
`;

const Content = () => {

    const {
        warnings
    } = useAppSelector((state) => state.rpc);

    const {
        isSearchOpen,
        shareUrl
    } =  useAppSelector((state) => state.ui);

    const search = useAppSelector((state) => state.search)
    const { store } = useContext(ReactReduxContext);
    const isShareOpen = shareUrl && shareUrl.length > 0 ? true : false;

    const hideWarn = () => {
        store.dispatch(setSelectError({show: false, type: '', filteredLayers: [], indeterminate: false}));
    };

    return (
        <>
        <StyledContent>
            <ZoomMenu />
            <PublishedMap />
            {isShareOpen && <ShareWebSitePopup />}
            <AppInfoModal />
            <MetadataModal />
            <StyledContentGrid>
                <MenuBar />
                <MapLayersDialog />
                <Search isOpen={isSearchOpen}/>
                <ThemeMapsActionButton />
                {warnings.show && warnings.type === 'multipleLayersWarning' &&
                    <WarningDialog
                        dialogOpen={warnings.show}
                        hideWarn={hideWarn}
                        title={strings.warning}
                        message={strings.multipleLayersWarning}
                        filteredLayers={warnings.filteredLayers}
                        isChecked={warnings.isChecked}
                        //indeterminate={warnings.indeterminate}
                        warningType={warnings.type}
                    />
                }
                {warnings.show && warnings.type === 'searchWarning' &&
                    <WarningDialog
                        dialogOpen={warnings.show}
                        hideWarn={hideWarn}
                        title={search.selected === 'vkm' ?
                            strings.search.vkm.error.title : strings.search.address.error.title}
                        message={warnings.message}
                        filteredLayers={[]}
                        isChecked={undefined}
                        indeterminate={false}
                        warningType={warnings.type}
                    />
                }
            </StyledContentGrid>
        </StyledContent>
        </>
    );
 }

 export default Content;
