import { useState, useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import styled from 'styled-components';
import { useAppSelector } from '../../state/hooks';
import ZoomBar from './ZoomBar';

import { setIsLegendOpen } from '../../state/slices/uiSlice';

const StyledContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: end;
`;

const ZoomMenu = () => {

    const { store } = useContext(ReactReduxContext);

    const [hoveringIndex, setHoveringIndex] = useState(null);

    const rpc = useAppSelector((state) => state.rpc);

    const isLegendOpen = useAppSelector((state) => state.ui.isLegendOpen);

    const handleLegendState = () => {
        store.dispatch(setIsLegendOpen(!isLegendOpen));
    };

    return (
        <>
            <StyledContainer>
                <ZoomBar
                    setHoveringIndex={setHoveringIndex}
                    zoomLevelsLayers={rpc.zoomLevelsLayers}
                    hoveringIndex={hoveringIndex}
                    isExpanded={isLegendOpen}
                    setIsExpanded={handleLegendState}
                    currentZoomLevel={rpc.currentZoomLevel}
                    allLayers={rpc.allLayers}
                    selectedLayers={rpc.selectedLayers}
                />
            </StyledContainer>
        </>
    );
};

export default ZoomMenu;
