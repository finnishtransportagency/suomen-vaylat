import React, { useContext } from 'react';
import styled from 'styled-components';
import { List } from 'react-movable';
import { ReactReduxContext } from 'react-redux';
import SelectedLayer from './SelectedLayer';
import { setBackgroundMaps, setMapLayers } from '../../../../state/slices/rpcSlice';
import { reArrangeRPCLayerOrder, resetThemeGroups, updateLayers } from '../../../../utils/rpcUtil';
import strings from '../../../../translations';
import { useAppSelector } from '../../../../state/hooks';

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
  margin: 20px auto;
  border-radius: 20px;
  box-shadow: 0px 1px 3px #0000001F;
  p { margin: 0; font-size: 14px; font-weight: 600; }
`;

const StyledListSubtitle = styled.div`
  display:flex;
  justify-content:flex-start;
  align-items:center;
  color: ${props => props.theme.colors.mainColor1};
  padding-bottom: 16px;
  font-size: 16px;
  font-weight: 600;
`;

const ListRoot = styled.ul`
  padding-inline-start: 0px;
  margin: 0;
  list-style: none;
  position: relative; /* safe for any child positioning */
`;

/* immutable reorder helper */
function reorder(list, startIndex, endIndex) {
  const result = Array.from(list || []);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

export const SelectedLayers = ({ currentZoomLevel }) => {
  const { store } = useContext(ReactReduxContext);
  const { channel, selectedLayersByType, filters } = useAppSelector(state => state.rpc);
  const mapLayers = selectedLayersByType?.mapLayers || [];
  const backgroundMaps = selectedLayersByType?.backgroundMaps || [];

  const handleClearSelectedLayers = () => {
    mapLayers.forEach(layer => channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, !layer.visible]));
    resetThemeGroups(store);
    store.dispatch(setMapLayers([]));
    updateLayers(store, channel);
  };

  const handleClearSelectedBackgroundMaps = () => {
    backgroundMaps.forEach(layer => channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, !layer.visible]));
    store.dispatch(setBackgroundMaps([]));
    updateLayers(store, channel);
  };

  return (
    <StyledSelectedLayers>
      <StyledListSubtitle>{strings.layerlist.layerlistLabels.mapLayers}</StyledListSubtitle>

      <List
        values={mapLayers}
        onChange={({ oldIndex, newIndex }) => {
          if (oldIndex === newIndex) return;
          const newArr = reorder(mapLayers, oldIndex, newIndex);
          store.dispatch(setMapLayers(newArr));
          reArrangeRPCLayerOrder(store, newArr);
        }}
        renderList={({ children, props }) => (
          <ListRoot {...props}>
            {children}
          </ListRoot>
        )}
        renderItem={({ value, props: itemProps, isDragged }) => {
          // itemProps contains handlers and inline style; merge the style so transforms apply.
          const mergedStyle = {
            marginBottom: 8,
            ...itemProps.style
          };

          // drag handle props might be available on itemProps.dragHandleProps;
          // apply them to the grip in SelectedLayer via the handleProps prop.
          const handleProps = itemProps.dragHandleProps || null;

          // remove dragHandleProps from the props passed to li so it does not conflict,
          // but keep other props (onMouseDown/onTouchStart/onKeyDown etc.)
          const { dragHandleProps, ...restProps } = itemProps;

          return (
            <li key={value.id} {...restProps} style={mergedStyle} data-is-dragging={isDragged ? 'true' : 'false'}>
              <SelectedLayer
                layer={value}
                uuid={value?.metadataIdentifier}
                currentZoomLevel={currentZoomLevel}
                handleProps={handleProps}
                filtersEnabled={filters && filters.length > 0 && filters.some(filter => filter.layer === value.id)}
              />
            </li>
          );
        }}
      />

      <StyledDeleteAllSelectedLayers onClick={handleClearSelectedLayers}>
        <p>{strings.layerlist.layerlistLabels.clearSelectedMapLayers}</p>
      </StyledDeleteAllSelectedLayers>

      <StyledListSubtitle>{strings.layerlist.layerlistLabels.backgroundMaps}</StyledListSubtitle>

      <List
        values={backgroundMaps}
        onChange={({ oldIndex, newIndex }) => {
          if (oldIndex === newIndex) return;
          const newArr = reorder(backgroundMaps, oldIndex, newIndex);
          store.dispatch(setBackgroundMaps(newArr));
          reArrangeRPCLayerOrder(store, newArr);
        }}
        renderList={({ children, props }) => (
          <ListRoot {...props}>
            {children}
          </ListRoot>
        )}
        renderItem={({ value, props: itemProps, isDragged }) => {
          const mergedStyle = {
            marginBottom: 8,
            ...itemProps.style
          };
          const handleProps = itemProps.dragHandleProps || null;
          const { dragHandleProps, ...restProps } = itemProps;
          return (
            <li key={value.id} {...restProps} style={mergedStyle} data-is-dragging={isDragged ? 'true' : 'false'}>
              <SelectedLayer
                layer={value}
                uuid={value?.metadataIdentifier}
                currentZoomLevel={currentZoomLevel}
                handleProps={handleProps}
                filtersEnabled={false}
              />
            </li>
          );
        }}
      />

      <StyledDeleteAllSelectedLayers onClick={handleClearSelectedBackgroundMaps}>
        <p>{strings.layerlist.layerlistLabels.clearSelectedBackgroundMaps}</p>
      </StyledDeleteAllSelectedLayers>
    </StyledSelectedLayers>
  );
};

export default SelectedLayers;
