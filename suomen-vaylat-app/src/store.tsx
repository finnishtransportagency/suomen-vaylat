import { configureStore, applyMiddleware } from "@reduxjs/toolkit";
import languageReducer from './features/language/languageSlice';
import thunkMiddleware from "redux-thunk";

const middlewareEnhancer = applyMiddleware(thunkMiddleware);

const store = configureStore ({
  reducer: {
    language: languageReducer
  },
  enhancers: [middlewareEnhancer]
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch