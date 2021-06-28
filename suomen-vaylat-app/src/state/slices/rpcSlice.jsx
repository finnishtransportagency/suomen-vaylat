import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: true,
  channel: null,
  allGroups: [],
  allLayers: [],
  allTags: [],
  features: {},
  currentState: {},
  zoomLevelsLayers: {},
  tagLayers: [],
  zoomRange: {},
  currentZoomLevel: 0
};

export const rpcSlice = createSlice({
  name: 'rpc',
  initialState,
  reducers: {
    setLoading: (state, action) => {
        state.loading = action.payload;
    },
    setChannel: (state, action) => {
        state.channel = action.payload;
    },
    setAllGroups: (state, action) => {
        state.allGroups = action.payload;
    },
    setAllLayers: (state, action) => {
        state.allLayers = action.payload;
    },
    setAllTags: (state, action) => {
        state.allTags = action.payload;
    },
    setFeatures: (state, action) => {
        state.features = action.payload;
    },
    setCurrentState: (state, action) => {
        state.currentState = action.payload;
    },
    setTagLayers: (state, action) => {
        state.tagLayers = action.payload;
    },
    setZoomRange: (state, action) => {
        state.zoomRange = action.payload;
    },
    setZoomLevelsLayers: (state, action) => {
        state.zoomLevelsLayers = action.payload;
    },
    setMapLayerVisibility: (state, action) => {
        state.channel !== null && state.channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [action.payload.id, action.payload.value]);
    },
    setOpacity: (state, action) => {
        state.channel !== null && state.channel.postRequest('ChangeMapLayerOpacityRequest', [action.payload.id, action.payload.value]);
    },
    setZoomIn: (state, action) => {
        state.channel !== null && state.channel.zoomIn(function (data) {
            console.log('Zoom level after: ', data);
        });
    },
    setZoomOut: (state, action) => {
        state.channel !== null && state.channel.zoomOut(function (data) {
            console.log('Zoom level after: ', data);
        });
    },
    setZoomTo: (state, action) => {
        state.channel !== null && state.channel.zoomTo([action.payload], function (data) {
            console.log('Zoom level after: ', data);
        });
    },
    searchVKMRoad: (state, action) => {
        if (state.channel !== null) {
            state.channel.searchVKMRoad(action.payload.search, action.payload.handler, (err) => {
                if (typeof action.errorHandler === 'function') {
                    action.errorHandler(err);
                } else {
                    // FIXME Tee virheen käsittely
                    console.log('Tee virheenkorjaus, esim. tie= 2, osa=9', err);
                }
            });
        }
    },
    addFeaturesToMap: (state, action) => {
        state.channel !== null && state.channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest',
        [action.payload.geojson, {
            layerId: action.payload.layerId,
            centerTo:action.payload.centerTo || true,
            featureStyle: action.payload.featureStyle,
            hover: action.payload.hover,
            maxZoomLevel: action.payload.maxZoomLevel || 4
        }]);
    },
    removeFeaturesFromMap: (state, action) => {
        state.channel !== null && state.channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [null, null, action.payload.layerId]);
    setCurrentZoomLevel: (state, action) => {
        state.currentZoomLevel = action.payload;
    }
  }
});

export const {
    setLoading,
    setChannel,
    setAllGroups,
    setAllLayers,
    setAllTags,
    setCurrentState,
    setFeatures,
    setTagLayers,
    setZoomRange,
    setZoomLevelsLayers,
    setMapLayerVisibility,
    setOpacity,
    setZoomIn,
    setZoomOut,
    setZoomTo,
    searchVKMRoad,
    addFeaturesToMap,
    removeFeaturesFromMap,
    setCurrentZoomLevel
} = rpcSlice.actions;

export default rpcSlice.reducer;
