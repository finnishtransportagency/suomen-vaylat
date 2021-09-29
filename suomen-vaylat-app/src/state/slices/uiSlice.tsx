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
  selectedLayerList: 'theme'
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setIsFullScreen: (state, action) => {
      state.isFullScreen = action.payload;
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
    }
  }
});

export const { setSearchParams, setIsSideMenuOpen, setIsSearchOpen, setIsLegendOpen, setIsInfoOpen, setIsFullScreen, setIsDrawingToolsOpen, setSelectedTheme, setShareUrl, setSelectedLayerListType } = uiSlice.actions;

export default uiSlice.reducer;
