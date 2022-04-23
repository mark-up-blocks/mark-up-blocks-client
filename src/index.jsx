import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import App from "./App";
import store from "./app/store";
import isTouchDevice from "./helpers/device";

const backend = isTouchDevice() ? TouchBackend : HTML5Backend;
const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <DndProvider backend={backend}>
        <Router>
          <App />
        </Router>
      </DndProvider>
    </Provider>
  </React.StrictMode>,
);
