import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSideMenuOpen: false,
  isSearchOpen: false,
  isLegendOpen: false
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setIsSideMenuOpen: (state, action) => {
      state.isSideMenuOpen = action.payload;
    },
    setIsSearchOpen: (state, action) => {
      state.isSearchOpen = action.payload;
    },
    setIsLegendOpen: (state, action) =>  {
      state.isLegendOpen = action.payload
    }
  }
});

export const { setIsSideMenuOpen, setIsSearchOpen, setIsLegendOpen } = uiSlice.actions;

export default uiSlice.reducer;