import React, { useContext, useState } from 'react';

import styled from 'styled-components';

import ZoomBar from './ZoomBar';
//import Dropdown from './Dropdown';

import { useAppSelector } from '../../state/hooks';
import { ReactReduxContext } from 'react-redux';

const StyledZoomMenu = styled.div`
    z-index: 2;
    position: fixed;
    width: 100%;
    max-width: 250px;
    height: 100vh;
    padding: 30px;
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

    const { store } = useContext(ReactReduxContext);
    const zoomLevelsLayers = useAppSelector((state) => state.rpc.zoomLevelsLayers);
    const currentZoomLevel = useAppSelector((state) => state.rpc.currentZoomLevel);

    return (
    <StyledZoomMenu>
        <ZoomBar
            zoomLevelsLayers={zoomLevelsLayers}
            hoveringIndex={hoveringIndex}
            setHoveringIndex={setHoveringIndex}
            currentZoomLevel={currentZoomLevel}
        />
        {/* <Dropdown
            layers={layers}
            hoveringIndex={hoveringIndex}
            setHoveringIndex={setHoveringIndex}
        /> */}
    </StyledZoomMenu>
    );
};

export default ZoomMenu;