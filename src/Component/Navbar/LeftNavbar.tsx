import { MainContainer, AddTaskButton, LeftSide } from "./Navbar.styles";
import { MonthCalendar } from "../MonthCalendar/MonthCalendar";
import { useAreModalsVisibleContext } from "../../context/ModalsContext";
import { useDateSelectedContext } from "../../context/DateSelectedContext";
import { useCalendarContext } from "../../context/CalendarContext";

const LeftNavbar = () => {
  // Context
  const { setIsAddTaskModalVisible } = useAreModalsVisibleContext();
  const { calendar } = useCalendarContext();
  const { setDateSelected } = useDateSelectedContext();

  const handleAddTaskButtonClick = () => {
    setDateSelected(new Date(calendar.year, calendar.month - 1, calendar.day));
    setIsAddTaskModalVisible(true);
  };
  return (
    <MainContainer>
      <LeftSide>
        <AddTaskButton onClick={() => handleAddTaskButtonClick()}>
          + Add Task
        </AddTaskButton>
        <MonthCalendar customCssProps isYearView={false}/>
      </LeftSide>
    </MainContainer>
  );
};

export default LeftNavbar;
