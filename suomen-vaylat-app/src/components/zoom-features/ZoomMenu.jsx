import { useState } from 'react';
import { faSearchLocation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactTooltip from "react-tooltip";
import { isMobile } from '../../theme/theme';
import styled from 'styled-components';
import { useAppSelector } from '../../state/hooks';
import strings from '../../translations';
import ZoomBar from './ZoomBar';

const StyledZoomMenu = styled.div`
    z-index: 2;
    position: fixed;
    right: 0;
    bottom: 0;
    width: 100%;
    max-width: 250px;
    height: 100vh;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-direction: column;
    pointer-events: none;
    padding: 50px;
`;

const StyledMyLocationButton = styled.div`
    width: 45px;
    height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.1s ease-out;
    background-color: ${props => props.theme.colors.mainColor1};
    margin-bottom: 50px;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    border-radius: 50%;
    svg {
        color: ${props => props.theme.colors.mainWhite};
        font-size: 23px;
    };
    &:hover {
        background-color: ${props => props.theme.colors.mainColor2};
    };
    pointer-events: auto;
    cursor: pointer;
`;

const ZoomMenu = () => {
    const [hoveringIndex, setHoveringIndex] = useState(null);

    const rpc = useAppSelector((state) => state.rpc);

    return (
        <>
            <ReactTooltip disable={isMobile} id='myLoc' place="top" type="dark" effect="float">
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