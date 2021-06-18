import { createSlice } from '@reduxjs/toolkit';
import strings from '../../translations';

const initialState = {
  selected: null,
  resultGeoJSON: null
};


export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchSelected: (state, action) => {
      state.selected = action.payload;
    }
  }
});

export const { setSearchSelected } = searchSlice.actions;

export default searchSlice.reducer;