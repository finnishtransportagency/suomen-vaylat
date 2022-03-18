import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isFullScreen: false,
  modalConstrainsRef: null,
  isSideMenuOpen: false,
  isSearchOpen: false,
  searchParams: '',
  isInfoOpen: false,
  isUserGuideOpen: false,
  shareUrl: '',
  isDrawingToolsOpen: false,
  isLegendOpen: false,
  isSaveViewOpen: false,
  activeTool: null,
  gfiLocations: null,
  isSwipingDisabled: false,
  selectedMapLayersMenuTab: 0,
  selectedMapLayersMenuThemeIndex: null,
  minimizeGfi: false,
  warning: null
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
    setIsUserGuideOpen: (state, action) => {
      state.isUserGuideOpen = action.payload;
    },
    setIsLegendOpen: (state, action) => {
      state.isLegendOpen = action.payload;
    },
    setIsSaveViewOpen: (state, action) => {
      state.isSaveViewOpen = action.payload;
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
    setWarning: (state, action) => {
      state.warning = action.payload;
    }
  }
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
  setIsSaveViewOpen,
  setShareUrl,
  setIsDrawingToolsOpen,
  setActiveTool,
  setIsSwipingDisabled,
  setSelectedMapLayersMenuTab,
  setSelectedMapLayersMenuThemeIndex,
  setMinimizeGfi,
  setWarning
} = uiSlice.actions;

export default uiSlice.reducer;
