import { combineReducers, createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";

import userEntries from "./userEntries";

const rootReducer = combineReducers({
  userEntries,
});

const middleware = composeWithDevTools(applyMiddleware(thunkMiddleware));

const store = createStore(rootReducer, middleware);

export default store;
