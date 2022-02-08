//action types
const SET_FACTORS = "SET_FACTORS";
const CLEAR_FACTORS = "CLEAR_FACTORS";
const ADD_FACTOR = "ADD_FACTOR";
const REMOVE_FACTOR = "REMOVE_FACTOR";

//action creators
export const setUserFactors = (factors) => {
  return {
    type: SET_FACTORS,
    factors,
  };
};

export const addFactor = (factor) => {
  return {
    type: ADD_FACTOR,
    factor,
  };
};

export const removeFactor = (factor) => {
  return {
    type: REMOVE_FACTOR,
    factor,
  };
};

export const clearFactors = () => {
  return {
    type: CLEAR_FACTORS,
  };
};

//reducer
export default function userFactors(state = {}, action) {
  switch (action.type) {
    case SET_FACTORS:
      return action.factors;
    case ADD_FACTOR:
      console.log("action.factor.id from add factor", action.factor.id);
      return { ...state, [action.factor.id]: action.factor };
    case REMOVE_FACTOR:
      let newUserFactors = { ...state };
      delete newUserFactors[action.factor.id];
      // console.log("newUserFactors from reducer's removefactor case: " newUserFactors);
      return newUserFactors;
    case CLEAR_FACTORS:
      return {};
    default:
      return state;
  }
}
