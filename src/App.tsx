import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import GlobalStyle from "./utils/GlobalStyle";
import { useAreModalsVisibleContext } from "./context/ModalsContext";
import { TasksProvider } from "./context/TasksContext";
import ViewTaskModal from "./component/TaskModals/ViewTaskModal/ViewTaskModal";
import AddTaskModal from "./component/TaskModals/AddTaskModal/AddTaskModal";
import { ModalBackground } from "./component/TaskModals/AddTaskModal/AddTaskModal.styles";
import { useTaskSelectedIdContext } from "./context/TaskSelectedIdContext";
import DateSelectedProvider from "./context/DateSelectedContext";
import { useCalendarContext } from "./context/CalendarContext";
import Tasks from "./page/Task/Tasks";
import DayView from "./page/CalendarViews/DayView/DayView";
import MonthView from "./page/CalendarViews/MonthView/MonthView";
import YearView from "./page/CalendarViews/YearView/YearView";
import TopNavbar from "./component/Navbar/TopNavbar";
import LeftNavbar from "./component/Navbar/LeftNavbar";
import { NavbarBodyContainer } from "./component/Navbar/Navbar.styles";
import { PowerModeBackground } from "./page/Task/Tasks.styles";

export default function App() {
  const {
    isAddTaskModalVisible,
    isViewTaskModalVisible,
    setIsAddTaskModalVisible,
    setIsViewTaskModalVisible,
  } = useAreModalsVisibleContext();
  const { calendar } = useCalendarContext();
  const { setTaskSelectedId } = useTaskSelectedIdContext();

  const handleModalBackgroundClick = () => {
    setTaskSelectedId("");

    if (isAddTaskModalVisible) setIsAddTaskModalVisible(false);
    else setIsViewTaskModalVisible(false);
  };

  return (
    <Router>
      <GlobalStyle />
      <TasksProvider>
        <DateSelectedProvider>
          {isAddTaskModalVisible && <AddTaskModal />}

          {isViewTaskModalVisible && <ViewTaskModal />}

          {(isViewTaskModalVisible || isAddTaskModalVisible) && (
            <ModalBackground onClick={() => handleModalBackgroundClick()} />
          )}
          <TopNavbar />
          <NavbarBodyContainer>
            <LeftNavbar />
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
                element={<DayView dayRangeProps={1} isWeekView={false} />}
              />
              <Route
                path="/calendar/week/:year/:month/:dayIndex"
                element={<DayView dayRangeProps={7} isWeekView={true} />}
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
          </NavbarBodyContainer>
        </DateSelectedProvider>
      </TasksProvider>
    </Router>
  );
}
