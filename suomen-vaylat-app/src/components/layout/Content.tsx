import { useAppSelector } from '../../state/hooks';
import styled from 'styled-components';
import PublishedMap from '../published-map/PublishedMap.jsx';
import DrawingTools from '../measurement-tools/DrawingTools';

import SideMenu from '../menus/side-menu/SideMenu';
import MenuBar from  '../layout/menu-bar/MenuBar';
import ZoomMenu from '../zoom-features/ZoomMenu';
import Search from '../search/Search';
import AppInfoModal from '../app-info-modal/AppInfoModal';
import { ToastContainer } from 'react-toastify';
import { Legend } from "../legend/Legend";
import { ShareWebSitePopup } from "../share-web-site/ShareWebSitePopup";

const StyledContent = styled.div`
    z-index: 1;
    position: relative;
    height: var(--app-height);
    overflow: hidden;
    @media ${(props: { theme: { device: { desktop: any; }; }; }) => props.theme.device.desktop} {
        height: calc(var(--app-height) - 60px);
    };
`;

const Content = () => {

    const { selectedLayers } = useAppSelector((state) => state.rpc);

    const {
        isSearchOpen,
        isLegendOpen,
        isDrawingToolsOpen,
        shareUrl
    } =  useAppSelector((state) => state.ui);
    
    const isShareOpen = shareUrl && shareUrl.length > 0 ? true : false;

    return (
        <>
        <StyledContent>
            <SideMenu />
            <ZoomMenu />
            <PublishedMap />
            {isSearchOpen && <Search />}
            {isLegendOpen && <Legend selectedLayers={selectedLayers} />}
            {isShareOpen && <ShareWebSitePopup />}
            {isDrawingToolsOpen && <DrawingTools />}
            <AppInfoModal />
            <ToastContainer />
            <MenuBar />
        </StyledContent>
        </>
    );
 }

 export default Content;
