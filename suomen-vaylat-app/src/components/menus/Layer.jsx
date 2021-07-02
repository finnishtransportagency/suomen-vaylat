import React, { useContext, useState } from "react";
import { ReactReduxContext, useSelector } from 'react-redux';
import { setMapLayerVisibility } from '../../state/slices/rpcSlice';
import styled from 'styled-components';

const StyledLayerContainer = styled.li`
    overflow: hidden;
    transition: all 0.3s ease-out;
    //max-height: 0%;
    display: flex;
    align-items: center;
    opacity: "1";
    height: "40px";
    margin: 0;
`;

const StyledSelectButton = styled.div`
    width: 20px;
    height: 20px;
    border: 1px solid black;
    margin-right: 10px;
    background-color: ${props => props.isSelected ? "blue" : "white"};
`;

const StyledlayerHeader = styled.div`

`;

const StyledLayerName = styled.p`
    font-size: 15px;
    margin: 5px;
`;



export const Layer = ({ layer }) => {
    const { store } = useContext(ReactReduxContext);
    const selectedLayers = useSelector(state => state.rpc)
    const [isSelected, setIsSelected] = useState(false);

    const selectLayer = (isSelected) => {
        store.dispatch(setMapLayerVisibility({layer, selectedLayers}));
        setIsSelected(!isSelected);
    }

    return (
        <>
            <StyledLayerContainer key={layer.id}>
                <StyledlayerHeader onClick={() => selectLayer(isSelected)}>
                    <StyledLayerName>
                        {layer[0].name}
                    </StyledLayerName>
                <StyledSelectButton isSelected={isSelected} />
                </StyledlayerHeader>
            </StyledLayerContainer>
        </>
    );
  };

export default Layer;