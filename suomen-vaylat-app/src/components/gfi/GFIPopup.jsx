import { useContext, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    faTimes,
    faSearchLocation,
    faPencilRuler,
    faDownload,
    faAngleLeft,
    faAngleRight
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactReduxContext } from 'react-redux';
import styled from 'styled-components';
import strings from '../../translations';
import { useAppSelector } from '../../state/hooks';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Controller } from "swiper";
import { isMobile } from '../../theme/theme';
import { resetGFILocations } from '../../state/slices/rpcSlice';

import { FormattedGFI } from './FormattedGFI';
import GfiTools from './GfiTools';
import CircleButton from '../circle-button/CircleButton';

const StyledGfiContainer = styled.div`
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    min-height: 480px;
`;

const StyledTabSwiperContainer = styled.div`
    z-index: 2;
    display: flex;
    background-color: ${props => props.theme.colors.mainColor1};
    box-shadow: 2px 2px 4px 0px rgba(0,0,0,0.20);
    border-bottom: 2px solid white;
`;

const StyledTabName = styled.p`
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    @media ${props => props.theme.device.mobileL} {
        font-size: 14px;
    };
`;

const StyledNoGfisContainer = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    color: ${props => props.theme.colors.mainColor1};
`;

const StyledSwiper = styled(Swiper)`
    .swiper-slide {
        height: 1px;
    };
    .swiper-slide-active {
        height: auto
    };
`;

const StyledTabsSwiper = styled(Swiper)`
    margin-left: unset;
    width: 100%;
    padding-top: 8px;
    .swiper-slide {
        max-width: 200px;
    };
    .swiper-slide-active {

    };
`;

const StyledSwiperNavigatorButton = styled.div`
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60px;
    background-color: ${props => props.theme.colors.mainColor1};
    svg {
        font-size: 20px;
        color: white;
    }
`;

const StyledGfiTab = styled.div`
    z-index: 10;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color:  ${props => props.selected ? props.theme.colors.mainColor1 : props.theme.colors.mainWhite};
    background-color: ${props => props.selected ?  props.theme.colors.mainWhite : props.theme.colors.mainColor1};
    border-left: 2px solid ${props => props.theme.colors.mainWhite};
    border-top: 2px solid ${props => props.theme.colors.mainWhite};
    border-right: 2px solid ${props => props.theme.colors.mainWhite};
    padding: 8px 16px 8px 8px;
    border-radius: 4px 4px 0px 0px;
`;

const StyledTabCloseButton = styled.div`
    display: flex;
    justify-content: center;
    margin-left: 12px;
`;

const StyledTabContent = styled.div`
    overflow: auto;
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

const StyledSelectedTabTitle = styled.div`
    position: sticky;
    top: 0;
    text-align: center;
    padding: 8px;
    p {
        color: ${props => props.theme.colors.mainColor1};
        margin: 0;
        font-size: 16px;
        font-weight: 600;
    }
`;

const StyledButtonsContainer = styled.div`
    position: absolute;
    bottom: 0px;
    right: 0px;
    padding: 16px;
    z-index: 3;
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const StyledGfiToolsContainer = styled(motion.div)`
    display: flex;
    position: absolute;
    height: 100%;
    z-index: 3;
`;

const StyledGfiBackdrop = styled(motion.div)`
    z-index: 2;
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
        gfiLocations
    } = useAppSelector((state) => state.rpc);

    const [selectedTab, setSelectedTab] = useState(0);
    const [tabsContent, setTabsContent] = useState([]);
    const [geoJsonToShow, setGeoJsonToShow] = useState(null);
    const [isGfiToolsOpen, setIsGfiToolsOpen] = useState(false);

    const [gfiTabsSwiper, setGfiTabsSwiper] = useState(null);
    const [gfiTabsSnapGridLength, setGfiTabsSnapGridLength] = useState(0);

    const gfiInputEl = useRef(null);

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
        channel && channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [null, null, LAYER_ID]);
        if (geoJson !== null) {
            channel && channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest',
            [geoJson, {
                layerId: LAYER_ID,
                centerTo : true,
                cursor: 'pointer',
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
                }
            }]);
        }
    };

    const handleGfiToolsMenu = () => {
        channel && channel.postRequest('DrawTools.StopDrawingRequest', ['gfi-selection-tool', true]);

        isGfiToolsOpen && channel.postRequest('VectorLayerRequest', [{
            layerId: 'download-tool-layer',
            remove: true
        }]);
        setIsGfiToolsOpen(!isGfiToolsOpen);
    };

    useEffect(() => {
        channel && channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [null, null, LAYER_ID]);

        if (geoJsonToShow !== null) {
            channel && channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest',
                [geoJsonToShow, {
                    layerId: LAYER_ID,
                    cursor: 'pointer',
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
                                width: 4,
                                lineJoin: 'round'
                            }
                        },
                        image: {
                            size: 3,
                            fill: {
                                color: 'rgba(100, 255, 95, 0.7)'
                            }
                        },
                    },
                    hover: {
                        featureStyle: {
                            fill: {
                                color: 'rgba(0, 99, 175, 0.7)'
                            },
                            stroke: {
                                color: '#0064af',
                                width: 2
                            },
                            text: {
                                fill: {
                                    color: '#ffffff'
                                },
                                stroke: {
                                    color: '#0064af',
                                    width: 5
                                },
                                font: 'bold 16px Arial',
                                textAlign: 'center',
                                textBaseline: 'middle',
                                offsetX: 0,
                                offsetY: 0
                            },
                        },
                    }
                }]);
        }
    },[channel, geoJsonToShow]);

    const closeTab = (index, id) => {
        var filteredLocations = gfiLocations.filter(gfi => gfi.layerId !== id);
        store.dispatch(resetGFILocations(filteredLocations));
        channel && channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [null, null, LAYER_ID]);
        if(index > 0){
            setSelectedTab(index - 1);
        } else {
            setSelectedTab(0);
        }
    };

    useEffect(() => {
        gfiInputEl.current.swiper.slideTo(selectedTab);
    },[selectedTab]);

    return (
        <StyledGfiContainer>
            {
                tabsContent.length > 0 &&
                <StyledTabSwiperContainer>
                    {
                        !isMobile && gfiTabsSnapGridLength > 1 && <StyledSwiperNavigatorButton
                            onClick={() => {
                                gfiTabsSwiper.slidePrev();
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faAngleLeft}
                            />
                        </StyledSwiperNavigatorButton>
                    }

                    <StyledTabsSwiper
                        id={"gfi-tabs-swiper"}
                        spaceBetween={4}
                        slidesPerView={"auto"}
                        freeMode={true}
                        modules={[Controller, FreeMode]}
                        onSwiper={setGfiTabsSwiper}
                        controller={{ control: gfiTabsSwiper }}
                        onSnapGridLengthChange={e => setGfiTabsSnapGridLength(e.snapGrid.length)}
                    >
                    {
                            tabsContent.map((tabContent, index) => {
                                return (
                                    <SwiperSlide
                                        id={'tab_' + index}
                                        key={'tab_' + index}
                                    >
                                        <StyledGfiTab

                                            onClick={() => setSelectedTab(index)}
                                            selected={selectedTab === index}
                                        >
                                            <StyledTabName>
                                                {
                                                    allLayers.filter(layer => layer.id === tabContent.props.id).length > 0 ? allLayers.filter(layer => layer.id === tabContent.props.id)[0].name : tabContent.props.id
                                                }
                                            </StyledTabName>
                                            <StyledTabCloseButton
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    closeTab(index, tabContent.props.id);
                                                }}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faTimes}
                                                />
                                            </StyledTabCloseButton>
                                        </StyledGfiTab>
                                    </SwiperSlide>
                                )})
                        }
                    </StyledTabsSwiper>
                    {
                        !isMobile && gfiTabsSnapGridLength > 1 && <StyledSwiperNavigatorButton
                            onClick={() => {
                                gfiTabsSwiper.slideNext();
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faAngleRight}
                            />
                        </StyledSwiperNavigatorButton>
                    }
                </StyledTabSwiperContainer>
            }
            <StyledTabContent>
                {
                    tabsContent[selectedTab] === undefined &&
                        <StyledNoGfisContainer>{strings.gfi.noSelectedGfis}</StyledNoGfisContainer>
                }
                <StyledSwiper
                    ref={gfiInputEl}
                    id={"gfi-swiper"}
                     onSlideChange={e => {
                         setSelectedTab(e.activeIndex);
                    }}
                    tabIndex={selectedTab}
                    allowTouchMove={false} // Disable swiping
                    speed={300}
                >
                {
                    gfiLocations.map((location) => {
                        const layers = allLayers.filter(layer => layer.id === location.layerId);
                        const layerIds = (layers && layers.length > 0) ? layers[0].id : location.layerId;
                        const name = layers.length > 0 && layers[0].name;
                        let content;
                        if (location.type === 'text') {
                            content = location.content
                            const popupContent = <div dangerouslySetInnerHTML={{__html: content}}></div> ;
                            var contentWrapper = <div>{popupContent}</div> ;
                            const contentDiv = <div id={layerIds}>{contentWrapper}</div>;
                            return contentDiv;
                        }
                        else if (location.type === 'geojson') {
                            return (
                                <SwiperSlide
                                id={'gfi_tab_content_' + + location.x + '_' + location.y + '_' + location.layerId}
                                key={'gfi_tab_content_' + location.x + '_' + location.y + '_' + location.layerId}
                            >
                                {
                                    <StyledSelectedTabTitle>
                                        <p>
                                            {
                                                name.toUpperCase()
                                            }
                                        </p>
                                    </StyledSelectedTabTitle>
                                }
                                <FormattedGFI
                                    id={layerIds}
                                    data={location.content}
                                    type='geoJson'
                                />
                            </SwiperSlide>
                            );
                        }
                        return null;
                    })
                }
                </StyledSwiper>
            </StyledTabContent>
            <StyledButtonsContainer>
                    <CircleButton
                        icon={faPencilRuler}
                        text={strings.gfi.selectLocations}
                        toggleState={isGfiToolsOpen}
                        tooltipDirection={'left'}
                        clickAction={handleGfiToolsMenu}
                    />
                    <CircleButton
                        icon={faSearchLocation}
                        text={strings.gfi.focusToLocations}
                        tooltipDirection={'left'}
                        clickAction={() => {
                            handleOverlayGeometry(tabsContent[selectedTab].props.data);
                        }}
                        disabled={gfiLocations.length === 0}
                    />
                    <CircleButton
                        icon={faDownload}
                        text={"Lataa kohdetiedot (tulossa)"}
                        tooltipDirection={'left'}
                        clickAction={() => {
                        }}
                        disabled={true}
                    />
            </StyledButtonsContainer>

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