import { auth, database } from "../firebase";
import { setNewestEntry } from "./newestEntry";
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
        //reformat they entries as an array and put the id as a prop on each entry
        const entriesArray = [];
        if (entriesObject) {
          for (let entryId in entriesObject) {
            let entry = entriesObject[entryId];
            entry.id = entryId;
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

export const goAddUserEntry = (formData) => {
  return async (dispatch) => {
    try {
      const userId = auth.currentUser && auth.currentUser.uid;
      const sleepEntriesRef = await database.ref(`sleepEntries/${userId}`);
      await sleepEntriesRef.push(formData);

      dispatch(fetchUserEntries());
      dispatch(setNewestEntry(formData));
    } catch (error) {
      console.log(
        "there was an error adding this entry to the firebase realtime database: ",
        error
      );
    }
  };
};

export const goUpdateUserEntry = (formData, entryId) => {
  return async (dispatch) => {
    try {
      //console.log("formData about to be updated in db", formData);
      const userId = auth.currentUser && auth.currentUser.uid;
      const sleepEntriesRef = database.ref(`sleepEntries/${userId}/${entryId}`);
      sleepEntriesRef.set(formData);

      dispatch(fetchUserEntries());
      dispatch(setNewestEntry(formData));
    } catch (error) {
      console.log(
        "there was an error updating this entry in the firebase realtime database: ",
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
