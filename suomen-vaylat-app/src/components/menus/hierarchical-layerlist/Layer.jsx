import { useEffect, useContext, useState } from "react";
import { ReactReduxContext, useSelector } from 'react-redux';
import { setAllLayers, setMapLayerVisibility } from '../../../state/slices/rpcSlice';
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
    const channel = useSelector(state => state.rpc.channel)
    //const [isSelected, setIsSelected] = useState(false);

    const handleLayerVisibility = (channel, layer) => {
        console.log(layer);
        channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, !layer.visible]);
        channel.getAllLayers(function (data) {
            console.log(data);
            //console.log('getAllGroups: ', data);
            store.dispatch(setAllLayers(data));
        });
        //store.dispatch(setMapLayerVisibility({layer, value}));
        //channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [action.payload.layer[0].id, true]);
       //setIsSelected(!isSelected);
    }

    return (
            <StyledLayerContainer
                key={layer.id}
                isOpen={isOpen}
            >
                <StyledSelectButton
                    type="checkbox"
                    checked={layer.visible}
                    onChange={() => handleLayerVisibility(channel, layer)}
                />
                <StyledlayerHeader>
                    <StyledLayerName>
                        {layer.name}
                    </StyledLayerName>
                </StyledlayerHeader>
            </StyledLayerContainer>
    );
  };

export default Layer;