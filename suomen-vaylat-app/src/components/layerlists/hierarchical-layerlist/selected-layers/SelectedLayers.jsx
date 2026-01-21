import React, { useContext } from 'react';
import styled from 'styled-components';
import { List } from 'react-movable';
import { ReactReduxContext } from 'react-redux';
import SelectedLayer from './SelectedLayer';
import {
  setBackgroundMaps,
  setMapLayers
} from '../../../../state/slices/rpcSlice';
import {
  reArrangeRPCLayerOrder,
  resetThemeGroups,
  updateLayers
} from '../../../../utils/rpcUtil';
import strings from '../../../../translations';
import { useAppSelector } from '../../../../state/hooks';

const StyledSelectedLayers = styled.div`
  margin: 0.5em;
`;

const StyledDeleteAllSelectedLayers = styled.div`
  width: 250px;
  height: 40px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.colors.mainWhite};
  background-color: ${(props) => props.theme.colors.mainColor1};
  margin: 20px auto;
  border-radius: 20px;
  box-shadow: 0px 1px 3px #0000001f;
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
  color: ${(props) => props.theme.colors.mainColor1};
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

function reorder(list, startIndex, endIndex) {
  const result = Array.from(list || []);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

export const SelectedLayers = ({ currentZoomLevel }) => {
  const { store } = useContext(ReactReduxContext);
  const { channel, selectedLayersByType, filters } = useAppSelector(
    (state) => state.rpc
  );
  const mapLayers = selectedLayersByType?.mapLayers || [];
  const backgroundMaps = selectedLayersByType?.backgroundMaps || [];

  const handleClearSelectedLayers = () => {
    mapLayers.forEach((layer) =>
      channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [
        layer.id,
        !layer.visible
      ])
    );
    resetThemeGroups(store);
    store.dispatch(setMapLayers([]));
    updateLayers(store, channel);
  };

  const handleClearSelectedBackgroundMaps = () => {
    backgroundMaps.forEach((layer) =>
      channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [
        layer.id,
        !layer.visible
      ])
    );
    store.dispatch(setBackgroundMaps([]));
    updateLayers(store, channel);
  };

  return (
    <StyledSelectedLayers>
      <StyledListSubtitle>
        {strings.layerlist.layerlistLabels.mapLayers}
      </StyledListSubtitle>

      <List
        values={mapLayers}
        onChange={({ oldIndex, newIndex }) => {
          if (oldIndex === newIndex) return;
          const newArr = reorder(mapLayers, oldIndex, newIndex);
          store.dispatch(setMapLayers(newArr));
          reArrangeRPCLayerOrder(store, newArr);
        }}
        renderList={({ children, props }) => (
          <ListRoot {...props}>{children}</ListRoot>
        )}
        renderItem={({ value, props: itemProps, isDragged }) => {
          const {
            key: _key,
            children: _children,
            style: itemStyle,
            ...restProps
          } = itemProps;

          const mergedStyle = {
            marginBottom: 8,
            ...itemStyle
          };

          return (
            <div
              key={String(value.id)}
              {...restProps}
              style={mergedStyle}
              data-is-dragging={isDragged ? 'true' : 'false'}
            >
              <SelectedLayer
                layer={value}
                uuid={value?.metadataIdentifier}
                currentZoomLevel={currentZoomLevel}
                style={{}}
                filtersEnabled={
                  filters &&
                  filters.length > 0 &&
                  filters.some((filter) => filter.layer === value.id)
                }
              />
            </div>
          );
        }}
      />

      <StyledDeleteAllSelectedLayers onClick={handleClearSelectedLayers}>
        <p>{strings.layerlist.layerlistLabels.clearSelectedMapLayers}</p>
      </StyledDeleteAllSelectedLayers>

      <StyledListSubtitle>
        {strings.layerlist.layerlistLabels.backgroundMaps}
      </StyledListSubtitle>

      <List
        values={backgroundMaps}
        onChange={({ oldIndex, newIndex }) => {
          if (oldIndex === newIndex) return;
          const newArr = reorder(backgroundMaps, oldIndex, newIndex);
          store.dispatch(setBackgroundMaps(newArr));
          reArrangeRPCLayerOrder(store, newArr);
        }}
        renderList={({ children, props }) => (
          <ListRoot {...props}>{children}</ListRoot>
        )}
        renderItem={({ value, props: itemProps, isDragged }) => {
          const {
            key: _key,
            children: _children,
            style: itemStyle,
            ...restProps
          } = itemProps;

          const mergedStyle = {
            marginBottom: 8,
            ...itemStyle
          };

          return (
            <div
              key={String(value.id)}
              {...restProps}
              style={mergedStyle}
              data-is-dragging={isDragged ? 'true' : 'false'}
            >
              <SelectedLayer
                layer={value}
                uuid={value?.metadataIdentifier}
                currentZoomLevel={currentZoomLevel}
                style={{}}
                filtersEnabled={
                  filters &&
                  filters.length > 0 &&
                  filters.some((filter) => filter.layer === value.id)
                }
              />
            </div>
          );
        }}
      />

      <StyledDeleteAllSelectedLayers
        onClick={handleClearSelectedBackgroundMaps}
      >
        <p>{strings.layerlist.layerlistLabels.clearSelectedBackgroundMaps}</p>
      </StyledDeleteAllSelectedLayers>
    </StyledSelectedLayers>
  );
};

export default SelectedLayers;
