import {
  MainContainer,
  AddTaskButton,
  LeftSide,
} from "./Navbar.styles";
import { MonthCalendar } from "../MonthCalendar/MonthCalendar";
import { useAreModalsVisibleContext } from "../../context/ModalsContext";
import { useTaskSelectedIdContext } from "../../context/TaskSelectedIdContext";
import { useEffect } from "react";

const LeftNavbar = () => {
  // Context
  const { setTaskSelectedId } = useTaskSelectedIdContext();
  const {
    isAddTaskModalVisible,
    setIsAddTaskModalVisible,
    isViewTaskModalVisible,
  } = useAreModalsVisibleContext();

  useEffect(() => {
    if (!isViewTaskModalVisible && !isAddTaskModalVisible)
      setTaskSelectedId("");
    
  }, [isViewTaskModalVisible]);

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
