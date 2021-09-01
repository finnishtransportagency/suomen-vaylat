import { useContext } from "react";
import { ReactReduxContext, useSelector } from 'react-redux';
import { setAllLayers } from '../../../state/slices/rpcSlice';
import styled from 'styled-components';

import Checkbox from '../../checkbox/Checkbox';

const StyledLayerContainer = styled.li`
    overflow: hidden;
    display: flex;
    align-items: center;
    margin: 0;
`;

const StyledlayerHeader = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
`;

const StyledLayerName = styled.p`
    user-select: none;
    color: ${props => props.theme.colors.mainWhite};
    font-size: 13px;
    margin: 5px;
    @media ${ props => props.theme.device.mobileL} {
        font-size: 12px;
    };
`;

export const Layer = ({ layer, isOpen, theme }) => {
    const { store } = useContext(ReactReduxContext);
    const channel = useSelector(state => state.rpc.channel)

    const handleLayerVisibility = (channel, layer) => {
        channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, !layer.visible]);
        channel.getAllLayers(function (data) {
            store.dispatch(setAllLayers(data));
        });
    }

    if (layer.visible) {
        // if theme then check layer theme style
        if (theme) {
            channel.getLayerThemeStyle([layer.id, theme], function(styleName) {
                if (styleName) {
                    channel.changeLayerStyle([layer.id, styleName], function() {});
                }
            });
        }
        // else use default
        else {
            channel.getLayerThemeStyle([layer.id, null], function(styleName) {
                if (styleName) {
                    channel.changeLayerStyle([layer.id, styleName], function() {});
                }
            });
        }
    }

    return (
            <StyledLayerContainer
                key={'layer' + layer.id + '_' + theme}
                isOpen={isOpen}
            >
                {/* <StyledLayerSelectButton
                    type="checkbox"
                    checked={layer.visible}
                    onChange={() => handleLayerVisibility(channel, layer)}
                /> */}
                <Checkbox
                    isChecked={layer.visible}
                    handleClick={() => handleLayerVisibility(channel, layer)}
                    size={15}
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