import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSideMenuOpen: false
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setIsSideMenuOpen: (state, action) => {
      state.isSideMenuOpen = action.payload;
    }
  }
});

export const { setIsSideMenuOpen } = uiSlice.actions;

export default uiSlice.reducer;