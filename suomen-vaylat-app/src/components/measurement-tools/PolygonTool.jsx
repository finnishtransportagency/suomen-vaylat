import { useState, useContext } from 'react';
import { useAppSelector } from '../../state/hooks';
import styled from 'styled-components';
import { device } from '../../device';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactReduxContext, useSelector } from 'react-redux';
import {
    faDrawPolygon,
    faAngleUp,
    faCar,
    faHardHat,
    faShip,
    faLandmark,
    faTrain,
    faRoad,
    faMap
} from '@fortawesome/free-solid-svg-icons';

import LanguageSelector from '../language-selector/LanguageSelector';

const StyledMasterGroupHeaderIcon = styled.div`
    display: flex;
    position: absolute;
    bottom: 1.5rem;
    margin: 1rem;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.color[0]};
    width: 40px;
    height: 40px;
    border-radius: 50%;
    svg {
        font-size: 16px;
        color: #fff;
    }
`;

const themeStyles = {
    icon: faDrawPolygon,
    color: [
        "red"
    ]
}

export const PolygonTool = () => {
    const [isDrawing, setIsDrawing] = useState(false);
    const channel = useSelector(state => state.rpc.channel)
    const startStopPolygonTool = () => {
        if (!isDrawing) {
            var clearData = ['sv-measure-polygon', true];
            channel.postRequest('DrawTools.StopDrawingRequest', clearData);

            var data = ['sv-measure-polygon', 'Polygon', { showMeasureOnMap: true }];
            channel.postRequest('DrawTools.StartDrawingRequest', data);
        } else {
            var data = ['sv-measure-polygon'];
            channel.postRequest('DrawTools.StopDrawingRequest', data);
        }
        setIsDrawing(!isDrawing);
    }
    return (
        <div>
            <StyledMasterGroupHeaderIcon
                color={themeStyles.color}
                onClick={() => startStopPolygonTool()}
            >
                <FontAwesomeIcon
                    icon={themeStyles.icon}
                />
            </StyledMasterGroupHeaderIcon>
        </div>
    );
 }

 export default PolygonTool;