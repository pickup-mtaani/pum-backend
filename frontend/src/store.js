import { createStore, compose, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
// import initialState from './initialstate';
import baseReduce from "./redux/reducers/index";
const initialState = {};
const reducer = combineReducers(baseReduce);
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducer,
  initialState,
  composeEnhancer(applyMiddleware(thunk))
);
export default store;
