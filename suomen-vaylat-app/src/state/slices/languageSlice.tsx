import { createSlice } from '@reduxjs/toolkit';
import strings from "../../translations";


const initialState = {
  current: 'fi'
};

export const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLocale: (state, action) => {
      state.current = action.payload;
      strings.setLanguage(action.payload);
    }
  }
});

export const { setLocale } = languageSlice.actions;

export default languageSlice.reducer;