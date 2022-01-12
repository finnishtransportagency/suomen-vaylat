import React, { useState } from 'react';
import ReactTooltip from 'react-tooltip';
import { isMobile } from '../../theme/theme';
import styled from 'styled-components';
import { useAppSelector } from '../../state/hooks';
import strings from '../../translations';
import ZoomBar from './ZoomBar';

const StyledContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: end;
`;

const ZoomMenu = () => {
    const [hoveringIndex, setHoveringIndex] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const rpc = useAppSelector((state) => state.rpc);

    return (
        <>
            <ReactTooltip disable={isMobile} id='myLoc' place='top' type='dark' effect='float'>
                <span>{strings.tooltips.myLocButton}</span>
            </ReactTooltip>
            <StyledContainer>
                <ZoomBar
                    setHoveringIndex={setHoveringIndex}
                    zoomLevelsLayers={rpc.zoomLevelsLayers}
                    hoveringIndex={hoveringIndex}
                    isExpanded={isExpanded}
                    setIsExpanded={setIsExpanded}
                    currentZoomLevel={rpc.currentZoomLevel}
                    allLayers={rpc.allLayers}
                    selectedLayers={rpc.selectedLayers}
                />
            </StyledContainer>
        </>
    );
};

export default ZoomMenu;
