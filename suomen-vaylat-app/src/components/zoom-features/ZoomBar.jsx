import { useContext } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { faList, faSearchMinus, faSearchPlus, faSearchLocation } from '@fortawesome/free-solid-svg-icons';

import { useAppSelector } from '../../state/hooks';
import { ReactReduxContext } from 'react-redux';
import { setZoomIn, setZoomOut } from '../../state/slices/rpcSlice';
import strings from '../../translations';
import CircleButton from '../circle-button/CircleButton';
import ZoomBarCircle from './ZoomBarCircle';

import { Legend } from '../legend/Legend';

const StyledZoomBarContainer = styled.div`
    z-index: 1;
    position: relative;
    pointer-events: none;
    cursor: pointer;
    display: flex;
`;

const StyledZoomBarContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const StyledZoomBarZoomFeatures = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    &::before {
        z-index: -1;
        content: '';
        position: absolute;
        top: 0px;
        left: 50%;
        transform: translateX(-50%);
        width: 4px;
        height: 100%;
        background-color: ${props => props.theme.colors.mainColor1};
    }
`;

const StyledZoombarCircles = styled(motion.div)`
    overflow: hidden;
    display: flex;
    flex-direction: column-reverse;
`;

const listVariants = {
    visible: {
        height: 'auto'
    },
    hidden: {
        height: 2
    }
};

const ZoomBar = ({
    zoomLevelsLayers,
    currentZoomLevel,
    isExpanded,
    setIsExpanded,
    setHoveringIndex
}) => {
    const { store } = useContext(ReactReduxContext);
    const rpc = useAppSelector((state) => state.rpc);

    return (
            <StyledZoomBarContainer>
                <Legend
                    currentZoomLevel={rpc.currentZoomLevel}
                    selectedLayers={rpc.selectedLayers}
                    zoomLevelsLayers={rpc.zoomLevelsLayers}
                    isExpanded={isExpanded}
                    setIsExpanded={setIsExpanded}
                />
                <StyledZoomBarContent>
                    <CircleButton
                        icon={faList}
                        text={strings.tooltips.legendButton}
                        toggleState={isExpanded}
                        clickAction={() => setIsExpanded(!isExpanded)}
                        tooltipDirection={"left"}
                    />
                    <StyledZoomBarZoomFeatures>
                        <CircleButton
                            icon={faSearchPlus}
                            text={strings.tooltips.zoomIn}
                            disabled={currentZoomLevel === Object.values(zoomLevelsLayers).length - 1}
                            clickAction={() => store.dispatch(setZoomIn())}
                            tooltipDirection={"left"}
                        />
                        <StyledZoombarCircles
                            initial='hidden'
                            animate={isExpanded ? 'visible' : 'hidden'}
                            variants={listVariants}
                            transition={{
                                duration: 0.5,
                                type: 'tween'
                            }}
                        >
                        {Object.values(zoomLevelsLayers).map((layer, index) => {
                            return <ZoomBarCircle
                                key={index}
                                index={index}
                                layer={layer}
                                zoomLevel={currentZoomLevel}
                                setHoveringIndex={setHoveringIndex}
                            />
                        })}
                        </StyledZoombarCircles>
                        <CircleButton
                            icon={faSearchMinus}
                            text={strings.tooltips.zoomOut}
                            disabled={currentZoomLevel === 0}
                            clickAction={() => store.dispatch(setZoomOut())}
                            tooltipDirection={"left"}
                        />
                    </StyledZoomBarZoomFeatures>
                    <CircleButton
                        icon={faSearchLocation}
                        text={strings.tooltips.myLocButton}
                        disabled={currentZoomLevel === Object.values(zoomLevelsLayers).length - 1}
                        clickAction={() => rpc.channel.postRequest('MyLocationPlugin.GetUserLocationRequest')}
                        tooltipDirection={"left"}
                    />
                </StyledZoomBarContent>
               
            </StyledZoomBarContainer>
    );
};

export default ZoomBar;

