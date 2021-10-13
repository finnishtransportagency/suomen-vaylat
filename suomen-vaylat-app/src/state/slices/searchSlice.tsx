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
    ajoradat: [],
    address: []
  },
  searching: false,
  searchError: false,
  searchErrorData: null,
  searchErrorType: '',
  addressSearchEventHandlerReady: false,
  selectedIndex: -1,
  marker: {
    x: null,
    y: null,
    msg: null
  }
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
        ajoradat: [],
        address: []
      };
      state.selectedIndex = -1;
      state.marker = {
        x: null,
        y: null,
        msg: null
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
      if (action.payload.address) {
        state.searchResult.address = action.payload.address;
      }
      if (action.payload.searching) {
        state.searching = action.payload.searching;
      } else {
        state.searching = false;
      }
      state.selectedIndex = -1;
    },
    setSearching: (state, action) => {
      state.searching = action.payload;
    },
    setSearchError: (state, action) => {
      state.searchError = action.payload.errorState;
      state.searchErrorData = action.payload.data[0];
      state.searchErrorType = action.payload.errorType;
    },
    emptySearchResult: (state) => {
      state.searchResult = {
        tie: null,
        geom: null,
        tieosat: [],
        osa: null,
        ajoradat: [],
        address: []
      };
      state.selectedIndex = -1;
      state.marker = {
        x: null,
        y: null,
        msg: null
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
    },
    setAddressSearchEventHandlerReady: (state, action) => {
      state.addressSearchEventHandlerReady = action.payload;
    },
    setSelectedIndex: (state, action) => {
      state.selectedIndex = action.payload;
    },
    setMarker: (state, action) => {
      state.marker.x = action.payload.x;
      state.marker.y = action.payload.y;
      state.marker.msg = action.payload.msg;
    }
  }
});

export const {
  setFormData,
  setSearchSelected,
  setSearchResult,
  setSearchError,
  setSearching,
  emptySearchResult,
  emptyFormData,
  setAddressSearchEventHandlerReady,
  setSelectedIndex,
  setMarker
} = searchSlice.actions;

export default searchSlice.reducer;