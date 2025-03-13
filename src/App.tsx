import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import Navbar from "./Component/Navbar/Navbar";
import { AreModalsVisibleProvider } from "./Component/Task/TaskHandler";
import { TasksProvider } from "./Component/Task/TasksProvider";
import Tasks from "./Page/Tasks";
import DayView from "./Page/CalendarViews/DayView";
import WeekView from "./Page/CalendarViews/WeekView";
import MonthView from "./Page/CalendarViews/MonthView";
import YearView from "./Page/CalendarViews/YearView";

const GlobalStyle = createGlobalStyle`
body{
  margin:0;
  padding:0;
  font-family: Noto Sans, sans-serif;
}
`;

export default function App() {
  return (
    <Router>
      <GlobalStyle />
      <TasksProvider>
        <AreModalsVisibleProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/tasks" />} />
            <Route
              path="/calendar/day/:year/:month/:dayIndex"
              element={<DayView />}
            />
            <Route
              path="/calendar/week/:year/:month/:dayIndex"
              element={<WeekView />}
            />
            <Route
              path="/calendar/month/:year/:month/:dayIndex"
              element={<MonthView />}
            />
            <Route
              path="/calendar/year/:year/:month/:dayIndex"
              element={<YearView />}
            />
            <Route path="/tasks" element={<Tasks />} />
          </Routes>
        </AreModalsVisibleProvider>
      </TasksProvider>
    </Router>
  );
}
