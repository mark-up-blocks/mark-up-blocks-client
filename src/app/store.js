import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import challenge from "../features/challenge";

export default configureStore({
  reducer: {
    challenge,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});
