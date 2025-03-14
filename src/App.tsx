import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import Navbar from "./Component/Navbar";
import { useAreModalsVisibleContext } from "./context/ModalsContext";
import { TasksProvider } from "./context/TasksContext";
import ViewTaskModal from "./Component/TaskModals/ViewTaskModal";
import AddTaskModal from "./Component/TaskModals/AddTaskModal";
import TaskSelectedIdProvider from "./context/TaskSelectedIdContext";
import CalendarProvider from "./context/CalendarContext";
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
  const { isAddTaskModalVisible, isViewTaskModalVisible } =
    useAreModalsVisibleContext();

  return (
    <Router>
      <GlobalStyle />

      <TasksProvider>
        <CalendarProvider>
          {isAddTaskModalVisible && <AddTaskModal />}

          <TaskSelectedIdProvider>
            {/*isViewTaskModalVisible && (
        <ViewTaskModal  />
      )*/}
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
          </TaskSelectedIdProvider>
        </CalendarProvider>
      </TasksProvider>
    </Router>
  );
}
