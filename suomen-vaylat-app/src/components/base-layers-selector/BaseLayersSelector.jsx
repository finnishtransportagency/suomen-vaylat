import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ReactReduxContext, useSelector } from "react-redux";
import { useAppSelector } from '../../state/hooks';
import { useContext } from 'react';
import { Button } from "react-bootstrap";
import { updateLayers } from '../../utils/rpcUtil';
import { setMapLayerVisibility } from '../../state/slices/rpcSlice';


const StyledBaselayerButtonContainer = styled(motion.div)` 
    position: absolute;
    bottom: 5px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 8px; /* Adds space between buttons */
    padding: 6px;
    border-radius: 8px;
    @media ${props => props.theme.device.tablet} {
        gap: 6px;
    };
`;

const StyledButton = styled(Button)`
    cursor: pointer;
    background-color: ${props => props.active ? props.theme.colors.mainColor1 : props.theme.colors.darkGrey } !important; /* Blue or Gray */
    box-shadow: 0px 2px 4px #0000004D;
    border-radius: 30px;
    border: none;
    padding: 6px 12px;
    width: 10em;
    &:hover {
        background-color: ${props => props.active ? props.theme.colors.buttonActive : props.theme.colors.buttonActive } !important; /* Blue or Gray */
    }
    @media ${props => props.theme.device.laptop} {
        max-width: 120px;
    };
    @media ${props => props.theme.device.tablet} {
        max-width: 100px;
    };
`;

const StyledButtonText = styled.div`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
    font-weight: 600;
    user-select: none;
`;

const BaseLayerSelector = () => {
    const { allLayers } = useAppSelector((state) => state.rpc);
    const baselayers = allLayers.filter(layer => layer.config?.baseLayer)
    const { store } = useContext(ReactReduxContext);
    const channel = useSelector(state => state.rpc.channel);

    const handleLayerVisibility = (channel, layer) => {
        store.dispatch(setMapLayerVisibility(layer));
        updateLayers(store, channel);
    }

    const BaseLayerButton = ({ action, layer, isSelected }) => {
        return(
            <StyledButton onClick={() => action(layer)} active={isSelected}>
                <StyledButtonText>
                    {layer.name} {/* Display layer name */}
                </StyledButtonText>
            </StyledButton>
        );
    };

    return(
        <StyledBaselayerButtonContainer>
            {baselayers.map(layer => (
                <BaseLayerButton
                    key={layer.id}
                    action={() => handleLayerVisibility(channel, layer)}
                    layer={layer}
                    isSelected={layer.visible}
                />
            ))}
        </StyledBaselayerButtonContainer>
    );
};

export default BaseLayerSelector;
