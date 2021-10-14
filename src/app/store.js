import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import challenge from "../features/challenge";

const middlewares = [];

if (process.env.NODE_ENV === "development") {
  middlewares.push(logger);
}

export default configureStore({
  reducer: {
    challenge,
  },
  middleware: (getDefaultMiddleware) => [...getDefaultMiddleware(), ...middlewares],
});
