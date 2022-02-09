import { auth, database } from "../firebase";

//action types
const SET_DBFACTORS = "SET_DBFACTORS";

//action creators
export const setDBFactors = (factors) => {
  return {
    type: SET_DBFACTORS,
    factors,
  };
};

export const fetchDBFactors = () => {
  return async (dispatch) => {
    let sleepFactorsRef = database.ref("sleepFactors");
    sleepFactorsRef.on("value", (snapshot) => {
      const dBFactors = snapshot.val();
      for (let factorId in dbFactors) {
        let factor = dbFactors[factorId];
        factor.id = factorId;
      }
      dispatch(setDBFactors(dBFactors));
    });
  };
};

//reducer
export default function dbFactors(state = {}, action) {
  switch (action.type) {
    case SET_DBFACTORS:
      return action.factors;
    default:
      return state;
  }
}
