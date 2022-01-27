import { useContext } from "react";
import {
    faCompress,
    faExpand,
    faLayerGroup,
    faPencilRuler
} from '@fortawesome/free-solid-svg-icons';
import { ReactReduxContext } from 'react-redux';
import styled from 'styled-components';
import { useAppSelector } from '../../../state/hooks';
import {
    setIsDrawingToolsOpen,
    setIsFullScreen,
    setIsSideMenuOpen,
    setActiveTool
} from '../../../state/slices/uiSlice';

import CircleButton from '../../circle-button/CircleButton';

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
    gap: 4px;
    @media ${props => props.theme.device.mobileL} {
        grid-row-start: ${props => props.isSearchOpen ? 2 : 1};
        grid-row-end: 3;
    };
`;

const StyledMapToolsContainer = styled.div`
    background-color: ${props => props.theme.colors.mainWhite};
    border-radius: 24px;
    box-shadow: 2px 2px 4px #0000004D;
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
            <StyledMenuBar
                isSearchOpen={isSearchOpen}
            >
                <CircleButton
                    icon={faLayerGroup}
                    text="Karttatasot"
                    toggleState={isSideMenuOpen}
                    clickAction={() => store.dispatch(setIsSideMenuOpen(!isSideMenuOpen))}
                >
                    <StyledLayerCount>
                        {selectedLayers.length}
                    </StyledLayerCount>
                </CircleButton>
                <StyledMapToolsContainer>
                    <CircleButton
                        icon={faPencilRuler}
                        text="Piirtotyökalut"
                        toggleState={isDrawingToolsOpen}
                        clickAction={closeDrawingTools}
                    />
                    <DrawingTools isOpen={isDrawingToolsOpen}/>
                </StyledMapToolsContainer>
                <CircleButton
                    icon={isFullScreen ? faCompress : faExpand}
                    text="Koko näyttö"
                    toggleState={isFullScreen}
                    clickAction={handleFullScreen}
                />
            </StyledMenuBar>
        </>
    )};

 export default MenuBar;
