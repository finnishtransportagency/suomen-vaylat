import { useState, useContext } from 'react';
import { useAppSelector } from '../../state/hooks';
import styled from 'styled-components';
import { device } from '../../device';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactReduxContext, useSelector } from 'react-redux';
import {
    faRuler,
    faSquare,
    faCircle,
    faBox,
    faDrawPolygon,
    faEraser
} from '@fortawesome/free-solid-svg-icons';

import LanguageSelector from '../language-selector/LanguageSelector';

const StyledDrawingTool = styled.div`
    z-index: 9999;
    display: flex;
    background-color: ${props => props.color};
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    svg {
        font-size: 20px;
        color: #fff;
    }
`;

const StyledErase = styled.div`
    display: flex;
    margin-top: 1rem;
    background-color: grey;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    svg {
        font-size: 15px;
        color: #fff;
    }
`;

const StyledDrawingToolContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`;

const StyledTools = styled.div`
    display: flex;
    justify-content: space-between;
    position: absolute;
    bottom: 1.5rem;
    margin: 1rem;
    align-items: center;
    flex-direction: row;
    background-color: ${props => props.color};
    width: 80%;
`;

const drawinToolsData = [
    {
        "name" : "sv-measure-polygon",
        "style" : {
            "color" : "red",
            "icon" : faDrawPolygon
            },
        "type" : "Polygon"
    },
    {
        "name" : "sv-measure-linestring",
        "style" : {
            "color" : "blue",
            "icon" : faRuler
        },
        "type" : "LineString"
    },
    {
        "name" : "sv-measure-square",
        "style" : {
            "color" : "green",
            "icon" : faSquare
        },
        "type" : "Square"
    },
    {
        "name" : "sv-measure-circle",
        "style" : {
            "color" : "orange",
            "icon" : faCircle
        },
        "type" : "Circle"
    },
    {
        "name" : "sv-measure-box",
        "style" : {
            "color" : "purple",
            "icon" : faBox
        },
        "type" : "Box"
    }
];

export const DrawingTools = () => {
    const [activeTool, setActiveTool] = useState("");
    const channel = useSelector(state => state.rpc.channel)
    const startStopTool = (tool) => {
        if (tool.name != activeTool) {
            var data = [tool.name, tool.type, { showMeasureOnMap: true }];
            channel.postRequest('DrawTools.StartDrawingRequest', data);
            setActiveTool(tool.name);
        } else {
            var clearData = [activeTool];
            channel.postRequest('DrawTools.StopDrawingRequest', clearData);
            setActiveTool("");
        }
    }

    const eraseDrawing = (tool) => {
        var clearData = [tool.name, true];
        channel.postRequest('DrawTools.StopDrawingRequest', clearData);
    }
    return (
        <StyledTools>
            {drawinToolsData.map((tool) => {
                return (
                    <StyledDrawingToolContainer>
                        <StyledDrawingTool
                            color={tool.style.color}
                            onClick={() => startStopTool(tool)}
                        >
                            <FontAwesomeIcon
                                icon={tool.style.icon}
                            />
                        </StyledDrawingTool>
                        <StyledErase
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
    );
 }

 export default DrawingTools;