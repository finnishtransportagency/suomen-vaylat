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
import Draggable from 'react-draggable';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

const StyledMenuContainer = styled.div`
    gap: 8px; /* Adds space between buttons */
    padding: 6px;
    display: grid;
`;

const StyledDescription = styled.div`
    display: block;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 2px;
    margin-inline-end: 2px;
    unicode-bidi: isolate;
`;

const StyledDescriptionText = styled.div`
    padding: 0px 0px 5px;
`;

const StyledBaseLayerButtonContainer = styled.div`
    gap: 8px; /* Adds space between buttons */
    padding: 6px;
    display: grid;
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

const StyledDraggableButton = styled(Button)`
    cursor: move;
    background-color: ${props => props.active ? props.theme.colors.mainColor1 : props.theme.colors.darkGrey } !important; /* Blue or Gray */
    box-shadow: 0px 2px 4px #0000004D;
    border-radius: 8px;
    border: 20px;
    padding: 6px 12px;
    width: 12em;
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

const StyledDraggableButtonContainer = styled.div`
    display: flex;
    gap: 10px;
    padding: 12px 20px;
    bottom: 6px;
`;

const BaseLayerSelectorMenu = () => {
    const { allLayers } = useAppSelector((state) => state.rpc);
    const baselayers = allLayers.filter(layer => layer.config?.baseLayer)
    const { store } = useContext(ReactReduxContext);
    const channel = useSelector(state => state.rpc.channel);
    const { selectedBaseLayers } = useAppSelector((state) => state.ui);

    /*Store layers selected in the menu here.*/
    const [selectedLayersListMenu, setSelectedLayersListMenu] = useState(selectedBaseLayers)

    // Draggable buttons use selected base layers
    const [draggableButtons, setDraggableButtons] = useState(selectedBaseLayers);

    const DraggableButton = ({ content, index, handleStop }) => {
        return (
            <Draggable
                axis="x"
                bounds="parent"
                onStop={(e, data) => handleStop(e, data, index)}
            >
                <div>
                    <StyledDraggableButton>
                        <StyledButtonText>
                            <DragIndicatorIcon />
                            {content}
                        </StyledButtonText>
                    </StyledDraggableButton>
                </div>
            </Draggable>
        );
    };



    // Swaps draggable button order based on where they are dropped
    const handleStop = (e, data, index) => {
        const newButtons = [...draggableButtons];
        const draggedButton = newButtons[index];
        const dropIndex = Math.round(data.x / (e.target.offsetWidth + 8)); // Calculate the drop index based on the x position

        // Remove the dragged button from its original position
        newButtons.splice(index, 1);

        // Insert the dragged button at the new position
        newButtons.splice(dropIndex, 0, draggedButton);

        setDraggableButtons(newButtons);
        setSelectedLayersListMenu(newButtons);
    };


    /*"Save" button sends updated list of selected layers to the local store.*/
    const SaveButton = () => {
        return (
            <StyledSaveButton onClick={() => store.dispatch(setSelectedBaseLayers(selectedLayersListMenu))}>
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
        const filteredButtons = [...selectedLayersListMenu].filter(ID => ID !== layerID);
        const pushedButtons = [...selectedLayersListMenu]
        pushedButtons.push(layerID);

        if (selectedLayersListMenu.includes(layerID)) {
            setSelectedLayersListMenu(filteredButtons);
            setDraggableButtons(filteredButtons);
        } else {
            setSelectedLayersListMenu(pushedButtons);
            setDraggableButtons(pushedButtons);
        }
    }

    return (
        <StyledMenuContainer>
            <StyledDescription>
                <StyledDescriptionText>
                    {strings.baseLayerSelector.description}
                </StyledDescriptionText>
            </StyledDescription>
            <StyledDraggableButtonContainer>
                {draggableButtons.map((layerID, index) => {
                    const layer = baselayers.find(layer => layer.id === layerID);
                    return (
                        <DraggableButton
                            key={layer.id}
                            content={layer.name}
                            index={index}
                            handleStop={handleStop}
                        />
                    );
                })}
            </StyledDraggableButtonContainer>
            <StyledBaseLayerButtonContainer>
                {baselayers.map(layer => (
                    <BaseLayerButton
                        key={layer.id}
                        action={() => addSelectedLayer(layer.id)}
                        layer={layer}
                        isSelected={selectedLayersListMenu.includes(layer.id)}
                    />
                ))}
            </StyledBaseLayerButtonContainer>
            <SaveButton></SaveButton>
        </StyledMenuContainer>
    )
 }


export default BaseLayerSelectorMenu;