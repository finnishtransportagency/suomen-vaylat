import { createSlice } from '@reduxjs/toolkit';
import { theme } from '../../theme/theme';

const initialState = {
  activeSwitch: 'default',
  isGfiToolsOpen: false,
  isGfiDownloadToolsOpen: false,
  isFullScreen: false,
  dialogConstrainsRef: null,
  isSideMenuOpen: false,
  isSearchOpen: false,
  isSearchResultPanelVisible: false,
  downloadLink: {
    layerDownloadLinkDialogOpen: false,
    layerDownloadLink: null,
    layerDownloadLinkName: null
  },
  searchParams: '',
  formSearchParams: '',
  isMoreSearchOpen: false,
  isInfoOpen: false,
  geoJsonArray: [],
  isSavedOpen: false,
  isChecked: false,
  isUserGuideOpen: false,
  isCustomFilterOpen: false,
  isFilterDialogOpen: false,
  isSavedLayer: false,
  shareUrl: '',
  isThemeMenuOpen: false,
  isDrawingToolsOpen: false,
  isLegendOpen: false,
  isSaveViewOpen: false,
  isSaveGeometriesOpen: false,
  isGfiOpen: false,
  isGfiDownloadOpen: false,
  selectedDrawingTool: null,
  activeTool: null,
  activeSelectionTool: null,
  gfiLocations: null,
  isSwipingDisabled: false,
  selectedMapLayersMenuTab: 0,
  selectedMapLayersMenuThemeIndex: null,
  minimizeGfi: false,
  maximizeGfi: false,
  minimizeFeatureSelection: false,
  minimizeFilter: { minimized: false },
  maximizeFilter: false,
  gfiCroppingTypes: [],
  warning: null,
  hasToastBeenShown: [],
  selectedMarker: 2,
  drawToolMarkers: [],
  markerLabel: '',
  activeGeometries: [],
  triggerUpdate: 0,
  showCustomLayerList: false,
  showSavedLayers: false,
  updateCustomLayer: false,
  checkedLayer: [],
  isCheckmark: false,
  selectedCustomFilterLayers: [],
  isCoordinateToolOpen: false,
  selectedBaseLayers: [],
  isBaseLayerSelectorMenuOpen: false,
  isDatasetImportOpen: false,
  isProfileOpen: false,
  attributeSearchEnabled: false
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setIsFullScreen: (state, action) => {
      state.isFullScreen = action.payload;
    },
    setIsMainScreen: (state) => {
      state.isFullScreen = false;
      state.isSideMenuOpen = false;
      state.isThemeMenuOpen = false;
      state.isSearchOpen = false;
      state.isInfoOpen = false;

      state.isSavedOpen = false;

      state.isUserGuideOpen = false;
      state.isDrawingToolsOpen = false;
      state.isLegendOpen = false;
      state.isSaveViewOpen = false;
      state.isSaveGeometriesOpen = false;
      state.selectedMapLayersMenuTab = 0;
      state.selectedMapLayersMenuThemeIndex = null;
      state.minimizeGfi = false;
      state.warning = null;
      state.isGfiOpen = false;
    },
    setDialogConstrainsRef: (state, action) => {
      state.dialogConstrainsRef = action.payload;
    },
    setIsSideMenuOpen: (state, action) => {
      state.isSideMenuOpen = action.payload;
    },
    setIsSearchOpen: (state, action) => {
      state.isSearchOpen = action.payload;
    },
    setIsSearchResultPanelVisible(state, action) {
      state.isSearchResultPanelVisible = action.payload;
    }, 
    setIsChecked: (state, action) => {
      state.isChecked = action.payload;
    },
    setSearchParams: (state, action) => {
      state.searchParams = action.payload;
    },
    setFormSearchParams: (state, action) => {
      state.formSearchParams = action.payload;
    },
    setIsMoreSearchOpen: (state, action) => {
      state.isMoreSearchOpen = action.payload;
    },
    setIsInfoOpen: (state, action) => {
      state.isInfoOpen = action.payload;
    },
    setGeoJsonArray: (state, action) => {
      state.geoJsonArray = action.payload;
    },
    addToGeoJsonArray: (state, action) => {
      let duplicateIndex = state.geoJsonArray.findIndex(
        (geoj) => geoj.id === action.payload.id
      );

      if (duplicateIndex !== -1)
        state.geoJsonArray[duplicateIndex] = action.payload;
      else state.geoJsonArray.push(action.payload);
    },
    setIsSavedOpen: (state, action) => {
      state.isSavedOpen = action.payload;
    },
    setIsThemeMenuOpen: (state, action) => {
      state.isThemeMenuOpen = action.payload;
    },
    setIsDownloadLinkDialogOpen: (state, action) => {
      state.downloadLink = {
        layerDownloadLinkDialogOpen: action.payload.layerDownloadLinkDialogOpen,
        layerDownloadLink: action.payload.layerDownloadLink,
        layerDownloadLinkName: action.payload.layerDownloadLinkName
      };
    },
    setIsUserGuideOpen: (state, action) => {
      state.isUserGuideOpen = action.payload;
    },
    setIsCustomFilterOpen: (state, action) => {
      state.isCustomFilterOpen = action.payload;
    },
    setIsSavedLayer: (state, action) => {
      state.isSavedLayer = action.payload;
    },
    setIsLegendOpen: (state, action) => {
      state.isLegendOpen = action.payload;
    },
    setIsSaveViewOpen: (state, action) => {
      state.isSaveViewOpen = action.payload;
    },
    setIsSaveGeometriesOpen: (state, action) => {
      state.isSaveGeometriesOpen = action.payload;
    },
    setIsGfiOpen: (state, action) => {
      state.isGfiOpen = action.payload;
    },
    setIsGfiDownloadOpen: (state, action) => {
      state.isGfiDownloadOpen = action.payload;
    },
    setSelectedDrawingTool: (state, action) => {
      state.selectedDrawingTool = action.payload;
    },
    setShareUrl: (state, action) => {
      state.shareUrl = action.payload;
    },
    setIsDrawingToolsOpen: (state, action) => {
      state.isDrawingToolsOpen = action.payload;
    },
    setActiveTool: (state, action) => {
      state.activeTool = action.payload;
    },
    setActiveSelectionTool: (state, action) => {
      state.activeSelectionTool = action.payload;
    },
    setIsSwipingDisabled: (state, action) => {
      state.isSwipingDisabled = action.payload;
    },
    setSelectedMapLayersMenuTab: (state, action) => {
      state.selectedMapLayersMenuTab = action.payload;
    },
    setSelectedMapLayersMenuThemeIndex: (state, action) => {
      state.selectedMapLayersMenuThemeIndex = action.payload;
    },
    setMinimizeGfi: (state, action) => {
      state.minimizeGfi = action.payload;
    },
    setMinimizeFeatureSelection: (state, action) => {
      state.minimizeFeatureSelection = action.payload;
    },
    setMaximizeGfi: (state, action) => {
      state.maximizeGfi = action.payload;
    },
    setMinimizeFilterDialog: (state, action) => {
      state.minimizeFilter = action.payload;
    },
    setMaximizeFilterDialog: (state, action) => {
      state.maximizeFilter = action.payload;
    },
    setGfiCroppingTypes: (state, action) => {
      state.gfiCroppingTypes = action.payload;
    },
    setWarning: (state, action) => {
      state.warning = action.payload;
    },
    setHasToastBeenShown: (state, action) => {
      const toastId = action.payload.toastId;
      const hasToastBeenShow = action.payload.shown;

      state.hasToastBeenShown = state.hasToastBeenShown.filter(
        (item) => item !== toastId
      );

      if (hasToastBeenShow) {
        state.hasToastBeenShown.push(toastId);
      }
    },
    setSelectedMarker: (state, action) => {
      state.selectedMarker = action.payload;
    },
    addToDrawToolMarkers: (state, action) => {
      let marker = {
        ...action.payload,
        color: theme.colors.secondaryColorLightBlue
      };
      state.drawToolMarkers.push(marker);
    },
    removeFromDrawToolMarkers: (state, action) => {
      action.payload
        ? (state.drawToolMarkers = state.drawToolMarkers.filter(
            (marker) => marker.markerId !== action.payload
          ))
        : (state.drawToolMarkers = []);
    },
    setMarkerLabel: (state, action) => {
      state.markerLabel = action.payload;
    },
    addToActiveGeometries: (state, action) => {
      state.activeGeometries.push(action.payload);
    },
    removeActiveGeometry: (state, action) => {
      state.activeGeometries = state.activeGeometries.filter(
        (activeGeometry) => activeGeometry.id !== action.payload
      );
    },
    setIsGfiToolsOpen: (state, action) => {
      state.isGfiToolsOpen = action.payload;
    },
    setIsGfiDownloadToolsOpen: (state, action) => {
      state.isGfiDownloadToolsOpen = action.payload;
    },
    setIsFilterDialogOpen: (state, action) => {
      state.isFilterDialogOpen = action.payload;
    },
    incrementTriggerUpdate: (state) => {
      state.triggerUpdate += 1; // increment value
    },
    setShowCustomLayerList: (state, action) => {
      state.showCustomLayerList = action.payload;
    },
    setShowSavedLayers: (state, action) => {
      state.showSavedLayers = action.payload;
    },
    setCheckedLayer: (state, action) => {
      state.checkedLayer = action.payload;
    },
    setIsCheckmark: (state, action) => {
      state.isCheckmark = action.payload;
    },
    setSelectedCustomFilterLayers: (state, action) => {
      state.selectedCustomFilterLayers = action.payload;
    },
    setActiveSwitch: (state, action) => {
      state.activeSwitch = action.payload;
    },
    setIsCoordinateToolOpen: (state, action) => {
      state.isCoordinateToolOpen = action.payload;
    },
    setSelectedBaseLayers: (state, action) => {
        state.selectedBaseLayers = action.payload;
    },
    setIsBaseLayerSelectorMenuOpen: (state, action) => {
        state.isBaseLayerSelectorMenuOpen = action.payload;
    },
    setIsDatasetImportOpen: (state, action) => {
        state.isDatasetImportOpen = action.payload;
    },
    setIsProfileOpen: (state, action) => {
        state.isProfileOpen = action.payload;
    },
    setAttributeSearchEnabled: (state, action) => {
        state.attributeSearchEnabled = action.payload;
    }
  }
});

export const {
  setMinimizeFilterDialog,
  setMaximizeFilterDialog,
  setIsFilterDialogOpen,
  setIsFullScreen,
  setIsMainScreen,
  setDialogConstrainsRef,
  setIsSideMenuOpen,
  setIsSearchOpen,
  setIsSearchResultPanelVisible,
  setIsChecked,
  setSearchParams,
  setFormSearchParams,
  setIsThemeMenuOpen,
  setIsMoreSearchOpen,
  setIsInfoOpen,
  setIsUserGuideOpen,
  setIsCustomFilterOpen,
  setIsSavedLayer,
  setIsLegendOpen,
  setIsSaveViewOpen,
  setIsSaveGeometriesOpen,
  setIsGfiOpen,
  setIsGfiDownloadToolsOpen,
  setIsGfiDownloadOpen,
  setSelectedDrawingTool,
  setShareUrl,
  setIsDrawingToolsOpen,
  setActiveTool,
  setActiveSelectionTool,
  setIsDownloadLinkDialogOpen,
  setIsSwipingDisabled,
  setSelectedMapLayersMenuTab,
  setSelectedMapLayersMenuThemeIndex,
  setMinimizeGfi,
  setMaximizeGfi,
  setMinimizeFeatureSelection,
  setGfiCroppingTypes,
  setWarning,
  setGeoJsonArray,
  addToGeoJsonArray,
  setIsSavedOpen,
  setHasToastBeenShown,
  setSelectedMarker,
  addToDrawToolMarkers,
  removeFromDrawToolMarkers,
  setMarkerLabel,
  addToActiveGeometries,
  removeActiveGeometry,
  setIsGfiToolsOpen,
  incrementTriggerUpdate,
  setShowCustomLayerList,
  setShowSavedLayers,
  setCheckedLayer,
  setIsCheckmark,
  setSelectedCustomFilterLayers,
  setActiveSwitch,
  setIsCoordinateToolOpen,
  setSelectedBaseLayers,
  setIsBaseLayerSelectorMenuOpen,
  setIsDatasetImportOpen,
  setIsProfileOpen,
  setAttributeSearchEnabled
} = uiSlice.actions;

export default uiSlice.reducer;
