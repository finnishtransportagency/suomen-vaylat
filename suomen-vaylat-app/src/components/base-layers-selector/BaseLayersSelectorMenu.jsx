import React, { useEffect, useContext, useState } from 'react';
import styled from 'styled-components';
import { ReactReduxContext } from 'react-redux';
import { useAppSelector } from '../../state/hooks';
import strings from '../../translations';
import { Button } from 'react-bootstrap';
import {
  setIsBaseLayerSelectorMenuOpen,
  setSelectedBaseLayers
} from '../../state/slices/uiSlice';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { BASE_LAYERS_LOCALSTORAGE } from '../../utils/constants';

const StyledMenuContainer = styled.div`
  padding: 16px;
  display: grid;
`;

const HorizontalLine = styled.div`
  width: 100%;
  height: 1px;
  background-color: #d7d9db;
  margin-top: 20px;
`;

const StyledFooter = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0px 0px;
  align-items: center;
`;

const StyledDescription = styled.div`
  display: block;
  margin-block-start: 0.5em;
  margin-block-end: 0.5em;
  margin-inline-start: 2px;
  margin-inline-end: 2px;
  unicode-bidi: isolate;
`;

const StyledDescriptionText = styled.div`
  padding: 0px 0px 10px;
`;

const StyledLayerColumnContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-right: 12px;
  flex-direction: row;
`;

const StyledDraggableButton = styled.div`
  user-select: none;
  cursor: grab;
  background-color: ${(props) => props.theme.colors.mainWhite} !important;
  outline: 1px solid ${(props) => props.theme.colors.mainColor1} !important;
  border-radius: 8px;
  width: 12em;
  margin-top: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: ${(props) => props.theme.colors.buttonActive} !important;
  }
  @media ${(props) => props.theme.device.laptop} {
    max-width: 120px;
  }
  @media ${(props) => props.theme.device.tablet} {
    max-width: 100px;
  }
`;

const StyledSaveButton = styled(Button)`
  cursor: pointer;
  background-color: ${(props) => props.theme.colors.mainColor1};
  border-radius: 30px;
  border: none;
  width: 10em;
  &:hover {
    background-color: ${(props) => props.theme.colors.buttonActive} !important;
  }
  @media ${(props) => props.theme.device.laptop} {
    max-width: 120px;
  }
  @media ${(props) => props.theme.device.tablet} {
    max-width: 100px;
  }
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

const StyledCancelButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.mainWhite};
  color: ${({ theme }) => theme.colors.mainColor1};
  border: 2px solid ${({ theme }) => theme.colors.mainColor1};
  font-weight: 600;
  &:hover:enabled {
    background-color: ${({ theme }) => theme.colors.hover};
    color: ${({ theme }) => theme.colors.buttonActive};
  }
  cursor: pointer;
  border-radius: 30px;
  width: 10em;
  @media ${(props) => props.theme.device.laptop} {
    max-width: 120px;
  }
  @media ${(props) => props.theme.device.tablet} {
    max-width: 100px;
  }
`;

const StyledCancelButtonText = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 600;
  user-select: none;
  align-items: center;
  color: ${(props) => props.theme.colors.mainColor1};
`;

const StyledSwitchButtonText = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.theme.colors.mainColor1};
  user-select: none;
  align-items: center;
`;

const StyledDraggableButtonText = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.theme.colors.mainColor1};
  user-select: none;
  align-items: center;
  margin-top: 6px;
  margin-right: 3px;
  &:hover {
    color: ${(props) => props.theme.colors.mainWhite} !important;
  }
`;

const StyledDraggableButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  min-height: 40.6px;
  margin-bottom: 20px;
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
  border: 1px dashed ${(props) => props.theme.colors.mainColor1};
  @media ${(props) => props.theme.device.laptop} {
    max-width: 120px;
  }
  @media ${(props) => props.theme.device.tablet} {
    max-width: 100px;
  }
`;

const StyledMenuHeader = styled.p`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const StyledGroupHeader = styled.p`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 0px;
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
  background-color: ${(props) =>
    props.isSelected ? props.theme.colors.mainColor1 : '#00000033'};
  cursor: pointer;
  margin-right: 0px;
`;

const StyledSwitchButton = styled.div`
  position: absolute;
  left: ${(props) => (props.isSelected ? '15px' : '0px')};
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-left: 2px;
  margin-right: 2px;
  transition: all 0.3s ease-out;
  background-color: ${(props) => props.theme.colors.mainWhite};
`;

const BaseLayerSelectorMenu = () => {
  const { allGroups, allLayers } = useAppSelector((state) => state.rpc);
  const { store } = useContext(ReactReduxContext);
  const { selectedBaseLayers } = useAppSelector((state) => state.ui);

  // Load from localStorage (make sure it's an array)
  useEffect(() => {
    const stored = localStorage.getItem(BASE_LAYERS_LOCALSTORAGE);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSelectedLayersListMenu(parsed);
        }
      } catch {
        // ignore parse errors, keep original state
      }
    }
  }, []);

  /*Store layers selected in the menu here.*/
  const [selectedLayersListMenu, setSelectedLayersListMenu] =
    useState(selectedBaseLayers);
  const [dragIndex, setDragIndex] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);

  // SWAP LOGIC
  const swapLayers = (i, j) => {
    if (i === j) return;
    const updated = [...selectedLayersListMenu];
    [updated[i], updated[j]] = [updated[j], updated[i]];
    setSelectedLayersListMenu(updated);
  };

  // BUTTON COMPONENT
  const DraggableBtn = ({ content, index, layerId }) => {
    return (
      <StyledDraggableButton
        id={`dataset-import-draggable-layer-btn-${layerId}`}
        draggable={true}
        tabIndex={0}
        aria-label={
          strings.baseLayerSelector.labels.dragSelectedLayerAriaLabel + content
        }
        aria-grabbed={dragIndex === index}
        role="button"
        onMouseOver={() => setDragIndex(index)}
        onDragStart={(e) => setDragIndex(index)}
        onDragOver={(e) => {
          e.preventDefault();
          setHoverIndex(index);
        }}
        onDragEnd={() => {
          setDragIndex(null);
          setHoverIndex(null);
        }}
        onDrop={(e) => {
          e.preventDefault();
          if (dragIndex !== null && dragIndex !== index) {
            swapLayers(dragIndex, index);
          }
          setDragIndex(null);
          setHoverIndex(null);
        }}
        style={{
          opacity: dragIndex === index ? 1 : 1,
          outline: hoverIndex === index ? '2px solid #2b7cd3' : 'none',
          borderRadius: '8px',
          transition: 'outline 0.15s',
          zIndex: dragIndex === index ? 0 : 1,
          display: 'inline-block'
        }}
      >
        <StyledDraggableButtonText
          id={`dataset-import-draggable-layer-btn-text-${layerId}`}
          draggable={false}
        >
          <StyledDragIndicatorIcon
            id={`dataset-import-drag-icon-${layerId}`}
            draggable={false}
            aria-hidden="true"
          />
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
    };

    return (
      <StyledSwitchContainer
        id={`dataset-import-layer-switch-${layer.id}`}
        isSelected={isSelected}
        onClick={(event) => handleClick(event)}
        aria-checked={isSelected}
        aria-label={
          strings.baseLayerSelector.labels.layerSwitchAriaLabel + layer.name
        }
        role="switch"
        tabIndex={0}
      >
        <StyledSwitchButton isSelected={isSelected} />
      </StyledSwitchContainer>
    );
  };

  const handleSaveBaseLayers = () => {
    localStorage.setItem(
      BASE_LAYERS_LOCALSTORAGE,
      JSON.stringify(selectedLayersListMenu)
    );
    store.dispatch(setSelectedBaseLayers(selectedLayersListMenu));
    store.dispatch(setIsBaseLayerSelectorMenuOpen(false));
  };

  const SaveButton = () => {
    return (
      <StyledSaveButton
        id="dataset-import-base-layer-save-button"
        aria-label={strings.baseLayerSelector.labels.saveAriaLabel}
        tabIndex={0}
        onClick={handleSaveBaseLayers}
      >
        <StyledButtonText>{strings.baseLayerSelector.save}</StyledButtonText>
      </StyledSaveButton>
    );
  };

  const CancelButton = () => {
    return (
      <StyledCancelButton
        id="dataset-import-base-layer-cancel-button"
        aria-label={strings.baseLayerSelector.labels.cancelAriaLabel}
        tabIndex={0}
        onClick={() => store.dispatch(setIsBaseLayerSelectorMenuOpen(false))}
      >
        <StyledCancelButtonText>
          {strings.baseLayerSelector.cancel}
        </StyledCancelButtonText>
      </StyledCancelButton>
    );
  };

  const addSelectedLayer = (layerID) => {
    // Removes an existing layer from list
    if (selectedLayersListMenu.includes(layerID)) {
      const newList = selectedLayersListMenu.filter((ID) => ID !== layerID);
      setSelectedLayersListMenu(newList);
      // Adds a new layer to the list if its length < 4
    } else if (selectedLayersListMenu.length < 4) {
      const newList = [...selectedLayersListMenu, layerID];
      setSelectedLayersListMenu(newList);
    }
  };

  const LayerColumn = (group) => {
    return (
      <StyledLayerColumn id={`dataset-import-group-col-${group.id}`}>
        <StyledGroupHeader id={`dataset-import-group-header-${group.id}`}>
          {group.locale.fi.name}
        </StyledGroupHeader>
        {group.layers?.map((layerID) => {
          const layer = allLayers.find((layer) => layer.id === layerID);
          if (!layer) return null;
          return (
            <React.Fragment key={layer.id}>
              <StyledLayerColumnField
                id={`dataset-import-layer-field-${layer.id}`}
              >
                <StyledSwitchButtonText
                  id={`dataset-import-layer-text-${layer.id}`}
                >
                  {layer.name}
                </StyledSwitchButtonText>
                <LayerlistSwitch
                  key={layer.id}
                  action={() => addSelectedLayer(layer.id)}
                  layer={layer}
                  isSelected={selectedLayersListMenu.includes(layer.id)}
                />
              </StyledLayerColumnField>
            </React.Fragment>
          );
        })}
      </StyledLayerColumn>
    );
  };

  return (
    <StyledMenuContainer id="dataset-import-base-layer-selector-menu">
      <StyledDescription>
        <StyledDescriptionText>
          {strings.baseLayerSelector.description}
        </StyledDescriptionText>
      </StyledDescription>

      <StyledMenuHeader id="dataset-import-selected-base-layers-header">
        {strings.baseLayerSelector.selectedBaseLayers}
      </StyledMenuHeader>
      <StyledDraggableButtonContainer id="dataset-import-selected-base-layers-container">
        {selectedLayersListMenu.map((layerID, index) => {
          const layer = allLayers.find((layer) => layer.id === layerID);
          return (
            <DraggableBtn
              key={layer.id}
              content={layer.name}
              index={index}
              layerId={layer.id}
            />
          );
        })}
        {selectedLayersListMenu.length < 4 && (
          <StyledDottedOutline id="dataset-import-new-layer-dotted-outline" />
        )}
      </StyledDraggableButtonContainer>

      <StyledLayerColumnContainer id="dataset-import-layer-columns">
        {allGroups.map((group) => {
          if (!group) return null;
          if (group.id === 1) {
            return (
              <React.Fragment key={group.id}>
                <LayerColumn {...group} />
                {group.groups?.map((subGroup) => (
                  <LayerColumn key={subGroup.id} {...subGroup} />
                ))}
              </React.Fragment>
            );
          }
          return null;
        })}
      </StyledLayerColumnContainer>

      <HorizontalLine />
      <StyledFooter>
        <CancelButton />
        <SaveButton />
      </StyledFooter>
    </StyledMenuContainer>
  );
};

export default BaseLayerSelectorMenu;