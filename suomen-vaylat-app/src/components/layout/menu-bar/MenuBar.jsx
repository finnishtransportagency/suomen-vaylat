import { useContext } from "react";
import {
    faCompress,
    faExpand,
    faLayerGroup,
    faPencilRuler
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactReduxContext } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { isMobile } from '../../../theme/theme';
import styled from 'styled-components';
import { useAppSelector } from '../../../state/hooks';
import {
    setIsDrawingToolsOpen,
    setIsFullScreen,
    setIsSideMenuOpen,
    setActiveTool
} from '../../../state/slices/uiSlice';
import strings from '../../../translations';

import DrawingTools from '../../measurement-tools/DrawingTools';

const StyledMenuBar = styled.div`
    z-index: 1;
    pointer-events: none;
    grid-row-start: 1;
    grid-row-end: 3;
    height: 100%;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    transition: all 0.5s ease-in-out;
    margin-top: 8px;
    @media ${props => props.theme.device.mobileL} {
        grid-row-start: ${props => props.isSearchOpen ? 2 : 1};
        grid-row-end: 3;
    };
`;

const StyledMapToolsContainer = styled.div`
    background-color: ${props => props.theme.colors.mainWhite};
    border-radius: 24px;
    box-shadow: 2px 2px 4px #0000004D;
    margin-bottom: 8px;
`;

const StyledMenuBarButton = styled.div`
    pointer-events: auto;
    position: relative;
    cursor: pointer;
    width: 48px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.isActive ? props.theme.colors.buttonActive : props.theme.colors.button};
    margin-bottom: 8px;
    box-shadow: 2px 2px 4px #0000004D;
    border-radius: 50%;
    svg {
        color: ${props => props.theme.colors.mainWhite};
        font-size: 22px;
    };
    @media ${props => props.theme.device.mobileL} {
        width: 40px;
        height: 40px;
        svg {
            font-size: 18px;
        };
    };
`;

const StyledMenuBarToolsButton = styled.div`
    pointer-events: auto;
    position: relative;
    cursor: pointer;
    width: 48px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.isActive ? props.theme.colors.buttonActive : props.theme.colors.button};
    box-shadow: 2px 2px 4px #0000004D;
    border-radius: 50%;
    svg {
        color: ${props => props.theme.colors.mainWhite};
        font-size: 22px;
    };
    @media ${props => props.theme.device.mobileL} {
        width: 40px;
        height: 40px;
        svg {
            font-size: 18px;
        };
    };
`;

const StyledLayerCount = styled.div`
    position: absolute;
    top: -7px;
    right: -8px;
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

    const { selectedLayers, channel } = useAppSelector((state) => state.rpc);

    const {
        isFullScreen,
        isSideMenuOpen,
        isDrawingToolsOpen,
        isSearchOpen,
        activeTool,
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

    const closeDrawingTools = () => {
        // remove geometries off the map
        channel.postRequest('DrawTools.StopDrawingRequest', [true]);
        // stop the drawing tool
        channel.postRequest('DrawTools.StopDrawingRequest', [activeTool]);
        store.dispatch(setActiveTool(null));
        store.dispatch(setIsDrawingToolsOpen(!isDrawingToolsOpen))
    };


    return (
        <>
            <ReactTooltip disable={isMobile} id='layerlist' place="right" type="dark" effect="float">
                <span>{strings.tooltips.layerlistButton}</span>
            </ReactTooltip>

            <ReactTooltip disable={isMobile} id='search' place="right" type="dark" effect="float">
                <span>{strings.tooltips.searchButton}</span>
            </ReactTooltip>

            <ReactTooltip disable={isMobile} id='drawingtools' place="right" type="dark" effect="float">
                <span>{strings.tooltips.drawingtools.drawingtoolsButton}</span>
            </ReactTooltip>

            <ReactTooltip disable={isMobile} id='fullscreen' place="right" type="dark" effect="float">
                <span>{strings.tooltips.fullscreenButton}</span>
            </ReactTooltip>

            <StyledMenuBar
                isSideMenuOpen={isSideMenuOpen}
                isSearchOpen={isSearchOpen}
            >
                <StyledMenuBarButton
                    data-tip data-for='layerlist'
                    isActive={isSideMenuOpen}
                    onClick={() =>
                        store.dispatch(setIsSideMenuOpen(!isSideMenuOpen))

                    }
                >
                    <StyledLayerCount>
                        {selectedLayers.length}
                    </StyledLayerCount>
                    <FontAwesomeIcon
                        icon={faLayerGroup}
                    />
                </StyledMenuBarButton>
                <StyledMapToolsContainer>
                    <StyledMenuBarToolsButton
                        data-tip data-for='drawingtools'
                        isActive={isDrawingToolsOpen}
                        onClick={() => closeDrawingTools()}>
                        <FontAwesomeIcon
                            icon={faPencilRuler}
                        />
                    </StyledMenuBarToolsButton>
                    <DrawingTools isOpen={isDrawingToolsOpen}/>
                </StyledMapToolsContainer>
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
