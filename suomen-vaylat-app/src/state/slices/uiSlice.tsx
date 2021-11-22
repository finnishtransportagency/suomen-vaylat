import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isFullScreen: false,
  isSideMenuOpen: false,
  isSearchOpen: false,
  searchParams: "",
  isLegendOpen: false,
  isInfoOpen: false,
  selectedTheme: '',
  shareUrl: '',
  isDrawingToolsOpen: false,
  selectedLayerList: 'themes',
  activeTool: '',
  gfiLocations: null,
  isGFIOpen: false,
  isSwipingDisabled: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setIsFullScreen: (state, action) => {
      state.isFullScreen = action.payload;
    },
    setIsGFIOpen: (state, action) => {
      state.isGFIOpen = action.payload;
    },
    setIsMainScreen: (state) => {
      state.isFullScreen = false
      state.isSideMenuOpen = false
      state.isSearchOpen = false
      state.isLegendOpen = false
      state.isInfoOpen = false;
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
    setIsLegendOpen: (state, action) =>  {
      state.isLegendOpen = action.payload
    },
    setIsInfoOpen: (state, action) => {
      state.isInfoOpen = action.payload;
    },
    setSelectedTheme: (state, action) => {
      state.selectedTheme = action.payload;
    },
    setShareUrl: (state, action) => {
      state.shareUrl = action.payload;
    },
    setIsDrawingToolsOpen: (state, action) => {
      state.isDrawingToolsOpen = action.payload;
    },
    setSelectedLayerListType: (state, action) => {
      state.selectedLayerList = action.payload;
    },
    setActiveTool: (state, action) => {
      state.activeTool = action.payload;
    },
    setIsSwipingDisabled: (state, action) => {
      state.isSwipingDisabled = action.payload;
    }
  }
});

export const {
  setIsMainScreen,
  setSearchParams,
  setIsSideMenuOpen,
  setIsSearchOpen,
  setIsLegendOpen,
  setIsInfoOpen,
  setIsFullScreen,
  setIsDrawingToolsOpen,
  setSelectedTheme,
  setShareUrl,
  setSelectedLayerListType,
  setActiveTool,
  setIsSwipingDisabled,
  setIsGFIOpen
} = uiSlice.actions;

export default uiSlice.reducer;
