import { useContext } from "react";
import { ReactReduxContext, useSelector } from 'react-redux';
import styled from 'styled-components';
import { updateLayers } from "../../../utils/rpcUtil";

const StyledLayerOptionsContainer = styled.div`
    transition: all 0.3s ease-out;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: ${props => props.isOptionsOpen ? "30px" : "0px"};
    white-space: nowrap;
`;

const StyledlayerOpacityControl = styled.input`
    user-select: auto;
    width: 60px;
    -webkit-appearance: none;
    appearance: none;
    height: 6px;
    border-radius: 5px;
    background: linear-gradient(90deg, rgba(0,100,175,0) 0%, rgba(0,100,175,1) 100%);
    box-shadow: rgba(0, 0, 0, 0.048) 0px 1px 2px, rgba(0, 0, 0, 0.11) 0px 1px 2px;
    outline: none;
    -webkit-transition: .2s;
    transition: opacity .2s;

    ::-webkit-slider-thumb {
        transition: all 0.1s ease-out;
        -webkit-appearance: none;
        appearance: none;
        width: 16px;
        height: 16px;
        border: 3px solid ${props => props.theme.colors.maincolor1};
        box-sizing: border-box;
        border-radius: 50%;
        background: ${props => props.theme.colors.mainWhite};
        cursor: pointer;
        &:hover{
            background: ${props => props.theme.colors.maincolor1};
        }
    }
`;

export const LayerOptions = ({ layer, isOptionsOpen }) => {
    const { store } = useContext(ReactReduxContext);
    const channel = useSelector(state => state.rpc.channel);

    const handleLayerOpacity = (channel, layer, value) => {
        channel.postRequest('ChangeMapLayerOpacityRequest', [layer.id, value]);
        updateLayers(store, channel);
    };

    return (
        <StyledLayerOptionsContainer
            key={layer.id+'_options'}
            isOptionsOpen={isOptionsOpen}
        >
                <StyledlayerOpacityControl
                    type="range"
                    min="0"
                    max="100"
                    value={layer.opacity}
                    onChange={event => handleLayerOpacity(channel, layer, event.target.value)}
                />
        </StyledLayerOptionsContainer>
    );
  };

export default LayerOptions;