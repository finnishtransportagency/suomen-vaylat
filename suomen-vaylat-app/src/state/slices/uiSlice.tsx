import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isFullScreen: false,
  isSideMenuOpen: false,
  isSearchOpen: false,
  searchParams: "",
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
    }
  }
});

export const {
  setIsFullScreen,
  setIsSideMenuOpen,
  setIsSearchOpen,
  setSearchParams,
  setIsLegendOpen,
  setIsInfoOpen
} = uiSlice.actions;

export default uiSlice.reducer;
