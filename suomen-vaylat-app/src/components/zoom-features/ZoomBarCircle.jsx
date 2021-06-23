import React, { useState, useContext } from 'react';
import styled, { keyframes } from 'styled-components';

import { ReactReduxContext } from 'react-redux';

import { setZoomTo } from '../../state/slices/rpcSlice';

const StyledZoomLevelContainer = styled.div`
    position: relative;
`;


const StyledZoomLevelInfo = styled.div`
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    position: absolute;
    top: 0px;

    transition: all 0.3s ease-out;
    border-radius: 15px;
    left: -220px;
    width: 195px;
    height: 80px;
    background-color: #0064af;
    opacity: 0;
`;

const StyledZoomLevelCircle = styled.div`
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    pointer-events: auto;
    transition: all 0.5s ease-in-out;
   
    background-color: ${props => props.index === props.zoomLevel ? "#ffc300" : "#fff"};
    transform: ${props => props.index === props.zoomLevel && "scale(1.2)"};
    width: ${props => props.isExpanded ? "23px" : "0px"};
    height: ${props => props.isExpanded ? "23px" : "0px"};
    opacity: ${props => props.isExpanded ? "1" : "0"};
    border-color: #0064af;
    border-style: solid;
    border-width: ${props => props.isExpanded ? "3px" : "1px"};
    border-radius: 50%;
    margin: ${props => props.isExpanded ? "3px" : "0px"};
    &:hover {
        background-color: #ffc300;
        transform: scale(1.1);
    };
    &:hover ~ ${StyledZoomLevelInfo} {
        opacity: 1;
        //transform: scale(1);
        height: 150px;
    };
`;


const ZoomBarCircle = ({index, zoomLevel, zoomTo, setHoveringIndex, isExpanded, layer}) => {
    const { store } = useContext(ReactReduxContext);

    return (
        <StyledZoomLevelContainer
        key={layer.id}
        >
            <StyledZoomLevelCircle
                        index={index}
                        zoomLevel={zoomLevel}
                        onClick={() => store.dispatch(setZoomTo(index))}
                        isExpanded={isExpanded}
                        //onMouseEnter={() => setHoveringIndex(index)}
                        //onMouseLeave={() => setHoveringIndex(null)}
            >
            </StyledZoomLevelCircle>
        </StyledZoomLevelContainer>

    )
};

export default ZoomBarCircle;