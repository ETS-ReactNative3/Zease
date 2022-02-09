import { auth, database } from '../firebase';

//action types
const SET_FACTORS = 'SET_FACTORS';
const CLEAR_FACTORS = 'CLEAR_FACTORS';
const ADD_FACTOR = 'ADD_FACTOR';
const REMOVE_FACTOR = 'REMOVE_FACTOR';

//action creators
export const setUserFactors = (factors) => {
  return {
    type: SET_FACTORS,
    factors
  };
};

export const addFactor = (factor) => {
  return {
    type: ADD_FACTOR,
    factor
  };
};

export const removeFactor = (factor) => {
  return {
    type: REMOVE_FACTOR,
    factor
  };
};

export const clearFactors = () => {
  return {
    type: CLEAR_FACTORS
  };
};

export const fetchUserFactors = () => {
  return async (dispatch) => {
    try {
      const userId = auth.currentUser && auth.currentUser.uid;
      const userFactorsRef = database.ref(`users/${userId}/userFactors`);
      userFactorsRef.on('value', (snapshot) => {
        const userFactors = snapshot.val();
        for (let id in userFactors) {
          userFactors[id].id = id;
        }
        dispatch(setUserFactors(userFactors));
      });
    } catch (error) {
      console.log('Error fetching user factors from db');
      console.log(error);
    }
  };
};

//reducer
export default function userFactors(state = {}, action) {
  switch (action.type) {
    case SET_FACTORS:
      return action.factors;
    case ADD_FACTOR:
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
