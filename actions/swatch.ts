import app from "../firebase";
import { SwatchActionTypes } from "../types/types";

export const getUserSwatches = (UserID: string): SwatchActionTypes => ({
  type: "GET_SWATCHES",
  payload: { UserID },
});

export const startGetUserSwatches =
  (userUid: string) => async (dispatch: any) => {
    //   const result = await app.fireStore
    //     .collection("swatches")
    //     .doc("k9V6LdYhaIQX45WobnePdxt6tHB2")
    //     .get("user swatches");
    //   console.log(result);
    //   if (result) {
    //   dispatch(getUserSwatches(""));
    //   }
    //   if (result.exists) {
    //     console.log(result);
    //   }
  };
