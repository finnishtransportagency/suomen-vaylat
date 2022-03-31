import { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { faTimes, faMapMarkerAlt, faPencilRuler } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactReduxContext } from 'react-redux';
import styled from 'styled-components';
import { useAppSelector } from '../../state/hooks';
import { resetGFILocations } from '../../state/slices/rpcSlice';
import { FormattedGFI } from './FormattedGFI';

import GfiTools from './GfiTools';
import CircleButton from '../circle-button/CircleButton';

const StyledGfiContainer = styled.div`
    position: relative;
    min-height: 200px;
    height: 100%;
    display: flex;
    flex-direction: column;
    min-height: 480px;
`;

const StyledTabs = styled.div`
    min-height: 48px;
    display: flex;
    background-color: ${props => props.theme.colors.mainColor1};
    overflow-y: scroll;
    z-index: 2;
    padding-top: 8px;
    &::-webkit-scrollbar {
        display: none;
    };
    position: sticky;
    top: 0px;
`;

const StyledTab = styled.div`
    z-index: 10;
    cursor: pointer;
    margin-left: 8px;
    display: flex;
    align-items: center;
    color:  ${props => props.selected ? props.theme.colors.mainColor1 : props.theme.colors.mainWhite};
    background-color: ${props => props.selected ?  props.theme.colors.mainWhite : props.theme.colors.mainColor1};
    p {
        margin: 0;
        @media ${props => props.theme.device.mobileL} {
            font-size: 14px;
        };
    };
    border-left: 2px solid ${props => props.theme.colors.mainWhite};
    border-top: 2px solid ${props => props.theme.colors.mainWhite};
    border-right: 2px solid ${props => props.theme.colors.mainWhite};
    padding: 8px 16px 8px 4px;
    border-radius: 4px 4px 0px 0px;
`;

const StyledNoGfisContainer = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const StyledTabLocationButton = styled.div`
    display: flex;
    justify-content: center;

    width: 32px;
    svg {
        font-size: 22px;
    }
`;

const StyledTabCloseButton = styled.div`
    display: flex;
    justify-content: center;
    margin-left: 12px;
`;

const StyledTabContent = styled.div`
    overflow: auto;
    height: 100%;
    padding-bottom: 48px;
    div.contentWrapper-infobox {
        @media ${props => props.theme.device.mobileL} {
            font-size: 14px;
        };
    }

    hr.infoboxLine {
        border: 1px solid;
        margin-top: 10px;
    }

    span.infoboxActionLinks {
        padding-right: 15px;
    }

    td:nth-child(even) {

    }

    td:nth-child(odd) {
        border-right: 1px solid #ddd;
    }

    table {
        border-top: 1px solid #ddd;
        padding-right: 0px !important;
        width: 100%;
    }

    tr:nth-child(2n) {
        background-color: #f2f2f2;
    }

    table tr {
        border-bottom: 1px solid #ddd;
    }

    .low-priority-table {
        margin-left: 0px;
    }
`;

const StyledGfiToolsButton = styled.div`
    position: absolute;
    bottom: 0px;
    right: 0px;
    padding: 8px;
    z-index: 3;
`;

const StyledGfiToolsContainer = styled(motion.div)`
    display: flex;
    position: absolute;
    //width: 100%;
    height: 100%;
    //background-color: white;
    z-index: 2;
`;

const StyledGfiBackdrop = styled(motion.div)`
    //width: 100%;
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    cursor: pointer;
`;

export const GFIPopup = () => {
    const LAYER_ID = 'gfi-result-layer';
    const { store } = useContext(ReactReduxContext);
    const {
        channel,
        allLayers,
        gfiLocations,
        currentZoomLevel
    } = useAppSelector((state) => state.rpc);

    const [selectedTab, setSelectedTab] = useState(0);
    const [tabsContent, setTabsContent] = useState([]);
    const [geoJsonToShow, setGeoJsonToShow] = useState(null);
    const [isGfiToolsOpen, setIsGfiToolsOpen] = useState(false);

    useEffect(() => {
        const mapResults = gfiLocations.map((location) => {
            const layers = allLayers.filter(layer => layer.id === location.layerId);
            const layerIds = (layers && layers.length > 0) ? layers[0].id : location.layerId;
            let content;
            if (location.type === 'text') {
                content = location.content
                const popupContent = <div dangerouslySetInnerHTML={{__html: content}}></div> ;
                var contentWrapper = <div>{popupContent}</div> ;
                const contentDiv = <div id={layerIds}>{contentWrapper}</div>;
                return contentDiv;
            }
            else if (location.type === 'geojson') {
                return <FormattedGFI
                    id={layerIds}
                    data={location.content}
                    type='geoJson'
                />;
            }
            return null;
        });

        setTabsContent(mapResults);
    },[allLayers, gfiLocations, selectedTab]);

    useEffect(() => {
        tabsContent[selectedTab] !== undefined
        && tabsContent[selectedTab].props.type === 'geoJson'
        && setGeoJsonToShow(tabsContent[selectedTab].props.data);
    },[selectedTab, tabsContent]);

    const handleOverlayGeometry = (geoJson) => {
        channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [null, null, LAYER_ID]);
        if (geoJson !== null) {
            channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest',
            [geoJson, {
                centerTo : true,
                maxZoomLevel: currentZoomLevel,
                featureStyle: {
                    fill: {
                        color: 'rgba(10, 140, 247, 0.3)'
                    },
                    stroke: {
                        color: 'rgba(10, 140, 247, 0.3)',
                        width: 5,
                        lineDash: 'solid',
                        lineCap: 'round',
                        lineJoin: 'round',
                        area: {
                            color: 'rgba(100, 255, 95, 0.7)',
                            width: 8,
                            lineJoin: 'round'
                        }
                    },
                    image: {
                        shape: 5,
                        size: 3,
                        fill: {
                            color: 'rgba(100, 255, 95, 0.7)'
                        }
                    }
                },
                layerId: LAYER_ID
            }]);
        }
    };

    const handleGfiToolsMenu = () => {
        //isGfiToolsOpen && channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [null, null, 'gfi-result-layer']);
        isGfiToolsOpen && channel.postRequest('VectorLayerRequest', [{
            layerId: 'download-tool-layer',
            remove: true
        }]);
        setIsGfiToolsOpen(!isGfiToolsOpen);
    };

    useEffect(() => {
        channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [null, null, LAYER_ID]);

        if (geoJsonToShow !== null) {
            channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest',
                [geoJsonToShow, {
                    featureStyle: {
                        fill: {
                            color: 'rgba(10, 140, 247, 0.3)'
                        },
                        stroke: {
                            color: 'rgba(10, 140, 247, 0.3)',
                            width: 5,
                            lineDash: 'solid',
                            lineCap: 'round',
                            lineJoin: 'round',
                            area: {
                                color: 'rgba(100, 255, 95, 0.7)',
                                width: 8,
                                lineJoin: 'round'
                            }
                        },
                        image: {
                            shape: 5,
                            size: 3,
                            fill: {
                                color: 'rgba(100, 255, 95, 0.7)'
                            }
                        }
                    },
                    layerId: LAYER_ID
                }]);
        }
    },[channel, geoJsonToShow]);

    const closeTab = (id) => {
        var filteredLocations = gfiLocations.filter(gfi => gfi.layerId !== id);
        store.dispatch(resetGFILocations(filteredLocations));
        channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [null, null, LAYER_ID]);
    };

    return (
        <StyledGfiContainer>
            {
                tabsContent.length > 0 &&
                <StyledTabs>
                    {
                        tabsContent.map((tabContent, index) => {
                            return (
                                <StyledTab
                                    key={'tab_' + index}
                                    onClick={() => setSelectedTab(index)}
                                    selected={selectedTab === index}
                                >
                                    <StyledTabLocationButton
                                        onClick={() => {
                                            handleOverlayGeometry(tabContent.props.data);
                                        }}
                                    >
                                        <FontAwesomeIcon
                                            icon={faMapMarkerAlt}
                                        />
                                    </StyledTabLocationButton>
                                    <p>{allLayers.filter(layer => layer.id === tabContent.props.id)[0].name}</p>
                                    <StyledTabCloseButton
                                        onClick={() => {
                                            closeTab(tabContent.props.id);
                                        }}
                                    >
                                        <FontAwesomeIcon
                                            icon={faTimes}
                                        />
                                    </StyledTabCloseButton>
                                </StyledTab>
                            )})
                    }
                </StyledTabs>
            }
            <StyledTabContent>
                {
                    tabsContent[selectedTab] !== undefined ?
                        tabsContent[selectedTab] :
                        <StyledNoGfisContainer>Ei valittuja kohteita</StyledNoGfisContainer> 
                }
            </StyledTabContent>
            <StyledGfiToolsButton>
                <CircleButton
                    icon={faPencilRuler}
                    text={"Valitse kohteita"}
                    toggleState={isGfiToolsOpen}
                    tooltipDirection={'left'}
                    clickAction={handleGfiToolsMenu}
                />
            </StyledGfiToolsButton>
            <AnimatePresence>
                {
                    isGfiToolsOpen &&
                    <StyledGfiToolsContainer
                        transition={{
                            duration: 0.4,
                            type: "tween"
                        }}
                        initial={{
                            opacity: 0,
                            x: "-100%"
                        }}
                        animate={{
                            opacity: 1,
                            x: 0
                        }}
                        exit={{
                            opacity: 0,
                            x: "-100%"
                        }}
                    >
                        <GfiTools
                            handleGfiToolsMenu={handleGfiToolsMenu}
                        />
                        
                    </StyledGfiToolsContainer>
                }
            </AnimatePresence>
            <AnimatePresence>
                {
                    isGfiToolsOpen &&
                    <StyledGfiBackdrop
                        transition={{
                            duration: 0.4,
                            type: "tween"
                        }}
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                        }}
                        exit={{
                            opacity: 0,
                        }}
                        onClick={() => handleGfiToolsMenu()}
                    />
                }
            </AnimatePresence>
        </StyledGfiContainer>
    );
};

export default GFIPopup;