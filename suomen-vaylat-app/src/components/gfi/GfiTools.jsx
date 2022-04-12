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
    faCircle,
    faTimes,
    faFile,
    faFileArchive
} from '@fortawesome/free-solid-svg-icons';

import CircleButtonListItem from '../circle-button-list-item/CircleButtonListItem';
//import ModalListItem from '../modals/ModalListItem';

import { ReactComponent as SvCircle } from '../../theme/icons/drawtools_circle.svg';
import { ReactComponent as SvSquare } from '../../theme/icons/drawtools_square.svg';
import { ReactComponent as SvRectangle } from '../../theme/icons/drawtools_rectangle.svg';
import { ReactComponent as SvPolygon } from '../../theme/icons/drawtools_polygon.svg';
import { ReactComponent as SvLinestring } from '../../theme/icons/drawtools_linestring.svg';

import {
    //setSelectedFeatures, 
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
    //gap: 16px;
    padding: 24px;
    //max-height: 500px;
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

const StyledDrawingToolContainer = styled.div`
`;

const StyledSelectedDownloadsContainer = styled(motion.div)`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const StyledDeleteAllDownloads = styled.div`
    width: 250px;
    height: 30px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${props => props.theme.colors.mainWhite};
    background-color: ${props => props.disabled ? "rgba(177, 177, 177, 0.5)" : props.theme.colors.mainColor1};
    margin: 20px auto 20px auto;
    border-radius: 15px;
    p {
        margin: 0;
        font-size: 12px;
        font-weight: 600;
    };
`;

const StyledDownloadFormatSelectorContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const StyledDownloadFormats = styled.div`
    display: flex;
    margin-left: auto;
    margin-right: auto;
    gap: 16px;
`;

const StyledDownloadFormat = styled(motion.button)`
    width: 56px;
    height: 56px;
    display: flex;
    gap: 6px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.disabled ? "rgba(177, 177, 177, 0.5)" : props.theme.colors.mainColor1};
    box-shadow: 0px 2px 4px #0000004D;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    pointer-events: ${props => !props.disabled && "auto"};
    svg {
        color: ${props => props.theme.colors.mainWhite};
        font-size: 22px;
    };
    p {
        margin: 0;
        font-weight: bold;
        font-size: 10px;
        color: ${props => props.theme.colors.mainWhite};
        margin-top: -4px;
    };
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

const drawinToolsData = [
/*     {
        id : 'sv-measure-point',
        title : strings.tooltips.measuringTools.point,
        style : {
            icon : <FontAwesomeIcon
                        icon={faCircle}
                    />
        },
        type : 'Point'ß
    }, */
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
/*     {
        id : 'sv-measure-square',
        title : strings.tooltips.measuringTools.square,
        style : {
            icon : <SvSquare />
        },
        type : 'Square'
    }, */
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

const downloadFormats = [
    {
        id: "download-format-shape",
        title: "shape"
    },
    {
        id: "download-format-csv",
        title: "csv"
    },
    {
        id: "download-format-xls",
        title: "excel"
    },
    {
        id: "download-format-json",
        title: "json"
    }
];


const GfiTools = ({
    handleGfiToolsMenu
}) => {

    const { store } = useContext(ReactReduxContext);

    const { channel, selectedFeatures, selectedLayers } = useSelector(state => state.rpc);
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
                            //centerTo: true,
                            featureStyle: {
                                fill: {
                                    color: 'rgba(255, 255, 255, 0.5)'
                                },
                                stroke: {
                                    color: '#0064af',
                                    width: 2
                                },
                                text: { // text style
                                    fill: { // text fill style
                                        color: "#ffffff" // fill color
                                    },
                                    stroke: {
                                        color: '#0064af',
                                        width: 5
                                    },
                                    font: "bold 12px Arial", // font
                                    textAlign: "center", // text align
                                    textBaseline: "middle",
                                    offsetX: 0, // text offset x
                                    offsetY: 0, // text offset y
                                    labelProperty: label, // read label from feature property
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
                                    text: { // text style
                                        fill: { // text fill style
                                            color: "#ffffff" // fill color
                                        },
                                        stroke: {
                                            color: '#0064af',
                                            width: 5
                                        },
                                        font: "bold 16px Arial", // font
                                        textAlign: "center", // text align
                                        textBaseline: "middle",
                                        offsetX: 0, // text offset x
                                        offsetY: 0, // text offset y
                                        labelProperty: label, // read label from feature property
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
                //allowMultipleDrawing: false,
                //drawControl: false,
                //modifyControl: false,
                //showMeasureOnMap: true,
                style: style

            }];
            channel.postRequest('DrawTools.StartDrawingRequest', data);
            store.dispatch(setMinimizeGfi(true));
        }
    };


    const handleHoverIn = (feature) => {
        let featureStyle = {
            fill: {
                color: 'rgba(0, 99, 175, 0.9)'
            }
        };

        let options = {
            featureStyle: featureStyle,
            layerId: 'download-tool-layer',
            animationDuration: 100
        };

        let rn = 'MapModulePlugin.AddFeaturesToMapRequest';

        if(feature.hasOwnProperty('uid')){
            channel.postRequest(rn, [{UID: feature.uid}, options]);
        };
    };

    const handleHoverOut = (feature) => {
        let featureStyle = {
            fill: {
                color: 'rgba(0, 99, 175, 0.5)'
            }
        };

        let options = {
            featureStyle: featureStyle,
            layerId: 'download-tool-layer',
            animationDuration: 100
        };

        let rn = 'MapModulePlugin.AddFeaturesToMapRequest';

        if(feature.hasOwnProperty('uid')){
            channel.postRequest(rn, [{UID: feature.uid}, options]);
        };
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
                                //icon={tool.style.icon}
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