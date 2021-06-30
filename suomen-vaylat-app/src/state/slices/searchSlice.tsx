import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selected: 'address',
  formData: {
    address: '',
    vkm: {
      tie: null,
      tieosa: null,
      ajorata: null,
      etaisyys: null
    }
  },
  searchResult: {
    tie: null,
    geom: null,
    tieosat: [],
    osa: null,
    ajoradat: []
  },
  searching: false
};


export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setFormData: (state, action) => {
      (state.formData as any)[state.selected] = action.payload as object;
    },
    setSearchSelected: (state, action) => {
      state.selected = action.payload;
      state.searching = false;
      state.searchResult = {
        tie: null,
        geom: null,
        tieosat: [],
        osa: null,
        ajoradat: []
      };
    },
    setSearchResult: (state, action) => {
      if (action.payload.tie) {
        state.searchResult.tie = action.payload.tie;
      }
      if (action.payload.tieosat) {
        state.searchResult.tieosat = action.payload.tieosat;
      }
      if (action.payload.geom) {
        state.searchResult.geom = action.payload.geom;
      }
      if (action.payload.ajoradat) {
        state.searchResult.ajoradat = action.payload.ajoradat;
      }
      if (action.payload.osa) {
        state.searchResult.osa = action.payload.osa;
      }
      if (action.payload.searching) {
        state.searching = action.payload.searching;
      } else {
        state.searching = false;
      }
    },
    setSearching: (state, action) => {
      state.searching = action.payload;
    },
    emptySearchResult: (state) => {
      state.searchResult = {
        tie: null,
        geom: null,
        tieosat: [],
        osa: null,
        ajoradat: []
      };
    },
    emptyFormData: (state) => {
      state.formData = {
        address: '',
        vkm: {
          ajorata: null,
          etaisyys: null,
          tie: null,
          tieosa: null
        }
      };
    }
  }
});

export const {
  setFormData,
  setSearchSelected,
  setSearchResult,
  setSearching,
  emptySearchResult,
  emptyFormData
} = searchSlice.actions;

export default searchSlice.reducer;