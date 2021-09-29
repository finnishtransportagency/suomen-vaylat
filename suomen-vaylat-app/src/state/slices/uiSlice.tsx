import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isFullScreen: false,
  isSideMenuOpen: false,
  isSearchOpen: false,
  searchParams: "",
  isLegendOpen: false,
  isInfoOpen: false,
  isDrawingToolsOpen: false
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setIsFullScreen: (state, action) => {
      state.isFullScreen = action.payload;
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
    setIsDrawingToolsOpen: (state, action) => {
      state.isDrawingToolsOpen = action.payload;
    }
  }
});

export const { setSearchParams,
               setIsFullScreen,
               setIsMainScreen,
               setIsSideMenuOpen,
               setIsSearchOpen,
               setIsLegendOpen,
               setIsInfoOpen,
               setIsDrawingToolsOpen  } = uiSlice.actions;

export default uiSlice.reducer;
