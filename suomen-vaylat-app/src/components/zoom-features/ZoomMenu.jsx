import { useState } from 'react';

import styled from 'styled-components';
import ZoomBar from './ZoomBar';
import { useAppSelector } from '../../state/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearchLocation } from '@fortawesome/free-solid-svg-icons';
import strings from '../../translations';
import ReactTooltip from "react-tooltip";

const StyledZoomMenu = styled.div`
    z-index: 2;
    position: fixed;
    width: 100%;
    max-width: 250px;
    height: 100vh;
    padding: 50px;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-direction: column;
    pointer-events: none;
`;

const StyledMyLocationButton = styled.div`
    transition: all 0.1s ease-out;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    margin-bottom: 50px;
    width: 45px;
    height: 45px;
    background-color: ${props => props.theme.colors.maincolor1};
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    svg {
        color: white;
        font-size: 23px;
    };
    &:hover {
        background-color: ${props => props.theme.colors.maincolor2};
    };
    pointer-events: auto;
    cursor: pointer;
`;

const ZoomMenu = () => {
    const [hoveringIndex, setHoveringIndex] = useState(null);

    const rpc = useAppSelector((state) => state.rpc);

    return (
        <>
            <ReactTooltip id='myLoc' place="top" type="dark" effect="float">
                <span>{strings.tooltips.myLocButton}</span>
            </ReactTooltip>

            <StyledZoomMenu>
                <StyledMyLocationButton
                    data-tip data-for='myLoc'
                    onClick={() => {
                        rpc.channel.postRequest('MyLocationPlugin.GetUserLocationRequest');
                    }}
                >
                    <FontAwesomeIcon
                        icon={faSearchLocation}
                    />
                </StyledMyLocationButton>
                <ZoomBar
                    setHoveringIndex={setHoveringIndex}
                    zoomLevelsLayers={rpc.zoomLevelsLayers}
                    hoveringIndex={hoveringIndex}
                    currentZoomLevel={rpc.currentZoomLevel}
                    allLayers={rpc.allLayers}
                    selectedLayers={rpc.selectedLayers}
                />
            </StyledZoomMenu>
        </>
    );
};

export default ZoomMenu;