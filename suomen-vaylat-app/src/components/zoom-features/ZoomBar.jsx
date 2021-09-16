import { useContext, useEffect, useState } from "react";
import { ReactReduxContext } from 'react-redux';
import styled, { keyframes } from 'styled-components';

import { setZoomIn, setZoomOut } from '../../state/slices/rpcSlice';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp, faSearchMinus, faSearchPlus, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import ZoomBarCircle from './ZoomBarCircle';
import ZoomBarLayer from './ZoomBarLayer';

const fadeIn = keyframes`
  0% {
      opacity: 0;
   // transform: rotate(0deg);
  }

  100% {
        opacity: 1;
    //transform: rotate(360deg);
  }
`;

const StyledZoomBarContainer = styled.div`
    pointer-events: none;
    cursor: pointer;
    position: relative;
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
`;

const StyledExpandControl = styled.div`
    position: absolute;
    top: -15px;
    right: -60%;
    transform: translateY(-50%);
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    pointer-events: auto;
    transition: all 0.1s ease-in;
    width: 40px;
    height: 40px;
    background-color: ${props => props.theme.colors.maincolor1};
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
        background-color: ${props => props.theme.colors.maincolor2};
    };
    svg {
        font-size: 23px;
        transition: all 0.5s ease-out;
        color: ${props => props.theme.colors.mainWhite};
    };
`;

const StyledZoomBarControlTop = styled.button`
    border: none;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    pointer-events: auto;
    transition: all 0.1s ease-in;
    width: 46px;
    height: 46px;
    background-color: ${props => props.theme.colors.maincolor1};
    margin: 0px 3px 3px 3px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
   svg {
        color: ${props => props.theme.colors.mainWhite};
        font-size: 20px;
    };
    &:hover {
        background-color: ${props => props.theme.colors.maincolor2};
    }
`;

const StyledZoomBarControlBottom = styled.button`
    border: none;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    pointer-events: auto;
    transition: all 0.3s ease-out;
    cursor: pointer;
    width: 46px;
    height: 46px;
    background-color: ${props => props.theme.colors.maincolor1};
    margin: 3px 3px 0px 3px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
        color: ${props => props.theme.colors.mainWhite};
        font-size: 20px;
    };
    &:hover {
        background-color: ${props => props.theme.colors.maincolor2};
    }
`;

const StyledCenterLine = styled.div`
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    z-index: -1;
    position: absolute;
    width: 4px;
    height: 100%;
    background-color: ${props => props.theme.colors.maincolor1};
`;

const StyledZoomBarLayersInfo = styled.div`
    overflow: hidden;
    transition: all 0.3s ease-out;
    position: absolute;
    left: ${props => props.isExpanded ? '-240px' : '-230px' };
    width: 230px;
    height: 100%;
    background-color: ${props => props.theme.colors.maincolor1};
    border-radius: 15px;
    opacity: ${props => props.isExpanded ? '1' : '0'};
    transition-delay: 0.6s;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
`;

const StyledTitle = styled.div`
    margin: 0;
    width: 100%;
    height: 60px;
    top: 0px;
    left: 0px;
    font-size: 12px;
    font-weight: 400;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${props => props.theme.colors.mainWhite};
    text-align: center;
    padding: 10px;
`;

const StyledLayerInfoContainer = styled.div`
    padding: 0px 15px 15px 15px;
    pointer-events: auto;
    overflow-y: auto;
    height: 100%;
    &::-webkit-scrollbar {
        display: none;
    }
`;

const ZoomBar = ({
    zoomLevelsLayers,
    currentZoomLevel,
    allLayers,
    selectedLayers
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [hoveringIndex, setHoveringIndex] = useState(null);
    const { store } = useContext(ReactReduxContext);
    const [currentLayersInfoLayers, setCurrentLayersInfoLayers] = useState([]);

    useEffect(() => {
        
        hoveringIndex !== null ?
        setCurrentLayersInfoLayers(Object.values(zoomLevelsLayers)[hoveringIndex].layers) :
        zoomLevelsLayers[currentZoomLevel] !== undefined && setCurrentLayersInfoLayers(Object.values(zoomLevelsLayers)[currentZoomLevel].layers);
    }, [zoomLevelsLayers, currentZoomLevel, hoveringIndex]);

    return (
            <StyledZoomBarContainer>
                    <StyledZoomBarLayersInfo isExpanded={isExpanded}>
                        <StyledTitle>TÄLLÄ ZOOM-TASOLLA NÄYTETTÄVÄT TASOT</StyledTitle>
                        <StyledLayerInfoContainer>
                            {currentLayersInfoLayers.map((zoomLevelLayer, index) => {
                                const layer = selectedLayers.find(layer => layer.id === zoomLevelLayer.id);
                                return layer && <ZoomBarLayer
                                    key={hoveringIndex !== null ?
                                        zoomLevelLayer.id+'_'+hoveringIndex :
                                        zoomLevelLayer.id+'_'+currentZoomLevel
                                    }
                                    zoomLevelLayer={zoomLevelLayer}
                                    index={index}
                                    layer={layer}
                                />
                            })}
                        </StyledLayerInfoContainer>

                    </StyledZoomBarLayersInfo>
                    <StyledExpandControl
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        <FontAwesomeIcon
                            icon={faAngleUp}
                            style={{
                                transform: isExpanded && "rotate(180deg)"
                            }}
                        />
                    </StyledExpandControl>
                    <StyledCenterLine />
                    <StyledZoomBarControlBottom
                        disabled={currentZoomLevel === 0}
                        onClick={() => {
                            store.dispatch(setZoomOut());
                        }}
                    >
                        <FontAwesomeIcon
                            icon={faSearchMinus}
                        />
                    </StyledZoomBarControlBottom>
                    {Object.values(zoomLevelsLayers).map((layer, index) => {
                        return <ZoomBarCircle
                            key={index}
                            index={index}
                            layer={layer}
                            zoomLevel={currentZoomLevel}
                            isExpanded={isExpanded}
                            //zoomTo={zoomTo}
                            setHoveringIndex={setHoveringIndex}
                        />
                    })}
                    <StyledZoomBarControlTop
                        disabled={currentZoomLevel === Object.values(zoomLevelsLayers).length - 1}
                        onClick={() => {
                            store.dispatch(setZoomIn());
                        }}
                    >
                        <FontAwesomeIcon
                            icon={faSearchPlus}
                        />
                    </StyledZoomBarControlTop>
            </StyledZoomBarContainer>
    )
};

export default ZoomBar;

