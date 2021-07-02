import React, { useState } from 'react';

import styled from 'styled-components';

import ZoomBar from './ZoomBar';

import { useAppSelector } from '../../state/hooks';

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

const ZoomMenu = () => {
    const [hoveringIndex, setHoveringIndex] = useState(null);

    const zoomLevelsLayers = useAppSelector((state) => state.rpc.zoomLevelsLayers);
    const currentZoomLevel = useAppSelector((state) => state.rpc.currentZoomLevel);
    const allLayers = useAppSelector((state) => state.rpc.allLayers);

    return (
    <StyledZoomMenu>
        <ZoomBar
            setHoveringIndex={setHoveringIndex}
            zoomLevelsLayers={zoomLevelsLayers}
            hoveringIndex={hoveringIndex}
            currentZoomLevel={currentZoomLevel}
            allLayers={allLayers}
        />
    </StyledZoomMenu>
    );
};

export default ZoomMenu;