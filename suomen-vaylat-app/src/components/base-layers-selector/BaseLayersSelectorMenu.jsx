import React from 'react';
import styled from 'styled-components';
import { ReactReduxContext } from "react-redux";
import { useAppSelector } from '../../state/hooks';
import { useContext, useState } from 'react';
import strings from '../../translations';
import { Button } from "react-bootstrap";
import { setSelectedBaseLayers } from '../../state/slices/uiSlice';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';


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

const StyledDraggableButton = styled.div`
    user-select: none;
    cursor: grab;
    background-color: ${props => props.theme.colors.mainWhite} !important; /* Blue or Gray */
    outline: 2px solid ${props => props.theme.colors.mainColor1} !important; /* Blue dotted outline */
    box-shadow: 0px 2px 4px #0000004D;
    border-radius: 8px;
    border: 20px;
    width: 12em;
    margin-top: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
        background-color: ${props => props.active ? props.theme.colors.mainColor1 : props.theme.colors.mainColor1 } !important; /* Blue or Gray */
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
    align-items: center;
`;

const StyledSwitchButtonText = styled.div`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
    font-weight: 600;
    user-select: none;
    align-items: center;
`;

const StyledDraggableButtonText = styled.div`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
    font-weight: 600;
    user-select: none;
    align-items: center;
    margin-top: 6px;
    margin-right: 3px;
`;

const StyledDraggableButtonContainer = styled.div`
    display: flex;
    gap: 10px;
    min-height: 40.60px;
    margin-bottom: 12px;
`;

const StyledDragIndicatorIcon = styled(DragIndicatorIcon)`
    margin-right: 4px;
    margin-left: 3px;
    margin-bottom: 3px;
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

const StyledLayerColumnField = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 10px;
    max-width: 200px;
`;

const StyledSwitchContainer = styled.div`
    position: relative;
    min-width: 32px;
    max-width: 30px;
    height: 16px;
    border-radius: 12px;
    margin-top: 3px;
    display: flex;
    align-items: center;
    background-color: ${(props) => (props.isSelected ? "#8DCB6D" : "#AAAAAA")};
    cursor: pointer;
    margin-right: 0px;
`;

const StyledSwitchButton = styled.div`
    position: absolute;
    left: ${(props) => (props.isSelected ? "15px" : "0px")};
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-left: 2px;
    margin-right: 2px;
    transition: all 0.3s ease-out;
    background-color: ${(props) => props.theme.colors.mainWhite};
`;

const BaseLayerSelectorMenu = () => {
    const {
        allGroups,
        allLayers,
    } = useAppSelector((state) => state.rpc);
    const { store } = useContext(ReactReduxContext);
    const { selectedBaseLayers } = useAppSelector((state) => state.ui);
    
    /*Store layers selected in the menu here.*/
    const [selectedLayersListMenu, setSelectedLayersListMenu] = useState(selectedBaseLayers);
    const [dragIndex, setDragIndex] = useState(null);      // index being dragged
    const [hoverIndex, setHoverIndex] = useState(null);    // index hovered as drop target

    // SWAP LOGIC
    const swapLayers = (i, j) => {
        if (i === j) return;
        const updated = [...selectedLayersListMenu];
        [updated[i], updated[j]] = [updated[j], updated[i]];
        setSelectedLayersListMenu(updated);
    };

    // BUTTON COMPONENT
    // Uses native HTML5 drag events.
    const DraggableBtn = ({ content, index }) => {
        return (
            <StyledDraggableButton
                draggable={true}
                tabIndex={0}
                onMouseOver={() => setDragIndex(index)} // THIS IS A HACK/BUGFIX. FOR SOME REASON THE FIRST DRAG ATTEMPT FAILS IF dragIndex IS null
                // after the first attempt drag index is set and the button can be dragged and dropped succesfully ==> onMouseOver fixes this bug by setting the dragIndex immediately
                // before the dragging starts, because mouse is naturally moved over the draggable button ==> the frist attempt works normally
                onDragStart={e => setDragIndex(index)}
                onDragOver={e => {
                    e.preventDefault();
                    setHoverIndex(index);
                }}
                onDragEnd={() => {
                    setDragIndex(null);
                    setHoverIndex(null);
                }}
                onDrop={e => {
                    e.preventDefault();
                    if (dragIndex !== null && dragIndex !== index) {
                        swapLayers(dragIndex, index);
                    }
                    setDragIndex(null);
                    setHoverIndex(null);
                }}
                style={{
                    opacity: dragIndex === index ? 1 : 1,
                    outline: hoverIndex === index ? "2px solid #2b7cd3" : "none",
                    borderRadius: '8px',
                    transition: "outline 0.15s",
                    zIndex: dragIndex === index ? 0 : 1,
                    display: 'inline-block'
                }}
            >
                <StyledDraggableButtonText draggable={false}>
                    <StyledDragIndicatorIcon draggable={false}/>
                    {content}
                </StyledDraggableButtonText>
            </StyledDraggableButton>
        );
    };

    const LayerlistSwitch = ({ action, layer, isSelected }) => {
        const handleClick = (e) => {
            if (layer) {
                action(layer);
            } else {
                action(e);
            }
        }

        return (
            <StyledSwitchContainer
                isSelected={isSelected}
                onClick={(event) => handleClick(event)}
            >   
                <StyledSwitchButton isSelected={isSelected} />
            </StyledSwitchContainer>
        );
    };

    /*"Save" button sends updated list of selected layers to the local store.*/
    const SaveButton = () => {
        return (
            <StyledSaveButton onClick={() => store.dispatch(setSelectedBaseLayers(selectedLayersListMenu))}>
                 <StyledButtonText>
                    {strings.baseLayerSelector.save}
                </StyledButtonText>

            </StyledSaveButton>
        );
    };

    const addSelectedLayer = (layerID) => {
        // Removes an existing layer from list
        if (selectedLayersListMenu.includes(layerID)) {
            const newList = selectedLayersListMenu.filter(ID => ID !== layerID);
            setSelectedLayersListMenu(newList);
        // Adds a new layer to the list if its length < 4
        } else if (selectedLayersListMenu.length < 4){
            const newList = [...selectedLayersListMenu, layerID];
            setSelectedLayersListMenu(newList);
        }
    };

    const LayerColumn = (group) => {
        return(
            <StyledLayerColumn>
                <StyledMenuHeader>{group.locale.fi.name}</StyledMenuHeader>
                {group.layers?.map((layerID) => {
                    const layer = allLayers.find(layer => layer.id === layerID);
                    return(
                        <React.Fragment key={layer.id}>
                            <StyledLayerColumnField>
                                <StyledSwitchButtonText>
                                    {layer.name} {/* Display layer name */}
                                </StyledSwitchButtonText>
                                <LayerlistSwitch
                                    key={layer.id}
                                    action={() => addSelectedLayer(layer.id)}
                                    layer={layer}
                                    isSelected={selectedLayersListMenu.includes(layer.id)}
                                >
                                </LayerlistSwitch>
                            </StyledLayerColumnField>
                        </React.Fragment>
                        

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
                {selectedLayersListMenu.map((layerID, index) => {
                    const layer = allLayers.find(layer => layer.id === layerID);
                    return <DraggableBtn key={layer.id} content={layer.name} index={index}/>;
                })}
                {selectedLayersListMenu.length < 4 && <StyledDottedOutline />}
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
    );
};

export default BaseLayerSelectorMenu;