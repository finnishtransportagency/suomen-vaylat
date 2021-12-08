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
  warnings: {
      show: false,
      message: '',
      type: '',
      filteredLayers: [],
      indeterminate: false,
      isChecked: null
  },
  announcements: [],
  activeAnnouncements: [],
  allThemesWithLayers: [],
  selectedTheme: null,
  lastSelectedTheme: null,
  selectedThemeIndex: null,
  filter: null,
  layerMetadata: { data: null, layer: null, uuid: null},
  legends: [],
  tagsWithLayers: {},
  gfiLocations: [],
  center: {
      x: 0,
      y: 0
  }
};

export const rpcSlice = createSlice({
  name: 'rpc',
  initialState,
  reducers: {
    setLoading: (state, action) => {
        state.loading = action.payload;
        LOG.log('setLoading to ' + action.payload);
    },
    setChannel: (state, action) => {
        state.channel = action.payload;
        LOG.log('setChannel to ', action.payload);
    },
    setAllGroups: (state, action) => {
        state.allGroups = action.payload;
        LOG.log('setAllGroups to ', action.payload);
    },
    setFilter: (state, action) => {
        state.filter = action.payload;
        LOG.log('setFilter to ' + action.payload);
    },
    setAllLayers: (state, action) => {
        const selectedLayers = action.payload.filter(layer => layer.visible === true);
        state.selectedLayers = selectedLayers;
        state.allLayers = action.payload;
        LOG.log('setAllLayers to ', action.payload);
        LOG.log('and selected layers to ', selectedLayers);
    },
    setSelectedLayers: (state, action) => {
        state.selectedLayers = action.payload;
        LOG.log('setSelectedLayers to ', action.payload);
    },
    setSelectError: (state,action) => {
        state.warnings = {
            show: action.payload.show,
            message: action.payload.message,
            type: action.payload.type,
            filteredLayers: action.payload.filteredLayers,
            indeterminate: action.payload.indeterminate,
            isChecked: action.payload.isChecked
        };
        LOG.log('setSelectError to ', action.payload);
    },
    setAllTags: (state, action) => {
        state.allTags = action.payload;
        LOG.log('setAllTags to ', action.payload);
    },
    setTags: (state, action) => {
        state.tags = action.payload;
        LOG.log('setTags to ', action.payload);
    },
    setTagsWithLayers: (state, action) => {
        state.tagsWithLayers = action.payload;
        LOG.log('setTagsWithLayers to ', action.payload);
    },
    setAllThemesWithLayers: (state, action) => {
        state.allThemesWithLayers = action.payload;
        LOG.log('setAllThemesWithLayers to ', action.payload);
    },
    setSelectedTheme: (state, action) => {
        state.selectedTheme = action.payload;
        LOG.log('setSelectedTheme to ', action.payload);
    },
    setLastSelectedTheme: (state, action) => {
        state.lastSelectedTheme = action.payload;
        LOG.log('setLastSelectedTheme to ', action.payload);
    },
    setSelectedThemeIndex: (state, action) => {
        state.selectedThemeIndex = action.payload;
        LOG.log('setSelectedThemeIndex to ' + action.payload);
    },
    setAnnouncements: (state, action) => {
        state.announcements = action.payload;
        LOG.log('setAnnounchements to ', action.payload);
    },
    setActiveAnnouncements: (state, action) => {
        state.activeAnnouncements = action.payload;
        LOG.log('setActiveAnnounchements to ', action.payload);
    },
    setFeatures: (state, action) => {
        state.features = action.payload;
        LOG.log('setFeatures to ', action.payload);
    },
    setCurrentState: (state, action) => {
        state.currentState = action.payload;
        LOG.log('setCurrentState to ', action.payload);
    },
    setTagLayers: (state, action) => {
        state.tagLayers = action.payload;
        LOG.log('setTagLayers to ', action.payload);
    },
    setZoomRange: (state, action) => {
        state.zoomRange = action.payload;
        LOG.log('setZoomRange to ' + action.payload);
    },
    setZoomLevelsLayers: (state, action) => {
        state.zoomLevelsLayers = action.payload;
        LOG.log('setZoomLevelsLayers to ', action.payload);
    },
    setMapLayerVisibility: (state, action) => {
        var layer = action.payload;
        state.channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, !layer.visible]);
        LOG.log('setMapLayerVisibility to ', action.payload);
    },
    setOpacity: (state, action) => {
        state.channel !== null && state.channel.postRequest('ChangeMapLayerOpacityRequest', [action.payload.id, action.payload.value]);
        LOG.log('setOpacity to ', action.payload);
    },
    setZoomIn: (state, action) => {
        state.channel !== null && state.channel.zoomIn(function (data) {});
        LOG.log('setZoomIn');
    },
    setZoomOut: (state, action) => {
        state.channel !== null && state.channel.zoomOut(function (data) {});
        LOG.log('setZoomOut');
    },
    setZoomTo: (state, action) => {
        state.channel !== null && state.channel.zoomTo([action.payload], function (data) {});
        LOG.log('setZoomTo to ' + action.payload);
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
        LOG.log('searchVKMRoad ', action.payload);
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
        LOG.log('addFeaturesToMap ', action.payload);
    },
    removeFeaturesFromMap: (state, action) => {
        state.channel !== null && state.channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [null, null, action.payload.layerId]);
        LOG.log('removeFeaturesFromMap ', action.payload);
    },
    setCurrentZoomLevel: (state, action) => {
        state.currentZoomLevel = action.payload;
        LOG.log('setCurrentZoomLevel to ' + action.payload);
    },
    searchRequest: (state, action) => {
        state.channel !== null && state.channel.postRequest('SearchRequest', [action.payload]);
        LOG.log('searchRequest ' + action.payload);
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
        LOG.log('addMarkerRequest ', action.payload);
    },
    removeMarkerRequest: (state, action) => {
        state.channel !== null && state.channel.postRequest('MapModulePlugin.RemoveMarkersRequest', [action.payload.markerId]);
        LOG.log('removeMarkerRequest ', action.payload);
    },
    mapMoveRequest: (state, action) => {
        state.channel !== null && state.channel.postRequest('MapMoveRequest', [action.payload.x, action.payload.y, action.payload.zoom || 10]);
        LOG.log('mapMoveRequest ', action.payload);
    },
    getLayerMetadata: (state, action) => {
        state.channel && state.channel.getLayerMetadata([action.payload.uuid], (data) => {
            LOG.log('Metadata getted ', data, action.payload.layer, action.payload.uuid);
            action.payload.handler(data, action.payload.layer, action.payload.uuid);
        }, (err) => {
            if (typeof action.payload.errorHandler === 'function') {
                action.payload.errorHandler(err);
                LOG.warn('metadata get error', err);
            } else {
                LOG.warn('Get layer metadata failed');
            }
        });
        LOG.log('getLayerMetadata ', action.payload);
    },
    clearLayerMetadata: (state) => {
        state.layerMetadata = {
            data: null,
            layer: null
        };
        LOG.log('clearLayerrMetadata');
    },
    setLayerMetadata: (state, action) => {
        state.layerMetadata = {
            layer: action.payload.layer,
            data: action.payload.data,
            uuid: action.payload.uuid
        };
        LOG.log('setLayerMetadata to ', action.payload);
    },
    getLegends: (state, action) => {
        state.channel && state.channel.getLegends((data) => {
            if (typeof action.payload.handler === 'function') {
                action.payload.handler(data);
                LOG.log(' --> legends getted', data);
            }
        });
        LOG.log('getLegends ', action.payload);
    },
    setLegends: (state, action) => {
        state.legends = action.payload;
        LOG.log('setLegends to ', action.payload);
    },
    setCurrentMapCenter: (state, action) => {
        state.center.x = action.payload.centerX;
        state.center.y = action.payload.centerY;
        state.currentZoomLevel = action.payload.zoom;
        LOG.log('setCurrentMapCenter to ', action.payload);
    },
    changeLayerStyle: (state, action) => {
        state.channel !== null && state.channel.postRequest('ChangeMapLayerStyleRequest', [action.payload.layerId, action.payload.style]);
        LOG.log('changeLayerStyle ', action.payload);
    },
    reArrangeSelectedMapLayers: (state, action) => {
        state.channel !== null && state.channel.postRequest('RearrangeSelectedMapLayerRequest', [action.payload.layerId, action.payload.position]);
    },
    setGFILocations: (state, action) => {
      state.gfiLocations.push(action.payload);
    },
    resetGFILocations: (state, action) => {
      state.gfiLocations = action.payload;
    },
    removeAllSelectedLayers: (state, action) => {
        const groupId = (action.payload && action.payload.notRemoveLayersByGroupId) || null;
        state.selectedLayers.forEach(l => {
            if (groupId !== null) {
                if (l && l.groups && !l.groups.includes(groupId)) {
                    state.channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [l.id, false]);
                }
            } else {
                state.channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [l.id, false]);
            }
        });
    }
  }
});

export const {
    setLoading,
    setChannel,
    setAllGroups,
    setAllLayers,
    setSelectedLayers,
    setAllTags,
    setTags,
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
    setSelectError,
    searchVKMRoad,
    addFeaturesToMap,
    removeFeaturesFromMap,
    setCurrentZoomLevel,
    searchRequest,
    addMarkerRequest,
    removeMarkerRequest,
    mapMoveRequest,
    setAllThemesWithLayers,
    setSelectedTheme,
    setLastSelectedTheme,
    setSelectedThemeIndex,
    setActiveAnnouncements,
    setFilter,
    getLayerMetadata,
    clearLayerMetadata,
    setLayerMetadata,
    getLegends,
    setLegends,
    setTagsWithLayers,
    setCurrentMapCenter,
    changeLayerStyle,
    reArrangeSelectedMapLayers,
    setGFILocations,
    resetGFILocations,
    removeAllSelectedLayers
} = rpcSlice.actions;

export default rpcSlice.reducer;
