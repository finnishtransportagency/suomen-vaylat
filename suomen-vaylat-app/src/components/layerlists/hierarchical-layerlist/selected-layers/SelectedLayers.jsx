import React, { useContext } from "react";
import styled from 'styled-components';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ReactReduxContext } from 'react-redux';
import SelectedLayer from './SelectedLayer';
import { setBackgroundMaps, setMapLayers } from "../../../../state/slices/rpcSlice";
import { updateLayers, resetThemeGroups, reArrangeRPCLayerOrder } from '../../../../utils/rpcUtil';
import strings from "../../../../translations";
import { useAppSelector } from "../../../../state/hooks";

const StyledSelectedLayers = styled.div``;

const StyledDeleteAllSelectedLayers = styled.div`
    width: 250px;
    height: 40px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${props => props.theme.colors.mainWhite};
    background-color: ${props => props.theme.colors.mainColor1};
    margin: 20px auto 20px auto;
    border-radius: 20px;
    box-shadow: 0px 1px 3px #0000001F;
    p {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
    }
`;

const StyledListSubtitle = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: ${props => props.theme.colors.mainColor1};
    padding: 0px 0px 16px 0px;
    font-size: 16px;
    font-weight: 600;
    svg {
      margin-left: 8px;
      font-size: 20px;
      transition: all 0.3s ease-out;
    };
`;

const ListRoot = styled.ul`
  padding-inline-start: 0px;
  margin: 0;
`;

/**
 * SortableItem wrapper:
 * - Attaches dnd-kit sortable to a given item and forwards drag handle props into SelectedLayer
 */
const SortableItem = ({ id, item, index, currentZoomLevel, filtersEnabled }) => {
  // useSortable gives attributes/listeners to attach to the handle, and setNodeRef to attach to item root
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: String(id) });

  const style = {
    transform: CSS.Transform.toString(transform || {}),
    transition,
    zIndex: isDragging ? 9999 : undefined,
    // avoid pointer events issues while dragging
    listStyle: 'none'
  };

  // pass handleProps and setNodeRef to SelectedLayer
  const handleProps = { attributes, listeners };

  return (
    <div ref={setNodeRef} style={style}>
      <SelectedLayer
        layer={item}
        uuid={item?.metadataIdentifier}
        currentZoomLevel={currentZoomLevel}
        handleProps={handleProps}
        setNodeRef={null} /* already attached above */
        style={{}}
        filtersEnabled={filtersEnabled}
      />
    </div>
  );
};

export const SelectedLayers = (props) => {
    const { currentZoomLevel } = props;
    const { store } = useContext(ReactReduxContext);
    const { channel, selectedLayersByType, filters } = useAppSelector(state => state.rpc);
    const { mapLayers, backgroundMaps } = selectedLayersByType || { mapLayers: [], backgroundMaps: [] };

    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          distance: 6 // require small drag distance to start drag
        }
      })
    );

    const sortSelectedLayers = (oldIndex, newIndex) => {
        const newSelectedLayers = arrayMove(mapLayers, oldIndex, newIndex);
        store.dispatch(setMapLayers(newSelectedLayers));
        reArrangeRPCLayerOrder(store, newSelectedLayers);
    };

    const sortSelectedBackgroundLayers = (oldIndex, newIndex) => {
        const newSelected = arrayMove(backgroundMaps, oldIndex, newIndex);
        store.dispatch(setBackgroundMaps(newSelected));
        reArrangeRPCLayerOrder(store, newSelected);
    };

    const handleClearSelectedLayers = () => {
        mapLayers.forEach(layer => {
            channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, !layer.visible]);
        });
        resetThemeGroups(store);
        store.dispatch(setMapLayers([]));
        updateLayers(store, channel);
    };

    const handleClearSelectedBackgroundMaps = () => {
        backgroundMaps.forEach(layer => {
            channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, !layer.visible]);
        });
        store.dispatch(setBackgroundMaps([]));
        updateLayers(store, channel);
    };

    const onDragEndMapLayers = (event) => {
      const { active, over } = event;
      if (!over) return;
      if (String(active.id) !== String(over.id)) {
        const oldIndex = mapLayers.findIndex(l => String(l.id) === String(active.id));
        const newIndex = mapLayers.findIndex(l => String(l.id) === String(over.id));
        if (oldIndex !== -1 && newIndex !== -1) {
          const newArr = arrayMove(mapLayers, oldIndex, newIndex);
          store.dispatch(setMapLayers(newArr));
          reArrangeRPCLayerOrder(store, newArr);
        }
      }
    };

    const onDragEndBackgroundMaps = (event) => {
      const { active, over } = event;
      if (!over) return;
      if (String(active.id) !== String(over.id)) {
        const oldIndex = backgroundMaps.findIndex(l => String(l.id) === String(active.id));
        const newIndex = backgroundMaps.findIndex(l => String(l.id) === String(over.id));
        if (oldIndex !== -1 && newIndex !== -1) {
          const newArr = arrayMove(backgroundMaps, oldIndex, newIndex);
          store.dispatch(setBackgroundMaps(newArr));
          reArrangeRPCLayerOrder(store, newArr);
        }
      }
    };

    return (
        <StyledSelectedLayers>
            <StyledListSubtitle>{strings.layerlist.layerlistLabels.mapLayers}</StyledListSubtitle>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEndMapLayers}>
              <SortableContext items={mapLayers.map(l => String(l.id))} strategy={verticalListSortingStrategy}>
                <ListRoot>
                  {mapLayers.map((item, index) => (
                      <SortableItem
                        key={'maplayer-' + item.id}
                        id={String(item.id)}
                        item={item}
                        index={index}
                        currentZoomLevel={currentZoomLevel}
                        filtersEnabled={filters && filters.length > 0 && filters.some(filter => (filter.layer ===  item.id))}
                      />
                  ))}
                </ListRoot>
              </SortableContext>
            </DndContext>

            <StyledDeleteAllSelectedLayers onClick={() => handleClearSelectedLayers()}>
                <p>{strings.layerlist.layerlistLabels.clearSelectedMapLayers}</p>
            </StyledDeleteAllSelectedLayers>

            <StyledListSubtitle>{strings.layerlist.layerlistLabels.backgroundMaps}</StyledListSubtitle>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEndBackgroundMaps}>
              <SortableContext items={backgroundMaps.map(l => String(l.id))} strategy={verticalListSortingStrategy}>
                <ListRoot>
                  {backgroundMaps && backgroundMaps.map((item, index) => (
                      <SortableItem
                        key={'background-maplayer-' + item.id}
                        id={String(item.id)}
                        item={item}
                        index={index}
                        currentZoomLevel={currentZoomLevel}
                        filtersEnabled={false}
                      />
                  ))}
                </ListRoot>
              </SortableContext>
            </DndContext>

            <StyledDeleteAllSelectedLayers onClick={() => handleClearSelectedBackgroundMaps()}>
                <p>{strings.layerlist.layerlistLabels.clearSelectedBackgroundMaps}</p>
            </StyledDeleteAllSelectedLayers>
        </StyledSelectedLayers>
    );
};

export default SelectedLayers;
