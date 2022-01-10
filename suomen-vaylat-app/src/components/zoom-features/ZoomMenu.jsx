import React, {useContext, useState} from 'react';
import ReactTooltip from 'react-tooltip';
import { isMobile } from '../../theme/theme';
import styled from 'styled-components';
import { useAppSelector } from '../../state/hooks';
import {setLegendOpen} from '../../state/slices/uiSlice'
import strings from '../../translations';
import ZoomBar from './ZoomBar';

import { Legend } from '../legend/Legend';
import {ReactReduxContext} from "react-redux";

const StyledZoomMenu = styled.div`
    position: relative;
    justify-self: end;
    align-self: end;
    display: flex;
    align-items: end;
    pointer-events: none;
`;

const ZoomMenu = () => {
    const [hoveringIndex, setHoveringIndex] = useState(null);

    const { store } = useContext(ReactReduxContext);
    const rpc = useAppSelector((state) => state.rpc);
    const isLegendOpen = useAppSelector((state) => state.ui.isLegendOpen)

    const setLegendPanelOpen = (isExpanded) => {
        store.dispatch(setLegendOpen(isExpanded))
    }

    return (
        <>
            <ReactTooltip disable={isMobile} id='myLoc' place='top' type='dark' effect='float'>
                <span>{strings.tooltips.myLocButton}</span>
            </ReactTooltip>

            <StyledZoomMenu>
                <Legend
                    currentZoomLevel={rpc.currentZoomLevel}
                    selectedLayers={rpc.selectedLayers}
                    zoomLevelsLayers={rpc.zoomLevelsLayers}
                    hoveringIndex={hoveringIndex}
                    isExpanded={isLegendOpen}
                    setIsExpanded={setLegendPanelOpen}
                />

                <ZoomBar
                    setHoveringIndex={setHoveringIndex}
                    zoomLevelsLayers={rpc.zoomLevelsLayers}
                    hoveringIndex={hoveringIndex}
                    isExpanded={isLegendOpen}
                    setIsExpanded={setLegendPanelOpen}
                    currentZoomLevel={rpc.currentZoomLevel}
                    allLayers={rpc.allLayers}
                    selectedLayers={rpc.selectedLayers}
                />
            </StyledZoomMenu>
        </>
    );
};

export default ZoomMenu;
