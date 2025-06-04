import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ReactReduxContext, useSelector } from "react-redux";
import { useAppSelector } from '../../state/hooks';
import { useContext, useState } from 'react';
import strings from '../../translations';
import { Button } from "react-bootstrap";
import { updateLayers } from '../../utils/rpcUtil';
import { setMapLayerVisibility } from '../../state/slices/rpcSlice';
import { setSelectedBaseLayers } from '../../state/slices/uiSlice';

const StyledMenuContainer = styled.div`
    gap: 8px; /* Adds space between buttons */
    padding: 6px;
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

const StyledSaveButton = styled(Button)`
    cursor: pointer;
    background-color: ${props => props.theme.colors.mainColor1};
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



const BaseLayerSelectorMenu = () => {
    const { allLayers } = useAppSelector((state) => state.rpc);
    const baselayers = allLayers.filter(layer => layer.config?.baseLayer)
    const { store } = useContext(ReactReduxContext);
    const channel = useSelector(state => state.rpc.channel);
    const { selectedBaseLayers } = useAppSelector((state) => state.ui);

    /*Store layers selected in the menu here.*/
    let selectedLayersList = [];

    /*"Save" button sends updated list of selected layers to the local store.*/
    const SaveButton = () => {
        return (
            <StyledSaveButton onClick={() => store.dispatch(setSelectedBaseLayers(selectedLayersList))}>
                 <StyledButtonText>
                    {strings.baseLayerSelector.save}
                </StyledButtonText>

            </StyledSaveButton>
        )
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

    const addSelectedLayer = (layerID) => {
        selectedLayersList.push(layerID);
    }

    return (
        <StyledMenuContainer>
            {baselayers.map(layer => (
                <BaseLayerButton
                    key={layer.id}
                    action={() => addSelectedLayer(layer.id)}
                    layer={layer}
                    isSelected={() => selectedLayersList.includes(layer.id)}
                />
            ))}
            <SaveButton></SaveButton>
        </StyledMenuContainer>
    )
 }


export default BaseLayerSelectorMenu;