import React from 'react';
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
import LayerList from '../layerlists/hierarchical-layerlist/LayerList';

const StyledMenuContainer = styled.div`
    padding: 0px 10px 10px;
    display: grid;
`;

const HorizontalLine = styled.div`
    width: 100%;
    height: 1px;
    background-color: ${props => props.theme.colors.mainColor1};
    margin-top: 20px; /* Adjust the margin as needed */
`;

const StyledFooter = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 20px 0px 0px;
    align-items: center;
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
    padding: 0px 0px 10px;
`;

const StyledLayerColumnContainer = styled.div`
    gap: 30px; /* Adds space between buttons */
    display: flex;
    flex-direction: row;
`;

const StyledButton = styled(Button)`
    cursor: pointer;
    background-color: ${props => props.active ? props.theme.colors.mainColor1 : props.theme.colors.darkGrey } !important; /* Blue or Gray */
    box-shadow: 0px 2px 4px #0000004D;
    border-radius: 30px;
    border: none;
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
    width: 12em;
    margin-top: 4px;
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
    min-height: 40.60px;
    margin-bottom: 12px;
`;

const StyledDragIndicatorIcon = styled(DragIndicatorIcon)`
    margin-right: 16px;
`;

const StyledDottedOutline = styled.div`
    cursor: pointer;
    background-color: transparent;
    border-radius: 8px;
    width: 12em;
    margin-top: 4px;
    border: 2px dashed ${props => props.theme.colors.mainColor1}; /* Blue dotted outline */
    @media ${props => props.theme.device.laptop} {
        max-width: 120px;
    };
    @media ${props => props.theme.device.tablet} {
        max-width: 100px;
    };
`;

const StyledMenuHeader = styled.th`
    font-size: 20px;
    font-weight: 600;
`;

const StyledLayerColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const BaseLayerSelectorMenu = () => {
    const {
        allGroups,
        allLayers,
        selectedLayers,
        allTags,
        currentZoomLevel,
    } = useAppSelector((state) => state.rpc);
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
                            <StyledDragIndicatorIcon/>
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

    const LayerColumn = (group) => {
        console.log(group);
        return(
            <StyledLayerColumn>
                <StyledMenuHeader>{group.locale.fi.name}</StyledMenuHeader>
                {group.layers?.map((layerID) => {
                    const layer = allLayers.find(layer => layer.id === layerID);
                    return(
                        <BaseLayerButton
                            key={layer.id}
                            action={() => addSelectedLayer(layer.id)}
                            layer={layer}
                            isSelected={selectedLayersListMenu.includes(layer.id)}
                        />
                    );
                })}
            </StyledLayerColumn>
        );
    };

    return (
        <StyledMenuContainer>

            <StyledDescription>
                <StyledDescriptionText>
                    {strings.baseLayerSelector.description}
                </StyledDescriptionText>
            </StyledDescription>

            <StyledMenuHeader>{strings.baseLayerSelector.selectedBaseLayers}</StyledMenuHeader>
            <StyledDraggableButtonContainer>
                {draggableButtons.slice(0, 4).map((layerID, index) => {
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
                {draggableButtons.length < 4 && <StyledDottedOutline />}
            </StyledDraggableButtonContainer>

            <StyledLayerColumnContainer>
            {allGroups.map((group) => {
                if (group.id === 1) {
                    return (
                        <React.Fragment key={group.id}>
                            <LayerColumn {...group} />
                            {group.groups && group.groups.map((subGroup) => (
                                <LayerColumn key={subGroup.id} {...subGroup} />
                            ))}
                        </React.Fragment>
                    );
                }
                return null;
            })}
            </StyledLayerColumnContainer>

            <HorizontalLine></HorizontalLine>
            <StyledFooter>
                <SaveButton />
            </StyledFooter>
    
        </StyledMenuContainer>
    )
 }


export default BaseLayerSelectorMenu;