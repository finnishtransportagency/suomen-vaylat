import { configureStore, applyMiddleware } from '@reduxjs/toolkit';
import languageReducer from './slices/languageSlice';
import thunkMiddleware from 'redux-thunk';
import { loadFromLocalStorage, saveToLocalStorage } from './localStorage';
import { throttle } from 'lodash';

const middlewareEnhancer = applyMiddleware(thunkMiddleware);

const store = configureStore ({
  reducer: {
    language: languageReducer
  },
  enhancers: [middlewareEnhancer],
  preloadedState: loadFromLocalStorage()
});

// Save only selected language to localstorage
store.subscribe(throttle(() => saveToLocalStorage({language: store.getState().language}), 1000));

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;