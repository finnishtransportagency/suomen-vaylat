import { useContext } from "react";
import strings from '../../../translations';
import {
    faCompress,
    faExpand,
    faLayerGroup,
    faPencilRuler,
    faSave
} from '@fortawesome/free-solid-svg-icons';
import { ReactReduxContext } from 'react-redux';
import styled from 'styled-components';
import { useAppSelector } from '../../../state/hooks';
import {
    setIsDrawingToolsOpen,
    setIsSideMenuOpen,
    setIsSaveViewOpen,
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
    gap: 8px;
    @media ${props => props.theme.device.mobileL} {
        grid-row-start: ${props => props.isSearchOpen ? 2 : 1};
        grid-row-end: 3;
    };
`;

const StyledMapToolsContainer = styled.div`
    background-color: ${props => props.theme.colors.mainWhite};
    border-radius: 24px;
    box-shadow: 1px 2px 6px #0000004D;
    z-index: -1;
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
        isSaveViewOpen,
        activeTool,
    } =  useAppSelector((state) => state.ui);

    const handleFullScreen = () => {
        if(isFullScreen){
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) { /* Safari */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE11 */
                document.msExitFullscreen();
            }
        } else {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            } else if (document.webkitRequestFullscreen) { /* Safari */
                document.webkitRequestFullscreen();
            } else if (document.msRequestFullscreen) { /* IE11 */
                document.msRequestFullscreen();
            }
        }
    };

    const closeDrawingTools = () => {
        // remove geometries off the map
        channel && channel.postRequest('DrawTools.StopDrawingRequest', [true]);
        // stop the drawing tool
        channel && channel.postRequest('DrawTools.StopDrawingRequest', [activeTool]);
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
                    text={strings.tooltips.layerlistButton}
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
                        text={strings.tooltips.measuringTools.measuringToolsButton}
                        toggleState={isDrawingToolsOpen}
                        clickAction={closeDrawingTools}
                    />
                    <DrawingTools isOpen={isDrawingToolsOpen}/>
                </StyledMapToolsContainer>
                <CircleButton
                    icon={isFullScreen ? faCompress : faExpand}
                    text={strings.tooltips.fullscreenButton}
                    toggleState={isFullScreen}
                    clickAction={handleFullScreen}
                />
                <CircleButton
                    icon={faSave}
                    text={strings.saveView.saveView}
                    toggleState={isSaveViewOpen}
                    clickAction={() => store.dispatch(setIsSaveViewOpen(!isSaveViewOpen))}
                />
            </StyledMenuBar>
        </>
    )};

 export default MenuBar;
