import { useContext } from "react";
import { useAppSelector } from '../../state/hooks';
import { ReactReduxContext } from 'react-redux';
import { setIsSideMenuOpen, setIsSearchOpen, setIsLegendOpen, setIsDrawingToolsOpen, setIsFullScreen} from '../../state/slices/uiSlice';
import styled from 'styled-components';
import strings from '../../translations';
import PublishedMap from '../published-map/PublishedMap.jsx';
import DrawingTools from '../measurement-tools/DrawingTools';
import ReactTooltip from 'react-tooltip';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup, faSearch, faImages, faPencilRuler, faExpand, faCompress } from '@fortawesome/free-solid-svg-icons';

import SideMenu from '../menus/side-menu/SideMenu';
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

const StyledMenuBar = styled.div`
    position: absolute;
    top: 10px;
    left: 10px;
    width: 40px;
    height: 100%;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    transition: all 0.5s ease-in-out;
    @media ${(props: { theme: { device: { mobileL: any; }; }; }) => props.theme.device.mobileL} {
        top: calc(100% - 60px);
        width: 100%;
        height: 40px;
        justify-content: space-around;
        align-items: center;
        flex-direction: row;
    };
`;

const StyledMenuBarButton = styled.div`
    position: relative;
    cursor: pointer;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${(props: { isActive: any; theme: { colors: { maincolor2: any; maincolor1: any; }; }; }) => props.isActive ? props.theme.colors.maincolor2 : props.theme.colors.maincolor1};
    margin-top: 10px;
    box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 3px 6px;
    border-radius: 50%;
    svg {
        color: ${(props: { theme: { colors: { mainWhite: any; }; }; }) => props.theme.colors.mainWhite};
        font-size: 18px;
    };
    @media ${(props: { theme: { device: { mobileL: any; }; }; }) => props.theme.device.mobileL} {
        width: 40px;
        height: 40px;
    };
`;

const StyledLayerCount = styled.div`
    position: absolute;
    top: -6px;
    right: -3px;
    width: 25px;
    height: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    color: ${(props: { theme: { colors: { mainWhite: any; }; }; }) => props.theme.colors.mainWhite};
    background-color: ${(props: { theme: { colors: { secondaryColor7: any; }; }; }) => props.theme.colors.secondaryColor7};
    font-size: 14px;
    font-weight: 600;
`;

const Content = () => {

    const { store } = useContext(ReactReduxContext);

    const { selectedLayers } = useAppSelector((state) => state.rpc);

    const {
        isFullScreen,
        isSideMenuOpen,
        isSearchOpen,
        isLegendOpen,
        isDrawingToolsOpen,
        shareUrl
    } =  useAppSelector((state) => state.ui);
    
    const isShareOpen = shareUrl && shareUrl.length > 0 ? true : false;

    const handleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            store.dispatch(setIsFullScreen(true));
        } else {
          if (document.exitFullscreen) {
                document.exitFullscreen();
                store.dispatch(setIsFullScreen(false));
          }
        }
    };


    return (
        <>
        <ReactTooltip id='layerlist' place="right" type="dark" effect="float">
            <span>{strings.tooltips.layerlistButton}</span>
        </ReactTooltip>
        
        <ReactTooltip id='search' place="right" type="dark" effect="float">
            <span>{strings.tooltips.searchButton}</span>
        </ReactTooltip>
        
        <ReactTooltip id='legend' place="right" type="dark" effect="float">
            <span>{strings.tooltips.legendButton}</span>
        </ReactTooltip>
        
        <ReactTooltip id='fullscreen' place="right" type="dark" effect="float">
            <span>{strings.tooltips.fullscreenButton}</span>
        </ReactTooltip>
        
        <ReactTooltip id='drawingtools' place="right" type="dark" effect="float">
            <span>{strings.tooltips.drawingtools.drawingtoolsButton}</span>
        </ReactTooltip>

        <StyledContent>
            <SideMenu />
            <ZoomMenu />
            <PublishedMap />
            {isSearchOpen && <Search />}
            {isLegendOpen && <Legend selectedLayers={selectedLayers}></Legend>}
            {isShareOpen && <ShareWebSitePopup />}
            {isDrawingToolsOpen && <DrawingTools />}
            <AppInfoModal />
            <ToastContainer></ToastContainer>
            <StyledMenuBar>
                <StyledMenuBarButton
                    data-tip data-for='layerlist'
                    isActive={isSideMenuOpen}
                    onClick={() => store.dispatch(setIsSideMenuOpen(!isSideMenuOpen))}
                >
                    <StyledLayerCount>
                        {selectedLayers.length}
                    </StyledLayerCount>
                    <FontAwesomeIcon
                        icon={faLayerGroup}
                    />
                </StyledMenuBarButton>
                <StyledMenuBarButton
                    data-tip data-for='search'
                    isActive={isSearchOpen}
                    onClick={() => store.dispatch(setIsSearchOpen(!isSearchOpen))}
                >
                    <FontAwesomeIcon
                        icon={faSearch}
                    />
                </StyledMenuBarButton>
                <StyledMenuBarButton
                    data-tip data-for='legend'
                    isActive={isLegendOpen}
                    onClick={() => store.dispatch(setIsLegendOpen(!isLegendOpen))}>
                    <FontAwesomeIcon
                        icon={faImages}
                    />
                </StyledMenuBarButton>
                <StyledMenuBarButton
                    data-tip data-for='drawingtools'
                    isActive={isDrawingToolsOpen}
                    onClick={() => store.dispatch(setIsDrawingToolsOpen(!isDrawingToolsOpen))}>
                    <FontAwesomeIcon
                        icon={faPencilRuler}
                    />
                </StyledMenuBarButton>
                <StyledMenuBarButton
                    data-tip data-for='fullscreen'
                    isActive={isFullScreen}
                    onClick={() => handleFullScreen()}>
                    <FontAwesomeIcon
                        icon={isFullScreen ? faCompress : faExpand}
                    />
                </StyledMenuBarButton>
            </StyledMenuBar>
        </StyledContent>
        </>
    );
 }

 export default Content;
