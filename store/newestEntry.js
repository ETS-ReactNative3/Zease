//action types
const SET_NEWEST = "SET_NEWEST";
const CLEAR_NEWEST = "CLEAR_NEWEST";
//action creators
export const setNewestEntry = (entry) => {
  return {
    type: SET_NEWEST,
    entry,
  };
};

export const clearNewest = () => {
  return {
    type: CLEAR_NEWEST,
  };
};

//reducer
export default function newestEntry(state = {}, action) {
  switch (action.type) {
    case SET_NEWEST:
      return action.entry;
    case CLEAR_NEWEST:
      return {};
    default:
      return state;
  }
}
