import { auth, database } from "../firebase";
import { setUserFactors, clearFactors } from "./userFactors";
import { fetchUserEntries, clearUserEntries } from "./userEntries";
import { clearNewest } from "./newestEntry";
import { clearOldest } from "./oldestEntry";

const userId = auth.currentUser && auth.currentUser.uid;

//action types
const SET_PROFILE = "SET_PROFILE";
const CLEAR_PROFILE = "CLEAR_PROFILE";

//action creators
const setProfile = (profile) => {
  return {
    type: SET_PROFILE,
    profile,
  };
};

export const clearProfile = () => {
  return {
    type: CLEAR_PROFILE,
  };
};

//thunk creators
export const fetchProfile = () => {
  return async (dispatch) => {
    try {
      const userId = auth.currentUser && auth.currentUser.uid;
      const profileRef = database.ref(`users/${userId}`);
      profileRef.on("value", (snapshot) => {
        const profile = snapshot.val();

        //extract the userFactors from the profile object and put the factorId on each factor.
        const userFactors = profile.userFactors;
        for (let factorId in userFactors) {
          let factor = userFactors[factorId];
          factor.id = factorId;
        }
        delete profile.userFactors;

        dispatch(setUserFactors(userFactors));
        dispatch(setProfile(profile));
      });
    } catch (error) {
      console.log(
        "there was an error fetching this user's profile from firebase realtime database: ",
        error
      );
    }
  };
};

export const login = (email, password, navigation) => {
  return async (dispatch) => {
    try {
      auth
        .signInWithEmailAndPassword(email, password)
        .then(async (userCredentials) => {
          const user = userCredentials.user;
          const userId = user.uid;
          console.log("Logged In with", user.email);
          console.log("userId", userId);
        })
        .then(() => {
          dispatch(fetchProfile());
        })
        .then(() => {
          dispatch(fetchUserEntries());
        })
        .then(() => {
          navigation.navigate("NavBar");
        });
    } catch (error) {
      console.log(
        `there was an error logging into firebase authorization with ${email} and ${password}: `,
        error
      );
    }
  };
};

export const createProfile = (newProfile, password, navigation) => {
  return async (dispatch) => {
    try {
      //take the id prop off each factor in userFactors.  this way it matches what is in firebase
      for (let factorId in newProfile.userFactors) {
        let factor = newProfile.userFactors[factorId];
        delete factor.id;
      }

      //create user in firebase auth
      auth
        .createUserWithEmailAndPassword(newProfile.email, password)
        .then((userCredentials) => {
          //create user in firebase realtime.
          const userId = userCredentials.user.uid;
          database.ref("users/" + userId).set(newProfile);
        })
        .then(() => {
          //pull info for the new profile from the db to update the store
          dispatch(fetchProfile());
          //send the user to the NavBar
          navigation.navigate("NavBar");
        });
    } catch (error) {
      console.log(
        "there was an error creating this user's profile in firebase: ",
        error
      );
    }
  };
};

export const updateProfile = (newProfile) => {
  return async (dispatch) => {
    try {
      //take the id prop off each factor in userFactors.  this way it matches what is in firebase
      for (let factorId in newProfile.userFactors) {
        let factor = newProfile.userFactors[factorId];
        delete factor.id;
      }

      //update firebase auth
      auth.currentUser
        .updateEmail(newProfile.email)
        .then(() => {
          //update firebase realtime
          database.ref("users/" + auth.currentUser.uid).set(newProfile);
        })
        .then(() => {
          //pull updated info from the db to update the store
          dispatch(fetchProfile());
        });
    } catch (error) {
      console.log(
        "there was an error updating this user's profile in firebase: ",
        error
      );
    }
  };
};

export const logout = (navigation) => {
  return async (dispatch) => {
    auth
      .signOut()
      .then(() => {
        console.log("Log out sucess");
        navigation.navigate("LoginScreen");
      })
      .catch((error) => {
        console.log("Error logging out", error);
      })
      .then(() => {
        dispatch(clearNewest());
        dispatch(clearOldest());
        dispatch(clearUserEntries());
        dispatch(clearFactors());
        dispatch(clearProfile());
      });
  };
};

//reducer
export default function profile(state = {}, action) {
  switch (action.type) {
    case SET_PROFILE:
      return action.profile;
    case CLEAR_PROFILE:
      return {};
    default:
      return state;
  }
}
