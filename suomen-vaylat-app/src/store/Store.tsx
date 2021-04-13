import { createBrowserHistory } from 'history';
import { applyMiddleware, createStore, compose } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import promise from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import { combinedRecuders } from '../reducers/index';
import { persistConfig } from './Config';
import { setLanguageMiddleware } from './Middleware';

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistedReducer = persistReducer(persistConfig, combinedRecuders);
const middlewares = applyMiddleware(thunk, promise, setLanguageMiddleware);

export const history = createBrowserHistory();
export const store = createStore(persistedReducer, composeEnhancers(middlewares));
export const persistor = persistStore(store as any);