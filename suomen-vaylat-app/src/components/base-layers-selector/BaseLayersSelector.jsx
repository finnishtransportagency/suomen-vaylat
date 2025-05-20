import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ReactReduxContext, useSelector } from "react-redux";
import { useAppSelector } from '../../state/hooks';
import { useContext } from 'react';
import { Button } from "react-bootstrap";
import { updateLayers } from '../../utils/rpcUtil';
import { setMapLayerVisibility } from '../../state/slices/rpcSlice';
import theme from '../../theme/theme';


const StyledBaselayerButtonContainer = styled(motion.div)` 
    position: fixed;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px; /* Adds space between buttons */
    padding: 10px;
    border-radius: 8px;
    box-shadow: 1px 4px 6px #0000004D;
`;

const StyledButton = styled(Button)`
    border-radius: 30px;
    background-color: ${(props) => (props.isSelected ? props.theme.colors.mainColor1 : "#AAAAAA")}; /* Blue or Gray */
    color: white; /* Ensure text color is visible */
    padding: 10px 20px; /* Adjust padding as needed */
    font-size: 18px; /* Increase font size */
    width: auto; /* Width adjusts based on text length */
    display: inline-block; /* Ensure the button takes only as much space as needed */
    margin: 5px; /* Add margin to separate buttons */
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
            <StyledButton onClick={() => action(layer)} isSelected={isSelected}>
                {layer.name} {/* Display layer name */}
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