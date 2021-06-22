import React, { useContext, useEffect, useState } from "react";
import { ReactReduxContext } from 'react-redux';
import styled, { keyframes } from 'styled-components'

import { setZoomIn, setZoomOut } from '../../state/slices/rpcSlice';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus, faAngleUp, faAngleDown, faCircle, faSearchMinus, faSearchPlus } from '@fortawesome/free-solid-svg-icons'

import ZoomBarCircle from './ZoomBarCircle';

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
    right: -40px;
    transform: translateY(-50%);
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    pointer-events: auto;
    transition: all 0.1s ease-in;
    width: 35px;
    height: 70px;
    background-color: #0064af;
    margin: 0px 3px 3px 3px;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    svg {
        transition: all 0.5s ease-out;
        color: white;
        width: 28px;
        height: 28px;
    };
`;



const StyledZoomBarControlTop = styled.div`
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    pointer-events: auto;
    transition: all 0.1s ease-in;
    width: 46px;
    height: 46px;
    background-color: #0064af;
    margin: 0px 3px 3px 3px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
   svg {
        color: white;
        width: 28px;
        height: 28px;
    };
    &:hover {
        background-color: #009ae1;
        transform: scale(1.05);
    }
`;

const StyledZoomBarControlBottom = styled.div`
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    pointer-events: auto;
    transition: all 0.3s ease-out;
    cursor: pointer;
    width: 46px;
    height: 46px;
    background-color: #0064af;
    margin: 3px 3px 0px 3px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
        color: white;

    };
    &:hover {
        background-color: #009ae1;
        transform: scale(1.05);
    }
`;

const StyledCenterLine = styled.div`
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    z-index: -1;
    position: absolute;
    width: 4px;
    height: 100%;
    background-color: #0064af;
`;

const StyledZoomBarLayersInfo = styled.div`
    overflow: hidden;
    transition: all 0.3s ease-out;
    position: absolute;
    left: ${props => props.isExpanded ? '-190px' : '-180px' };
    width: 180px;
    height: 100%;
    background-color: #0064af;
    border-radius: 15px;
    opacity: ${props => props.isExpanded ? '1' : '0'};
    transition-delay: 0.6s;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
`;

const StyledTitle = styled.div`
    margin: 0;
    width: 100%;
    height: 40px;
    top: 0px;
    left: 0px;
    font-family: 'Exo 2';
    font-size: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    
`;

const StyledLayerInfoContainer = styled.div`
    padding: 15px;
    pointer-events: auto;
    overflow-y: auto;
    height: 100%;
    &::-webkit-scrollbar {
        display: none;
    }
`;

const StyledLayerInfo = styled.p`
    overflow-y: auto;
    opacity: 0;
    margin: 0px;
    font-family: 'Exo 2';
    font-weight: 600;
    font-size: 13px;
    color: #fff;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    display: inline-block;
    text-overflow: ellipsis;
    height: 30px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.5);
    display: flex;
    align-items: center;
    animation: ${fadeIn} 0.4s ease-in forwards;
    animation-delay: ${props => props.index * 0.03+'s'}; 
`;

const ZoomBar = ({ zoomLevelsLayers, hoveringIndex, setHoveringIndex, currentZoomLevel }) => {

    const [isExpanded, setIsExpanded] = useState(false);

    const { store } = useContext(ReactReduxContext);

    //const [zoomLevel, setZoomLevel] = useState(0);
    //const { zoomLevel, zoomIn, zoomOut, zoomTo } = useContext(AppContext);

    const [layersInfo, setLayersInfo] = useState([]);

    useEffect(() => {
        //zoomLevelsLayers && currentZoomLevel && setLayersInfo(Object.values(zoomLevelsLayers)[hoveringIndex !== null ? hoveringIndex : currentZoomLevel].layers);
        Object.values(zoomLevelsLayers).length > 0 && setLayersInfo(Object.values(zoomLevelsLayers)[hoveringIndex !== null ? hoveringIndex : currentZoomLevel].layers);
    },[zoomLevelsLayers, hoveringIndex, currentZoomLevel]);

    // useEffect(() => {
    //     layerz && setLayerz(Object.values(layerz)[hoveringIndex !== null ? hoveringIndex : zoomLevel]);
    // },[layers, hoveringIndex, zoomLevel]);
    
    return (
            <StyledZoomBarContainer>
                    <StyledZoomBarLayersInfo isExpanded={isExpanded}>
                        <StyledTitle>Näkyvät tasot</StyledTitle>
                        <StyledLayerInfoContainer>
                            {layersInfo.map((layer, index) => {
                                return <StyledLayerInfo
                                key={layer.id}
                                index={index}
                                >{layer.name}</StyledLayerInfo>
                            })}
                        </StyledLayerInfoContainer>

                    </StyledZoomBarLayersInfo>
                    <StyledExpandControl
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        <FontAwesomeIcon
                            icon={faAngleUp}
                            size="2x"
                            style={{
                                transform: isExpanded && "rotate(180deg)"
                            }}/>
                        <FontAwesomeIcon
                            icon={faCircle}
                            size="xs"
                        />
                        <FontAwesomeIcon
                            icon={faAngleDown} 
                            size="2x"
                            style={{
                                transform: isExpanded && "rotate(180deg)"
                            }}
                        />
                    </StyledExpandControl>
                    <StyledCenterLine />
                    <StyledZoomBarControlBottom
                        onClick={() => {
                            setLayersInfo([]);
                            store.dispatch(setZoomOut());
                        }}
                    >
                        <FontAwesomeIcon
                            icon={faSearchMinus}
                        />
                    </StyledZoomBarControlBottom>
                    {Object.values(zoomLevelsLayers).map((layer, index) => {
                        return <ZoomBarCircle
                            key={layer.id}
                            index={index}
                            layer={layer}
                            zoomLevel={currentZoomLevel}
                            isExpanded={isExpanded}
                            //zoomTo={zoomTo}
                            //setHoveringIndex={setHoveringIndex}
                        />
                    })}
                    <StyledZoomBarControlTop
                        onClick={() => {
                            setLayersInfo([]);
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

