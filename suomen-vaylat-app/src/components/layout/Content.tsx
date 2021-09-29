import { useContext } from "react";
import { useAppSelector } from '../../state/hooks';
import { ReactReduxContext } from 'react-redux';
import { setIsSideMenuOpen, setIsSearchOpen, setIsLegendOpen, setIsDrawingToolsOpen, setIsFullScreen} from '../../state/slices/uiSlice';
import styled from 'styled-components';
import strings from '../../translations';
import PublishedMap from '../published-map/PublishedMap.jsx';
import LayerListTEMP from '../menus/hierarchical-layerlist/LayerListTEMP';
import DrawingTools from '../measurement-tools/DrawingTools';
import ReactTooltip from 'react-tooltip';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup, faSearch, faTimes, faImages, faPencilRuler, faExpand, faCompress } from '@fortawesome/free-solid-svg-icons';

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


const StyledSideMenu = styled.div`
    z-index: 10;
    display: flex;
    flex-direction: column;
    position: absolute;
    transition: all 0.5s ease-in-out;
    top: 0px;
    left: 0px;
    max-width: 340px;
    width: 100%;
    padding: 10px;
    height: calc(var(--app-height) - 60px);
    transform: ${(props: { isSideMenuOpen: boolean; }) => props.isSideMenuOpen ? "translateX(0%)" : "translateX(-100%)"};
    background-color: ${(props: { theme: { colors: { maincolor1: any; }; }; }) => props.theme.colors.maincolor1};
    box-shadow: rgba(0, 0, 0, 0.19) 5px 5px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
    overflow-y: auto;
    &::-webkit-scrollbar {
        display: none;
    };
    @media ${(props: { theme: { device: { laptop: any; }; }; }) => props.theme.device.laptop} {
        z-index: 10;
    };
    @media ${(props: { theme: { device: { mobileL: any; }; }; }) => props.theme.device.mobileL} {
        z-index: 10;
        max-width: 100%;
        width: 100%;
        //height: var(--app-height);
    };
`;

const StyledSideMenuHeader = styled.div`
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: ${(props: { theme: { colors: { mainWhite: any; }; }; }) => props.theme.colors.mainWhite};
    margin: 10px;
    padding-left: 10px;
    svg  {
        font-size: 20px;
    }
`;

const StyledSideMenuLeftContent = styled.div`
    display: flex;
    align-items: center;
`;

const StyledSideMenuHeaderTitle = styled.p`
    font-size: 18px;
    margin: 0;
    font-weight: 600;
    padding-left: 10px;
`;

const StyledSideMenuCloseButton = styled.div`
    cursor: pointer;
    display: flex;
    padding-right: 15px;
    svg {
        color: ${(props: { theme: { colors: { mainWhite: any; }; }; }) => props.theme.colors.mainWhite};
        font-size: 20px;
    };
`;

const StyledMenuBar = styled.div`
    transition: all 0.5s ease-in-out;
    position: absolute;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    top: 10px;
    left: 10px;
    width: 40px;
    height: 100%;
    @media ${(props: { theme: { device: { mobileL: any; }; }; }) => props.theme.device.mobileL} {
        top: calc(100% - 60px);
        width: 100%;
        height: 40px;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
    };
`;

const StyledMenuBarButton = styled.div`
    position: relative;
    cursor: pointer;
    width: 40px;
    height: 40px;
    margin-top: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${(props: { isActive: any; theme: { colors: { maincolor2: any; maincolor1: any; }; }; }) => props.isActive ? props.theme.colors.maincolor2 : props.theme.colors.maincolor1};
    border-radius: 50%;
    box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 3px 6px;
    svg {
        font-size: 18px;
        color: ${(props: { theme: { colors: { mainWhite: any; }; }; }) => props.theme.colors.mainWhite};
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
    background-color: ${(props: { theme: { colors: { secondaryColor7: any; }; }; }) => props.theme.colors.secondaryColor7};
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${(props: { theme: { colors: { mainWhite: any; }; }; }) => props.theme.colors.mainWhite};
    font-size: 14px;
    font-weight: 600;
`;

const Content = () => {
    const { store } = useContext(ReactReduxContext);
    const isFullScreen = useAppSelector((state) => state.ui.isFullScreen);
    const isSideMenuOpen = useAppSelector((state) => state.ui.isSideMenuOpen);
    const isSearchOpen = useAppSelector((state) => state.ui.isSearchOpen);
    const isLegendOpen = useAppSelector((state) => state.ui.isLegendOpen);
    const isDrawingToolsOpen = useAppSelector((state) => state.ui.isDrawingToolsOpen);
    const allGroups = useAppSelector((state) => state.rpc.allGroups);
    const allLayers = useAppSelector((state) => state.rpc.allLayers);
    const selectedLayers = useAppSelector((state) => state.rpc.selectedLayers);
    const allThemes = useAppSelector((state) => state.rpc.allThemesWithLayers);
    const allTags = useAppSelector((state) => state.rpc.allTags);
    const suomenVaylatLayers = useAppSelector((state) => state.rpc.suomenVaylatLayers);

    const shareUrl = useAppSelector((state) => state.ui.shareUrl);
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
            <StyledSideMenu isSideMenuOpen={isSideMenuOpen}>
                <StyledSideMenuHeader>
                    <StyledSideMenuLeftContent>
                        <FontAwesomeIcon
                            icon={faLayerGroup}
                        />
                        <StyledSideMenuHeaderTitle>{strings.layerlist.layerlistLabels.layers}</StyledSideMenuHeaderTitle>
                    </StyledSideMenuLeftContent>
                    <StyledSideMenuCloseButton onClick={() => store.dispatch(setIsSideMenuOpen(!isSideMenuOpen))}>
                        <FontAwesomeIcon
                            icon={faTimes}
                        />
                    </StyledSideMenuCloseButton>
                </StyledSideMenuHeader>
                <LayerListTEMP
                    groups={allGroups}
                    layers={allLayers}
                    themes={allThemes}
                    tags={allTags}
                    selectedLayers={selectedLayers}
                    suomenVaylatLayers={suomenVaylatLayers}
                />
            </StyledSideMenu>
            <ZoomMenu />
            <PublishedMap />
            {isSearchOpen && <Search />}
            {isLegendOpen && <Legend selectedLayers={selectedLayers}></Legend>}
            {isShareOpen && <ShareWebSitePopup></ShareWebSitePopup>}
            <DrawingTools isDrawingToolsOpen={isDrawingToolsOpen} />
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
