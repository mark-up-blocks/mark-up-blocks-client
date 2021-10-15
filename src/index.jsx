import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { DndProvider } from "react-dnd";
import MultiBackend from "react-dnd-multi-backend";
import HTML5toTouch from "react-dnd-multi-backend/dist/esm/HTML5toTouch";
import App from "./App";
import store from "./app/store";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <DndProvider backend={MultiBackend} options={HTML5toTouch}>
        <Router>
          <App />
        </Router>
      </DndProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root"),
);
