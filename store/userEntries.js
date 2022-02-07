import { auth, database } from "../firebase";

const userId = auth.currentUser
  ? auth.currentUser.uid
  : "v3fmHEk6CiTxbU5o8M6tFxuawEI3";

//action types
const SET_USER_ENTRIES = "SET_USER_ENTRIES";

//action creators
const setUserEntries = (entriesArray) => {
  return {
    type: SET_USER_ENTRIES,
    entriesArray,
  };
};

//thunk creators
export const fetchUserEntries = () => {
  return async (dispatch) => {
    try {
      const entriesRef = database.ref(`sleepEntries/${userId}`);
      entriesRef.on("value", (snapshot) => {
        const entriesObject = snapshot.val();
        const entriesArray = [];
        for (let entryId in entriesObject) {
          entriesArray.push(entriesObject[entryId]);
        }
        dispatch(setUserEntries(entriesArray));
      });
    } catch (error) {
      console.log(
        "there was an error fetching this user's entries from firebase realtime database: ",
        error
      );
    }
  };
};

//reducer
export default function userEntries(state = [], action) {
  switch (action.type) {
    case SET_USER_ENTRIES:
      return action.entriesArray;
    default:
      return state;
  }
}
