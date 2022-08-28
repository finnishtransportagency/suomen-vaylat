import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ReactReduxContext } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEraser, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import svCircle from '../../theme/icons/drawtools_circle.svg';
import svSquare from '../../theme/icons/drawtools_square.svg';
import svRectangle from '../../theme/icons/drawtools_rectangle.svg';
import svPolygon from '../../theme/icons/drawtools_polygon.svg';
import svLinestring from '../../theme/icons/drawtools_linestring.svg';

import { useSelector } from 'react-redux';

import strings from '../../translations';
import { setActiveTool, setHasToastBeenShown, setIsSaveViewOpen, setSavedTabIndex , setGeoJsonArray} from '../../state/slices/uiSlice';
import { theme } from '../../theme/theme';
import DrawingToast from '../toasts/DrawingToast';
import { toast } from 'react-toastify';

import CircleButton from '../circle-button/CircleButton';
import AddGeometryButton from '../add-geometry-button/AddGeometryButton';

const DRAWTOOLS_GEOMETRY_LAYER_ID = 'drawtools-geometry-layer';

const StyledTools = styled(motion.div)`
    display: flex;
    align-items: center;
    flex-direction: row;
    background-color: ${props => props.color};
    flex-direction: column;
    gap: 4px;
`;

const StyledIcon = styled.img`
    width: 1.3rem;
    @media ${props => props.theme.device.mobileL} {
        width: 1rem;
    };
`;

const StyledToastIcon = styled(FontAwesomeIcon)`
    color: ${theme.colors.mainColor1};
`;

const variants = {
    show: {
        height: "auto",
        opacity: 1,
        paddingTop: "4px",
        paddingBottom: "1px",
        filter: "blur(0px)",
        transition: {
            when: "beforeChildren",
            duration: 0.3,
            type: "tween"
        },
        pointerEvents: "auto"
    },
    hidden: {
        height: 0,
        opacity: 0,
        paddingTop: "0px",
        paddingBottom: "0px",
        filter: "blur(10px)",
        transition: {
            when: "afterChildren",
            duration: 0.2,
            type: "tween",
        },
        pointerEvents: "none" 
    },
};

export const DrawingTools = ({isOpen, theme}) => {
    const { store } = useContext(ReactReduxContext);
    const { channel } = useSelector(state => state.rpc);
    const { activeTool, geoJsonArray, isDrawingToolsOpen, hasToastBeenShown} = useSelector(state => state.ui);
    const [ showToast, setShowToast] = useState(JSON.parse(localStorage.getItem("showToast")));
    
    const handleClick = () => {
        setShowToast(false);
        toast.dismiss("drawToast");
    };

    useEffect(() => {
        const drawHandler = (data) => {
            if (data.isFinished && data.isFinished === true && data.geojson.features.length > 0) {
                store.dispatch(setGeoJsonArray(data));
            }
        };

        channel && channel.handleEvent('DrawingEvent', drawHandler);
        
        return () => {
            channel &&
                channel.unregisterEventHandler('DrawingEvent', drawHandler);
        };
    }, [channel, store]);
    
    useEffect(() => {
        setShowToast(JSON.parse(localStorage.getItem("showToast")));
        if(showToast === false) store.dispatch(setHasToastBeenShown(true));
    }, [isDrawingToolsOpen, hasToastBeenShown]);

    if(activeTool === null) toast.dismiss("drawToast");


    const startStopTool = (tool) => {
        if (tool.name !== activeTool) {
            var data = [tool.name, tool.type, { showMeasureOnMap: true }];
            channel && channel.postRequest('DrawTools.StartDrawingRequest', data);
            store.dispatch(setActiveTool(tool.name));
            if(showToast !== false && !hasToastBeenShown) {
                if((tool.type === "LineString") || (tool.type === "Polygon")) {
                    toast.info(<DrawingToast handleButtonClick={handleClick} text={strings.tooltips.drawingtools.drawingToast} />, 
                    {icon: <StyledToastIcon icon={faInfoCircle} /> ,toastId: "drawToast", onClose : () => {
                         store.dispatch(setHasToastBeenShown(true))
                    }});
                }
                else toast.dismiss("drawToast");
            }
        } else {
            channel && channel.postRequest('DrawTools.StopDrawingRequest', [activeTool]);
            store.dispatch(setActiveTool(null));
        }
    };

    const eraseDrawing = () => {
        // remove geometries off the map
        channel && channel.postRequest('DrawTools.StopDrawingRequest', [true]);
        // stop the drawing tool
        channel && channel.postRequest('DrawTools.StopDrawingRequest', [activeTool]);
        store.dispatch(setGeoJsonArray({}));
        store.dispatch(setActiveTool(null));
    };

    const drawinToolsData = [
        {
            id : 'sv-measure-linestring',
            name : strings.tooltips.measuringTools.linestring,
            style : {
                icon : svLinestring
            },
            type : 'LineString'
        },
        {
            id : 'sv-measure-polygon',
            name : strings.tooltips.measuringTools.polygon,
            style : {
                icon : svPolygon
                },
            type : 'Polygon'
        },
        {
            id : 'sv-measure-square',
            name : strings.tooltips.measuringTools.square,
            style : {
                icon : svSquare
            },
            type : 'Square'
        },
        {
            id : 'sv-measure-box',
            name : strings.tooltips.measuringTools.box,
            style : {
                icon : svRectangle
            },
            type : 'Box'
        },
        {
            id : 'sv-measure-circle',
            name : strings.tooltips.measuringTools.circle,
            style : {
                icon : svCircle
            },
            type : 'Circle'
        },
        {
            id : 'sv-erase',
            name : strings.tooltips.measuringTools.erase,
            style : {
                icon : faEraser
            },
        },
    ];

    const handleAddGeometry = () => {
        geoJsonArray.features && geoJsonArray.features.forEach(feature => {
            channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [
                feature.geojson,
                {
                    clearPrevious: true,
                    layerId: DRAWTOOLS_GEOMETRY_LAYER_ID,
                    centerTo: true,
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
        })

        geoJsonArray.geojson &&
        channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [
            geoJsonArray.geojson ,
            {
                clearPrevious: true,
                layerId: DRAWTOOLS_GEOMETRY_LAYER_ID,
                centerTo: true,
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
        store.dispatch(setIsSaveViewOpen(true));
        store.dispatch(setSavedTabIndex(1));
    };

    return (
            <StyledTools
                isOpen={isOpen}
                initial="hidden"
                animate={isOpen ? "show" : "hidden"}
                variants={variants}
                transition={{
                    duration: 0.3,
                    type: "tween",
                }}
            >
                {drawinToolsData.map(tool => {
                    return (
                            tool.id !== "sv-erase" ?
                            <CircleButton
                                key={tool.id}
                                text={tool.name && tool.name}
                                toggleState={tool.name && tool.name === activeTool ? true : false}
                                clickAction={() => startStopTool(tool)}
                                type="drawingTool"
                                tooltipDirection={"right"}
                            >
                                <StyledIcon src={tool.style && tool.style.icon}/>
                            </CircleButton> : tool.id === "sv-erase" &&
                            <CircleButton
                                key={tool.id}
                                icon={faEraser}
                                text={tool.name}
                                clickAction={() => eraseDrawing()}
                                type="drawingTool"
                                color="secondaryColor7"
                                tooltipDirection={"right"}
                            >
                            </CircleButton>
                    )
                })}
                <AddGeometryButton
                    disabled={!Object.keys(geoJsonArray).length}
                    text={strings.savedContent.saveGeometry.saveGeometry}
                    tooltipDirection={'right'}
                    clickAction={handleAddGeometry}
                />
            </StyledTools>
    );
 };

 export default DrawingTools;