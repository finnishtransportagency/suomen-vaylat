import { applyMiddleware, configureStore } from '@reduxjs/toolkit';
import languageReducer from './slices/languageSlice';
import rpcReducer from './slices/rpcSlice';
import searchReducer from './slices/searchSlice';
import uiReducer from './slices/uiSlice';


//import { loadFromLocalStorage, saveToLocalStorage } from './localStorage';
//import { throttle } from 'lodash';


export const store = configureStore ({
  reducer: {
    language: languageReducer,
    rpc: rpcReducer,
    ui: uiReducer,
    search: searchReducer
  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({serializableCheck: false}),
  // TODO check at if something still need to get localStorage
  //preloadedState: loadFromLocalStorage()
});

// TODO check at if something still need to save localStorage
// Save only selected language to localstorage
// store.subscribe(throttle(() => saveToLocalStorage({language: store.getState().language}), 1000));

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;