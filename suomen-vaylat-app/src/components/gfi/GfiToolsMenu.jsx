import { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import strings from '../../translations';
import { isMobile } from '../../theme/theme';
import { useSelector } from 'react-redux';
import { ReactReduxContext } from 'react-redux';
import Moment from 'react-moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPencilAlt,
    faPencilRuler,
    faBorderAll,
    faTimes,
    faDownload,
    faInfoCircle
} from '@fortawesome/free-solid-svg-icons';

import CircleButtonListItem from '../circle-button-list-item/CircleButtonListItem';
import DrawingToast from '../toasts/DrawingToast';

import { ReactComponent as SvCircle } from '../../theme/icons/drawtools_circle.svg';
import { ReactComponent as SvRectangle } from '../../theme/icons/drawtools_rectangle.svg';
import { ReactComponent as SvPolygon } from '../../theme/icons/drawtools_polygon.svg';
import { ReactComponent as SvLinestring } from '../../theme/icons/drawtools_linestring.svg';
import { theme } from '../../theme/theme';


import {
    setGFILocations,
    resetGFILocations,
    setGFICroppingArea,
    setVKMData
} from '../../state/slices/rpcSlice';

import { setMinimizeGfi, setSelectedGfiTool, setGeoJsonArray, setHasToastBeenShown } from '../../state/slices/uiSlice';

import SVLoader from '../loader/SvLoader';



const vectorLayerId = 'SEARCH_VECTORLAYER';

const StyledGfiToolContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 24px;
    overflow: auto;
    @media ${(props) => props.theme.device.mobileL} {
        padding: 16px;
    }
    background-color: white;
`;

const StyledToolsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const StyledDrawingToolsContainer = styled(motion.div)`
    padding-left: 2px;
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const StyledLoadingOverlay = styled(motion.div)`
    z-index: 2;
    position: fixed;
    left: 0px;
    top: 0px;
    right: 0px;
    bottom: 0px;
    background-color: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(4px);
`;

const StyledCloseButton = styled.div`
    z-index: 1;
    position: sticky;
    top: 0px;
    right: 0px;
    display: flex;
    justify-content: flex-end;
    svg {
        font-size: 24px;
        color: ${(props) => props.theme.colors.mainColor1};
        cursor: pointer;
    }
`;

const StyledLoaderWrapper = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 999;
    height: 100%;
    max-width: 200px;
    max-height: 200px;
    transform: translate(-50%, -50%);
    svg {
        width: 100%;
        height: 100%;
        fill: none;
    }
`;

const StyledSubtitle = styled.div`
    display: flex;
    justify-content: flex-start;
    color: ${(props) => props.theme.colors.mainColor1};
    padding: 10px 0px 10px 5px;
    font-size: 16px;
    font-weight: bold;
`;

const StyledSavedViewContainer = styled(motion.div)`
    display: flex;
`;

const StyledSavedView = styled.div`
    width: 100%;
    z-index: 1;
    min-height: 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    background-color: ${(props) => props.theme.colors.mainColor1};
    border-radius: 4px;
    padding: 8px 0px 8px 0px;
    box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
    @-moz-document url-prefix() {
        position: initial;
    } ;
`;

const StyledSavedViewName = styled.p`
    user-select: none;
    max-width: 240px;
    color: ${(props) => props.theme.colors.mainWhite};
    margin: 0;
    padding: 0px;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.1s ease-in;
`;

const StyledSavedViewDescription = styled.p`
    margin: 0;
    padding: 0px;
    font-size: 12px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.8);
`;

const StyledLeftContent = styled.div`
    display: flex;
    align-items: center;
`;

const StyledRightContent = styled.div`
    display: flex;
    align-items: center;
`;

const StyleSavedViewHeaderIcon = styled.div`
    width: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
        font-size: 20px;
        color: ${(props) => props.theme.colors.mainWhite};
    }
    p {
        margin: 0;
        font-weight: bold;
        font-size: 22px;
        color: ${(props) => props.theme.colors.mainWhite};
    }
`;

const StyledSavedViewTitleContent = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;
const StyledToastIcon = styled(FontAwesomeIcon)`
    color: ${theme.colors.mainColor1};
`;

// Define default icon, if null then use cropping area name first char
const defaultIcon = null;

// Define here other than default icon (null = use cropping area name first char)
const icons = {
    0: {
        icon: faPencilRuler,
    },
    3: {
        icon: faBorderAll,
    },
    4: {
        icon: faBorderAll,
    },
    5: {
        icon: faBorderAll,
    }
};

const GfiToolsMenu = ({ handleGfiToolsMenu }) => {
    const drawinToolsData = [
        {
            id: 'sv-measure-linestring',
            title: strings.tooltips.measuringTools.linestring,
            style: {
                icon: <SvLinestring />,
            },
            type: 'LineString',
        },
        {
            id: 'sv-measure-polygon',
            title: strings.tooltips.measuringTools.polygon,
            style: {
                icon: <SvPolygon />,
            },
            type: 'Polygon',
        },
        {
            id: 'sv-measure-box',
            title: strings.tooltips.measuringTools.box,
            style: {
                icon: <SvRectangle />,
            },
            type: 'Box',
        },
        {
            id: 'sv-measure-circle',
            title: strings.tooltips.measuringTools.circle,
            style: {
                icon: <SvCircle />,
            },
            type: 'Circle',
        },
    ];

    const { store } = useContext(ReactReduxContext);

    const { channel, gfiLocations } = useSelector((state) => state.rpc);
    const { gfiCroppingTypes, selectedGfiTool, hasToastBeenShown } = useSelector(
        (state) => state.ui
    );

    const [loading, setLoading] = useState(false);
    const [selectedTool, setSelectedTool] = useState(null);
    const [geometries, setGeometries] = useState([]);

    const [showToast, setShowToast] = useState(JSON.parse(localStorage.getItem("showToast")));

    const handleClick = () => {
        setShowToast(false);
        toast.dismiss("measurementToast");
    };

    const handleSelectTool = (id) => {
        if (selectedTool !== id) {
            setSelectedTool(id);

            if (id === 0 || id === 505) {
                setSelectedTool(id);
                channel.postRequest(
                    'MapModulePlugin.RemoveFeaturesFromMapRequest',
                    [null, null, 'download-tool-layer']
                );
            } else {
                setLoading(true);
                channel.getGfiCroppingArea([id], function (data) {
                    store.dispatch(setMinimizeGfi(true));
                    setLoading(false);

                    let label = data.hasOwnProperty('labelProperty')
                        ? data.labelProperty
                        : null;

                    let rn = 'MapModulePlugin.AddFeaturesToMapRequest';
                    let options = {
                        layerId: 'download-tool-layer',
                        clearPrevious: true,
                        featureStyle: {
                            fill: {
                                color: 'rgba(255, 255, 255, 0.5)',
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
                                font: 'bold 12px Arial',
                                textAlign: 'center',
                                textBaseline: 'middle',
                                offsetX: 0,
                                offsetY: 0,
                                labelProperty: label,
                                overflow: id === 2 ? true : false,
                            },
                        },
                        hover: !isMobile
                            ? {
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
                                          labelProperty: label,
                                          overflow: id === 2 ? true : false,
                                      },
                                  },
                              }
                            : {},
                    };
                    data.geojson &&
                        channel.postRequest(rn, [data.geojson, options]);
                }, function(err) {
                    setLoading(false);
                });
            }
        } else {
            setSelectedTool(null);
            channel.postRequest(
                'MapModulePlugin.RemoveFeaturesFromMapRequest',
                [null, null, 'download-tool-layer']
            );
        }
    };

    const handleSelectDrawingTool = (id, item) => {
        if (id !== selectedGfiTool) {
            store.dispatch(setSelectedGfiTool(id));
            var style = {
                draw: {
                    fill: {
                        color: 'rgba(255,255,255,0.5)',
                    },
                    stroke: {
                        color: '#fd7e14',
                        width: 3,
                    },
                    image: {
                        radius: 4,
                        fill: {
                            color: 'rgba(0,0,0,1)',
                        },
                    },
                },
                modify: {
                    fill: {
                        color: 'rgba(153,102,255,0.3)',
                    },
                    stroke: {
                        color: 'rgba(0,0,0,1)',
                        width: 2,
                    },
                    image: {
                        radius: 4,
                        fill: {
                            color: 'rgba(0,0,0,1)',
                        },
                    },
                },
                intersect: {
                    fill: {
                        color: 'rgba(255,255,255,0.3)',
                    },
                    stroke: {
                        color: 'rgba(0,0,0,1)',
                        width: 2,
                        lineDash: 5,
                    },
                    image: {
                        radius: 4,
                        fill: {
                            color: 'rgba(0,0,0,1)',
                        },
                    },
                },
            };

            var data = [
                'gfi-selection-tool',
                item.type,
                {
                    style: style,
                },
            ];
            channel.postRequest('DrawTools.StartDrawingRequest', data);
            store.dispatch(setMinimizeGfi(true));
            if(showToast !== false && !hasToastBeenShown) {
                if(item.type === "LineString" || item.type === "Polygon")
                toast.info(<DrawingToast text={strings.tooltips.measuringTools.measureToast} handleButtonClick={handleClick} />,
                {icon: <StyledToastIcon icon={faInfoCircle} />, toastId: "measurementToast", onClose : () => store.dispatch(setHasToastBeenShown(true))})
            }
        }
    };

    const handleActivateGeometry = (features) => {
        channel.postRequest(
            'MapModulePlugin.RemoveFeaturesFromMapRequest',
            [null, null, vectorLayerId]
        );

        //Others than drawtools
        if (features.data.operation === 'click') {
            if (features.data.features) {
                Object.values(features.data.features).forEach((feature) => {
                    if (
                        feature.layerId &&
                        feature.layerId === 'download-tool-layer'
                    ) {
                        store.dispatch(setMinimizeGfi(false));
                        if (feature.geojson.features) {
                            setLoading(true);
                            Object.values(feature.geojson.features).forEach(
                                (subfeature) => {
                                    store.dispatch(
                                        setGFICroppingArea(subfeature)
                                    );
                                    subfeature.geometry &&
                                        channel &&
                                        channel.getFeaturesByGeoJSON(
                                            [subfeature],
                                            (gfiData) => {
                                                store.dispatch(
                                                    resetGFILocations([])
                                                );
                                                gfiData.gfi &&
                                                    gfiData.gfi.forEach(
                                                        (gfi) => {
                                                            store.dispatch(
                                                                setGFILocations(
                                                                    {
                                                                        content:
                                                                            gfi.geojson,
                                                                        layerId:
                                                                            gfi.layerId,
                                                                        gfiCroppingArea:
                                                                        features
                                                                                .data
                                                                                .features[0]
                                                                                .geojson,
                                                                        type: 'geojson',
                                                                    }
                                                                )
                                                            );
                                                        }
                                                    );

                                                setLoading(false);
                                                handleGfiToolsMenu(gfiData.gfi);
                                            }
                                        );
                                }
                            );
                        }
                    }
                });
            }
        } else if (features.data.geojson) {
            features.data.geojson.features.forEach(feature => {
                store.dispatch(setGFICroppingArea(feature));
                feature.geometry &&
                    channel &&
                    channel.getFeaturesByGeoJSON(
                        [feature],
                        (gfiData) => {
                            store.dispatch(resetGFILocations([]));
                            store.dispatch(setVKMData(null));
                            channel.postRequest('MapModulePlugin.RemoveMarkersRequest', ["VKM_MARKER"]);
                            gfiData.gfi &&
                                gfiData.gfi.forEach((gfi) => {
                                    store.dispatch(
                                        setGFILocations({
                                            content: gfi.geojson,
                                            layerId: gfi.layerId,
                                            gfiCroppingArea:
                                                features.data.geojson,
                                            type: 'geojson',
                                        })
                                    );
                                });
                            setLoading(false);
                            handleGfiToolsMenu(gfiData.gfi);
                        }
                    );
            }) 
        }  else if (features.data.data.geom) {
            features.data.data.geom.features.forEach(feature => {
                store.dispatch(setGFICroppingArea(feature));
                feature.geometry &&
                    channel &&
                    channel.getFeaturesByGeoJSON(
                        [feature],
                        (gfiData) => {
                            store.dispatch(resetGFILocations([]));
                            store.dispatch(setVKMData(null));
                            channel.postRequest('MapModulePlugin.RemoveMarkersRequest', ["VKM_MARKER"]);
                            gfiData.gfi &&
                                gfiData.gfi.forEach((gfi) => {
                                    store.dispatch(
                                        setGFILocations({
                                            content: gfi.geojson,
                                            layerId: gfi.layerId,
                                            gfiCroppingArea:
                                                features.data.geojson,
                                            type: 'geojson',
                                        })
                                    );
                                });
                            setLoading(false);
                            handleGfiToolsMenu(gfiData.gfi);
                        }
                    );
            }) 
        }           
    };

    useEffect(() => {
        
        window.localStorage.getItem('geometries') !== null &&
        setGeometries(JSON.parse(window.localStorage.getItem('geometries')));

        const drawHandler = (data) => {
            if (data.isFinished && data.isFinished === true) {
                channel &&
                    channel.unregisterEventHandler('DrawingEvent', drawHandler);
                channel &&
                    channel.postRequest('DrawTools.StopDrawingRequest', [
                        'gfi-selection-tool',
                        true,
                    ]);
                channel && channel.handleEvent('DrawingEvent', drawHandler);
                store.dispatch(setSelectedGfiTool(null));
                toast.dismiss("measurementToast")
                if (data.id === 'gfi-selection-tool') {
                    store.dispatch(setMinimizeGfi(false));
                    setLoading(true);

                    data.geojson &&
                        data.geojson.features &&
                        data.geojson.features.forEach((feature) => {
                            store.dispatch(setGFICroppingArea(feature));
                            feature.geometry &&
                                channel &&
                                channel.getFeaturesByGeoJSON(
                                    [feature],
                                    (gfiData) => {
                                        store.dispatch(resetGFILocations([]));
                                        store.dispatch(setVKMData(null));
                                        channel.postRequest('MapModulePlugin.RemoveMarkersRequest', ["VKM_MARKER"]);
                                        gfiData.gfi &&
                                            gfiData.gfi.forEach((gfi) => {
                                                store.dispatch(
                                                    setGFILocations({
                                                        content: gfi.geojson,
                                                        layerId: gfi.layerId,
                                                        gfiCroppingArea:
                                                            data.geojson,
                                                        type: 'geojson',
                                                    })
                                                );
                                            });
                                        store.dispatch(setGeoJsonArray(data));
                                        setLoading(false);
                                        handleGfiToolsMenu(gfiData.gfi);
                                    }
                                );
                        });
                }
            }
        };

        const featureEventHandler = (data) => {
            if (data.operation === 'click') {
                if (data.features) {
                    Object.values(data.features).forEach((feature) => {
                        if (
                            feature.layerId &&
                            feature.layerId === 'download-tool-layer'
                        ) {
                            store.dispatch(setMinimizeGfi(false));
                            if (feature.geojson.features) {
                                setLoading(true);
                                Object.values(feature.geojson.features).forEach(
                                    (subfeature) => {
                                        store.dispatch(
                                            setGFICroppingArea(subfeature)
                                        );
                                        subfeature.geometry &&
                                            channel &&
                                            channel.getFeaturesByGeoJSON(
                                                [subfeature],
                                                (gfiData) => {
                                                    store.dispatch(
                                                        resetGFILocations([])
                                                    );
                                                    gfiData.gfi &&
                                                        gfiData.gfi.forEach(
                                                            (gfi) => {
                                                                store.dispatch(
                                                                    setGFILocations(
                                                                        {
                                                                            content:
                                                                                gfi.geojson,
                                                                            layerId:
                                                                                gfi.layerId,
                                                                            gfiCroppingArea:
                                                                                data
                                                                                    .features[0]
                                                                                    .geojson,
                                                                            type: 'geojson',
                                                                        }
                                                                    )
                                                                );
                                                            }
                                                        );
                                                    store.dispatch(setGeoJsonArray(data));
                                                    setLoading(false);
                                                    handleGfiToolsMenu(gfiData.gfi);
                                                }
                                            );
                                    }
                                );
                            }
                        }
                    });
                }
            }
        };

        channel && channel.handleEvent('FeatureEvent', featureEventHandler);
        channel && channel.handleEvent('DrawingEvent', drawHandler);

        return () => {
            channel &&
                channel.unregisterEventHandler(
                    'FeatureEvent',
                    featureEventHandler
                );
            channel &&
                channel.unregisterEventHandler('DrawingEvent', drawHandler);
        };
    }, [channel, handleGfiToolsMenu, store]);

    return (
        <StyledGfiToolContainer>
            <StyledCloseButton onClick={() => handleGfiToolsMenu()}>
                <FontAwesomeIcon icon={faTimes} />
            </StyledCloseButton>
            <AnimatePresence>
                {loading && (
                    <StyledLoadingOverlay
                        transition={{
                            duration: 0.2,
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
                    >
                        <StyledLoaderWrapper>
                            <SVLoader />
                        </StyledLoaderWrapper>
                    </StyledLoadingOverlay>
                )}
            </AnimatePresence>
            <StyledToolsContainer>
                <StyledSubtitle>{strings.gfi.selectLocations}:</StyledSubtitle>
                <CircleButtonListItem
                    key={'cropping-type-draw'}
                    id={0}
                    icon={faPencilAlt}
                    title={strings.gfi.draw}
                    subtitle={strings.gfi.drawSubtitle}
                    selectedItem={selectedTool}
                    handleSelectTool={handleSelectTool}
                />
                <AnimatePresence>
                    {selectedTool === 0 && (
                        <StyledDrawingToolsContainer
                            transition={{
                                duration: 0.2,
                                type: 'tween',
                            }}
                            initial={{
                                opacity: 0,
                                height: 0,
                            }}
                            animate={{
                                opacity: 1,
                                height: 'auto',
                            }}
                            exit={{
                                opacity: 0,
                                height: 0,
                            }}
                        >
                            {drawinToolsData.map((tool) => {
                                return (
                                    <CircleButtonListItem
                                        key={'cropping-type-' + tool.id}
                                        id={tool.id}
                                        item={tool}
                                        title={tool.title}
                                        subtitle={null}
                                        selectedItem={selectedGfiTool}
                                        handleSelectTool={
                                            handleSelectDrawingTool
                                        }
                                        size={'md'}
                                        bgColor={'#ffffff'}
                                        color={'#0064AF'}
                                        activeColor={'#ffc107'}
                                    >
                                        {tool.style.icon}
                                    </CircleButtonListItem>
                                );
                            })}
                        </StyledDrawingToolsContainer>
                    )}
                </AnimatePresence>
                
                <CircleButtonListItem
                    key={'saved'}
                    id={505}
                    icon={faDownload}
                    title={"Omat geometriat"}
                    subtitle={"Omat tallennetut geometriat"}
                    selectedItem={selectedTool}
                    handleSelectTool={handleSelectTool}
                />
                <AnimatePresence>
                    {selectedTool === 505 && (
                        <StyledDrawingToolsContainer
                            transition={{
                                duration: 0.2,
                                type: 'tween',
                            }}
                            initial={{
                                opacity: 0,
                                height: 0,
                            }}
                            animate={{
                                opacity: 1,
                                height: 'auto',
                            }}
                            exit={{
                                opacity: 0,
                                height: 0,
                            }}
                        >
                            {geometries.map((geometry) => {
                                return (
                                    <StyledSavedViewContainer
                                        key={geometry.id}
                                        transition={{
                                            duration: 0.2,
                                            type: 'tween',
                                        }}
                                        initial={{
                                            opacity: 0,
                                            height: 0,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            height: 'auto',
                                        }}
                                        exit={{
                                            opacity: 0,
                                            height: 0,
                                        }}
                                    >
                                        <StyledSavedView
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleActivateGeometry(geometry);
                                            }}
                                        >
                                            <StyledLeftContent>
                                                <StyleSavedViewHeaderIcon>
                                                    {
                                                        <p>
                                                            {geometry.name
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </p>
                                                    }
                                                </StyleSavedViewHeaderIcon>
                                                <StyledSavedViewTitleContent>
                                                    <StyledSavedViewName>
                                                        {geometry.name}
                                                    </StyledSavedViewName>
                                                    <StyledSavedViewDescription>
                                                        {
                                                            <Moment
                                                                format="DD.MM.YYYY"
                                                                tz="Europe/Helsinki"
                                                            >
                                                                {geometry.saveDate}
                                                            </Moment>
                                                        }
                                                    </StyledSavedViewDescription>
                                                </StyledSavedViewTitleContent>
                                            </StyledLeftContent>
                                            <StyledRightContent>
                                            </StyledRightContent>
                                        </StyledSavedView>
                                    </StyledSavedViewContainer>
                                )
                                })
                            }
                        </StyledDrawingToolsContainer>
                    )}
                </AnimatePresence>
                {gfiCroppingTypes &&
                    gfiCroppingTypes.map((croppingType) => {
                        return (
                            <CircleButtonListItem
                                key={'cropping-type-' + croppingType.id}
                                id={croppingType.id}
                                item={croppingType}
                                icon={icons[croppingType.id] ? icons[croppingType.id].icon : defaultIcon}
                                title={croppingType.title}
                                subtitle={croppingType.description}
                                selectedItem={selectedTool}
                                handleSelectTool={handleSelectTool}
                            />
                        );
                    })}
            </StyledToolsContainer>
        </StyledGfiToolContainer>
    );
};

export default GfiToolsMenu;
