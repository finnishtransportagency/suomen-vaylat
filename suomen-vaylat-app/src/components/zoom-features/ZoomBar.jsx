import { useContext } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
    faList,
    faSearchMinus,
    faSearchPlus,
    faCrosshairs,
    faMap,
} from '@fortawesome/free-solid-svg-icons';

import { useAppSelector } from '../../state/hooks';
import { ReactReduxContext } from 'react-redux';
import { setZoomTo, setZoomIn, setZoomOut } from '../../state/slices/rpcSlice';
import strings from '../../translations';
import CircleButton from '../circle-button/CircleButton';
import ZoomBarCircle from './ZoomBarCircle';

import { Legend } from '../legend/Legend';
import { BaseLayers } from '../baseLayers/BaseLayers';

const StyledZoomBarContainer = styled.div`
    z-index: 5;
    position: relative;
    pointer-events: none;
    cursor: pointer;
    display: flex;
`;

const StyledZoomBarContent = styled.div`
    z-index: 2;
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
        background-color: ${(props) => props.theme.colors.mainColor1};
    }
`;

const StyledZoomBarSlider = styled.input`
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    -webkit-appearance: slider-vertical;
    width: 100%;
    height: 100%;
    background: #d3d3d3;
    padding-top: 8px;
    padding-bottom: 8px;
    pointer-events: auto;
    cursor: pointer;
    opacity: 0;
`;

const StyledZoombarCircles = styled(motion.div)`
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column-reverse;
    width: 100%;
`;

const listVariants = {
    visible: {
        height: 'auto',
    },
    hidden: {
        height: 2,
    },
};

const ZoomBar = ({
    setHoveringIndex,
    hoveringIndex,
    currentZoomLevel,
    isBaselayersOpen,
    isLegendOpen,
    isZoomBarOpen,
    setIsLegendOpen,
    setIsZoomBarOpen,
    setIsBaselayersOpen
}) => {
    const { store } = useContext(ReactReduxContext);
    const rpc = useAppSelector((state) => state.rpc);
    const zooms = Array.apply(null, {
        length: rpc.zoomRange.max + 1 - rpc.zoomRange.min,
    }).map(function (_, idx) {
        return idx + rpc.zoomRange.min;
    });

    const handleLegendClick = () => {
        if((isZoomBarOpen && isLegendOpen) || (!isZoomBarOpen && !isLegendOpen)) {
            setIsLegendOpen(!isLegendOpen);
            setIsZoomBarOpen(!isZoomBarOpen)
        }
        else if(isZoomBarOpen && !isLegendOpen) setIsZoomBarOpen(false);
        else if(isLegendOpen && !isZoomBarOpen) setIsZoomBarOpen(true);
    };

    return (
        <StyledZoomBarContainer>
            <Legend
                currentZoomLevel={rpc.currentZoomLevel}
                selectedLayers={rpc.selectedLayers}
                isExpanded={isLegendOpen}
                setIsExpanded={setIsLegendOpen}
            />
            <BaseLayers
                selectedLayers={rpc.selectedLayers}
                isExpanded={isBaselayersOpen}
                setIsExpanded={setIsBaselayersOpen}
            />
            <StyledZoomBarContent>
                <CircleButton
                    icon={faList}
                    text={strings.tooltips.legendButton}
                    toggleState={isZoomBarOpen || isLegendOpen}
                    clickAction={() => handleLegendClick()}
                    tooltipDirection={'left'}
                />
                <StyledZoomBarZoomFeatures>
                    <CircleButton
                        icon={faSearchPlus}
                        text={strings.tooltips.zoomIn}
                        disabled={currentZoomLevel === rpc.zoomRange.max}
                        clickAction={() => store.dispatch(setZoomIn())}
                        tooltipDirection={'left'}
                    />
                    <StyledZoombarCircles
                        initial="hidden"
                        animate={isZoomBarOpen ? 'visible' : 'hidden'}
                        variants={listVariants}
                        transition={{
                            duration: 0.5,
                            type: 'tween',
                        }}
                    >
                        {Object.values(zooms).map((zoom, index) => {
                            return (
                                <ZoomBarCircle
                                    key={index}
                                    index={index}
                                    zoomLevel={currentZoomLevel}
                                    hoveringIndex={hoveringIndex}
                                    setHoveringIndex={setHoveringIndex}
                                    isActive={
                                        parseInt(index) ===
                                        parseInt(hoveringIndex)
                                    }
                                />
                            );
                        })}
                        <StyledZoomBarSlider
                            type="range"
                            orient="vertical"
                            max="13"
                            value={hoveringIndex}
                            onChange={(e) => {
                                setHoveringIndex(e.target.value);
                            }}
                            onMouseUp={(e) => {
                                store.dispatch(setZoomTo(e.target.value));
                            }}
                            onTouchEnd={(e) => {
                                store.dispatch(setZoomTo(e.target.value));
                            }}
                        />
                    </StyledZoombarCircles>
                    <CircleButton
                        icon={faSearchMinus}
                        text={strings.tooltips.zoomOut}
                        disabled={currentZoomLevel === rpc.zoomRange.min}
                        clickAction={() => {
                            currentZoomLevel > 0 &&
                                store.dispatch(setZoomOut());
                        }}
                        tooltipDirection={'left'}
                    />
                </StyledZoomBarZoomFeatures>
                <CircleButton
                    icon={faMap}
                    text={strings.tooltips.baseLayersButton}
                    toggleState={isBaselayersOpen}
                    clickAction={() => setIsBaselayersOpen()}
                    tooltipDirection={'left'}
                />
                <CircleButton
                    icon={faCrosshairs}
                    text={strings.tooltips.myLocButton}
                    clickAction={() =>
                        rpc.channel.postRequest(
                            'MyLocationPlugin.GetUserLocationRequest'
                        )
                    }
                    tooltipDirection={'left'}
                />
            </StyledZoomBarContent>
        </StyledZoomBarContainer>
    );
};

export default ZoomBar;
