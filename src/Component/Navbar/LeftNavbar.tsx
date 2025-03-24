import { MainContainer, AddTaskButton, LeftSide } from "./Navbar.styles";
import { MonthCalendar } from "../MonthCalendar/MonthCalendar";
import { useAreModalsVisibleContext } from "../../context/ModalsContext";

const LeftNavbar = () => {
  // Context
  const { setIsAddTaskModalVisible } = useAreModalsVisibleContext();

  return (
    <MainContainer>
      <LeftSide>
        <AddTaskButton onClick={() => setIsAddTaskModalVisible(true)}>
          + Add Task
        </AddTaskButton>
        <MonthCalendar customCssProps />
      </LeftSide>
    </MainContainer>
  );
};

export default LeftNavbar;
