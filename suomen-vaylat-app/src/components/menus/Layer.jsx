import { useContext, useState } from "react";
import { ReactReduxContext, useSelector } from 'react-redux';
import { setMapLayerVisibility } from '../../state/slices/rpcSlice';
import styled from 'styled-components';

const StyledLayerContainer = styled.li`
    overflow: hidden;
    display: flex;
    align-items: center;
    margin: 0;
`;

const StyledSelectButton = styled.input`
    cursor: pointer;
    width: 18px;
    height: 18px;
    border: 1px solid black;
    margin-right: 10px;
`;

const StyledlayerHeader = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
`;

const StyledLayerName = styled.p`
    font-size: 14px;
    margin: 5px;
`;

export const Layer = ({ layer, isOpen }) => {
    const { store } = useContext(ReactReduxContext);
    const selectedLayers = useSelector(state => state.rpc)
    const [isSelected, setIsSelected] = useState(false);

    const selectLayer = (isSelected) => {
        store.dispatch(setMapLayerVisibility({layer, selectedLayers}));
        setIsSelected(!isSelected);
    }

    return (
            <StyledLayerContainer
                key={layer[0].id}
                isOpen={isOpen}
            >
                <StyledSelectButton
                    type="checkbox"
                    checked={isSelected}
                    //isSelected={isSelected}
                    onChange={() => selectLayer(isSelected)}
                />
                <StyledlayerHeader>
                    <StyledLayerName>
                        {layer[0].name}
                    </StyledLayerName>
                </StyledlayerHeader>
            </StyledLayerContainer>
    );
  };

export default Layer;