import { createSlice } from '@reduxjs/toolkit';

const initialState = {
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
    isUserGuideOpen: false,
    shareUrl: '',
    isDrawingToolsOpen: false,
    isLegendOpen: false,
    isZoomBarOpen: false,
    isSaveViewOpen: false,
    isGfiOpen: false,
    isGfiDownloadOpen: false,
    selectedGfiTool: null,
    activeTool: null,
    gfiLocations: null,
    isSwipingDisabled: false,
    selectedMapLayersMenuTab: 0,
    selectedMapLayersMenuThemeIndex: null,
    minimizeGfi: false,
    maximizeGfi: false,
    gfiCroppingTypes: [],
    warning: null,
    hasToastBeenShown: false
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
            state.isSearchOpen = false;
            state.isInfoOpen = false;
            state.isUserGuideOpen = false;
            state.isDrawingToolsOpen = false;
            state.isLegendOpen = false;
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
            state.hasToastBeenShown = action.payload;
        }
    },
});

export const {
    setIsFullScreen,
    setIsMainScreen,
    setModalConstrainsRef,
    setIsSideMenuOpen,
    setIsSearchOpen,
    setSearchParams,
    setIsInfoOpen,
    setIsUserGuideOpen,
    setIsLegendOpen,
    setIsZoomBarOpen,
    setIsSaveViewOpen,
    setIsGfiOpen,
    setIsGfiDownloadOpen,
    setSelectedGfiTool,
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
    setHasToastBeenShown
} = uiSlice.actions;

export default uiSlice.reducer;
