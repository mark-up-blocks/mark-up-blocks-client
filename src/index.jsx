import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { DndProvider } from "react-dnd";
import App from "./App";
import store from "./app/store";
import isTouchDevice from "./helpers/device";

const render = (backend) => {
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
};

if (isTouchDevice()) {
  import("react-dnd-touch-backend")
    .then(({ TouchBackend }) => render(TouchBackend));
} else {
  import("react-dnd-html5-backend")
    .then(({ HTML5Backend }) => render(HTML5Backend));
}
