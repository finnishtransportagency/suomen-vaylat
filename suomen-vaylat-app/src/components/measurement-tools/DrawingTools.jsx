import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ReactReduxContext } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEraser, faInfoCircle, faMapMarkerAlt, faMapPin, faFlag, faCircle, faArrowDown, faCommentAlt, faThumbtack, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import svCircle from '../../theme/icons/drawtools_circle.svg';
import svSquare from '../../theme/icons/drawtools_square.svg';
import svRectangle from '../../theme/icons/drawtools_rectangle.svg';
import svPolygon from '../../theme/icons/drawtools_polygon.svg';
import svLinestring from '../../theme/icons/drawtools_linestring.svg';

import { useSelector } from 'react-redux';

import strings from '../../translations';
import { setActiveTool, setHasToastBeenShown, setSelectedMarker } from '../../state/slices/uiSlice';
import { removeMarkerRequest } from '../../state/slices/rpcSlice';

import { theme } from '../../theme/theme';

import CircleButton from '../circle-button/CircleButton';
import DrawingToast from '../toasts/DrawingToast';
import { toast } from 'react-toastify';
import { ThemeProvider } from 'react-bootstrap';

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
    left: 0;
    bottom: 5px;
    background-color: ${props => props.theme.colors.mainWhite};
    z-index: -1;
    display: grid;
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
        margin-left: 50px;
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
`;

/*
const StyledOptionsWrapper = styled(motion.div)`
    position: absolute;
    left: 0;
    background-color: ${props => props.theme.colors.mainWhite};
    z-index: -1;
    display: flex;
    justify-content: center;
    align-items: center;
    white-space: nowrap;
    padding: 20px;
    padding-left: calc(100% + 5px);
    padding-right: 10px;
    overflow: visible;
    border-radius: 24px;
    color: ${props => props.theme.colors.mainColor1};
    font-weight: 600;
    box-shadow: 0px 2px 4px #0000004D;
    height: 44px;
    gap: 2px;
    svg {
        color: ${props => props.theme.colors.mainWhite};
    };
    @media ${props => props.theme.device.mobileL} {
        height: 35px;
        gap: 1px;
        padding-left: calc(100% + 3px);
        padding-right: 5px;
        svg {
            
        };
        button {
            height: 33px;
            width: 32px;
        }
    };
`; */

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
    const { activeTool, isDrawingToolsOpen, hasToastBeenShown, selectedMarker, drawToolMarkers} = useSelector(state => state.ui);
    const [ showToast, setShowToast] = useState(JSON.parse(localStorage.getItem("showToast")));
    const [markerLabel, setMarkerLabel] = useState('');


    const handleClick = () => {
        setShowToast(false);
        toast.dismiss("drawToast");
    };

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

    const addMarker = (tool) => {
        if(tool.name !== activeTool) {
            store.dispatch(setActiveTool(tool.name));
        }
        else {
            store.dispatch(setActiveTool(null));
        }
    }

    const eraseDrawing = () => {
        // remove geometries off the map
        channel && channel.postRequest('DrawTools.StopDrawingRequest', [true]);
        // stop the drawing tool
        channel && channel.postRequest('DrawTools.StopDrawingRequest', [activeTool]);
        store.dispatch(setActiveTool(null));
        // remove all markers made with drawing tools
        drawToolMarkers.forEach(marker => {
            store.dispatch(removeMarkerRequest({markerId: marker}));
        });
    };

    const optionValues = [
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
            icon: faTrashAlt
        }
    ]

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
            id: 'sv-add-marker',
            name: strings.tooltips.measuringTools.marker,
            style: {
                icon: faMapMarkerAlt
            },
        },
        {
            id : 'sv-erase',
            name : strings.tooltips.measuringTools.erase,
            style : {
                icon : faEraser
            },
        },
    ];

    console.log("markerLabel = ", markerLabel);

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
                                clickAction={() => eraseDrawing()}
                                type="drawingTool"
                                color="secondaryColor7"
                                tooltipDirection={"right"}
                            >
                            </CircleButton> : tool.id === "sv-add-marker" &&
                            <div>
                                {tool.name && tool.name === activeTool &&
                                <StyledOptionsWrapper>
                                    <StyledOptionButtonsWrapper>
                                    {optionValues.map(option => {
                                        const isSelected = option.id === selectedMarker;
                                        return (option.id !== 7 ?
                                        <StyledOptionsButton style={{background: isSelected && theme.colors.buttonActive}} onClick={() => store.dispatch(setSelectedMarker(option.id))}>
                                            <StyledOptionsIcon style={{transform: option.icon === faFlag && "scale(-1,1)", color: isSelected && theme.colors.mainWhite + '!important'}} icon={option.icon} />
                                        </StyledOptionsButton> :
                                        <StyledOptionsButton style={{background: isSelected ? theme.colors.secondaryColor6 : theme.colors.secondaryColor7}} onClick={() => store.dispatch(setSelectedMarker(option.id))}>
                                        <StyledOptionsIcon icon={option.icon} />
                                    </StyledOptionsButton>
                                )})}
                                    </StyledOptionButtonsWrapper>
                                    <input value={markerLabel} onChange={(event) => setMarkerLabel(event.target.value)} style={{borderRadius: "5%", padding: "5px", border: "1px solid " + theme.colors.mainColor1}} placeholder="Markkerin nimi" type="text"></input>
                                </StyledOptionsWrapper>
                                }
                                <CircleButton type="drawingTool" showOptions={true} key={tool.id} icon={faMapMarkerAlt} text={tool.name} clickAction={() => addMarker(tool)}
                                toggleState={tool.name && tool.name === activeTool ? true : false} tooltipDirection="right" />
                            </div>
                    )
                })}
            </StyledTools>
    );
 };

 export default DrawingTools;