import { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const StyledLayerContainer = styled.li`
    overflow: hidden;
    transition: all 0.3s ease-out;
    //max-height: 0%;
    display: flex;
    align-items: center;
    opacity: ${props => props.isOpen ? "1" : "0"};
    height: ${props => props.isOpen ? "40px" : "0px"};
    margin: 0;
`;

const StyledlayerHeader = styled.div`

`;

const StyledLayerName = styled.p`
    font-size: 15px;
    margin: 5px;
`;



export const Layers = ({ groupLayers, allLayers, isOpen }) => {
    //Find matching layers from all layers and groups, then push this group's layers into 'filteredLayers'
    var filteredLayers = [];
    for (var i in groupLayers) {
        filteredLayers.push(allLayers.filter(layer => layer.id == groupLayers[i]));
    }
    return (
        <>
            {filteredLayers.map((layer, index) => {
                return (
                    <StyledLayerContainer key={layer.id} isOpen={isOpen}>
                        <StyledlayerHeader>
                            <StyledLayerName>
                                {layer[0].name}
                            </StyledLayerName>
                        </StyledlayerHeader>
                    </StyledLayerContainer>
            )})}
        </>
    );
  };

export default Layers;