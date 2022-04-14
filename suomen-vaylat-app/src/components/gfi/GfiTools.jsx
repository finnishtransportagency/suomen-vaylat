import { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import strings from '../../translations';
import { isMobile } from '../../theme/theme';
import { useSelector } from 'react-redux';
import { ReactReduxContext } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPencilRuler,
    faBorderAll,
    faTimes
} from '@fortawesome/free-solid-svg-icons';

import CircleButtonListItem from '../circle-button-list-item/CircleButtonListItem';

import { ReactComponent as SvCircle } from '../../theme/icons/drawtools_circle.svg';
import { ReactComponent as SvRectangle } from '../../theme/icons/drawtools_rectangle.svg';
import { ReactComponent as SvPolygon } from '../../theme/icons/drawtools_polygon.svg';
import { ReactComponent as SvLinestring } from '../../theme/icons/drawtools_linestring.svg';

import {
    setGFILocations,
    resetGFILocations
} from '../../state/slices/rpcSlice';

import {
    setMinimizeGfi,
    setSelectedGfiTool
} from '../../state/slices/uiSlice';

import SVLoader from '../loader/SvLoader';

const StyledGfiToolContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 24px;
    overflow: auto;
    @media ${props => props.theme.device.mobileL} {
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
    position: absolute;
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
    color: ${props => props.theme.colors.mainColor1};
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
        color: ${props => props.theme.colors.mainColor1};
        cursor: pointer;
    }
`;

const icons = {
   0: {
        icon: faPencilRuler,
    },
    1: {
        icon: null,
    },
    2: {
        icon: null,
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

const GfiTools = ({
    handleGfiToolsMenu
}) => {

    const drawinToolsData = [
            {
                id : 'sv-measure-linestring',
                title : strings.tooltips.measuringTools.linestring,
                style : {
                    icon : <SvLinestring />
                },
                type : 'LineString'
            },
            {
                id : 'sv-measure-polygon',
                title : strings.tooltips.measuringTools.polygon,
                style : {
                    icon : <SvPolygon />
                    },
                type : 'Polygon'
            },
            {
                id : 'sv-measure-box',
                title : strings.tooltips.measuringTools.box,
                style : {
                    icon : <SvRectangle />
                },
                type : 'Box'
            },
            {
                id : 'sv-measure-circle',
                title : strings.tooltips.measuringTools.circle,
                style : {
                    icon : <SvCircle />
                },
                type : 'Circle'
            }
    ];

    const { store } = useContext(ReactReduxContext);

    const { channel } = useSelector(state => state.rpc);
    const { gfiCroppingTypes, selectedGfiTool } = useSelector(state => state.ui);

    const [ loading, setLoading ] = useState(false);

    const [selectedTool, setSelectedTool] = useState(null);
    const [selectedDrawingTool, setSelectedDrawingTool] = useState(null);

    const handleSelectTool = (id) => {

        setSelectedDrawingTool(null);

        if(selectedTool !== id) {
            setSelectedTool(id);

            if(id === 0) {
                    setSelectedTool(id);
                    channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [null, null, 'download-tool-layer']);
                } else {

                    setLoading(true);
                    channel.getGfiCroppingArea([id], function (data) {
                        store.dispatch(setMinimizeGfi(true));
                        setLoading(false);

                        let label = data.hasOwnProperty('labelProperty') ? data.labelProperty : null;

                        let rn = 'MapModulePlugin.AddFeaturesToMapRequest';
                        let options = {
                            layerId: 'download-tool-layer',
                            clearPrevious: true,
                            featureStyle: {
                                fill: {
                                    color: 'rgba(255, 255, 255, 0.5)'
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
                                    font: 'bold 12px Arial',
                                    textAlign: 'center',
                                    textBaseline: 'middle',
                                    offsetX: 0,
                                    offsetY: 0,
                                    labelProperty: label,
                                    overflow: id === 2 ? true : false
                                },
                            },
                            hover: !isMobile ? {
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
                                        offsetY: 0,
                                        labelProperty: label,
                                        overflow: id === 2 ? true : false
                                    },
                                },
                            } : {}
                        };

                        data.geojson && channel.postRequest(rn, [data.geojson, options]);
                    });
               }
        } else {
            setSelectedTool(null);
            channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [null, null, 'download-tool-layer']);
        }
    };

    const handleSelectDrawingTool = (id, item) => {
        if(id === selectedGfiTool){
            setSelectedDrawingTool(null);
        } else {
            store.dispatch(setSelectedGfiTool(id));
            var style = {
                draw : {
                    fill : {
                         color: 'rgba(255,255,255,0.5)'
                    },
                    stroke : {
                          color: '#fd7e14',
                          width: 3
                    },
                    image : {
                          radius: 4,
                          fill: {
                            color: 'rgba(0,0,0,1)'
                          }
                    }
                },
                modify : {
                    fill : {
                         color: 'rgba(153,102,255,0.3)'
                    },
                    stroke : {
                          color: 'rgba(0,0,0,1)',
                          width: 2
                    },
                    image : {
                          radius: 4,
                          fill: {
                            color: 'rgba(0,0,0,1)'
                          }
                    }
                },
                intersect : {
                    fill : {
                         color: 'rgba(255,255,255,0.3)'
                    },
                    stroke : {
                          color: 'rgba(0,0,0,1)',
                          width: 2,
                          lineDash: 5
                    },
                    image : {
                          radius: 4,
                          fill: {
                            color: 'rgba(0,0,0,1)'
                          }
                    }
                }
            };


            var data = ['gfi-selection-tool', item.type, {
                style: style

            }];
            channel.postRequest('DrawTools.StartDrawingRequest', data);
            store.dispatch(setMinimizeGfi(true));
        }
    };

/*     useEffect(() => {
        switch(selectedTool){
        case 1:
            setSelectedDownloads(
                selectedFeatures.map(selectedFeature => {
                    return {
                         id: selectedFeature.id,
                         uid: selectedFeature.properties.UID,
                         title: "Kunta",
                         subtitle: selectedFeature.properties.KUNTANIMI
                     };
                 })
            );
        break;
        case 2:
            setSelectedDownloads(
                selectedFeatures.map(selectedFeature => {
                    return {
                         id: selectedFeature.id,
                         uid: selectedFeature.properties.UID,
                         title: "Maakunta",
                         subtitle: selectedFeature.properties.NIMI
                     };
                 })
            );
        break;
        case 3:
            setSelectedDownloads(
                selectedFeatures.map(selectedFeature => {
                    return {
                         id: selectedFeature.id,
                         uid: selectedFeature.properties.UID,
                         title: "Ruudukko 50km",
                         subtitle: selectedFeature.properties.LEHTITUNNU
                     };
                 })
            );
        break;
        case 4:
            setSelectedDownloads(
                selectedFeatures.map(selectedFeature => {
                    return {
                         id: selectedFeature.id,
                         uid: selectedFeature.properties.UID,
                         title: "Ruudukko 100km",
                         subtitle: selectedFeature.properties.LEHTITUNNU
                     };
                 })
            );
        break;
        case 5:
            setSelectedDownloads(
                selectedFeatures.map(selectedFeature => {
                    return {
                         id: selectedFeature.id,
                         uid: selectedFeature.properties.UID,
                         title: "Ruudukko 200km",
                         subtitle: selectedFeature.properties.LEHTITUNNU
                     };
                 })
            );
        break;
        default:
        break;
        }
    },[selectedFeatures, selectedTool, store]); */

    useEffect(() => {
        const drawHandler = (data) => {
            if(data.isFinished && data.isFinished === true ){
                channel && channel.unregisterEventHandler('DrawingEvent', drawHandler);
                channel && channel.postRequest('DrawTools.StopDrawingRequest', ['gfi-selection-tool', true]);
                channel && channel.handleEvent('DrawingEvent', drawHandler);
                store.dispatch(setSelectedGfiTool(null));
                if(data.id === 'gfi-selection-tool'){
                    store.dispatch(setMinimizeGfi(false));
                    setLoading(true);
                    data.geojson && data.geojson.features && data.geojson.features.forEach(feature => {
                        feature.geometry &&  channel && channel.getFeaturesByGeoJSON([feature], (gfiData) => {
                           store.dispatch(resetGFILocations([]));
                           gfiData.gfi && gfiData.gfi.forEach(gfi => {
                                store.dispatch(setGFILocations(
                                    {
                                        content: gfi.geojson,
                                        layerId: gfi.layerId,
                                        gfiCroppingArea: data.geojson,
                                        type: 'geojson'
                                    }
                                ));
                            });
                            setLoading(false);
                            handleGfiToolsMenu();
                        });
                    });
                };
            };
        };

        const featureEventHandler = (data) => {
            if(data.operation === 'click') {
                if(data.features){
                    Object.values(data.features).forEach(feature => {
                        if(feature.layerId && feature.layerId === 'download-tool-layer'){
                            store.dispatch(setMinimizeGfi(false));
                            if(feature.geojson.features){
                                setLoading(true);
                                Object.values(feature.geojson.features).forEach(subfeature => {
                                    subfeature.geometry && channel && channel.getFeaturesByGeoJSON([subfeature], (gfiData) => {
                                        store.dispatch(resetGFILocations([]));
                                        gfiData.gfi && gfiData.gfi.forEach(gfi => {

                                             store.dispatch(setGFILocations(
                                                 {
                                                     content: gfi.geojson,
                                                     layerId: gfi.layerId,
                                                     gfiCroppingArea: data.features[0].geojson,
                                                     type: 'geojson'
                                                 }
                                             ));
                                         });
                                         setLoading(false);
                                         handleGfiToolsMenu();
                                     });
                                });
                            };
                        };
                    });
                };
            };
        };

        channel && channel.handleEvent('FeatureEvent', featureEventHandler);
        channel && channel.handleEvent('DrawingEvent', drawHandler);

        return () => {
            channel && channel.unregisterEventHandler('FeatureEvent', featureEventHandler);
            channel && channel.unregisterEventHandler('DrawingEvent', drawHandler);
        };
    },[channel, handleGfiToolsMenu, store]);

    return <StyledGfiToolContainer>
        <StyledCloseButton
            onClick={() => handleGfiToolsMenu()}
        >
            <FontAwesomeIcon
                icon={faTimes}
            />
        </StyledCloseButton>
         <AnimatePresence>
            {
            loading && <StyledLoadingOverlay
                    transition={{
                        duration: 0.2,
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
                >
                <SVLoader />
            </StyledLoadingOverlay>
            }
         </AnimatePresence>
        <StyledToolsContainer>
        <StyledSubtitle>{strings.gfi.selectLocations}:</StyledSubtitle>
            <CircleButtonListItem
                key={'cropping-type-draw'}
                id={0}
                icon={faPencilRuler}
                title={strings.gfi.draw}
                subtitle={strings.gfi.drawSubtitle}
                selectedItem={selectedTool}
                handleSelectTool={handleSelectTool}
            />
            <AnimatePresence>
            {
                selectedTool === 0 && <StyledDrawingToolsContainer
                    transition={{
                        duration: 0.2,
                        type: "tween"
                    }}
                    initial={{
                        opacity: 0,
                        height: 0
                    }}
                    animate={{
                        opacity: 1,
                        height: 'auto'
                    }}
                    exit={{
                        opacity: 0,
                        height: 0
                    }}
                >
                    {
                        drawinToolsData.map((tool) => {
                            return <CircleButtonListItem
                                key={'cropping-type-'+tool.id}
                                id={tool.id}
                                item={tool}
                                title={tool.title}
                                subtitle={null}
                                selectedItem={selectedGfiTool}
                                handleSelectTool={handleSelectDrawingTool}
                                size={'md'}
                                bgColor={'#ffffff'}
                                color={'#0064AF'}
                                activeColor={'#ffc107'}
                            >
                                {tool.style.icon}
                            </CircleButtonListItem>
                        })
                    }
                </StyledDrawingToolsContainer>
            }
            </AnimatePresence>
            {
                gfiCroppingTypes && gfiCroppingTypes.map((croppingType) => {
                    return <CircleButtonListItem
                        key={'cropping-type-'+croppingType.id}
                        id={croppingType.id}
                        item={croppingType}
                        icon={icons[croppingType.id].icon}
                        title={croppingType.title}
                        subtitle={croppingType.description}
                        selectedItem={selectedTool}
                        handleSelectTool={handleSelectTool}
                    />
                })
            }
        </StyledToolsContainer>
{/*         <StyledSelectedDownloadsContainer>
            <StyledSubtitle>Valitut rajaukset:</StyledSubtitle>
            <AnimatePresence>
                {
                    selectedDownloads.map(item => {
                        return <ModalListItem
                            key={item.id}
                            id={item.id}
                            title={item.title}
                            subtitle={item.subtitle}
                            icon={faFile}
                            removeAction={handleRemoveSelectedFeature}
                            hoverInAction={handleHoverIn}
                            hoverOutAction={handleHoverOut}
                            data={item}
                        />
                    })
                }
            </AnimatePresence>
                {
                   selectedDownloads.length > 0 && <StyledDeleteAllDownloads
                        onClick={() => selectedDownloads.length > 0 && handleDeleteAllSelectedFeatures()}
                        disabled={selectedDownloads.length === 0}
                    >
                        <p>{"Poista kaikki valitut rajausalueet"}</p>
                    </StyledDeleteAllDownloads>
                }
        </StyledSelectedDownloadsContainer> */}
{/*         <StyledDownloadFormatSelectorContainer>

            {selectedDownloads.length > 0 &&
            <>
            <StyledSubtitle>Karttatasot:</StyledSubtitle>
                <ul>
                    {
                        selectedLayers.map(selectedLayer => {
                            console.log(selectedLayer);
                            return <li
                                key={'download-tool-layer-'+selectedLayer.id}
                                style={{display: 'flex', alignItems: 'center'}}
                                >
                                <label htmlFor={'download-tool-layer-input'+selectedLayer.id} style={{margin: 0}}>
                                    {selectedLayer.name}
                                </label>
                                <input type="checkbox" id={'download-tool-layer-input'+selectedLayer.id} checked/>
                            </li>
                        })
                    }
                </ul>
            </>
            }
        </StyledDownloadFormatSelectorContainer> */}
{/*         <StyledDownloadFormatSelectorContainer>
            <StyledSubtitle style={{display: 'flex', justifyContent: 'center'}}>
                Lataa aineistot valituista karttatasoista
            </StyledSubtitle>
            <StyledDownloadFormats>
                {
                    downloadFormats.map(format => {
                        return <StyledDownloadFormat
                                    key={format.id}
                                    whileHover={{
                                        scale: 1.1,
                                        transition: { duration: 0.2 },
                                    }}
                                    disabled={!selectedDownloads.length > 0}
                                    onClick={() => console.log("SADDSA")}
                                >
                                    <FontAwesomeIcon
                                        icon={faFileArchive}
                                    />
                            <p>{format.title.toUpperCase()}</p>
                        </StyledDownloadFormat>
                    })
                }
            </StyledDownloadFormats>
        </StyledDownloadFormatSelectorContainer> */}
    </StyledGfiToolContainer>
};

export default GfiTools;