import styled from 'styled-components';
import { motion } from 'motion/react';
import { ReactReduxContext, useSelector } from "react-redux";
import { useAppSelector } from '../../state/hooks';
import { useContext } from 'react';
import { Button } from "react-bootstrap";
import { updateLayers } from '../../utils/rpcUtil';
import { setMapLayerVisibility } from '../../state/slices/rpcSlice';
import { setIsBaseLayerSelectorMenuOpen } from '../../state/slices/uiSlice';
import ModeEditOutlineTwoToneIcon from '@mui/icons-material/ModeEditOutlineTwoTone';
import strings from '../../translations';

const StyledBaselayerButtonContainer = styled(motion.div)` 
    position: absolute;
    bottom: 10px;
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
    background-color: ${props => props.active ? props.theme.colors.buttonSelected : props.theme.colors.mainColor1 } !important;
    box-shadow: 0px 2px 4px #0000004D;
    border-radius: 30px;
    border: none;
    padding: 6px 12px;
    width: 10em;
    transition: background-color 150ms ease; /* smooth the change */
    &:hover {
        outline: 2px solid ${props => props.theme.colors.mainColor2};
    }
    &:active {
        outline: 2px solid ${props => props.theme.colors.mainColor2};
    }
    &:focus {
        outline: 2px solid ${props => props.theme.colors.mainColor2};
    }
`;

const StyledMenuButton = styled(Button)`
    cursor: pointer;
    background-color: ${props => props.theme.colors.mainColor1 } !important;
    box-shadow: 0px 2px 4px #0000004D;
    border-radius: 30px;
    border: none;
    padding: 6px 12px;
    width: 3em;
    &:hover {
        outline: 2px solid ${props => props.theme.colors.mainColor2};
    }
    &:active {
        outline: 2px solid ${props => props.theme.colors.mainColor2};
    }
    &:focus {
        outline: 2px solid ${props => props.theme.colors.mainColor2};
    }
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
    const { allLayers, selectedLayersByType } = useAppSelector((state) => state.rpc);
    const { store } = useContext(ReactReduxContext);
    const channel = useSelector(state => state.rpc.channel);
    const { selectedBaseLayers } = useAppSelector((state) => state.ui);

    const handleLayerVisibility = (channel, layer) => {
        store.dispatch(setMapLayerVisibility(layer));
        updateLayers(store, channel);
    }

    const BaseLayerButton = ({ action, layer, isSelected }) => {
        return(
            <StyledButton
                id={`baselayer-selector-base-layer-btn-${layer?.id}`}
                onClick={() => action(layer)}
                active={isSelected}
                tabIndex={0}
                aria-label={strings.baseLayerSelector.labels.selectBaseLayer + layer?.name}
                role="button"
            >
                <StyledButtonText id={`baselayer-selector-base-layer-btn-text-${layer?.id}`}>
                    {layer?.name}
                </StyledButtonText>
            </StyledButton>
        );
    };

    const BaseLayerSelectorMenuButton = () => {
        return(
            <StyledMenuButton
                id="baselayer-selector-base-layer-menu-btn"
                onClick={() => store.dispatch(setIsBaseLayerSelectorMenuOpen(true))}
                aria-label={strings.baseLayerSelector.labels.editBaseLayers}
                tabIndex={0}
                role="button"
                disabled={selectedLayersByType.backgroundMaps?.length === 0}
            >
                <ModeEditOutlineTwoToneIcon />
            </StyledMenuButton>
        )
    }

    return(
        <StyledBaselayerButtonContainer id="baselayer-selector-base-layer-container">
            {allLayers.length > 0 && selectedBaseLayers.map((layerID) => {
                const layer = allLayers.find(layer => layer.id === layerID) || null;
                if (layer === null) return null;
                return(
                    <BaseLayerButton
                        key={layer?.id}
                        action={() => handleLayerVisibility(channel, layer)}
                        layer={layer}
                        isSelected={layer?.visible}
                    />
                );
            })}
            <BaseLayerSelectorMenuButton />
        </StyledBaselayerButtonContainer>
    );
};

export default BaseLayerSelector;
