import { useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ReactReduxContext } from 'react-redux';

import { debounce } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEraser, faInfoCircle, faMapMarkerAlt, faMapPin, faFlag, faCircle, faArrowDown, faCommentAlt, faThumbtack, faTimes, faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import svCircle from '../../theme/icons/drawtools_circle.svg';
import svSquare from '../../theme/icons/drawtools_square.svg';
import svRectangle from '../../theme/icons/drawtools_rectangle.svg';
import svPolygon from '../../theme/icons/drawtools_polygon.svg';
import svLinestring from '../../theme/icons/drawtools_linestring.svg';

import { useSelector } from 'react-redux';

import strings from '../../translations';
import { setIsDrawingToolsOpen, setActiveTool, setHasToastBeenShown, setIsSaveViewOpen, setSavedTabIndex , setGeoJsonArray, addToGeoJsonArray, setSelectedMarker, setMarkerLabel, removeFromDrawToolMarkers} from '../../state/slices/uiSlice';
import { removeMarkerRequest } from '../../state/slices/rpcSlice';

import { theme } from '../../theme/theme';
import DrawingToast from '../toasts/DrawingToast';
import { toast } from 'react-toastify';
import { DRAWING_TIP_LOCALSTORAGE } from '../../utils/constants';

import CircleButton from '../circle-button/CircleButton';

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

const StyledOptionsWrapper = styled(motion.div)`
    position: absolute;
    background-color: ${props => props.theme.colors.mainWhite};
    z-index: -1;
    display: grid;
    bottom: 40px;
    grid-template-columns: 1fr;
    grid-gap: 5px;
    margin-left: 55px;
    justify-content: center;
    align-items: center;
    white-space: nowrap;
    padding: 10px;
    padding-right: 10px;
    overflow: visible;
    color: ${props => props.theme.colors.mainColor1};
    font-weight: 600;
    box-shadow: 0px 2px 4px #0000004D;
    gap: 5px;
    svg {
        color: ${props => props.theme.colors.mainWhite};
    };
    @media ${props => props.theme.device.mobileL} {
        margin-left: 45px;
        bottom: -15px;
        svg {

        };
        button {
            height: 33px;
            width: 32px;
        }
    };
`;

const StyledOptionButtonsWrapper = styled(motion.div)`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 5px;
    @media ${props => props.theme.device.mobileL} {
        grid-template-columns: repeat(2, 1fr);
    };
`;

const StyledOptionsButton = styled(motion.button)`
    display: flex;
    height: 35px;
    width: 35px;
    align-items: center;
    text-align: center;
    justify-content: center;
    z-index: 10;
    border: none;
    border-radius: 50%;
    margin: 0 auto;
    background-color: ${props => props.theme.colors.button};
`;

const StyledOptionsIcon = styled(FontAwesomeIcon)`

`;

const StyledLabelWrapper = styled.div`
    border: none;
`;

const StyledLabelInput = styled.input`
    width: 200px;
    padding: 5px;
    padding-right: 25px;
    border: 1px solid ${theme.colors.mainColor1};
    border-radius: 5%;
    &&:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    };
    @media ${props => props.theme.device.mobileL} {
        width: 75px;
        padding-right: 25px;
    };
`;

const StyledClearLabelButton = styled.button`
    position: absolute;
    background: none;
    border: none;
    bottom: 15px;
    right: 20px;
    padding: 0px;
    @media ${props => props.theme.device.mobileL} {
        right: 10px;
        bottom: 12px;
    };
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

export const DrawingTools = ({isOpen}) => {
    const { store } = useContext(ReactReduxContext);
    const { channel } = useSelector(state => state.rpc);
    const { isDrawingToolsOpen, activeTool, geoJsonArray, hasToastBeenShown, selectedMarker, drawToolMarkers} = useSelector(state => state.ui);
    const [ showToast, setShowToast] = useState(JSON.parse(localStorage.getItem(DRAWING_TIP_LOCALSTORAGE)));
    const [label, setLabel] = useState('');

    const updateMarkerLabel = (label) => store.dispatch(setMarkerLabel(label))

    const debouncedChangeHandler = useCallback(
        debounce(updateMarkerLabel, 300)
    , []);

    const handleChange = (event) => {
        setLabel(event.target.value);
    };

    const handleClick = () => {
        setShowToast(false);
        toast.dismiss("drawToast");
    };

    const handleKeyUp = (event) => {
        if(event.keyCode === 13) {
            event.preventDefault();
            event.target.blur();
        }
    }

    const resetTools = () => {
        store.dispatch(setActiveTool(null));
        console.log("is called");
        setLabel('');
    }

    useEffect(() => {
        if(showToast === false) store.dispatch(setHasToastBeenShown({toastId: 'drawToast', shown: true}));
    }, [showToast, store]);

    useEffect(() => {
        if(activeTool === strings.tooltips.drawingTools.marker) return;
        setLabel('');
    }, [activeTool]);

    useEffect(() => {
        debouncedChangeHandler(label);
    }, [label]);

    if(activeTool === null) toast.dismiss("drawToast");


    const startStopTool = (tool) => {
        if (tool.name !== activeTool) {
            var data = [tool.name, tool.type, { showMeasureOnMap: true }];
            channel && channel.postRequest('DrawTools.StartDrawingRequest', data);
            store.dispatch(setActiveTool(tool.name));
            if(showToast !== false && !hasToastBeenShown.includes('drawToast')) {
                if((tool.type === "LineString") || (tool.type === "Polygon")) {
                    toast.info(<DrawingToast handleButtonClick={handleClick} text={strings.tooltips.drawingTools.drawingToast} />,
                    {icon: <StyledToastIcon icon={faInfoCircle} />, toastId: "drawToast", onClose : () => {
                         store.dispatch(setHasToastBeenShown({toastId: 'drawToast', shown: true}))
                    }});
                }
                else toast.dismiss("drawToast");
            }
        } else {
            channel && channel.postRequest('DrawTools.StopDrawingRequest', [activeTool]);
            resetTools();
        }
    };

    const addMarker = (tool) => {
        //Stop drawing only if drawing is currently on-going
        channel && activeTool !== strings.tooltips.drawingTools.marker && activeTool !== null && channel.postRequest('DrawTools.StopDrawingRequest', [activeTool, false]);
        if(tool.name !== activeTool) {
            store.dispatch(setActiveTool(tool.name));
        }
        else {
            resetTools();
        }
    };

    const eraseDrawing = () => {
        // stop the drawing tool
        channel && channel.postRequest('DrawTools.StopDrawingRequest', [activeTool]);
        store.dispatch(setGeoJsonArray([]));
        store.dispatch(removeFromDrawToolMarkers(false));
        // remove geometries off the map
        channel && channel.postRequest('DrawTools.StopDrawingRequest', []);
        store.dispatch(setActiveTool(null));
        // remove all markers made with drawing tools
        drawToolMarkers.forEach(marker => {
            store.dispatch(removeMarkerRequest({markerId: marker.markerId}));
            store.dispatch(removeFromDrawToolMarkers(marker.markerId));
        });
    };

    const markerShapes = [
        {
            id: 0,
            icon: faThumbtack
        },
        {
            id: 1,
            icon: faCommentAlt
        },
        {
            id: 2,
            icon: faMapMarkerAlt
        },
        {
            id: 3,
            icon: faMapPin
        },
        {
            id: 4,
            icon: faFlag
        },
        {
            id: 5,
            icon: faCircle
        },
        {
            id: 6,
            icon: faArrowDown
        },
        {
            id: 7,
            icon: faTimes
        }
    ];

    const drawingToolsData = [
        {
            id : 'sv-measure-linestring',
            name : strings.tooltips.drawingTools.linestring,
            style : {
                icon : svLinestring
            },
            type : 'LineString'
        },
        {
            id : 'sv-measure-polygon',
            name : strings.tooltips.drawingTools.polygon,
            style : {
                icon : svPolygon
                },
            type : 'Polygon'
        },
        {
            id : 'sv-measure-square',
            name : strings.tooltips.drawingTools.square,
            style : {
                icon : svSquare
            },
            type : 'Square'
        },
        {
            id : 'sv-measure-box',
            name : strings.tooltips.drawingTools.box,
            style : {
                icon : svRectangle
            },
            type : 'Box'
        },
        {
            id : 'sv-measure-circle',
            name : strings.tooltips.drawingTools.circle,
            style : {
                icon : svCircle
            },
            type : 'Circle'
        },
        {
            id: 'sv-add-marker',
            name: strings.tooltips.drawingTools.marker,
            style: {
                icon: faMapMarkerAlt
            },
        },
        {
            id : 'sv-erase',
            name : strings.tooltips.drawingTools.erase,
            style : {
                icon : faEraser
            },
        },
    ];

    const handleAddGeometry = () => {

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
                {drawingToolsData.map(tool => {
                    return (
                            tool.id !== "sv-erase" && tool.id !== "sv-add-marker" ?
                            <CircleButton
                                key={tool.id}
                                text={tool.name && tool.name}
                                toggleState={tool.name && tool.name === activeTool ? true : false}
                                clickAction={() => startStopTool(tool)}
                                type="drawingTool"
                                tooltipDirection={"right"}
                            >
                                <StyledIcon src={tool.style && tool.style.icon}/>
                            </CircleButton> : tool.id === "sv-erase" ?
                            <CircleButton
                                key={tool.id}
                                icon={faEraser}
                                text={tool.name}
                                clickAction={eraseDrawing}
                                type="drawingTool"
                                color={theme.colors.secondaryColor7}
                                tooltipDirection={"right"}
                            >
                            </CircleButton> : tool.id === "sv-add-marker" &&
                            <div>
                                {tool.name && tool.name === activeTool &&
                                <StyledOptionsWrapper>
                                    <StyledOptionButtonsWrapper>
                                    {markerShapes.map(shape => {
                                        const isSelected = shape.id === selectedMarker;
                                        return (shape.id !== 7 ?
                                        <StyledOptionsButton style={{background: isSelected && theme.colors.buttonActive}} onClick={() => store.dispatch(setSelectedMarker(shape.id))}>
                                            <StyledOptionsIcon style={{transform: shape.icon === faFlag && "scale(-1,1)", color: isSelected && theme.colors.mainWhite + '!important'}} icon={shape.icon} />
                                        </StyledOptionsButton> :
                                        <StyledOptionsButton style={{background: isSelected ? 'rgb(161 51 0)' : theme.colors.secondaryColor7}} onClick={() => store.dispatch(setSelectedMarker(shape.id))}>
                                        <StyledOptionsIcon icon={shape.icon} />
                                    </StyledOptionsButton>
                                )})}
                                    </StyledOptionButtonsWrapper>
                                    <StyledLabelWrapper>
                                    <StyledLabelInput onKeyUp={(event) => handleKeyUp(event)} value={label} onChange={(event) => {handleChange(event)}} placeholder={strings.tooltips.drawingTools.labelPlaceholder} type="text"></StyledLabelInput>
                                    <StyledClearLabelButton onClick={() => setLabel('')}>
                                        <FontAwesomeIcon style={{color: 'rgba(0, 0, 0, 0.5)'}} icon={faTimes} />
                                    </StyledClearLabelButton>
                                    </StyledLabelWrapper>
                                </StyledOptionsWrapper>
                                }
                                <CircleButton type="drawingTool" showOptions={true} key={tool.id} icon={faMapMarkerAlt} text={tool.name} clickAction={() => addMarker(tool)}
                                toggleState={tool.name && tool.name === activeTool ? true : false} tooltipDirection="right" />
                            </div>
                    )
                })}
                <CircleButton
                    disabled={!geoJsonArray.length && drawToolMarkers.length <= 0}
                    text={strings.savedContent.saveGeometry.saveGeometry}
                    tooltipDirection={'right'}
                    clickAction={handleAddGeometry}
                    icon={faCloudUploadAlt}
                    color={theme.colors.secondaryColor2}
                />
            </StyledTools>
    );
 };

 export default DrawingTools;