import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { createGlobalStyle, styled } from "styled-components";
import Navbar from "./component/Navbar/Navbar";
import { useAreModalsVisibleContext } from "./context/ModalsContext";
import { TasksProvider } from "./context/TasksContext";
import ViewTaskModal from "./component/TaskModals/ViewTaskModal/ViewTaskModal";
import AddTaskModal from "./component/TaskModals/AddTaskModal/AddTaskModal";
import TaskSelectedIdProvider from "./context/TaskSelectedIdContext";
import DateSelectedProvider from "./context/DateSelectedContext";
import { useCalendarContext } from "./context/CalendarContext";
import Tasks from "./page/Tasks";
import DayView from "./page/CalendarViews/DayView";
import MonthView from "./page/CalendarViews/MonthView";
const GlobalStyle = createGlobalStyle`
body{
  margin:0;
  padding:0;
  font-family: Noto Sans, sans-serif;
    overflow-y: hidden;
}
`;

const ModalBackground = styled.div`
  position: absolute;
  z-index: 12;
  background-color: rgba(0, 0, 0, 0.66);
  width: 100%;
  height: 100vh;
`;

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
