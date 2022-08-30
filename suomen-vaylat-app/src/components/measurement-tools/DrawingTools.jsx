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
import { setActiveTool, setHasToastBeenShown } from '../../state/slices/uiSlice';

import { theme } from '../../theme/theme';

import CircleButton from '../circle-button/CircleButton';
import DrawingToast from '../toasts/DrawingToast';
import { toast } from 'react-toastify';

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
    const { activeTool, isDrawingToolsOpen, hasToastBeenShown} = useSelector(state => state.ui);
    const [ showToast, setShowToast] = useState(JSON.parse(localStorage.getItem("showToast")));

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

    const eraseDrawing = () => {
        // stop the drawing tool
        channel && channel.postRequest('DrawTools.StopDrawingRequest', [activeTool]);
        // remove geometries off the map
        channel && channel.postRequest('DrawTools.StopDrawingRequest', [true, true]);
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
            </StyledTools>
    );
 };

 export default DrawingTools;