import { useState, useContext, useEffect } from 'react';
import { ReactReduxContext } from 'react-redux';
import styled from 'styled-components';
import { useAppSelector } from '../../state/hooks';
import ZoomBar from './ZoomBar';

import { setIsLegendOpen, setIsZoomBarOpen } from '../../state/slices/uiSlice';

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

    const { isLegendOpen, isZoomBarOpen } = useAppSelector((state) => state.ui);

    const handleLegendState = () => {
        store.dispatch(setIsLegendOpen(!isLegendOpen));
    };

    const handleZoomBarState = () => {
        store.dispatch(setIsZoomBarOpen(!isZoomBarOpen));
    }

    return (
        <>
            <StyledContainer>
                <ZoomBar
                    isLegendOpen={isLegendOpen}
                    isZoomBarOpen={isZoomBarOpen}
                    setIsZoomBarOpen={handleZoomBarState}
                    setIsLegendOpen={handleLegendState}
                />
            </StyledContainer>
        </>
    );
};

export default ZoomMenu;
