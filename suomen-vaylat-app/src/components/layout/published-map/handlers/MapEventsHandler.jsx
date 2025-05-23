import { theme } from '../../../../theme/theme';
import { GFI_GEOMETRY_LAYER_ID } from '../../../../utils/constants';
import {
  addMarkerRequest,
  removeMarkerRequest,
  resetGFILocations,
  setGFILocations,
  setPointInfo,
  setVKMData
} from '../../../../state/slices/rpcSlice';
import {
  addToDrawToolMarkers,
  addToGeoJsonArray,
  removeFromDrawToolMarkers,
  setIsGfiOpen,
  setMinimizeGfi
} from '../../../../state/slices/uiSlice';
import strings from '../../../../translations';

const MapEventsHandler = ({ channel, store }) => {
  channel.handleEvent('DrawingEvent', (data) => {
    if (
      store.getState().ui.activeTool &&
      data.isFinished &&
      data.geojson.features.length > 0
    ) {
      store.getState().ui.activeTool !== strings.tooltips.drawingTools.marker &&
        store.dispatch(addToGeoJsonArray(data));
    }
  });

  channel.handleEvent('PointInfoEvent', (data) => {
    store.dispatch(
      setPointInfo({ lon: data.coordinates.x, lat: data.coordinates.y })
    );
    if (data.vkm !== null && store.getState().ui.activeSelectionTool === null) {
      store.dispatch(setVKMData(data));
    }
    if (
      store.getState().ui.activeTool === strings.tooltips.drawingTools.marker
    ) {
      if (store.getState().ui.selectedMarker !== 7) {
        const markerId = `${data.coordinates.x}_${data.coordinates.y}_id`;
        const customMarker = {
          x: data.coordinates.x,
          y: data.coordinates.y,
          markerId,
          shape: store.getState().ui.selectedMarker,
          msg: store.getState().ui.markerLabel,
          color: theme.colors.mainColor2
        };
        store.dispatch(addToDrawToolMarkers(customMarker));
        store.dispatch(addMarkerRequest(customMarker));
      }
    }
  });

  channel.handleEvent('MapClickedEvent', () => {
    store.dispatch(setVKMData(null));
    store.dispatch(removeMarkerRequest({ markerId: 'VKM_MARKER' }));
    store.dispatch(resetGFILocations([]));
  });

  channel.handleEvent('DataForMapLocationEvent', (data) => {
    if (
      store.getState().ui.activeSelectionTool === null &&
      store.getState().ui.activeTool === null
    ) {
      channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [
        null,
        null,
        GFI_GEOMETRY_LAYER_ID
      ]);

      store.dispatch(
        addMarkerRequest({
          x: data.x,
          y: data.y,
          markerId: 'VKM_MARKER',
          shape:
            '<svg xmlns="http://www.w3.org/2000/svg" fill="#0064af" viewBox="0 0 384 512"><path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/></svg>',
          size: 5,
          offsetX: 13,
          offsetY: 7
        })
      );

      store.getState().ui.minimizeGfi && store.dispatch(setMinimizeGfi(false));
      store.dispatch(setIsGfiOpen(true));
      store.dispatch(setGFILocations(data));
    }
  });

  channel.handleEvent('MarkerClickEvent', (event) => {
    if (
      store.getState().ui.selectedMarker === 7 &&
      store.getState().ui.drawToolMarkers.length > 0
    ) {
      store.dispatch(removeMarkerRequest({ markerId: event.id }));
      store.dispatch(removeFromDrawToolMarkers(event.id));
    }
  });

  return null;
};

export default MapEventsHandler;
