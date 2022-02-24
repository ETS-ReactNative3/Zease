import { combineReducers, createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";

import profile from "./profile";
import userEntries from "./userEntries";
import newestEntry from "./newestEntry";
import oldestEntry from "./oldestEntry";
import userFactors from "./userFactors";
import dbFactors from "./dbFactors";
import pieChartSliderMargin from "./pieChartSliderMargin";

const rootReducer = combineReducers({
  profile,
  userEntries,
  newestEntry,
  oldestEntry,
  userFactors,
  dbFactors,
  pieChartSliderMargin,
});

const middleware = composeWithDevTools(applyMiddleware(thunkMiddleware));

const store = createStore(rootReducer, middleware);

export default store;
