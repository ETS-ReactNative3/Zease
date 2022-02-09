//action types
const SET_OLDEST = "SET_OLDEST";
const CLEAR_OLDEST = "CLEAR_OLDEST";
//action creators
export const setOldestEntry = (entry) => {
  return {
    type: SET_OLDEST,
    entry,
  };
};

export const clearOldest = () => {
  return {
    type: CLEAR_OLDEST,
  };
};

//reducer
export default function oldestEntry(state = {}, action) {
  switch (action.type) {
    case SET_OLDEST:
      return action.entry;
    case CLEAR_OLDEST:
      return {};
    default:
      return state;
  }
}
