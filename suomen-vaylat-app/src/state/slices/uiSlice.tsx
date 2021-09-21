import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isFullScreen: false,
  isSideMenuOpen: false,
  isSearchOpen: false,
  isLegendOpen: false,
  isInfoOpen: false
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
    setIsLegendOpen: (state, action) =>  {
      state.isLegendOpen = action.payload
    },
    setIsInfoOpen: (state, action) => {
      state.isInfoOpen = action.payload;
    }
  }
});

export const { setIsFullScreen,
               setIsMainScreen,
               setIsSideMenuOpen,
               setIsSearchOpen,
               setIsLegendOpen,
               setIsInfoOpen } = uiSlice.actions;

export default uiSlice.reducer;
