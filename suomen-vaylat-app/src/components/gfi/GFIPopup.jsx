import { useContext, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    faTimes,
    faSearchLocation,
    faPencilRuler,
    faFileDownload,
    faAngleLeft,
    faAngleRight,
    faLayerGroup,
    faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactReduxContext } from 'react-redux';
import styled from 'styled-components';
import strings from '../../translations';
import { useAppSelector } from '../../state/hooks';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Controller } from 'swiper';
import { isMobile } from '../../theme/theme';
import { setMinimizeGfi } from '../../state/slices/uiSlice';
import { resetGFILocations } from '../../state/slices/rpcSlice';

import { FormattedGFI } from './FormattedGFI';
import GfiTabContent from './GfiTabContent';
import GfiToolsMenu from './GfiToolsMenu';
import GfiDownloadMenu from './GfiDownloadMenu';
import CircleButton from '../circle-button/CircleButton';

// Max amount of features that wont trigger react-data-table-component
const GFI_MAX_LENGTH = 5;
const KUNTA_IMAGE_URL = 'https://www.kuntaliitto.fi/sites/default/files/styles/narrow_320_x_600_/public/media/profile_pictures/';

const StyledGfiContainer = styled.div`
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    min-height: 480px;
`;

const StyledVKMDataContainer = styled(motion.div)`
    display: flex;
    align-items: center;
    justify-content: space-around;
    color: ${(props) => props.theme.colors.mainColor1};
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
    img {
        max-width: 100px;
    };
    p {
        margin: 0;
        font-size: 22px;
        font-weight: 600;
    }
`;

const StyledVKMDataMunacipalityImageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-right: 8px;
    img {
        max-height: 100px
    }
    user-select: text;
`;

const StyledCoordinatesWrapper = styled.div`
    display: flex;
    align-items: center;
    svg {
        font-size: 24px;
        padding: 8px;
    }
    p {
        margin: 0px;
        font-size: 12px;
    }
`;

const StyledVKMDataInfoWrapper = styled.div`
    padding-left: 8px;
    user-select: text;
`;

const StyledTabSwiperContainer = styled.div`
    z-index: 2;
    display: flex;
    background-color: ${(props) => props.theme.colors.mainColor1};
`;

const StyledTabName = styled.p`
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    @media ${(props) => props.theme.device.mobileL} {
        font-size: 14px;
    }
`;

const StyledNoGfisContainer = styled.div`
    position: absolute;
    width: 100%;
    max-width: 520px;
    height: 100%;
    display: flex;
    padding: 24px;
    left: 50%;
    transform: translateX(-50%);
    flex-direction: column;
    font-size: 18px;
    color: ${(props) => props.theme.colors.mainColor1};
`;

const StyledSubtitle = styled.div`
    display: flex;
    justify-content: flex-start;
    color: ${(props) => props.theme.colors.mainColor1};
    padding: 10px 0px 10px 5px;
    font-size: 16px;
    font-weight: bold;
`;

const StyledInfoTextContainer = styled.ul`
    li {
        font-size: 14px;
        color: ${(props) => props.theme.colors.mainColor1};
    }
`;

const StyledSwiper = styled(Swiper)`
    width: 100%;
    .swiper-slide {
        height: 1px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }
    .swiper-slide-active {
        height: auto;
    }
`;

const StyledTabsSwiper = styled(Swiper)`
    margin-left: unset;
    width: 100%;
    padding-top: 8px;
    .swiper-slide {
        max-width: 200px;
    }
    .swiper-slide-active {
    }
`;

const StyledSwiperNavigatorButton = styled.div`
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60px;
    background-color: ${(props) => props.theme.colors.mainColor1};
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
    color: ${(props) =>
        props.selected
            ? props.theme.colors.mainColor1
            : props.theme.colors.mainWhite};
    background-color: ${(props) =>
        props.selected
            ? props.theme.colors.mainWhite
            : props.theme.colors.mainColor1};
    border-left: 2px solid ${(props) => props.theme.colors.mainWhite};
    border-top: 2px solid ${(props) => props.theme.colors.mainWhite};
    border-right: 2px solid ${(props) => props.theme.colors.mainWhite};
    padding: 8px 16px 8px 8px;
    border-radius: 4px 4px 0px 0px;
`;

const StyledTabCloseButton = styled.div`
    display: flex;
    justify-content: center;
    margin-left: 12px;
`;

const StyledTabContent = styled.div`
    overflow: hidden;
    display: flex;
    div.contentWrapper-infobox {
        @media ${(props) => props.theme.device.mobileL} {
            font-size: 14px;
        }
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

const StyledButtonsContainer = styled.div`
    position: absolute;
    bottom: 0px;
    right: 0px;
    padding: 16px;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
    pointer-events: none;
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

export const GFIPopup = ({ handleGfiDownload }) => {
    const LAYER_ID = 'gfi-result-layer';
    const { store } = useContext(ReactReduxContext);
    const { channel, allLayers, gfiLocations, vkmData, pointInfoImageError, setPointInfoImageError } = useAppSelector(state => state.rpc);

    const [selectedTab, setSelectedTab] = useState(0);
    const [tabsContent, setTabsContent] = useState([]);
    const [geoJsonToShow, setGeoJsonToShow] = useState(null);
    const [isGfiToolsOpen, setIsGfiToolsOpen] = useState(false);
    const [isDataTable, setIsDataTable] = useState(false);
    const [isGfiDownloadsOpen, setIsGfiDownloadsOpen] = useState(false);
    const [isVKMInfoOpen, setIsVKMInfoOpen] = useState(false);
    const [gfiTabsSwiper, setGfiTabsSwiper] = useState(null);
    const [gfiTabsSnapGridLength, setGfiTabsSnapGridLength] = useState(0);

    const gfiInputEl = useRef(null);

    useEffect(() => {
        const mapResults = gfiLocations.map((location) => {
            location.content.features.length > GFI_MAX_LENGTH && setIsDataTable(true);
            const layers = allLayers.filter(
                (layer) => layer.id === location.layerId
            );
            const layerIds =
                layers && layers.length > 0 ? layers[0].id : location.layerId;
            let content;
            if (location.type === 'text') {
                content = location.content;
                const popupContent = (
                    <div dangerouslySetInnerHTML={{ __html: content }}></div>
                );
                var contentWrapper = <div>{popupContent}</div>;
                const contentDiv = <div id={layerIds}>{contentWrapper}</div>;
                return contentDiv;
            }
            else if (location.type === 'geojson') {
                return <FormattedGFI
                    id={layerIds}
                    data={location.content}
                    type='geoJson'
                    isDataTable={isDataTable}
                />;
            }
            return null;
        });

        setTabsContent(mapResults);
    }, [allLayers, gfiLocations, isDataTable, selectedTab]);

    useEffect(() => {
        tabsContent[selectedTab] !== undefined &&
            tabsContent[selectedTab].props.type === 'geoJson' &&
            setGeoJsonToShow(tabsContent[selectedTab].props.data);
    }, [selectedTab, tabsContent]);

    useEffect(() => {
        gfiLocations && gfiLocations.length > 0 ? setIsVKMInfoOpen(false) : vkmData && setIsVKMInfoOpen(true);
    },[vkmData, gfiLocations])

    const handleOverlayGeometry = (geoJson) => {
        channel &&
            channel.postRequest(
                'MapModulePlugin.RemoveFeaturesFromMapRequest',
                [null, null, LAYER_ID]
            );
        if (geoJson !== null) {
            channel &&
                channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [
                    geoJson,
                    {
                        layerId: LAYER_ID,
                        centerTo: true,
                        cursor: 'pointer',
                        featureStyle: {
                            fill: {
                                color: 'rgba(10, 140, 247, 0.3)',
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
                                    lineJoin: 'round',
                                },
                            },
                            image: {
                                shape: 5,
                                size: 3,
                                fill: {
                                    color: 'rgba(100, 255, 95, 0.7)',
                                },
                            },
                        },
                    },
                ]);
        }
    };

    const handleVKMInfo = () => {
        setIsVKMInfoOpen(!isVKMInfoOpen);
    };


    const handleGfiToolsMenu = () => {
        setIsGfiDownloadsOpen(false);
        setIsGfiToolsOpen(!isGfiToolsOpen);
        channel &&
            channel.postRequest('DrawTools.StopDrawingRequest', [
                'gfi-selection-tool',
                true,
            ]);

        isGfiToolsOpen && channel &&
            channel.postRequest('VectorLayerRequest', [
                {
                    layerId: 'download-tool-layer',
                    remove: true,
                },
            ]);
    };

    const handleGfiDownloadsMenu = () => {
        setIsGfiToolsOpen(false);
        setIsGfiDownloadsOpen(!isGfiDownloadsOpen);
    };

    useEffect(() => {
        channel &&
            channel.postRequest(
                'MapModulePlugin.RemoveFeaturesFromMapRequest',
                [null, null, LAYER_ID]
            );

        if (geoJsonToShow !== null) {
            channel &&
                channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [
                    geoJsonToShow,
                    {
                        layerId: LAYER_ID,
                        cursor: 'pointer',
                        featureStyle: {
                            fill: {
                                color: 'rgba(10, 140, 247, 0.3)',
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
                                    lineJoin: 'round',
                                },
                            },
                            image: {
                                size: 3,
                                fill: {
                                    color: 'rgba(100, 255, 95, 0.7)',
                                },
                            },
                        },
                        hover: {
                            featureStyle: {
                                fill: {
                                    color: 'rgba(0, 99, 175, 0.7)',
                                },
                                stroke: {
                                    color: '#0064af',
                                    width: 2,
                                },
                                text: {
                                    fill: {
                                        color: '#ffffff',
                                    },
                                    stroke: {
                                        color: '#0064af',
                                        width: 5,
                                    },
                                    font: 'bold 16px Arial',
                                    textAlign: 'center',
                                    textBaseline: 'middle',
                                    offsetX: 0,
                                    offsetY: 0,
                                },
                            },
                        },
                    },
                ]);
        }
    }, [channel, geoJsonToShow]);

    const closeTab = (index, id) => {
        var filteredLocations = gfiLocations.filter(
            (gfi) => gfi.layerId !== id
        );
        store.dispatch(resetGFILocations(filteredLocations));
        channel &&
            channel.postRequest(
                'MapModulePlugin.RemoveFeaturesFromMapRequest',
                [null, null, LAYER_ID]
            );
        if (index > 0) {
            setSelectedTab(index - 1);
        } else {
            setSelectedTab(0);
        }
    };

    useEffect(() => {
        gfiInputEl.current.swiper.slideTo(selectedTab);
    }, [selectedTab]);

    return (
        <StyledGfiContainer>
                <StyledVKMDataContainer
                    animate={{
                        height: isVKMInfoOpen ? 'auto' : 0,
                        opacity: isVKMInfoOpen ? 1 : 0,
                        marginTop: isVKMInfoOpen ? '16px' : '0px',
                        marginBottom: isVKMInfoOpen ? '16px' : '0px'
                    }}
                    transition={{ duration: 0.4 }}
                >
                    <StyledVKMDataMunacipalityImageWrapper>
                        {
                            vkmData && vkmData.vkm.kuntakoodi && !pointInfoImageError &&
                            <img
                                src={KUNTA_IMAGE_URL + vkmData.vkm.kuntakoodi.toString().padStart(3, '0')+'.gif'}
                                alt=''
                                onError={({ currentTarget }) => {
                                    currentTarget.onerror = null; // prevents looping
                                    setPointInfoImageError(true);
                                  }}
                                />
                        }
                        {
                            vkmData && vkmData.vkm.kuntanimi && <p>{vkmData.vkm.kuntanimi}</p>
                        }
                        {
                            vkmData && vkmData.coordinates && <StyledCoordinatesWrapper>
                                <FontAwesomeIcon icon={faMapMarkerAlt} />
                                <div>
                                    <p>Lat: {vkmData.coordinates.y}</p>
                                    <p>Lon: {vkmData.coordinates.x}</p>
                                </div>
                            </StyledCoordinatesWrapper>
                        }
                    </StyledVKMDataMunacipalityImageWrapper>

                    {
                        vkmData && vkmData.vkm._orderHigh && vkmData.vkm._orderHigh.filter(value => value !== 'kuntanimi').length > 0 &&
                        <StyledVKMDataInfoWrapper>
                            {
                                vkmData.vkm._orderHigh.filter(value => value !== 'kuntanimi').map(property => {
                                    return (
                                            <li
                                                key={'vkm-info-box-li'+property}
                                                style={{
                                                    color: '#0064af'
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontSize: '14px',
                                                        fontWeight: 'light',
                                                        margin: '0'
                                                    }}
                                                >
                                                    {property + ':'}
                                                </span>
                                                &nbsp;
                                                <span
                                                    style={{
                                                        fontSize: '16px',
                                                        fontWeight: '600',
                                                        margin: '0'
                                                    }}
                                                >
                                                    {vkmData.vkm[property]}
                                                </span>
                                            </li>
                                    )
                                })
                            }
                        </StyledVKMDataInfoWrapper>
                    }
                </StyledVKMDataContainer>
            {tabsContent.length > 0 && (
                <StyledTabSwiperContainer>
                    {!isMobile && gfiTabsSnapGridLength > 1 && (
                        <StyledSwiperNavigatorButton
                            onClick={() => {
                                gfiTabsSwiper.slidePrev();
                            }}
                        >
                            <FontAwesomeIcon icon={faAngleLeft} />
                        </StyledSwiperNavigatorButton>
                    )}

                    <StyledTabsSwiper
                        id={'gfi-tabs-swiper'}
                        spaceBetween={4}
                        slidesPerView={'auto'}
                        freeMode={true}
                        modules={[Controller, FreeMode]}
                        onSwiper={setGfiTabsSwiper}
                        controller={{ control: gfiTabsSwiper }}
                        onSnapGridLengthChange={(e) =>
                            setGfiTabsSnapGridLength(e.snapGrid.length)
                        }
                    >
                        {tabsContent.map((tabContent, index) => {
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
                                            {allLayers.filter(
                                                (layer) =>
                                                    layer.id ===
                                                    tabContent.props.id
                                            ).length > 0
                                                ? allLayers.filter(
                                                      (layer) =>
                                                          layer.id ===
                                                          tabContent.props.id
                                                  )[0].name
                                                : tabContent.props.id}
                                        </StyledTabName>
                                        <StyledTabCloseButton
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                closeTab(
                                                    index,
                                                    tabContent.props.id
                                                );
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faTimes} />
                                        </StyledTabCloseButton>
                                    </StyledGfiTab>
                                </SwiperSlide>
                            );
                        })}
                    </StyledTabsSwiper>
                    {!isMobile && gfiTabsSnapGridLength > 1 && (
                        <StyledSwiperNavigatorButton
                            onClick={() => {
                                gfiTabsSwiper.slideNext();
                            }}
                        >
                            <FontAwesomeIcon icon={faAngleRight} />
                        </StyledSwiperNavigatorButton>
                    )}
                </StyledTabSwiperContainer>
            )}
            <StyledTabContent>
                {tabsContent[selectedTab] === undefined && (
                    <StyledNoGfisContainer>
                        <StyledSubtitle>{strings.gfi.choosingGfi}:</StyledSubtitle>
                        <StyledInfoTextContainer>
                            <li>{strings.gfi.choosingGfiDescription0}.&nbsp; <FontAwesomeIcon icon={faLayerGroup} style={{fontSize: '16px'}}/></li>
                            <li>{strings.gfi.choosingGfiDescription1}.&nbsp; <FontAwesomeIcon icon={faPencilRuler} style={{fontSize: '16px'}}/></li>
                            <li>{strings.gfi.choosingGfiDescription2}.</li>
                        </StyledInfoTextContainer>
                    </StyledNoGfisContainer>
                )}
                <StyledSwiper
                    ref={gfiInputEl}
                    id={'gfi-swiper'}
                    onSlideChange={(e) => {
                        setSelectedTab(e.activeIndex);
                    }}
                    tabIndex={selectedTab}
                    allowTouchMove={false} // Disable swiping
                    speed={300}
                >
                    {gfiLocations.map((location) => {
                            const layers = allLayers.filter(layer => layer.id === location.layerId);
                            const title = layers.length > 0 && layers[0].name;
                            if (location.type === 'geojson') {
                                return (
                                    <SwiperSlide
                                        id={
                                            'gfi_tab_content_' +
                                            +location.x +
                                            '_' +
                                            location.y +
                                            '_' +
                                            location.layerId
                                        }
                                        key={
                                            'gfi_tab_content_' +
                                            location.x +
                                            '_' +
                                            location.y +
                                            '_' +
                                            location.layerId
                                        }
                                    >
                                        <GfiTabContent
                                            data={location}
                                            title={title}
                                        />
                                    </SwiperSlide>
                                );
                            }
                        return null;
                    })}
                </StyledSwiper>
            </StyledTabContent>
            <StyledButtonsContainer>
                {
                    vkmData &&
                    <CircleButton
                        icon={faMapMarkerAlt}
                        text={strings.vkm.locationInfo}
                        toggleState={isVKMInfoOpen}
                        tooltipDirection={'left'}
                        clickAction={handleVKMInfo}
                    />
                }
                <CircleButton
                    icon={faPencilRuler}
                    text={strings.gfi.selectLocations}
                    toggleState={isGfiToolsOpen}
                    tooltipDirection={'left'}
                    clickAction={handleGfiToolsMenu}
                />
                <CircleButton
                    icon={faFileDownload}
                    text={strings.gfi.downloadMaterials}
                    toggleState={isGfiDownloadsOpen}
                    tooltipDirection={'left'}
                    clickAction={handleGfiDownloadsMenu}
                    //clickAction={() => store.dispatch(setIsGfiDownloadOpen(true))}
                    disabled={!gfiLocations.length > 0}
                />
                <CircleButton
                    icon={faSearchLocation}
                    text={strings.gfi.focusToLocations}
                    tooltipDirection={'left'}
                    clickAction={() => {
                        handleOverlayGeometry(tabsContent[selectedTab].props.data);
                        isMobile && store.dispatch(setMinimizeGfi(true));
                    }}
                    disabled={gfiLocations.length === 0}
                />
            </StyledButtonsContainer>

            <AnimatePresence>
                {isGfiToolsOpen && (
                    <StyledGfiToolsContainer
                        transition={{
                            duration: 0.4,
                            type: 'tween',
                        }}
                        initial={{
                            opacity: 0,
                            x: '-100%',
                        }}
                        animate={{
                            opacity: 1,
                            x: 0,
                        }}
                        exit={{
                            opacity: 0,
                            x: '-100%',
                        }}
                    >
                        <GfiToolsMenu handleGfiToolsMenu={handleGfiToolsMenu} />
                    </StyledGfiToolsContainer>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {isGfiDownloadsOpen && (
                    <StyledGfiToolsContainer
                        transition={{
                            duration: 0.4,
                            type: 'tween',
                        }}
                        initial={{
                            opacity: 0,
                            x: '-100%',
                        }}
                        animate={{
                            opacity: 1,
                            x: 0,
                        }}
                        exit={{
                            opacity: 0,
                            x: '-100%',
                        }}
                    >
                        <GfiDownloadMenu
                            handleGfiDownloadsMenu={handleGfiDownloadsMenu}
                            handleGfiDownload={handleGfiDownload}
                        />
                    </StyledGfiToolsContainer>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {(isGfiDownloadsOpen || isGfiToolsOpen) && (
                    <StyledGfiBackdrop
                        transition={{
                            duration: 0.4,
                            type: 'tween',
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
                        onClick={() => {
                            isGfiToolsOpen && handleGfiToolsMenu();
                            isGfiDownloadsOpen && handleGfiDownloadsMenu();
                        }}
                    />
                )}
            </AnimatePresence>
        </StyledGfiContainer>
    );
};

export default GFIPopup;
