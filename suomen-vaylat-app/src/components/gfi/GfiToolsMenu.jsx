import { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import strings from '../../translations';
import { isMobile } from '../../theme/theme';
import { useSelector } from 'react-redux';
import { ReactReduxContext } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPencilAlt,
    faPencilRuler,
    faBorderAll,
    faTimes,
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

import { setHasToastBeenShown, setMinimizeGfi, setSelectedGfiTool, setActiveSelectionTool } from '../../state/slices/uiSlice';

import SVLoader from '../loader/SvLoader';

const StyledGfiToolContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 24px;
    overflow: auto;
    @media ${(props) => props.theme.device.mobileL} {
        padding: 16px;
    };
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

const StyledSubtitle = styled.div`
    display: flex;
    justify-content: flex-start;
    color: ${(props) => props.theme.colors.mainColor1};
    padding: 0px 0px 10px 5px;
    font-size: 16px;
    font-weight: bold;
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
            title: strings.tooltips.drawingTools.linestring,
            style: {
                icon: <SvLinestring />,
            },
            type: 'LineString',
        },
        {
            id: 'sv-measure-polygon',
            title: strings.tooltips.drawingTools.polygon,
            style: {
                icon: <SvPolygon />,
            },
            type: 'Polygon',
        },
        {
            id: 'sv-measure-box',
            title: strings.tooltips.drawingTools.box,
            style: {
                icon: <SvRectangle />,
            },
            type: 'Box',
        },
        {
            id: 'sv-measure-circle',
            title: strings.tooltips.drawingTools.circle,
            style: {
                icon: <SvCircle />,
            },
            type: 'Circle',
        },
    ];

    const { store } = useContext(ReactReduxContext);

    const { channel } = useSelector((state) => state.rpc);

    const { gfiCroppingTypes, selectedGfiTool, hasToastBeenShown, activeSelectionTool } = useSelector(

        (state) => state.ui
    );

    const [loading, setLoading] = useState(false);


    const [showToast, setShowToast] = useState(JSON.parse(localStorage.getItem("showToast")));

    const handleClick = () => {
        setShowToast(false);
        toast.dismiss("measurementToast");
    };

    const handleSelectTool = (id) => {
        if (activeSelectionTool !== id) {
            store.dispatch(setActiveSelectionTool(id));
            if (id === 0) {
                store.dispatch(setActiveSelectionTool(id));
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
            store.dispatch(setActiveSelectionTool(null));
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
                toast.info(<DrawingToast text={strings.tooltips.drawingTools.measureToast} handleButtonClick={handleClick} />,
                {icon: <StyledToastIcon icon={faInfoCircle} />, toastId: "measurementToast", onClose : () => store.dispatch(setHasToastBeenShown(true))})
            }
        }
    };

    useEffect(() => {
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
                                                        moreFeatures: gfi.moreFeatures,
                                                        nextStartIndex: gfi.nextStartIndex
                                                    })
                                                );
                                            });
                                        setLoading(false);
                                        handleGfiToolsMenu();
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
                                                                            moreFeatures: gfi.moreFeatures,
                                                                            nextStartIndex: gfi.nextStartIndex
                                                                        }
                                                                    )
                                                                );
                                                            }
                                                        );
                                                    setLoading(false);
                                                    handleGfiToolsMenu();
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
                    selectedItem={activeSelectionTool}
                    handleSelectTool={handleSelectTool}
                />
                <AnimatePresence>
                    {activeSelectionTool === 0 && (
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
                                selectedItem={activeSelectionTool}
                                handleSelectTool={handleSelectTool}
                            />
                        );
                    })}
            </StyledToolsContainer>
        </StyledGfiToolContainer>
    );
};

export default GfiToolsMenu;
