import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import challenge from "../features/challenge";
import notice from "../features/notice";

const middlewares = [];

if (process.env.NODE_ENV === "development") {
  middlewares.push(logger);
}

export default configureStore({
  reducer: {
    challenge,
    notice,
  },
  middleware: (getDefaultMiddleware) => [...getDefaultMiddleware(), ...middlewares],
});
