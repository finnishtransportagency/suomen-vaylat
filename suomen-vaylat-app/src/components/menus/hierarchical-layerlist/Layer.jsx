import { useContext, useEffect } from "react";
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactReduxContext, useSelector } from 'react-redux';
import styled from 'styled-components';
import { debounce } from 'tlence';
import { setLegends } from '../../../state/slices/rpcSlice';
import { updateLayers } from "../../../utils/rpcUtil";

//import Switch from '../../../components/switch/Switch';

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
    color: ${props => props.theme.colors.mainColor1};
    margin: 5px;
    font-size: 14px;
    @media ${ props => props.theme.device.mobileL} {
        font-size: 12px;
    };
`;

let debounceLegendsUpdate = null;


const StyledCheckbox = styled.div`
    cursor: pointer;
    min-width: 20px;
    min-height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.theme.colors.mainWhite};
    margin-right: 36px;
    border: 2px solid ${props => props.theme.colors.mainColor1};
    border-radius: 30%;
    box-sizing: border-box;
    svg {
        color: ${props => props.theme.colors.mainColor1};
        font-size: 12px;
    };
`;

const StyledSwitchContainer = styled.div`
    position: relative;
    min-width: 32px;
    height: 16px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    background-color: ${props => props.isSelected ? "#8DCB6D" : "#AAAAAA"};
    cursor: pointer;
    margin-right: 16px;
`;

const StyledSwitchButton = styled.div`
    position: absolute;
    left: ${props => props.isSelected ? "15px" : "0px"};
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-left: 2px;
    margin-right: 2px;
    transition: all 0.3s ease-out;
    background-color: ${props => props.theme.colors.mainWhite};
`;

const Switch = ({ action, layer, isSelected }) => {
    return (
        <StyledSwitchContainer
        isSelected={isSelected}
        onClick={() => {
            action(layer);
        }}>
            <StyledSwitchButton isSelected={isSelected}/>
        </StyledSwitchContainer>
    );
};

export const Layer = ({ layer, theme }) => {

    const { store } = useContext(ReactReduxContext);

    const {
        channel,
        selectedLayers
    } = useSelector(state => state.rpc);

    const handleLayerVisibility = (layer) => {
        channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, !layer.visible]);
        // Update layer orders to correct
        const position = selectedLayers.length + 1;
        channel.reorderLayers([layer.id, position], () => {});
        updateLayers(store, channel);
    };

    useEffect(() => {
        const updateLayerLegends = (channel) => {
            channel.getLegends((data) => {
                store.dispatch(setLegends(data));
            });
    };
        
        debounceLegendsUpdate = debounce(updateLayerLegends, 500);
    }, [store]);

    if (layer.visible) {
        // If theme then check layer theme style
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
        // Else use default
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
                className={`list-layer ${layer.visible && "list-layer-active"}`}
                key={'layer' + layer.id + '_' + theme}
            >
                <StyledlayerHeader>
                    <StyledLayerName>
                        {layer.name}
                    </StyledLayerName>
                </StyledlayerHeader>
                <Switch
                    action={handleLayerVisibility}
                    isSelected={layer.visible}
                    layer={layer}
                />
            </StyledLayerContainer>
    );
  };

export default Layer;