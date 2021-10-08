import { useContext } from "react";
import {
    faCompress, faExpand, faImages, faLayerGroup, faPencilRuler, faSearch
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactReduxContext } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';
import { useAppSelector } from '../../../state/hooks';
import {
    setIsDrawingToolsOpen,
    setIsFullScreen, setIsLegendOpen, setIsSearchOpen, setIsSideMenuOpen
} from '../../../state/slices/uiSlice';
import strings from '../../../translations';

const StyledMenuBar = styled.div`
    position: absolute;
    top: 10px;
    left: ${props => props.isSideMenuOpen ? "360px" : "10px"};
    width: 40px;
    height: 100%;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    transition: all 0.5s ease-in-out;
    @media ${props => props.theme.device.mobileL} {
        top: calc(100% - 60px);
        left: 10px;
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
    background-color: ${props => props.isActive ? props.theme.colors.maincolor2 : props.theme.colors.maincolor1};
    margin-top: 10px;
    box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 3px 6px;
    border-radius: 50%;
    svg {
        color: ${props => props.theme.colors.mainWhite};
        font-size: 18px;
    };
    @media ${props => props.theme.device.mobileL} {
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
    color: ${props => props.theme.colors.mainWhite};
    background-color: ${props => props.theme.colors.secondaryColor7};
    font-size: 14px;
    font-weight: 600;
`;

const MenuBar = () => {

    const { store } = useContext(ReactReduxContext);

    const { selectedLayers } = useAppSelector((state) => state.rpc);

    const {
        isFullScreen,
        isSideMenuOpen,
        isSearchOpen,
        isLegendOpen,
        isDrawingToolsOpen,
    } =  useAppSelector((state) => state.ui);

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

            <ReactTooltip id='drawingtools' place="right" type="dark" effect="float">
                <span>{strings.tooltips.drawingtools.drawingtoolsButton}</span>
            </ReactTooltip>
            
            <ReactTooltip id='fullscreen' place="right" type="dark" effect="float">
                <span>{strings.tooltips.fullscreenButton}</span>
            </ReactTooltip>
            
            <StyledMenuBar isSideMenuOpen={isSideMenuOpen}>
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
        </>
    )};

 export default MenuBar;
