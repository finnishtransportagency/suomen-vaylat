import styled from 'styled-components';
import { useAppSelector } from '../../state/hooks';
import AppInfoModal from '../app-info-modal/AppInfoModal';
import MenuBar from '../layout/menu-bar/MenuBar';
import { Legend } from "../legend/Legend";
import DrawingTools from '../measurement-tools/DrawingTools';
import MapLayersDialog from '../dialog/MapLayersDialog';
import WarningDialog from '../dialog/WarningDialog';
import PublishedMap from '../published-map/PublishedMap';
import Search from '../search/Search';
import { ShareWebSitePopup } from "../share-web-site/ShareWebSitePopup";
import ZoomMenu from '../zoom-features/ZoomMenu';
import strings from "../../translations";
import {setSelectError} from "../../state/slices/rpcSlice";
import {useContext} from "react";
import {ReactReduxContext} from "react-redux";

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
    grid-template-columns: 48px 344px 1fr 48px;
    padding: 16px;
    pointer-events: none;
`;

const Content = () => {

    const {
        selectedLayers,
        warnings
    } = useAppSelector((state) => state.rpc);

    const {
        isSearchOpen,
        isLegendOpen,
        isDrawingToolsOpen,
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
            {isSearchOpen && <Search />}
            {isLegendOpen && <Legend selectedLayers={selectedLayers} />}
            {isShareOpen && <ShareWebSitePopup />}
            {isDrawingToolsOpen && <DrawingTools />}
            <AppInfoModal />
            <StyledContentGrid>
                <MenuBar />
                <MapLayersDialog />
                {warnings.show && warnings.type == 'multipleLayersWarning' &&
                    <WarningDialog
                        dialogOpen={warnings.show}
                        hideWarn={hideWarn}
                        title={strings.warning}
                        message={strings.multipleLayersWarning}
                        filteredLayers={warnings.filteredLayers}
                        indeterminate={warnings.indeterminate}
                    />
                }
                {warnings.show && warnings.type == 'searchWarning' &&
                    <WarningDialog
                        dialogOpen={warnings.show}
                        hideWarn={hideWarn}
                        title={search.selected == 'vkm' ?
                            strings.search.vkm.error.title : strings.search.address.error.title}
                        message={warnings.message}
                        filteredLayers={[]}
                        indeterminate={false}
                    />
                }
            </StyledContentGrid>
        </StyledContent>
        </>
    );
 }

 export default Content;
