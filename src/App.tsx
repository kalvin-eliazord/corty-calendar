import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import GlobalStyle from "./utils/GlobalStyle";
import Navbar from "./component/Navbar/Navbar";
import { useAreModalsVisibleContext } from "./context/ModalsContext";
import { TasksProvider } from "./context/TasksContext";
import ViewTaskModal from "./component/TaskModals/ViewTaskModal/ViewTaskModal";
import AddTaskModal from "./component/TaskModals/AddTaskModal/AddTaskModal";
import { ModalBackground } from "./component/TaskModals/AddTaskModal/AddTask.styles";
import TaskSelectedIdProvider from "./context/TaskSelectedIdContext";
import DateSelectedProvider from "./context/DateSelectedContext";
import { useCalendarContext } from "./context/CalendarContext";
import Tasks from "./page/Task/Tasks";
import DayView from "./page/CalendarViews/DayView/DayView";
import MonthView from "./page/CalendarViews/MonthView/MonthView";

export default function App() {
  const {
    isAddTaskModalVisible,
    isViewTaskModalVisible,
    setIsAddTaskModalVisible,
    setIsViewTaskModalVisible,
  } = useAreModalsVisibleContext();
  const { calendar } = useCalendarContext();

  return (
    <Router>
      <GlobalStyle />
      <TaskSelectedIdProvider>
        <TasksProvider>
          <DateSelectedProvider>
            {isAddTaskModalVisible && <AddTaskModal />}

            {isViewTaskModalVisible && <ViewTaskModal />}

            {(isViewTaskModalVisible || isAddTaskModalVisible) && (
              <ModalBackground
                onClick={() => {
                  isAddTaskModalVisible
                    ? setIsAddTaskModalVisible(false)
                    : setIsViewTaskModalVisible(false);
                }}
              />
            )}
            <Navbar />
            <Routes>
              <Route
                path="/"
                element={
                  <Navigate
                    to={`/calendar/day/${calendar.year}/${calendar.month}/${calendar.day}`}
                  />
                }
              />
              <Route
                path="/calendar/day/:year/:month/:dayIndex"
                element={<DayView dayRangeProps={1} displayType="block" />}
              />
              <Route
                path="/calendar/week/:year/:month/:dayIndex"
                element={<DayView dayRangeProps={7} displayType="flex" />}
              />
              <Route
                path="/calendar/month/:year/:month/:dayIndex"
                element={<MonthView monthRangeProps={1} />}
              />
              <Route
                path="/calendar/year/:year/:month/:dayIndex"
                element={<MonthView monthRangeProps={12} />}
              />
              <Route path="/tasks" element={<Tasks />} />
            </Routes>
          </DateSelectedProvider>
        </TasksProvider>
      </TaskSelectedIdProvider>
    </Router>
  );
}
