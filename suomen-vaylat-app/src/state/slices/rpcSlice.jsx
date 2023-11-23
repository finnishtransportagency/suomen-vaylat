import { createSlice } from "@reduxjs/toolkit";
import { Logger } from "../../utils/logger";

const LOG = new Logger("RPCSlice");

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
  selectedLayersByType: {
    backgroundMaps: [],
    mapLayers: [],
  },
  warnings: {
    show: false,
    errors: [],
    message: "",
    type: "",
    filteredLayers: [],
    indeterminate: false,
    isChecked: null,
  },
  announcements: [],
  activeAnnouncements: [],
  allThemesWithLayers: [],
  allSelectedThemeLayers: [],
  selectedTheme: null,
  lastSelectedTheme: null,
  selectedThemeId: null,
  filter: null,
  layerMetadata: { data: null, layer: null, uuid: null },
  legends: [],
  tagsWithLayers: {},
  gfiLocations: [],
  center: {
    x: 0,
    y: 0,
  },
  gfiPoint: null,
  gfiCroppingArea: null,
  vkmData: null,
  pointInfoImageError: false,
  downloads: [],
  startState: {
    x: null,
    y: null,
    selectedLayers: [],
    zoom: null,
  },
  pointInfo: {},
  filters: [],
  filters: [],
  activeGFILayer: null,
  filteringInfo: []
};

export const rpcSlice = createSlice({
  name: "rpc",
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
      LOG.log("setLoading to " + action.payload);
    },

    /**
     * Set selected layer on gfi popup
     * @method setActiveGFILayer
     * @param {Object} state
     * @param {Object} action
     */
    setActiveGFILayer: (state, action) => {
      state.activeGFILayer = action.payload;
    },

    /**
     * Set channel.
     * @method setChannel
     * @param {Object} state
     * @param {Object} action
     */
    setChannel: (state, action) => {
      state.channel = action.payload;
      LOG.log("setChannel to ", action.payload);
    },

    /**
     * Set filters.
     * @method setFilters
     * @param {Object} state
     * @param {Object} action
     */
    setFilters: (state, action) => {
      state.filters = action.payload;
    },

    /**
     * Set CQL filters.
     * @method setChannel
     * @param {Object} state
     * @param {Object} action
     */
    setCQLFilters: (state, action) => {
      state.filters = action.payload;
    },

    /**
     * Set filtering info.
     * @method setFilteringInfo
     * @param {Object} state
     * @param {Object} action
     */
    setFilteringInfo: (state, action) => {
      state.filteringInfo = action.payload;
    },

    /**
     * Set all maplayer groups.
     * @method setAllGroups
     * @param {Object} state
     * @param {Object} action
     */
    setAllGroups: (state, action) => {
      state.allGroups = action.payload;
      LOG.log("setAllGroups to ", action.payload);
    },

    /**
     * Set all layers.
     * Not use this function directly, use rpcUtil/updateLayers function.
     * @method setAllLayers
     * @param {Object} state
     * @param {Object} action
     */
    setAllLayers: (state, action) => {
      state.allLayers = action.payload;
      LOG.log("setAllLayers to ", action.payload);
    },

    /**
     * Set selected layers.
     * Not use this function directly, use rpcUtil/updateLayers function.
     * @param {Object} state
     * @param {Object} action
     */
    setSelectedLayers: (state, action) => {
      state.selectedLayers = action.payload;
      LOG.log("setSelectedLayers to ", action.payload);
    },

    /**
     * Sets backgroundMaps for selectedLayersByType
     * @param {Object} state
     * @param {Object} action
     */
    setBackgroundMaps: (state, action) => {
      state.selectedLayersByType.backgroundMaps = action.payload;
      LOG.log("setBackgroundMaps ", action.payload);
    },

    /**
     * Sets mapLayers for selectedLayersByType
     * @param {Object} state
     * @param {Object} action
     */

    setMapLayers: (state, action) => {
      state.selectedLayersByType.mapLayers = action.payload;
      LOG.log("setMapLayers ", action.payload);
    },

    setAllSelectedThemeLayers: (state, action) => {
      state.allSelectedThemeLayers = action.payload;
      LOG.log("setThemeLayers", action.payload);
    },

    /**
     * Set select error.
     * @method setSelectError
     * @param {Object} state
     * @param {Object} action
     */
    setSelectError: (state, action) => {
      state.warnings = {
        show: action.payload.show,
        errors: action.payload.errors,
        message: action.payload.message,
        type: action.payload.type,
        filteredLayers: action.payload.filteredLayers,
        indeterminate: action.payload.indeterminate,
        isChecked: action.payload.isChecked,
      };
      LOG.log("setSelectError to ", action.payload);
    },

    /**
     * Set all tags.
     * @method setAllTags
     * @param {Object} state
     * @param {Object} action
     */
    setAllTags: (state, action) => {
      state.allTags = action.payload;
      LOG.log("setAllTags to ", action.payload);
    },

    /**
     * Set selected tags.
     * @method setTags
     * @param {Object} state
     * @param {Object} action
     */
    setTags: (state, action) => {
      state.tags = action.payload;
      LOG.log("setTags to ", action.payload);
    },

    /**
     * Set tags with maplayers.
     * @method setTagsWithLayers
     * @param {Object} state
     * @param {Object} action
     */
    setTagsWithLayers: (state, action) => {
      state.tagsWithLayers = action.payload;
      LOG.log("setTagsWithLayers to ", action.payload);
    },

    /**
     * Set all themes with maplayers.
     * @method setAllThemesWithLayers
     * @param {Object} state
     * @param {Object} action
     */
    setAllThemesWithLayers: (state, action) => {
      state.allThemesWithLayers = action.payload;
      LOG.log("setAllThemesWithLayers to ", action.payload);
    },

    /**
     * Set selected theme.
     * @method setSelectedTheme
     * @param {Object} state
     * @param {Object} action
     */
    setSelectedTheme: (state, action) => {
      state.selectedTheme = action.payload;
      LOG.log("setSelectedTheme to ", action.payload);
    },

    /**
     * Set last selected theme.
     * @method setLastSelectedTheme
     * @param {Object} state
     * @param {Object} action
     */
    setLastSelectedTheme: (state, action) => {
      state.lastSelectedTheme = action.payload;
      LOG.log("setLastSelectedTheme to ", action.payload);
    },

    /**
     * Set selected theme id.
     * @method setSelectedThemeId
     * @param {Object} state
     * @param {Object} action
     */
    setSelectedThemeId: (state, action) => {
      state.selectedThemeId = action.payload;
      LOG.log("setSelectedThemeId to " + action.payload);
    },

    /**
     * Set announcements.
     * @method setAnnouncements
     * @param {Object} state
     * @param {Object} action
     */
    setAnnouncements: (state, action) => {
      state.announcements = action.payload;
      LOG.log("setAnnounchements to ", action.payload);
    },

    /**
     * Set active announcements.
     * @method setActiveAnnouncements
     * @param {Object} state
     * @param {Object} action
     */
    setActiveAnnouncements: (state, action) => {
      state.activeAnnouncements = action.payload;
      LOG.log("setActiveAnnounchements to ", action.payload);
    },

    /**
     * Set features.
     * @method setFeatures
     * @param {Object} state
     * @param {Object} action
     */
    setFeatures: (state, action) => {
      state.features = action.payload;
      LOG.log("setFeatures to ", action.payload);
    },

    /**
     * Set current state.
     * @method  setCurrentState
     * @param {Object} state
     * @param {Object} action
     */
    setCurrentState: (state, action) => {
      state.currentState = action.payload;
      LOG.log("setCurrentState to ", action.payload);
    },

    /**
     * Set tag layers.
     * @method setTagLayers
     * @param {Object} state
     * @param {Object} action
     */
    setTagLayers: (state, action) => {
      state.tagLayers = action.payload;
      LOG.log("setTagLayers to ", action.payload);
    },

    /**
     * setZoomRange
     * @method
     * @param {Object} state
     * @param {Object} action
     */
    setZoomRange: (state, action) => {
      state.zoomRange = action.payload;
      LOG.log("setZoomRange to " + action.payload);
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
      state.channel.postRequest("MapModulePlugin.MapLayerVisibilityRequest", [
        layer.id,
        !layer.visible,
      ]);
      LOG.log("setMapLayerVisibility to ", action.payload);
    },

    /**
     * Set opacity.
     * @method setOpacity
     * @param {Object} state
     * @param {Object} action
     */
    setOpacity: (state, action) => {
      state.channel !== null &&
        state.channel.postRequest("ChangeMapLayerOpacityRequest", [
          action.payload.id,
          action.payload.value,
        ]);
      LOG.log("setOpacity to ", action.payload);
    },

    /**
     * Set zoom in.
     * @method setZoomIn
     * @param {Object} state
     */
    setZoomIn: (state) => {
      state.channel !== null && state.channel.zoomIn(function () {});
      LOG.log("setZoomIn");
    },

    /**
     * Set zoom out.
     * @method setZoomOut
     * @param {Object} state
     */
    setZoomOut: (state) => {
      state.channel !== null && state.channel.zoomOut(function () {});
      LOG.log("setZoomOut");
    },

    /**
     * Set zoom to.
     * @method setZoomTo
     * @param {Object} state
     * @param {Object} action
     */
    setZoomTo: (state, action) => {
      state.channel !== null &&
        state.channel.zoomTo([action.payload], function (data) {});
      LOG.log("setZoomTo to " + action.payload);
    },

    /**
     * Search VKM road.
     * @method searchVKMRoad
     * @param {Object} state
     * @param {Object} action
     */
    searchVKMRoad: (state, action) => {
      if (state.channel !== null) {
        state.channel.searchVKMRoad(
          action.payload.search,
          action.payload.handler,
          (err) => {
            if (typeof action.payload.errorHandler === "function") {
              action.payload.errorHandler(err);
            } else {
              LOG.warn("VKM search failed");
            }
          }
        );
      }
      LOG.log("searchVKMRoad ", action.payload);
    },

    /**
     * Set current zoom level.
     * @method setCurrentZoomLevel
     * @param {Object} state
     * @param {Object} action
     */
    setCurrentZoomLevel: (state, action) => {
      state.currentZoomLevel = action.payload;
      LOG.log("setCurrentZoomLevel to " + action.payload);
    },

    /**
     * Search request.
     * @method searchRequest.
     * @param {Object} state
     * @param {Object} action
     */
    searchRequest: (state, action) => {
      state.channel !== null &&
        state.channel.postRequest("SearchRequest", [action.payload]);
      LOG.log("searchRequest " + action.payload);
    },

    /**
     * Add marker request.
     * @method addMarkerRequest
     * @param {Object} state
     * @param {Object} action
     */
    addMarkerRequest: (state, action) => {
      const data = {
        x: action.payload.x,
        y: action.payload.y,
        msg: action.payload.msg || "",
        shape:
          typeof action.payload.shape === "number" ? action.payload.shape : 2,
        size: action.payload.size || 7,
        color: action.payload.color || "0064af",
        offsetX: action.payload.offsetX || "",
        offsetY: action.payload.offsetY || "",
      };
      state.channel !== null &&
        state.channel.postRequest("MapModulePlugin.AddMarkerRequest", [
          data,
          action.payload.markerId,
        ]);
      LOG.log("addMarkerRequest ", action.payload);
    },

    /**
     * Remove marker request.
     * @method removeMarkerRequest
     * @param {Object} state
     * @param {Object} action
     */
    removeMarkerRequest: (state, action) => {
      state.channel !== null && action.payload
        ? state.channel.postRequest("MapModulePlugin.RemoveMarkersRequest", [
            action.payload.markerId,
          ])
        : state.channel.postRequest("MapModulePlugin.RemoveMarkersRequest");
      LOG.log("removeMarkerRequest ", action.payload);
    },

    /**
     * Map move request.
     * @method mapMoveRequest
     * @param {Object} state
     * @param {Object} action
     */
    mapMoveRequest: (state, action) => {
      state.channel !== null &&
        state.channel.postRequest("MapMoveRequest", [
          action.payload.x,
          action.payload.y,
          typeof action.payload.zoom === "number" ? action.payload.zoom : 10,
        ]);
      LOG.log("mapMoveRequest ", action.payload);
    },

    /**
     * Get layer metadata.
     * @method getLayerMetadata
     * @param {Object} state
     * @param {Object} action
     */
    getLayerMetadata: (state, action) => {
      state.channel &&
        state.channel.getLayerMetadata(
          [action.payload.uuid],
          (data) => {
            LOG.log(
              "Metadata getted ",
              data,
              action.payload.layer,
              action.payload.uuid
            );
            action.payload.handler(
              data,
              action.payload.layer,
              action.payload.uuid
            );
          },
          (err) => {
            if (typeof action.payload.errorHandler === "function") {
              action.payload.errorHandler(err);
              LOG.warn("metadata get error", err);
            } else {
              LOG.warn("Get layer metadata failed");
            }
          }
        );
      LOG.log("getLayerMetadata ", action.payload);
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
        layer: null,
      };
      LOG.log("clearLayerrMetadata");
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
        uuid: action.payload.uuid,
      };
      LOG.log("setLayerMetadata to ", action.payload);
    },

    /**
     * Get legends.
     * @method getLegends
     * @param {Object} state
     * @param {Object} action
     */
    getLegends: (state, action) => {
      state.channel &&
        state.channel.getLegends((data) => {
          if (typeof action.payload.handler === "function") {
            action.payload.handler(data);
            LOG.log(" --> legends getted", data);
          }
        });
      LOG.log("getLegends ", action.payload);
    },

    /**
     * Set legends.
     * @method setLegends
     * @param {Object} state
     * @param {Object} action
     */
    setLegends: (state, action) => {
      state.legends = action.payload;
      LOG.log("setLegends to ", action.payload);
    },

    /**
     * Set current map center.
     * @method setCurrentMapCenter
     * @param {Object} state
     * @param {Object} action
     */
    setCurrentMapCenter: (state, action) => {
      if (
        state.center.x === action.payload.centerX &&
        state.center.y === action.payload.centerY &&
        state.currentZoomLevel === action.payload.zoom
      ) {
        return;
      }
      state.center.x = action.payload.centerX;
      state.center.y = action.payload.centerY;
      state.currentZoomLevel = action.payload.zoom;
      LOG.log("setCurrentMapCenter to ", action.payload);
    },

    /**
     * Change layer style.
     * @method changeLayerStyle.
     * @param {Object} state
     * @param {Object} action
     */
    changeLayerStyle: (state, action) => {
      state.channel !== null &&
        state.channel.postRequest("ChangeMapLayerStyleRequest", [
          action.payload.layerId,
          action.payload.style,
        ]);
      LOG.log("changeLayerStyle ", action.payload);
    },

    /**
     * Rearrange selected maplayers.
     * @method reArrangeSelectedMapLayers
     * @param {Object} state
     * @param {Object} action
     */
    reArrangeSelectedMapLayers: (state, action) => {
      state.channel !== null &&
        state.channel.postRequest("RearrangeSelectedMapLayerRequest", [
          action.payload.layerId,
          action.payload.position,
        ]);
    },

    /**
     * Set GFI locations.
     * @method setGFILocations
     * @param {Object} state
     * @param {Object} action
     */
    setGFILocations: (state, action) => {
      state.gfiLocations.push(action.payload);
    },

    /**
     * Reset GFI locations.
     * @method resetGFILocations
     * @param {Object} state
     * @param {Object} action
     */
    resetGFILocations: (state, action) => {
      state.gfiLocations = action.payload;
      state.channel &&
        state.channel.postRequest(
          "MapModulePlugin.RemoveFeaturesFromMapRequest",
          [null, null, "gfi-result-layer"]
        );
    },

    /**
     * Add features to gfiLocations.
     * @param {Object} state
     * @param {Object} action
     */
    addFeaturesToGFILocations: (state, action) => {
      const layerId = action.payload.layerId;
      const content = action.payload.content;
      const moreFeatures = action.payload.moreFeatures;

      const selectedGFI = action.payload.selectedGFI;
      if (
        state.gfiLocations[selectedGFI].layerId === layerId &&
        state.gfiLocations[selectedGFI].content
      ) {
        state.gfiLocations[selectedGFI].content.forEach((cont) => {
          if (cont.id === content.id) {
            cont.geojson.features.push(...content.geojson.features);
            cont.moreFeatures = content.moreFeatures;

            if (content.nextStartIndex) {
              cont.nextStartIndex = content.nextStartIndex;
            } else {
              cont.nextStartIndex = null;
            }
          }
        });
      }
      state.gfiLocations[selectedGFI].moreFeatures = moreFeatures;
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
     * Set GFI cropping area.
     * @method setGFICroppingArea
     * @param {Object} state
     * @param {Object} action
     */
    setGFICroppingArea: (state, action) => {
      state.gfiCroppingArea = action.payload;
    },

    /**
     * Set VKM data.
     * @method setVKMData
     * @param {Object} state
     * @param {Object} action
     */
    setVKMData: (state, action) => {
      state.vkmData = action.payload;
      state.vkmDataImageError = false;
    },

    /**
     * Set point info image error.
     * @method setPointInfoImageError
     * @param {Object} state
     * @param {Object} action
     */
    setPointInfoImageError: (state, action) => {
      state.pointInfoImageError = action.payload;
    },

    /**
     * Set downloads.
     * @method setDownloads
     * @param {Object} state
     * @param {Object} action
     */
    setDownloads: (state, action) => {
      state.downloads.push(action.payload);
    },

    /**
     * Set active downloads.
     * @method setDownloadActive
     * @param {Object} state
     * @param {Object} action
     */
    setDownloadActive: (state, action) => {
      state.downloads.push(action.payload);
    },

    /**
     * Set finished download.
     * @method setDownloadFinished
     * @param {Object} state
     * @param {Object} action
     */
    setDownloadFinished: (state, action) => {
      let downloadIndex = state.downloads.findIndex(
        (download) => download.id === action.payload.id
      );
      let download = state.downloads[downloadIndex];
      download.url = action.payload.url !== null && action.payload.url;
      download.fileSize =
        action.payload.fileSize !== null && action.payload.fileSize;
      download.loading = false;
      download.errorLayers = action.payload.errorLayers;
      state.downloads[downloadIndex] = download;
    },

    /**
     * Remove download.
     * @method setDownloadRemove
     * @param {Object} state
     * @param {Object} action
     */
    setDownloadRemove: (state, action) => {
      state.downloads = state.downloads.filter(
        (download) => download.id !== action.payload
      );
    },

    /**
     * Set gfi tools open.
     * @method setisGfiToolsOpen
     * @param {Object} state
     * @param {Object} action
     */
    setIsGfiToolsOpen: (state, action) => {
      state.isGfiToolsOpen = action.payload;
    },

    /**
     * Remove all selected layers.
     * @method removeAllSeelctedLayers
     * @param {Object} state
     * @param {Object} action
     */
    removeAllSelectedLayers: (state, action) => {
      const groupId =
        (action.payload && action.payload.notRemoveLayersByGroupId) || null;
      state.selectedLayers.forEach((l) => {
        if (groupId !== null) {
          if (l && l.groups && !l.groups.includes(groupId)) {
            state.channel.postRequest(
              "MapModulePlugin.MapLayerVisibilityRequest",
              [l.id, false]
            );
          }
        } else {
          state.channel.postRequest(
            "MapModulePlugin.MapLayerVisibilityRequest",
            [l.id, false]
          );
        }
      });
    },

    /**
     * Set information of clicked point on the map
     * @method setPointInfo
     * @param {Object} state
     * @param {Object} action
     */
    setPointInfo: (state, action) => {
      state.pointInfo = action.payload;
    },

    /**
     * Set start state.
     * @method setStartState
     * @param {Object} state
     * @param {Object} action
     */
    setStartState: (state, action) => {
      if (typeof action.payload.x === "number") {
        state.startState.x = action.payload.x;
      }
      if (typeof action.payload.y === "number") {
        state.startState.y = action.payload.y;
      }
      if (action.payload.selectedLayers) {
        state.startState.selectedLayers = action.payload.selectedLayers;
      }
      if (typeof action.payload.zoom === "number") {
        state.startState.zoom = action.payload.zoom;
      }
    },
  },
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
  setSelectedThemeId,
  setActiveAnnouncements,
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
  setGFICroppingArea,
  setVKMData,
  setPointInfoImageError,
  setDownloads,
  setDownloadActive,
  setDownloadFinished,
  setDownloadRemove,
  removeAllSelectedLayers,
  setStartState,
  addFeaturesToGFILocations,
  setBackgroundMaps,
  setMapLayers,
  setAllSelectedThemeLayers,
  setPointInfo,
  setCQLFilters,
  setFilters,
  setActiveGFILayer,
  setFilteringInfo,
} = rpcSlice.actions;

export default rpcSlice.reducer;
