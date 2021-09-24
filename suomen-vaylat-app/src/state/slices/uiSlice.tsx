import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isFullScreen: false,
  isSideMenuOpen: false,
  isSearchOpen: false,
  isLegendOpen: false,
  isInfoOpen: false,
  selectedTheme: '',
  shareUrl: ''
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
    }
  }
});

export const {
  setIsFullScreen,
  setIsSideMenuOpen,
  setIsSearchOpen,
  setIsLegendOpen,
  setIsInfoOpen,
  setSelectedTheme,
  setShareUrl
} = uiSlice.actions;

export default uiSlice.reducer;
