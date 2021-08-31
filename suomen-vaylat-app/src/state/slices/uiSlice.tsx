import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSideMenuOpen: false,
  isSearchOpen: false
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
    }
  }
});

export const { setIsSideMenuOpen, setIsSearchOpen } = uiSlice.actions;

export default uiSlice.reducer;