import { combineReducers, createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";

import userEntries from "./userEntries";
import newestEntry from "./newestEntry";
import oldestEntry from "./oldestEntry";

const rootReducer = combineReducers({
  userEntries,
  newestEntry,
  oldestEntry,
});

const middleware = composeWithDevTools(applyMiddleware(thunkMiddleware));

const store = createStore(rootReducer, middleware);

export default store;
