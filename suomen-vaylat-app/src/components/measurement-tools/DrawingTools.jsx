import { useContext } from 'react';
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
import styled from 'styled-components';
import strings from '../../translations';
import { setActiveTool } from '../../state/slices/uiSlice';

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
    background-color: ${(props => props.active? props.theme.colors.mainColorselected1 : props.theme.colors.mainColor1)};
    box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 3px 6px;
    border-radius: 50%;
    svg {
        color: ${props => props.theme.colors.mainWhite};
        font-size: 20px;
    };
`;

const StyledErase = styled.div`
    z-index: 100;
    width: 40px;
    height: 40px;
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
    margin-left: .5rem;
    svg {
        color: ${props => props.theme.colors.mainWhite};
        font-size: 20px;
    };
`;

const StyledIcon = styled.img`
    width: 1.5rem;
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

export const DrawingTools = () => {
    const { store } = useContext(ReactReduxContext);
    const { channel } = useSelector(state => state.rpc);
    console.log(channel);
    const { activeTool } = useSelector(state => state.ui);
    console.log(activeTool);

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
                        </StyledDrawingToolContainer>
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