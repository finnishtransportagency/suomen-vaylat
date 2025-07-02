import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ReactReduxContext, useSelector } from "react-redux";
import { useAppSelector } from '../../state/hooks';
import { useContext, useState, useEffect } from 'react';
import { Button } from "react-bootstrap";
import { updateLayers } from '../../utils/rpcUtil';
import { setMapLayerVisibility } from '../../state/slices/rpcSlice';
import { setIsBaseLayerSelectorMenuOpen } from '../../state/slices/uiSlice';
import ModeEditOutlineTwoToneIcon from '@mui/icons-material/ModeEditOutlineTwoTone';
import { BASE_LAYERS_LOCALSTORAGE } from '../../utils/constants';
import { setSelectedBaseLayers } from '../../state/slices/uiSlice';
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
    background-color: ${props => props.active ? props.theme.colors.buttonActive : props.theme.colors.mainColor1 + 'DB' } !important;
    box-shadow: 0px 2px 4px #0000004D;
    border-radius: 30px;
    border: none;
    padding: 6px 12px;
    width: 10em;
    &:hover {
        background-color: ${props => props.theme.colors.buttonActive} !important;
    }
    @media ${props => props.theme.device.laptop} {
        max-width: 120px;
    };
    @media ${props => props.theme.device.tablet} {
        max-width: 100px;
    };
`;

const StyledMenuButton = styled(Button)`
    cursor: pointer;
    background-color: ${props => props.active ? props.theme.colors.buttonActive : props.theme.colors.mainColor1 + 'DB' } !important;
    box-shadow: 0px 2px 4px #0000004D;
    border-radius: 30px;
    border: none;
    padding: 6px 12px;
    width: 3em;
    &:hover {
        background-color: ${props => props.theme.colors.buttonActive} !important;
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
    const { store } = useContext(ReactReduxContext);
    const channel = useSelector(state => state.rpc.channel);
    const { selectedBaseLayers } = useAppSelector((state) => state.ui);

    useEffect(() => {
        const stored = localStorage.getItem(BASE_LAYERS_LOCALSTORAGE);
        if (stored) {
            try {
                store.dispatch(setSelectedBaseLayers(JSON.parse(stored)))
            } catch (e) {
                store.dispatch(setSelectedBaseLayers([]));
            }
        }
    }, []);
    

    const handleLayerVisibility = (channel, layer) => {
        store.dispatch(setMapLayerVisibility(layer));
        updateLayers(store, channel);
    }

    const BaseLayerButton = ({ action, layer, isSelected }) => {
        return(
            <StyledButton
                id={`baselayer-selector-base-layer-btn-${layer.id}`}
                onClick={() => action(layer)}
                active={isSelected}
                tabIndex={0}
                aria-label={strings.baseLayerSelector.labels.selectBaseLayer + layer.name}
                aria-pressed={isSelected}
                role="button"
            >
                <StyledButtonText id={`baselayer-selector-base-layer-btn-text-${layer.id}`}>
                    {layer.name}
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
                disabled={allLayers.length == 0}
            >
                <ModeEditOutlineTwoToneIcon />
            </StyledMenuButton>
        )
    }

    return(
        <StyledBaselayerButtonContainer id="baselayer-selector-base-layer-container">
            {allLayers.length > 0 && selectedBaseLayers.map((layerID) => {
                const layer = allLayers.find(layer => layer.id === layerID);
                return(
                    <BaseLayerButton
                        key={layer.id}
                        action={() => handleLayerVisibility(channel, layer)}
                        layer={layer}
                        isSelected={layer.visible}
                    />
                );
            })}
            <BaseLayerSelectorMenuButton />
        </StyledBaselayerButtonContainer>
    );
};

export default BaseLayerSelector;
