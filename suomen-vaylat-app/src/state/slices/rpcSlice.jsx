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
  scaleBarState: null,
  tagLayers: [],
  tags: [],
  zoomRange: {},
  currentZoomLevel: 0,
  selectedLayers: [],
  warnings: {
      show: false,
      errors: [],
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
  },
  gfiPoint: null,
  startState: {
      x: null,
      y: null,
      selectedLayers: [],
      zoom: null
  }
};

export const rpcSlice = createSlice({
  name: 'rpc',
  initialState,
  reducers: {
    /**
     * Set loading true/false --> show loading icon.
     * @method setLoading
     * @param {Object} state
     * @param {Object} action
     */
    setLoading: (state, action) => {
        state.loading = action.payload;
        LOG.log('setLoading to ' + action.payload);
    },

    /**
     * Set channel.
     * @method setChannel
     * @param {Object} state
     * @param {Object} action
     */
    setChannel: (state, action) => {
        state.channel = action.payload;
        LOG.log('setChannel to ', action.payload);
    },

    /**
     * Set all maplayer groups.
     * @method setAllGroups
     * @param {Object} state
     * @param {Object} action
     */
    setAllGroups: (state, action) => {
        state.allGroups = action.payload;
        LOG.log('setAllGroups to ', action.payload);
    },

    /**
     * Set maplayer filter
     * @method setFilter
     * @param {Object} state
     * @param {Object} action
     */
    setFilter: (state, action) => {
        state.filter = action.payload;
        LOG.log('setFilter to ' + action.payload);
    },

    /**
     * Set all layers.
     * Not use this function directly, use rpcUtil/updateLayers function.
     * @param {Object} state
     * @param {Object} action
     */
    setAllLayers: (state, action) => {
        state.allLayers = action.payload;
        LOG.log('setAllLayers to ', action.payload);
    },

    /**
     * Set selected layers.
     * Not use this function directly, use rpcUtil/updateLayers function.
     * @param {Object} state
     * @param {Object} action
     */
    setSelectedLayers: (state, action) => {
        state.selectedLayers = action.payload;
        LOG.log('setSelectedLayers to ', action.payload);
    },

    /**
     * Set select error.
     * @method setSelectError
     * @param {Object} state
     * @param {Object} action
     */
    setSelectError: (state,action) => {
        state.warnings = {
            show: action.payload.show,
            errors: action.payload.errors,
            message: action.payload.message,
            type: action.payload.type,
            filteredLayers: action.payload.filteredLayers,
            indeterminate: action.payload.indeterminate,
            isChecked: action.payload.isChecked
        };
        LOG.log('setSelectError to ', action.payload);
    },

    /**
     * Set all tags.
     * @method setAllTags
     * @param {Object} state
     * @param {Object} action
     */
    setAllTags: (state, action) => {
        state.allTags = action.payload;
        LOG.log('setAllTags to ', action.payload);
    },

    /**
     * Set selected tags.
     * @method setTags
     * @param {Object} state
     * @param {Object} action
     */
    setTags: (state, action) => {
        state.tags = action.payload;
        LOG.log('setTags to ', action.payload);
    },

    /**
     * Set tags with maplayers.
     * @method setTagsWithLayers
     * @param {Object} state
     * @param {Object} action
     */
    setTagsWithLayers: (state, action) => {
        state.tagsWithLayers = action.payload;
        LOG.log('setTagsWithLayers to ', action.payload);
    },

    /**
     * Set all themes with maplayers.
     * @method setAllThemesWithLayers
     * @param {Object} state
     * @param {Object} action
     */
    setAllThemesWithLayers: (state, action) => {
        state.allThemesWithLayers = action.payload;
        LOG.log('setAllThemesWithLayers to ', action.payload);
    },

    /**
     * Set selected theme.
     * @method setSelectedTheme
     * @param {Object} state
     * @param {Object} action
     */
    setSelectedTheme: (state, action) => {
        state.selectedTheme = action.payload;
        LOG.log('setSelectedTheme to ', action.payload);
    },

    /**
     * Set last selected theme.
     * @method setLastSelectedTheme
     * @param {Object} state
     * @param {Object} action
     */
    setLastSelectedTheme: (state, action) => {
        state.lastSelectedTheme = action.payload;
        LOG.log('setLastSelectedTheme to ', action.payload);
    },

    /**
     * Set selected theme index.
     * @method setSelectedThemeIndex
     * @param {Object} state
     * @param {Object} action
     */
    setSelectedThemeIndex: (state, action) => {
        state.selectedThemeIndex = action.payload;
        LOG.log('setSelectedThemeIndex to ' + action.payload);
    },

    /**
     * Set announcements.
     * @method setAnnouncements
     * @param {Object} state
     * @param {Object} action
     */
    setAnnouncements: (state, action) => {
        state.announcements = action.payload;
        LOG.log('setAnnounchements to ', action.payload);
    },

    /**
     * Set active announcements.
     * @method setActiveAnnouncements
     * @param {Object} state
     * @param {Object} action
     */
    setActiveAnnouncements: (state, action) => {
        state.activeAnnouncements = action.payload;
        LOG.log('setActiveAnnounchements to ', action.payload);
    },

    /**
     * Set features.
     * @method setFeatures
     * @param {Object} state
     * @param {Object} action
     */
    setFeatures: (state, action) => {
        state.features = action.payload;
        LOG.log('setFeatures to ', action.payload);
    },

    /**
     * Set current state.
     * @method  setCurrentState
     * @param {Object} state
     * @param {Object} action
     */
    setCurrentState: (state, action) => {
        state.currentState = action.payload;
        LOG.log('setCurrentState to ', action.payload);
    },

    /**
     * Set tag layers.
     * @method setTagLayers
     * @param {Object} state
     * @param {Object} action
     */
    setTagLayers: (state, action) => {
        state.tagLayers = action.payload;
        LOG.log('setTagLayers to ', action.payload);
    },

    /**
     * setZoomRange
     * @method
     * @param {Object} state
     * @param {Object} action
     */
    setZoomRange: (state, action) => {
        state.zoomRange = action.payload;
        LOG.log('setZoomRange to ' + action.payload);
    },

    /**
     * Set scale bar state
     * @method setScaleBarState
     * @param {Object} state
     * @param {Object} action
     */
    setScaleBarState: (state, action) => {
        state.scaleBarState = action.payload;
    },

    /**
     * Set map layers visibility.
     * @method setMapLayerVisibility
     * @param {Object} state
     * @param {Object} action
     */
    setMapLayerVisibility: (state, action) => {
        var layer = action.payload;
        state.channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, !layer.visible]);
        LOG.log('setMapLayerVisibility to ', action.payload);
    },

    /**
     * Set opacity.
     * @method setOpacity
     * @param {Object} state
     * @param {Object} action
     */
    setOpacity: (state, action) => {
        state.channel !== null && state.channel.postRequest('ChangeMapLayerOpacityRequest', [action.payload.id, action.payload.value]);
        LOG.log('setOpacity to ', action.payload);
    },

    /**
     * Set zoom in.
     * @method setZoomIn
     * @param {Object} state
     */
    setZoomIn: (state) => {
        state.channel !== null && state.channel.zoomIn(function () {});
        LOG.log('setZoomIn');
    },

    /**
     * Set zoom out.
     * @method setZoomOut
     * @param {Object} state
     */
    setZoomOut: (state) => {
        state.channel !== null && state.channel.zoomOut(function () {});
        LOG.log('setZoomOut');
    },

    /**
     * Set zoom to.
     * @method setZoomTo
     * @param {Object} state
     * @param {Object} action
     */
    setZoomTo: (state, action) => {
        state.channel !== null && state.channel.zoomTo([action.payload], function (data) {});
        LOG.log('setZoomTo to ' + action.payload);
    },

    /**
     * Search VKM road.
     * @method searchVKMRoad
     * @param {Object} state
     * @param {Object} action
     */
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

    /**
     * Set current zoom level.
     * @method setCurrentZoomLevel
     * @param {Object} state
     * @param {Object} action
     */
    setCurrentZoomLevel: (state, action) => {
        state.currentZoomLevel = action.payload;
        LOG.log('setCurrentZoomLevel to ' + action.payload);
    },

    /**
     * Search request.
     * @method searchRequest.
     * @param {Object} state
     * @param {Object} action
     */
    searchRequest: (state, action) => {
        state.channel !== null && state.channel.postRequest('SearchRequest', [action.payload]);
        LOG.log('searchRequest ' + action.payload);
    },

    /**
     * Add marker request.
     * @method addMarkerRequest
     * @param {Object} state
     * @param {Object} action
     */
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

    /**
     * Remove marker request.
     * @method removeMarkerRequest
     * @param {Object} state
     * @param {Object} action
     */
    removeMarkerRequest: (state, action) => {
        state.channel !== null && state.channel.postRequest('MapModulePlugin.RemoveMarkersRequest', [action.payload.markerId]);
        LOG.log('removeMarkerRequest ', action.payload);
    },

    /**
     * Map move request.
     * @method mapMoveRequest
     * @param {Object} state
     * @param {Object} action
     */
    mapMoveRequest: (state, action) => {
        state.channel !== null && state.channel.postRequest('MapMoveRequest', [action.payload.x, action.payload.y, typeof action.payload.zoom === 'number' ? action.payload.zoom : 10]);
        LOG.log('mapMoveRequest ', action.payload);
    },

    /**
     * Get layer metadata.
     * @method getLayerMetadata
     * @param {Object} state
     * @param {Object} action
     */
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

    /**
     * Clear layer metadata.
     * @method clearLayerMetadata
     * @param {Object} state
     * @param {Object} action
     */
    clearLayerMetadata: (state) => {
        state.layerMetadata = {
            data: null,
            layer: null
        };
        LOG.log('clearLayerrMetadata');
    },

    /**
     * Set layer metadata.
     * @method
     * @param {Object} state
     * @param {Object} action
     */
    setLayerMetadata: (state, action) => {
        state.layerMetadata = {
            layer: action.payload.layer,
            data: action.payload.data,
            uuid: action.payload.uuid
        };
        LOG.log('setLayerMetadata to ', action.payload);
    },

    /**
     * Get legends.
     * @method getLegends
     * @param {Object} state
     * @param {Object} action
     */
    getLegends: (state, action) => {
        state.channel && state.channel.getLegends((data) => {
            if (typeof action.payload.handler === 'function') {
                action.payload.handler(data);
                LOG.log(' --> legends getted', data);
            }
        });
        LOG.log('getLegends ', action.payload);
    },

    /**
     * Set legends.
     * @method setLegends
     * @param {Object} state
     * @param {Object} action
     */
    setLegends: (state, action) => {
        state.legends = action.payload;
        LOG.log('setLegends to ', action.payload);
    },

    /**
     * Set current map center.
     * @method setCurrentMapCenter
     * @param {Object} state
     * @param {Object} action
     */
    setCurrentMapCenter: (state, action) => {
        if (state.center.x === action.payload.centerX && state.center.y === action.payload.centerY && state.currentZoomLevel === action.payload.zoom) {
            return;
        }
        state.center.x = action.payload.centerX;
        state.center.y = action.payload.centerY;
        state.currentZoomLevel = action.payload.zoom;
        LOG.log('setCurrentMapCenter to ', action.payload);
    },

    /**
     * Change layer style.
     * @method changeLayerStyle.
     * @param {Object} state
     * @param {Object} action
     */
    changeLayerStyle: (state, action) => {
        state.channel !== null && state.channel.postRequest('ChangeMapLayerStyleRequest', [action.payload.layerId, action.payload.style]);
        LOG.log('changeLayerStyle ', action.payload);
    },

    /**
     * Rearrange selected maplayers.
     * @method reArrangeSelectedMapLayers
     * @param {Object} state
     * @param {Object} action
     */
    reArrangeSelectedMapLayers: (state, action) => {
        state.channel !== null && state.channel.postRequest('RearrangeSelectedMapLayerRequest', [action.payload.layerId, action.payload.position]);
    },

    /**
     * Set GFI locations.
     * @method setGFILocations
     * @param {Object} state
     * @param {Object} action
     */
    setGFILocations: (state, action) => {
        if (action.payload.layerId === 'VKM') {
            state.gfiLocations.unshift(action.payload);
        } else {
            state.gfiLocations.push(action.payload);
        }
    },

    /**
     * Reset GFI locations.
     * @method resetGFILocations
     * @param {Object} state
     * @param {Object} action
     */
    resetGFILocations: (state, action) => {
      state.gfiLocations = action.payload;
    },

    /**
     * Set GFI point.
     * @method setGFIPoint
     * @param {Object} state
     * @param {Object} action
     */
    setGFIPoint: (state, action) => {
        state.gfiPoint = action.payload;
    },
    /**
     * Remove all selected layers.
     * @method removeAllSeelctedLayers
     * @param {Object} state
     * @param {Object} action
     */
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
    },

    /**
     * Set start state.
     * @method setStartState
     * @param {Object} state
     * @param {Object} action
     */
    setStartState: (state, action) => {
        if (typeof action.payload.x === 'number') {
            state.startState.x = action.payload.x;
        }
        if (typeof action.payload.y === 'number') {
            state.startState.y = action.payload.y;
        }
        if (action.payload.selectedLayers) {
            state.startState.selectedLayers = action.payload.selectedLayers;
        }
        if (typeof action.payload.zoom === 'number') {
            state.startState.zoom = action.payload.zoom;
        }
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
    setScaleBarState,
    setMapLayerVisibility,
    setOpacity,
    setZoomIn,
    setZoomOut,
    setZoomTo,
    setSelectError,
    searchVKMRoad,
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
    setGFIPoint,
    setGfiCroppingArea,
    removeAllSelectedLayers,
    setStartState
} = rpcSlice.actions;

export default rpcSlice.reducer;
