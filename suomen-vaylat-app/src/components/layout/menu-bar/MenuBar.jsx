import { useContext, useState } from 'react';
import strings from '../../../translations';
import {
    faCompress,
    faExpand,
    faLayerGroup,
    faPencilRuler,
    faSave,
    faMapMarkedAlt,
    faDownload,
    faMap
} from '@fortawesome/free-solid-svg-icons';
import { ReactReduxContext } from 'react-redux';
import styled from 'styled-components';
import { useAppSelector } from '../../../state/hooks';
import {
    setIsDrawingToolsOpen,
    setIsSideMenuOpen,
    setIsSaveViewOpen,
    setIsGfiOpen,
    setActiveTool,
    setMinimizeGfi,
    setIsGfiDownloadOpen,
    setGeoJsonArray,
    setSelectedMarker,
    setIsThemeMenuOpen,
    removeFromDrawToolMarkers
} from '../../../state/slices/uiSlice';

import { removeMarkerRequest } from '../../../state/slices/rpcSlice';

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
    @media ${(props) => props.theme.device.mobileL} {
        grid-row-start: ${(props) => (props.isSearchOpen ? 2 : 1)};
        grid-row-end: 3;
    } ;
`;

const StyledMapToolsContainer = styled.div`
    background-color: ${(props) => props.theme.colors.mainWhite};
    border-radius: 24px;
    box-shadow: 1px 2px 6px #0000004d;
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
    color: ${(props) => props.theme.colors.mainWhite};
    background-color: ${(props) => props.theme.colors.secondaryColor7};
    font-size: 14px;
    font-weight: 600;
`;

const MenuBar = () => {
    const { store } = useContext(ReactReduxContext);
    const { selectedLayers, downloads, channel, filters } = useAppSelector(
        (state) => state.rpc
    );

    const { drawToolMarkers } = useAppSelector(state => state.ui);

    const {
        isFullScreen,
        isSideMenuOpen,
        isThemeMenuOpen,
        isDrawingToolsOpen,
        isSearchOpen,
        isSaveViewOpen,
        isGfiOpen,
        isGfiDownloadOpen,
        activeTool,
    } = useAppSelector((state) => state.ui);

    const [animationUnfinished, setAnimationUnfinished] = useState(false);
    const handleFullScreen = () => {

        var elem = document.documentElement;
        /* View in fullscreen */

        function openFullscreen() {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) {
                /* Safari */
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) {
                /* IE11 */
                elem.msRequestFullscreen();
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            }
        }

        /* Close fullscreen */
        function closeFullscreen() {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                /* Safari */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                /* IE11 */
                document.msExitFullscreen();
            }
        }

        if (isFullScreen) {
            closeFullscreen();
        } else {
            openFullscreen();
        }
    };

    const closeDrawingTools = () => {
        // remove geometries off the map
        channel && channel.postRequest('DrawTools.StopDrawingRequest', []);
        store.dispatch(setGeoJsonArray([]));
        // stop the drawing tool
        channel &&
            channel.postRequest('DrawTools.StopDrawingRequest', [activeTool]);
        store.dispatch(setActiveTool(null));
        drawToolMarkers.forEach(marker => {
            store.dispatch(removeMarkerRequest({markerId: marker}));
        });
        store.dispatch(setIsDrawingToolsOpen(!isDrawingToolsOpen));
        store.dispatch(setSelectedMarker(2));
        // remove all markers made with drawing tools
        drawToolMarkers.forEach(marker => {
            store.dispatch(removeMarkerRequest({markerId: marker.markerId}));
            store.dispatch(removeFromDrawToolMarkers(marker.markerId));
        });
    };

    const waitForAnimationFinish = () => {
        setAnimationUnfinished(true);
        setTimeout(() => {
            setAnimationUnfinished(false);
        }, 400);
    }

    const handleSideMenuClick = () => {
        if(!animationUnfinished) {
            if(isThemeMenuOpen) {
                store.dispatch(setIsThemeMenuOpen(false));
                setAnimationUnfinished(true);
                setTimeout(() => {
                    store.dispatch(setIsSideMenuOpen(true));
                    setAnimationUnfinished(false);
                }, 600);
            }
            else if(!isSideMenuOpen && !isThemeMenuOpen) {
                store.dispatch(setIsSideMenuOpen(true));
            } 
            else if(isSideMenuOpen) {
                store.dispatch(setIsSideMenuOpen(false));
            } 
            waitForAnimationFinish();
        }
        else return;
    };

    const handleThemeMenuClick = () => {
        if(!animationUnfinished) {
            if(isSideMenuOpen) {
                store.dispatch(setIsSideMenuOpen(false));
                setAnimationUnfinished(true);
                setTimeout(() => {
                    setAnimationUnfinished(false);
                    store.dispatch(setIsThemeMenuOpen(true));
                }, 600);
            }
            else if(!isSideMenuOpen && !isThemeMenuOpen) {
                store.dispatch(setIsThemeMenuOpen(true));
            } 
            else if(isThemeMenuOpen) {
                store.dispatch(setIsThemeMenuOpen(false));
            } 
            waitForAnimationFinish();
        }
        else return;
    };

    return (
        <>
            <StyledMenuBar isSearchOpen={isSearchOpen}>
                <CircleButton 
                    icon={faMap}
                    text={strings.layerlist.layerlistLabels.themeLayers}
                    toggleState={isThemeMenuOpen}
                    tooltipDirection="right"
                    clickAction={handleThemeMenuClick}
                />
                <CircleButton
                    icon={faLayerGroup}
                    text={strings.layerlist.layerlistLabels.mapLayers}
                    toggleState={isSideMenuOpen}
                    tooltipDirection={"right"}
                    clickAction={handleSideMenuClick}
                >
                    <StyledLayerCount>{selectedLayers.length}</StyledLayerCount>
                </CircleButton>
                <CircleButton
                    icon={faMapMarkedAlt}
                    text={strings.gfi.title}
                    toggleState={isGfiOpen}
                    tooltipDirection={"right"}
                    clickAction={() => {
                        store.dispatch(setIsGfiOpen(!isGfiOpen));
                        isGfiOpen && store.dispatch(setMinimizeGfi(false));
                    }}
                >
                { filters?.filters && filters?.filters?.length >0 && 
                 <StyledLayerCount>{filters?.filters?.length}</StyledLayerCount>
                }
                </CircleButton>
                <CircleButton
                    icon={faDownload}
                    text={strings.downloads.downloads}
                    toggleState={isGfiDownloadOpen}
                    tooltipDirection={"right"}
                    clickAction={() =>
                        store.dispatch(setIsGfiDownloadOpen(!isGfiDownloadOpen))
                    }
                >
                    <StyledLayerCount>
                        {
                            downloads.filter(
                                (download) => download.url !== null
                            ).length
                        }
                    </StyledLayerCount>
                </CircleButton>
                <StyledMapToolsContainer>
                    <CircleButton
                        icon={faPencilRuler}
                        text={strings.tooltips.drawingTools.drawingToolsButton}
                        toggleState={isDrawingToolsOpen}
                        tooltipDirection={"right"}
                        clickAction={closeDrawingTools}
                    />
                    <DrawingTools isOpen={isDrawingToolsOpen} />
                </StyledMapToolsContainer>
                <CircleButton
                    icon={faSave}
                    text={strings.savedContent.saveView.saveView}
                    toggleState={isSaveViewOpen}
                    tooltipDirection={"right"}
                    clickAction={() =>
                        store.dispatch(setIsSaveViewOpen(!isSaveViewOpen))
                    }
                />
                <CircleButton
                    icon={isFullScreen ? faCompress : faExpand}
                    text={strings.tooltips.fullscreenButton}
                    toggleState={isFullScreen}
                    tooltipDirection={"right"}
                    clickAction={handleFullScreen}
                />
            </StyledMenuBar>
        </>
    );
};

export default MenuBar;
