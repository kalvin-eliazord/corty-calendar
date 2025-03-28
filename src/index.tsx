import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import AreModalsVisibleProvider from "./context/ModalsContext";
import CalendarProvider from "./context/CalendarContext";
import TaskSelectedIdProvider from "./context/TaskSelectedIdContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <CalendarProvider>
      <TaskSelectedIdProvider>
        <AreModalsVisibleProvider>
          <App />
        </AreModalsVisibleProvider>
      </TaskSelectedIdProvider>
    </CalendarProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
