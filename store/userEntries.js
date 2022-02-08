import { auth, database } from "../firebase";

const userId = auth.currentUser && auth.currentUser.uid;

//action types
const SET_USER_ENTRIES = "SET_USER_ENTRIES";
const CLEAR_USER_ENTRIES = "CLEAR_USER_ENTRIES";
//action creators
const setUserEntries = (entriesArray) => {
  return {
    type: SET_USER_ENTRIES,
    entriesArray,
  };
};

export const clearUserEntries = () => {
  return {
    type: CLEAR_USER_ENTRIES,
  };
};

//thunk creators
export const fetchUserEntries = () => {
  return async (dispatch) => {
    try {
      const userId = auth.currentUser && auth.currentUser.uid;

      const entriesRef = database.ref(`sleepEntries/${userId}`);
      entriesRef.on("value", (snapshot) => {
        const entriesObject = snapshot.val();

        const entriesArray = [];
        if (entriesObject) {
          for (let entryId in entriesObject) {
            entriesArray.push(entriesObject[entryId]);
          }
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
    case CLEAR_USER_ENTRIES:
      return [];
    default:
      return state;
  }
}
