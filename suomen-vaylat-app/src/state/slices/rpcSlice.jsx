import { createSlice } from '@reduxjs/toolkit';
import { Logger } from '../../utils/logger';

const LOG = new Logger('RPCSlice');

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
  tags: [],
  zoomRange: {},
  currentZoomLevel: 0,
  selectedLayers: [],
  announcements: [],
  activeAnnouncements: [],
  allThemesWithLayers: [],
  filter: null,
  suomenVaylatLayers: [],
  tagsWithLayers: {},
  layerMetadata: { data: null, layer: null, uuid: null}
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
    setFilter: (state, action) => {
        state.filter = action.payload;
    },
    setAllLayers: (state, action) => {
        const selectedLayers = action.payload.filter(layer => layer.visible === true)
        if (selectedLayers.length > 0) {
            state.selectedLayers = selectedLayers;
        }
        state.allLayers = action.payload;
    },
    setAllTags: (state, action) => {
        state.allTags = action.payload;
    },
    setTags: (state, action) => {
        state.tags = action.payload;
    },
    setTagsWithLayers: (state, action) => {
        state.tagsWithLayers = action.payload;
    },
    setAllThemesWithLayers: (state, action) => {
        state.allThemesWithLayers = action.payload;
    },
    setAnnouncements: (state, action) => {
        state.announcements = action.payload;
    },
    setActiveAnnouncements: (state, action) => {
        state.activeAnnouncements = action.payload;
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
    setSelectedLayers: (state, action) => {
        const data = action;
        state.selectedLayers = data;
    },
    setSelectedLayerIds: (state, action) => {
        const oldSelectedLayers = action.payload.selectedLayers;
        var newSelectedLayers = [...oldSelectedLayers];
        if (newSelectedLayers.length > 0) {
            newSelectedLayers.push([...action.payload.layers]);
        } else {
            newSelectedLayers.push([...action.payload.layers]);
        }
        state.selectedLayerIds = newSelectedLayers;
    },
    setMapLayerVisibility: (state, action) => {
        var layer = action.payload.layer;
        state.channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, !layer.visible]);
    },
    setOpacity: (state, action) => {
        state.channel !== null && state.channel.postRequest('ChangeMapLayerOpacityRequest', [action.payload.id, action.payload.value]);
    },
    setZoomIn: (state, action) => {
        state.channel !== null && state.channel.zoomIn(function (data) {
            LOG.log('Zoom level after: ', data);
        });
    },
    setZoomOut: (state, action) => {
        state.channel !== null && state.channel.zoomOut(function (data) {
            LOG.log('Zoom level after: ', data);
        });
    },
    setZoomTo: (state, action) => {
        state.channel !== null && state.channel.zoomTo([action.payload], function (data) {
            LOG.log('Zoom level after: ', data);
        });
    },
    searchVKMRoad: (state, action) => {
        if (state.channel !== null) {
            state.channel.searchVKMRoad(action.payload.search, action.payload.handler, (err) => {
                if (typeof action.payload.errorHandler === 'function') {
                    action.payload.errorHandler(err);
                } else {
                    LOG.warn('VKM search failed');
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
    },
    setSuomenVaylatLayers: (state, action) => {
        state.suomenVaylatLayers = action.payload;
    },
    getLayerMetadata: (state, action) => {
        state.channel && state.channel.getLayerMetadata([action.payload.uuid], (data) => {
            action.payload.handler(data, action.payload.layer, action.payload.uuid)
        }, (err) => {
            if (typeof action.payload.errorHandler === 'function') {
                action.payload.errorHandler(err);
            } else {
                LOG.warn('Get layer metadata failed');
            }
        });
    },
    clearLayerMetadata: (state) => {
        state.layerMetadata = {
            data: null,
            layer: null
        };
    },
    setLayerMetadata: (state, action) => {
        state.layerMetadata = {
            layer: action.payload.layer,
            data: action.payload.data,
            uuid: action.payload.uuid
        };
    }
  }
});

export const {
    setLoading,
    setChannel,
    setAllGroups,
    setAllLayers,
    setAllTags,
    setTags,
    setCurrentState,
    setFeatures,
    setTagLayers,
    setZoomRange,
    setZoomLevelsLayers,
    setSelectedLayerIds,
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
    mapMoveRequest,
    setSelectedLayers,
    setAllThemesWithLayers,
    setActiveAnnouncements,
    setFilter,
    setSuomenVaylatLayers,
    getLayerMetadata,
    clearLayerMetadata,
    setLayerMetadata,
    setTagsWithLayers
} = rpcSlice.actions;

export default rpcSlice.reducer;
