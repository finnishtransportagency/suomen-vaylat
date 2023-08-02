import { createSlice, current } from '@reduxjs/toolkit';
import { theme } from '../../theme/theme';

const initialState = {
    isGfiToolsOpen: false,
    isFullScreen: false,
    modalConstrainsRef: null,
    isSideMenuOpen: false,
    isSearchOpen: false,
    downloadLink: {
        layerDownloadLinkModalOpen: false,
        layerDownloadLink: null,
        layerDownloadLinkName: null,
    },
    searchParams: '',
    isInfoOpen: false,
    geoJsonArray: [],
    isSavedOpen: false,
    savedTabIndex: 0,
    isUserGuideOpen: false,
    isCustomFilterOpen: false,
    isSavedLayer: false,
    shareUrl: '',
    isThemeMenuOpen: false,
    isDrawingToolsOpen: false,
    isLegendOpen: false,
    isZoomBarOpen: false,
    isSaveViewOpen: false,
    isGfiOpen: false,
    isGfiDownloadOpen: false,
    selectedGfiTool: null,
    activeTool: null,
    activeSelectionTool: null,
    gfiLocations: null,
    isSwipingDisabled: false,
    selectedMapLayersMenuTab: 0,
    selectedMapLayersMenuThemeIndex: null,
    minimizeGfi: false,
    maximizeGfi: false,
    gfiCroppingTypes: [],
    warning: null,
    hasToastBeenShown : [],
    selectedMarker: 2,
    drawToolMarkers: [],
    markerLabel: '',
    activeGeometries: [],
    triggerUpdate: 0,
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
            state.isZoomBarOpen = false;
            state.isSaveViewOpen = false;
            state.selectedMapLayersMenuTab = 0;
            state.selectedMapLayersMenuThemeIndex = null;
            state.minimizeGfi = false;
            state.warning = null;
            state.isGfiOpen = false;
        },
        setModalConstrainsRef: (state, action) => {
            state.modalConstrainsRef = action.payload;
        },
        setIsSideMenuOpen: (state, action) => {
            state.isSideMenuOpen = action.payload;
        },
        setIsSearchOpen: (state, action) => {
            state.isSearchOpen = action.payload;
        },
        setSearchParams: (state, action) => {
            state.searchParams = action.payload;
        },
        setIsInfoOpen: (state, action) => {
            state.isInfoOpen = action.payload;
        },
        setGeoJsonArray: (state, action) => {
            state.geoJsonArray = action.payload;
        }, 
        addToGeoJsonArray: (state, action) => {
            let duplicateIndex = state.geoJsonArray.findIndex(geoj => geoj.id === action.payload.id);

            if(duplicateIndex !== -1) state.geoJsonArray[duplicateIndex] = action.payload;
            else state.geoJsonArray.push(action.payload);
        },
        setSavedTabIndex: (state, action) => {
            state.savedTabIndex = action.payload;
        },
        setIsSavedOpen: (state, action) => {
            state.isSavedOpen = action.payload;
        },
        setIsThemeMenuOpen: (state, action) => {
            state.isThemeMenuOpen = action.payload;
        },
        setIsDownloadLinkModalOpen: (state, action) => {
            state.downloadLink = {
                layerDownloadLinkModalOpen:
                    action.payload.layerDownloadLinkModalOpen,
                layerDownloadLink: action.payload.layerDownloadLink,
                layerDownloadLinkName: action.payload.layerDownloadLinkName,
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
        setIsZoomBarOpen: (state, action) => {
            state.isZoomBarOpen = action.payload;
        },
        setIsSaveViewOpen: (state, action) => {
            state.isSaveViewOpen = action.payload;
        },
        setIsGfiOpen: (state, action) => {
            state.isGfiOpen = action.payload;
        },
        setIsGfiDownloadOpen: (state, action) => {
            state.isGfiDownloadOpen = action.payload;
        },
        setSelectedGfiTool: (state, action) => {
            state.selectedGfiTool = action.payload;
        },
        setActiveSelectionTool: (state, action) => {
            state.activeSelectionTool = action.payload;
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
        setMaximizeGfi: (state, action) => {
            state.maximizeGfi = action.payload;
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

            state.hasToastBeenShown = state.hasToastBeenShown.filter(item => item !== toastId);

            if (hasToastBeenShow) {
                state.hasToastBeenShown.push(toastId);
            }
        },
        setSelectedMarker: (state, action) => {
            state.selectedMarker = action.payload;
        },
        addToDrawToolMarkers: (state, action) => {
            let marker = {...action.payload, color: theme.colors.secondaryColor1}
            state.drawToolMarkers.push(marker);
        },
        removeFromDrawToolMarkers: (state, action) => {
            action.payload? state.drawToolMarkers = state.drawToolMarkers.filter((marker) => marker.markerId !== action.payload) : state.drawToolMarkers = [];
        },
        setMarkerLabel: (state, action) => {
            state.markerLabel = action.payload;
        },
        addToActiveGeometries: (state, action) => {
            state.activeGeometries.push(action.payload);
        },
        removeActiveGeometry: (state, action) => {
            state.activeGeometries = state.activeGeometries.filter((activeGeometry) => activeGeometry.id !== action.payload);
        },
        setIsGfiToolsOpen: (state, action) => {
            state.isGfiToolsOpen = action.payload;
        },
        incrementTriggerUpdate: state => {
            state.triggerUpdate += 1; // increment value
          },

    },
});

export const {
    setIsFullScreen,
    setIsMainScreen,
    setModalConstrainsRef,
    setIsSideMenuOpen,
    setIsSearchOpen,
    setSearchParams,
    setIsThemeMenuOpen,
    setIsInfoOpen,
    setIsUserGuideOpen,
    setIsCustomFilterOpen,
    setIsSavedLayer,
    setIsLegendOpen,
    setIsZoomBarOpen,
    setIsSaveViewOpen,
    setIsGfiOpen,
    setIsGfiDownloadOpen,
    setSelectedGfiTool,
    setActiveSelectionTool,
    setShareUrl,
    setIsDrawingToolsOpen,
    setActiveTool,
    setIsDownloadLinkModalOpen,
    setIsSwipingDisabled,
    setSelectedMapLayersMenuTab,
    setSelectedMapLayersMenuThemeIndex,
    setMinimizeGfi,
    setMaximizeGfi,
    setGfiCroppingTypes,
    setWarning,
    setGeoJsonArray,
    addToGeoJsonArray,
    setIsSavedOpen,
    setSavedTabIndex,
    setHasToastBeenShown,
    setSelectedMarker,
    addToDrawToolMarkers,
    removeFromDrawToolMarkers,
    setMarkerLabel,
    addToActiveGeometries,
    removeActiveGeometry,
    setIsGfiToolsOpen,
    incrementTriggerUpdate
} = uiSlice.actions;

export default uiSlice.reducer;
