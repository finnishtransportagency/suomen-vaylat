import { useContext } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ReactReduxContext } from 'react-redux';

import { faEraser } from '@fortawesome/free-solid-svg-icons';

import svCircle from '../../theme/icons/drawtools_circle.svg';
import svSquare from '../../theme/icons/drawtools_square.svg';
import svRectangle from '../../theme/icons/drawtools_rectangle.svg';
import svPolygon from '../../theme/icons/drawtools_polygon.svg';
import svLinestring from '../../theme/icons/drawtools_linestring.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { isMobile } from '../../theme/theme';

import strings from '../../translations';
import { setActiveTool } from '../../state/slices/uiSlice';

const listVariants = {
    visible: {
        height: "auto",
        opacity: 1
    },
    hidden: {
        height: 0,
        opacity: 0
    },
};

const StyledTools = styled(motion.div)`
    display: flex;
    align-items: center;
    flex-direction: row;
    background-color: ${props => props.color};
    flex-direction: column;
`;

const StyledDrawingTool = styled.div`
    pointer-events: auto;
    cursor: pointer;
    z-index: 100;
    width: 44px;
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${(props => props.active? props.theme.colors.mainColorselected1 : props.theme.colors.mainColor1)};
    box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 3px 6px;
    border-radius: 50%;
    margin-top: 8px;
    svg {
        color: ${props => props.theme.colors.mainWhite};
        //font-size: 18px;
    };
    @media ${props => props.theme.device.mobileL} {
        width: 38px;
        min-height: 38px;
    };
`;

const StyledErase = styled.div`
    pointer-events: auto;
    cursor: pointer;
    z-index: 100;
    width: 44px;
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${props => props.theme.colors.secondaryColor7};
    box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 3px 6px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-top: 8px;
    margin-bottom: 2px;
    svg {
        color: ${props => props.theme.colors.mainWhite};
        font-size: 20px;
    };
    @media ${props => props.theme.device.mobileL} {
        width: 38px;
        min-height: 38px;
    };
`;

const StyledIcon = styled.img`
    width: 1.3rem;
`;

const drawinToolsData = [
    {
        'name' : 'sv-measure-linestring',
        'style' : {
            'icon' : svLinestring
        },
        'type' : 'LineString'
    },
    {
        'name' : 'sv-measure-polygon',
        'style' : {
            'icon' : svPolygon
            },
        'type' : 'Polygon'
    },
    {
        'name' : 'sv-measure-square',
        'style' : {
            'icon' : svSquare
        },
        'type' : 'Square'
    },
    {
        'name' : 'sv-measure-box',
        'style' : {
            'icon' : svRectangle
        },
        'type' : 'Box'
    },
    {
        'name' : 'sv-measure-circle',
        'style' : {
            'icon' : svCircle
        },
        'type' : 'Circle'
    },
];

export const DrawingTools = ({isOpen}) => {
    const { store } = useContext(ReactReduxContext);
    const { channel } = useSelector(state => state.rpc);
    const { activeTool } = useSelector(state => state.ui);

    const startStopTool = (tool) => {
        if (tool.name !== activeTool) {
            var data = [tool.name, tool.type, { showMeasureOnMap: true }];
            channel.postRequest('DrawTools.StartDrawingRequest', data);
            store.dispatch(setActiveTool(tool.name));
        } else {
            channel.postRequest('DrawTools.StopDrawingRequest', [activeTool]);
            store.dispatch(setActiveTool(''));
        }
    };

    const eraseDrawing = () => {
        // remove geometries off the map
        channel.postRequest('DrawTools.StopDrawingRequest', [true]);
        // stop the drawing tool
        channel.postRequest('DrawTools.StopDrawingRequest', [activeTool]);
        store.dispatch(setActiveTool(''));
    };

    return (
        <>
            <ReactTooltip disable={isMobile} id='circle' place='top' type='dark' effect='float'>
                <span>{strings.tooltips.drawingtools.circle}</span>
            </ReactTooltip>

            <ReactTooltip disable={isMobile} id='box' place='top' type='dark' effect='float'>
                <span>{strings.tooltips.drawingtools.box}</span>
            </ReactTooltip>

            <ReactTooltip disable={isMobile} id='square' place='top' type='dark' effect='float'>
                <span>{strings.tooltips.drawingtools.square}</span>
            </ReactTooltip>

            <ReactTooltip disable={isMobile} id='polygon' place='top' type='dark' effect='float'>
                <span>{strings.tooltips.drawingtools.polygon}</span>
            </ReactTooltip>

            <ReactTooltip disable={isMobile} id='linestring' place='top' type='dark' effect='float'>
                <span>{strings.tooltips.drawingtools.linestring}</span>
            </ReactTooltip>

            <ReactTooltip disable={isMobile} id='erase' place='top' type='dark' effect='float'>
                <span>{strings.tooltips.drawingtools.erase}</span>
            </ReactTooltip>

            <StyledTools
                isOpen={isOpen}
                initial="hidden"
                animate={isOpen ? "visible" : "hidden"}
                variants={listVariants}
            >
                {drawinToolsData.map((tool, index) => {
                    return (
                            <StyledDrawingTool
                                key={tool.name}
                                data-tip data-for={tool.type.toLowerCase()}
                                active={tool.name === activeTool ? true : false}
                                onClick={() => startStopTool(tool)}
                            >
                                <StyledIcon src={tool.style.icon}/>
                            </StyledDrawingTool>
                    )
                })}
                <StyledErase
                    data-tip data-for='erase'
                    onClick={() => eraseDrawing()}
                >
                    <FontAwesomeIcon
                        icon={faEraser}
                    />
                </StyledErase>
            </StyledTools>
        </>
    );
 };

 export default DrawingTools;