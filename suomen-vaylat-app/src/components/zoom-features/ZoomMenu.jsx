import { useState, useContext, useEffect } from 'react';
import { ReactReduxContext } from 'react-redux';
import styled from 'styled-components';
import { useAppSelector } from '../../state/hooks';
import ZoomBar from './ZoomBar';

import { setIsLegendOpen, setIsZoomBarOpen, setIsBaselayersOpen } from '../../state/slices/uiSlice';

const StyledContainer = styled.div`
    position: fixed;
    right: 5;
    bottom: 10px;
    z-index: 5;
    display: flex;
    justify-content: flex-end;
    align-items: end;
    -webkit-align-items: flex-end;
    width: 100%;

@media (max-width: 600px) {
    width: 100vw;
`;

const ZoomMenu = () => {

    const { store } = useContext(ReactReduxContext);

    const [hoveringIndex, setHoveringIndex] = useState(null);

    const rpc = useAppSelector((state) => state.rpc);

    const { isLegendOpen, isZoomBarOpen, isBaselayersOpen } = useAppSelector((state) => state.ui);

    const handleLegendState = () => {
        store.dispatch(setIsLegendOpen(!isLegendOpen));
        isBaselayersOpen && store.dispatch(setIsBaselayersOpen(false));
    };

    const handleZoomBarState = () => {
        store.dispatch(setIsZoomBarOpen(!isZoomBarOpen));
    }

    const handleBaselayersState = () => {
        store.dispatch(setIsBaselayersOpen(!isBaselayersOpen));
        isLegendOpen && store.dispatch(setIsLegendOpen(false));
        isZoomBarOpen && store.dispatch(setIsZoomBarOpen(false));
    }

    useEffect(() => {
        setHoveringIndex(rpc.currentZoomLevel);
    },[rpc.currentZoomLevel])

    return (
        <>
            <StyledContainer>
                <ZoomBar
                    setHoveringIndex={setHoveringIndex}
                    hoveringIndex={hoveringIndex}
                    currentZoomLevel={rpc.currentZoomLevel}
                    isBaselayersOpen={isBaselayersOpen}
                    isLegendOpen={isLegendOpen}
                    isZoomBarOpen={isZoomBarOpen}
                    setIsZoomBarOpen={handleZoomBarState}
                    setIsLegendOpen={handleLegendState}
                    setIsBaselayersOpen={handleBaselayersState}
                />
            </StyledContainer>
        </>
    );
};

export default ZoomMenu;
