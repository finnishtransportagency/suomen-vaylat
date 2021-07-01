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
    setCurrentZoomLevel
} = rpcSlice.actions;

export default rpcSlice.reducer;
