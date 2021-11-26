import React, { useState } from 'react';
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

const ZoomMenu = () => {
    const [hoveringIndex, setHoveringIndex] = useState(null);

    const rpc = useAppSelector((state) => state.rpc);

    return (
        <>
            <ReactTooltip disable={isMobile} id='myLoc' place="top" type="dark" effect="float">
                <span>{strings.tooltips.myLocButton}</span>
            </ReactTooltip>

            <StyledZoomMenu>
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