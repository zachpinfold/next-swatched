import { Dispatch } from "redux";
import { AppActions } from "../types/types";
import app from "../firebase";

export const login = (UserID: string): AppActions => ({
  type: "LOGIN_AUTH",
  payload: { UserID },
});

export const loadUser = (UserID: string): AppActions => ({
  type: "USER_LOADED",
  payload: { UserID },
});

export const authError = (): AppActions => ({
  type: "AUTH_ERROR",
});

export const startLoadUser = () => async (dispatch) => {
  try {
    app.auth.onAuthStateChanged((user) => {
      if (user === null) {
        dispatch(authError);
      }

      const { uid } = user;

      // store.dispatch(getProfileData(uid));

      dispatch(loadUser(uid));
    });
  } catch (error) {
    console.log(error);
  }
};

export const startLogin =
  (email: string, password: string) => async (dispatch) => {
    try {
      const data = await app.auth().signInWithEmailAndPassword(email, password);
      const { uid } = data.user;
      console.log(uid);

      dispatch(login(uid));
    } catch (error) {
      console.log("error-" + error);
    }
  };
