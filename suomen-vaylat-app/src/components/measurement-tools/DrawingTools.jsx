import { useState } from 'react';
import {
    faBox, faCircle, faDrawPolygon,
    faEraser, faRuler,
    faSquare
} from '@fortawesome/free-solid-svg-icons';

import svCircle from '../../theme/icons/drawtools_circle.svg';
import svSquare from '../../theme/icons/drawtools_square.svg';
import svRectangle from '../../theme/icons/drawtools_rectangle.svg';
import svPolygon from '../../theme/icons/drawtools_polygon.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';
import strings from '../../translations';

const StyledTools = styled.div`
    position: absolute;
    left: 50%;
    bottom: 0px;
    transform: translateX(-50%);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    background-color: ${props => props.color};
    margin: 1rem;
    transition: all .2s ease-in-out;
`;

const StyledDrawingToolContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin: .5rem;
`;

const StyledDrawingTool = styled.div`
    z-index: 100;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${(props => props.active? props.theme.colors.maincolorselected1 : props.theme.colors.maincolor1)};
    box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 3px 6px;
    border-radius: 50%;
    svg {
        color: ${props => props.theme.colors.mainWhite};
        font-size: 20px;
    };
`;

const StyledErase = styled.div`
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: grey;
    margin-top: 1rem;
    border-radius: 50%;
    svg {
        color: ${props => props.theme.colors.mainWhite};
        font-size: 15px;
    }
`;

const StyledIcon = styled.img`
    height: 1.5rem;
    width: auto;
`;

const drawinToolsData = [
    {
        'name' : 'sv-measure-polygon',
        'style' : {
            'icon' : svPolygon
            },
        'type' : 'Polygon'
    },
    {
        'name' : 'sv-measure-linestring',
        'style' : {
            'icon' : faRuler
        },
        'type' : 'LineString'
    },
    {
        'name' : 'sv-measure-square',
        'style' : {
            'icon' : svSquare
        },
        'type' : 'Square'
    },
    {
        'name' : 'sv-measure-circle',
        'style' : {
            'icon' : svCircle
        },
        'type' : 'Circle'
    },
    {
        'name' : 'sv-measure-box',
        'style' : {
            'icon' : svRectangle
        },
        'type' : 'Box'
    }
];

export const DrawingTools = () => {

    const [activeTool, setActiveTool] = useState('');

    const channel = useSelector(state => state.rpc.channel);

    const startStopTool = (tool) => {
        if (tool.name !== activeTool) {
            var data = [tool.name, tool.type, { showMeasureOnMap: true }];
            channel.postRequest('DrawTools.StartDrawingRequest', data);
            setActiveTool(tool.name);
        } else {
            var clearData = [activeTool];
            channel.postRequest('DrawTools.StopDrawingRequest', clearData);
            setActiveTool('');
        }
    };

    const eraseDrawing = (tool) => {
        var clearData = [tool.name, true];
        channel.postRequest('DrawTools.StopDrawingRequest', clearData);
        setActiveTool('');
    };

    return (
        <>
            <ReactTooltip id='circle' place='top' type='dark' effect='float'>
                <span>{strings.tooltips.drawingtools.circle}</span>
            </ReactTooltip>

            <ReactTooltip id='box' place='top' type='dark' effect='float'>
                <span>{strings.tooltips.drawingtools.box}</span>
            </ReactTooltip>

            <ReactTooltip id='square' place='top' type='dark' effect='float'>
                <span>{strings.tooltips.drawingtools.square}</span>
            </ReactTooltip>

            <ReactTooltip id='polygon' place='top' type='dark' effect='float'>
                <span>{strings.tooltips.drawingtools.polygon}</span>
            </ReactTooltip>

            <ReactTooltip id='linestring' place='top' type='dark' effect='float'>
                <span>{strings.tooltips.drawingtools.linestring}</span>
            </ReactTooltip>

            <ReactTooltip id='erase' place='top' type='dark' effect='float'>
                <span>{strings.tooltips.drawingtools.erase}</span>
            </ReactTooltip>

            <StyledTools>
                {drawinToolsData.map((tool, index) => {
                    return (
                        <StyledDrawingToolContainer
                            key={tool.name}
                        >
                            <StyledDrawingTool
                                data-tip data-for={tool.type.toLowerCase()}
                                active={tool.name === activeTool ? true : false}
                                onClick={() => startStopTool(tool)}
                            >
                                <StyledIcon src={tool.style.icon}/>
                            </StyledDrawingTool>
                            <StyledErase
                                data-tip data-for='erase'
                                color={tool.style.color}
                                onClick={() => eraseDrawing(tool)}
                            >
                                <FontAwesomeIcon
                                    icon={faEraser}
                                />
                            </StyledErase>
                        </StyledDrawingToolContainer>
                    )
                })}
            </StyledTools>
        </>
    );
 };

 export default DrawingTools;