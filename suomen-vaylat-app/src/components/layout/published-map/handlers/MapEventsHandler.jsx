import { theme } from '../../../../theme/theme';
import { GFI_GEOMETRY_LAYER_ID } from '../../../../utils/constants';
import {
  addMarkerRequest,
  removeMarkerRequest,
  resetGFILocations,
  pushGFILocations,
  setPointInfo,
  setVKMData,
  setGFICroppingArea,
  setCurrentMapCenter,
  setScaleBarState
} from '../../../../state/slices/rpcSlice';
import {
  addToDrawToolMarkers,
  addToGeoJsonArray,
  removeFromDrawToolMarkers,
  setIsGfiOpen,
  setMinimizeGfi
} from '../../../../state/slices/uiSlice';

const MapEventsHandler = ({ channel, store }) => {

  // this adds drawings to geojsonArray for tools
  // TODO: the addToGeoJsonArray and setGeojsonArray functions are confusing and might be called too often
  channel.handleEvent('DrawingEvent', (data) => {
    if (
      store.getState().ui.activeTool &&
      data.isFinished &&
      data.geojson.features.length > 0
    ) {
      store.getState().ui.activeTool !== "marker" &&
        store.dispatch(addToGeoJsonArray(data));
    }
  });

  channel.handleEvent('PointInfoEvent', (data) => {
    store.dispatch(
      setPointInfo({ lon: data.coordinates.x, lat: data.coordinates.y })
    );
    if (
      data.vkm !== null &&
      store.getState().ui.activeSelectionTool === null &&
      store.getState().ui.activeTool === null &&
      store.getState().ui.selectedMarker !== 7
    ) {
      store.dispatch(setVKMData(data));
    }
    if (
      store.getState().ui.activeTool === "marker"
    ) {
      let marker_id = data.coordinates.x + data.coordinates.y + '_id';
      const customMarker = {
        x: data.coordinates.x,
        y: data.coordinates.y,
        markerId: marker_id,
        shape: store.getState().ui.selectedMarker,
        msg: store.getState().ui.markerLabel,
        color: theme.colors.mainColor2,
        size: 5,
        offsetX: 0,
        offsetY: 7
      };
      if (store.getState().ui.selectedMarker !== 7) {
        store.dispatch(addToDrawToolMarkers(customMarker));
        store.getState().ui.selectedMarker !== 7 &&
          store.dispatch(addMarkerRequest(customMarker));
      }
    }
  });

  channel.handleEvent('MapClickedEvent', (data) => {
    // TODO: have every mapclick put in a new marker, it's not working atm for some reason
    store.dispatch(setVKMData(null));
    store.dispatch(removeMarkerRequest({ markerId: 'VKM_MARKER' }));
    //store.dispatch(resetGFILocations([]));
  });

  channel.handleEvent('DataForMapLocationEvent', (data) => {
    if (data.content && data.content.features) {
      data.content.features.forEach((f) => {
        if (f.properties) {
          Object.keys(f.properties).forEach((k) => {
            if (typeof f.properties[k] === 'object') {
              f.properties[k] = JSON.stringify(f.properties[k]);
            }
          });
        }
      });
    }

    // reformat data to same way croppings are
    // might need to be 'fixed' later
    const features = data.content;
    let geojson = { geojson: features };
    let reformattedData = {};
    reformattedData.content = [geojson];
    data.content = reformattedData.content;

    if (
      store.getState().ui.activeSelectionTool === null &&
      store.getState().ui.activeTool === null
    ) {
      channel &&
        channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [
          null,
          null,
          GFI_GEOMETRY_LAYER_ID
        ]);

      var MARKER_ID = 'VKM_MARKER';

      store.dispatch(
        addMarkerRequest({
          x: data.x,
          y: data.y,
          markerId: MARKER_ID,
          shape:
            '<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="#0064af" viewBox="0 0 384 512"><path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/></svg>',
          size: 5,
          offsetX: 13,
          offsetY: 7
        })
      );
      const croppingArea = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [data.x, data.y]
        }
      };

      store.dispatch(setGFICroppingArea(croppingArea));
      store.getState().ui.minimizeGfi && store.dispatch(setMinimizeGfi(false));
      !store.getState().ui.isGfiOpen && store.dispatch(setIsGfiOpen(true));

      const currentGfiLocations = [...store.getState().rpc.gfiLocations]; // or wherever your gfiLocations live
      const newLayerId = data.layerId || (data.content && data.content[0] && data.content[0].layerId);

      const alreadyPresent = currentGfiLocations.some(
        loc => loc.layerId === newLayerId
      );

      if (alreadyPresent) {
        store.dispatch(resetGFILocations([]));
      } 
      store.dispatch(pushGFILocations(data));
      
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

  channel.handleEvent('AfterMapMoveEvent', (event) => {
    store.dispatch(setCurrentMapCenter(event));
  });

  channel.handleEvent('ScaleBarEvent', function (data) {
    store.dispatch(setScaleBarState(data));
  });

  return null;
};

export default MapEventsHandler;
