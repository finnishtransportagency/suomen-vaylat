import { createSlice, current } from '@reduxjs/toolkit';

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
  currentZoomLevel: 0,
  selectedLayers: []
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
        console.log(state.zoomRange);
        state.zoomRange = action.payload;
    },
    setZoomLevelsLayers: (state, action) => {
        state.zoomLevelsLayers = action.payload;
    },
    setMapLayerVisibility: (state, action) => {
        var selectedLayers = action.payload.selectedLayers.selectedLayers;
        if (selectedLayers === action.payload.layer) {
            return; // relying on immutability; same identity -> no changes
        }
        const selectedLayersMap = new Map(selectedLayers.map((layer) => [layer]));
        const toDelete = selectedLayers.filter((layer) => layer.id == action.payload.layer[0].id);
        toDelete.length > 0 ?
            state.channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [toDelete[0].id, false])
            :
            state.channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [action.payload.layer[0].id, true]);
        var array = [...selectedLayers];
        if (array.includes(action.payload.layer[0])) {
            const filteredArray = array.filter(e => e.id != action.payload.layer[0].id);
            state.selectedLayers = filteredArray;
        }  else {
            array.push(action.payload.layer[0]);
            state.selectedLayers = array;
        }
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
                if (typeof action.payload.errorHandler === 'function') {
                    action.payload.errorHandler(err);
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
            maxZoomLevel: action.payload.maxZoomLevel || 4,
            clearPrevious: action.payload.clearPrevious || true
        }]);
    },
    removeFeaturesFromMap: (state, action) => {
        state.channel !== null && state.channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [null, null, action.payload.layerId]);
    },
    setCurrentZoomLevel: (state, action) => {
        state.currentZoomLevel = action.payload;
    },
    searchRequest: (state, action) => {
        state.channel !== null && state.channel.postRequest('SearchRequest', [action.payload]);
    },
    addMarkerRequest: (state, action) => {
        const data =  {
            x: action.payload.x,
            y: action.payload.y,
            msg: action.payload.msg || '',
            shape: action.payload.shape || 2,
            size: action.payload.size || 7,
            color: action.payload.color || '0064af'
        };
        state.channel !== null && state.channel.postRequest('MapModulePlugin.AddMarkerRequest', [data, action.payload.markerId]);
    },
    removeMarkerRequest: (state, action) => {
        state.channel !== null && state.channel.postRequest('MapModulePlugin.RemoveMarkersRequest', [action.payload.markerId]);
    },
    mapMoveRequest: (state, action) => {
        state.channel !== null && state.channel.postRequest('MapMoveRequest', [action.payload.x, action.payload.y, action.payload.zoom || 10]);
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
    setCurrentZoomLevel,
    searchRequest,
    addMarkerRequest,
    removeMarkerRequest,
    mapMoveRequest
} = rpcSlice.actions;

export default rpcSlice.reducer;
