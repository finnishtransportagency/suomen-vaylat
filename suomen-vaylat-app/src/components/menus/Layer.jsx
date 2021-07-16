import { useContext } from "react";
import { ReactReduxContext, useSelector } from 'react-redux';
import { setAllLayers } from '../../state/slices/rpcSlice';
import styled from 'styled-components';

const StyledLayerContainer = styled.li`
    overflow: hidden;
    display: flex;
    align-items: center;
    margin: 0;
`;

const StyledLayerSelectButton = styled.input`
    cursor: pointer;
    min-width: 18px;
    min-height: 18px;
`;

const StyledlayerHeader = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
`;

const StyledLayerName = styled.p`
    font-size: 13px;
    margin: 5px;
`;

export const Layer = ({ layer, isOpen }) => {
    const { store } = useContext(ReactReduxContext);
    const channel = useSelector(state => state.rpc.channel)

    const handleLayerVisibility = (channel, layer) => {
        channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, !layer.visible]);
        channel.getAllLayers(function (data) {
            store.dispatch(setAllLayers(data));
        });
    }

    return (
            <StyledLayerContainer
                key={layer[0].id}
                isOpen={isOpen}
            >
                <StyledLayerSelectButton
                    type="checkbox"
                    checked={layer[0].visible}
                    onChange={() => handleLayerVisibility(channel, layer[0])}
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