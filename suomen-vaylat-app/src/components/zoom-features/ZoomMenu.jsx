import { useState } from 'react';
import { motion } from 'framer-motion';
import ReactTooltip from "react-tooltip";
import { isMobile } from '../../theme/theme';
import styled from 'styled-components';
import { useAppSelector } from '../../state/hooks';
import strings from '../../translations';
import ZoomBar from './ZoomBar';

import { Legend } from '../legend/Legend';

const StyledZoomMenu = styled.div`
    position: relative;
    z-index: 2;
    justify-self: end;
    align-self: end;
    display: flex;
    align-items: end;
    pointer-events: none;
`;

const ZoomMenu = () => {
    const [hoveringIndex, setHoveringIndex] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const rpc = useAppSelector((state) => state.rpc);

    return (
        <>
            <ReactTooltip disable={isMobile} id='myLoc' place="top" type="dark" effect="float">
                <span>{strings.tooltips.myLocButton}</span>
            </ReactTooltip>

            <StyledZoomMenu>
                <Legend
                    currentZoomLevel={rpc.currentZoomLevel}
                    selectedLayers={rpc.selectedLayers}
                    zoomLevelsLayers={rpc.zoomLevelsLayers}
                    hoveringIndex={hoveringIndex}
                    isExpanded={isExpanded}
                    setIsExpanded={setIsExpanded}
                />

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
            </StyledZoomMenu>
        </>
    );
};

export default ZoomMenu;