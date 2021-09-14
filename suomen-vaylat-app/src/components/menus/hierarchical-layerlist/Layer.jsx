import { useContext, useEffect } from "react";
import { ReactReduxContext, useSelector } from 'react-redux';
import { setLegends, setAllLayers } from '../../../state/slices/rpcSlice';
import styled from 'styled-components';

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
    color: ${props => props.theme.colors.black};
    font-size: 13px;
    margin: 5px;
    @media ${ props => props.theme.device.mobileL} {
        font-size: 12px;
    };
`;

const StyledCheckbox = styled.div`
    cursor: pointer;
    min-width: 20px;
    min-height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid ${props => props.theme.colors.maincolor1};
    box-sizing: border-box;
    background-color: ${props => props.theme.colors.mainWhite};
    border-radius: 30%;
    margin-right: 36px;
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

    useEffect(() => {
        const updateLayerLegends = (channel) => {
            channel.getLegends((data) => {
                store.dispatch(setLegends(data));
            });
        };

        debounceLegendsUpdate = debounce(updateLayerLegends, 500);
    }, [store]);

    if (layer.visible) {
        // if theme then check layer theme style
        if (theme) {
            channel.getLayerThemeStyle([layer.id, theme], function(styleName) {
                if (styleName) {
                    channel.changeLayerStyle([layer.id, styleName], function() {
                        // update layers legends
                        debounceLegendsUpdate(channel);
                    });
                }
            });
        }
        // else use default
        else {
            channel.getLayerThemeStyle([layer.id, null], function(styleName) {
                if (styleName) {
                    channel.changeLayerStyle([layer.id, styleName], function() {
                        debounceLegendsUpdate(channel);
                    });
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

                <StyledlayerHeader>
                    <StyledLayerName>
                        {layer.name}
                    </StyledLayerName>
                </StyledlayerHeader>
                <StyledCheckbox
                    isChecked={layer.visible}
                    handleClick={() => handleLayerVisibility(channel, layer)}
                />
            </StyledLayerContainer>
    );
  };

export default Layer;