import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import Navbar from "./component/Navbar";
import { useAreModalsVisibleContext } from "./context/ModalsContext";
import { TasksProvider } from "./context/TasksContext";
import ViewTaskModal from "./component/TaskModals/ViewTaskModal";
import AddTaskModal from "./component/TaskModals/AddTaskModal";
import TaskSelectedIdProvider from "./context/TaskSelectedIdContext";
import {
  useCalendarContext,
} from "./context/CalendarContext";
import Tasks from "./page/Tasks";
import DayView from "./page/CalendarViews/DayView";
import WeekView from "./page/CalendarViews/WeekView";
import MonthView from "./page/CalendarViews/MonthView";
import YearView from "./page/CalendarViews/YearView";

const GlobalStyle = createGlobalStyle`
body{
  margin:0;
  padding:0;
  font-family: Noto Sans, sans-serif;
    overflow-y: hidden;
}
`;

export default function App() {
  const { isAddTaskModalVisible, isViewTaskModalVisible } =
    useAreModalsVisibleContext();
  const { calendar } = useCalendarContext();

  return (
    <Router>
      <GlobalStyle />

      <TasksProvider>
          {isAddTaskModalVisible && <AddTaskModal />}

          <TaskSelectedIdProvider>
            {/*isViewTaskModalVisible && (
        <ViewTaskModal  />
      )*/}
            <Navbar />
            <Routes>
              <Route path="/" element={<Navigate to={`/calendar/day/${calendar.year}/${calendar.month}/${calendar.day}`} />} />
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
      </TasksProvider>
    </Router>
  );
}
