import React, { useContext } from 'react';
import styled from 'styled-components';
import { ReactReduxContext } from 'react-redux';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import CircleButton from '../../../utils/components/CircleButton';
import { useAppSelector } from '../../../state/hooks';
import { setIsGfiDownloadOpen } from '../../../state/slices/uiSlice';
import strings from '../../../translations';

import {
  setIsDrawingToolsOpen,
  setActiveTool,
  setGeoJsonArray,
  setSelectedMarker,
  removeFromDrawToolMarkers
} from '../../../state/slices/uiSlice';

import { removeMarkerRequest } from '../../../state/slices/rpcSlice';

const StyledLayerCount = styled.div`
  position: absolute;
  top: -7px;
  right: -8px;
  width: 24px;
  height: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  color: ${(props) => props.theme.colors.mainWhite};
  background-color: ${(props) => props.theme.colors.secondaryColorDarkOrange};
  font-size: 14px;
  font-weight: 600;
`;

const FeatureDataDownloadDialogButton = () => {
  const { store } = useContext(ReactReduxContext);
  const { channel } = useAppSelector((state) => state.rpc);
  const { drawToolMarkers } = useAppSelector((state) => state.ui);
  const { selectedLayers, downloads, selectedLayersByType, isGfiDownloadOpen } =
    useAppSelector((state) => ({
      selectedLayers: state.rpc.selectedLayers,
      downloads: state.rpc.downloads,
      selectedLayersByType: state.rpc.selectedLayersByType,
      isGfiDownloadOpen: state.ui.isGfiDownloadOpen
    }));

  const nonBgMaps = selectedLayers.filter(
    (layer) =>
      layer.groups?.every((group) => group !== 1) &&
      selectedLayersByType.backgroundMaps.filter((l) => l.id === layer.id)
        .length === 0
  );

  const closeDrawingTools = (open) => {
    // remove geometries off the map
    channel && channel.postRequest('DrawTools.StopDrawingRequest');
    store.dispatch(setGeoJsonArray([]));
    store.dispatch(setActiveTool(null));
    drawToolMarkers.forEach((marker) => {
      store.dispatch(removeMarkerRequest({ markerId: marker }));
    });
    store.dispatch(setIsDrawingToolsOpen(open));
    store.dispatch(setSelectedMarker(2));
    // remove all markers made with drawing tools
    drawToolMarkers.forEach((marker) => {
      store.dispatch(removeMarkerRequest({ markerId: marker.markerId }));
      store.dispatch(removeFromDrawToolMarkers(marker.markerId));
    });
  };

  return (
    <CircleButton
      disabled={nonBgMaps.length === 0}
      icon={faDownload}
      text={strings.downloads.downloads}
      toggleState={isGfiDownloadOpen}
      tooltipDirection="right"
      clickAction={() => {
        closeDrawingTools(false);
        store.dispatch(setIsGfiDownloadOpen(!isGfiDownloadOpen));
      }}
    >
      <StyledLayerCount>
        {downloads.filter((download) => download.url !== null).length}
      </StyledLayerCount>
    </CircleButton>
  );
};

export default FeatureDataDownloadDialogButton;
