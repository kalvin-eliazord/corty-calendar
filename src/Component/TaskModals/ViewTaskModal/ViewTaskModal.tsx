import { useState, useEffect } from "react";
import { format } from "date-fns";
import { getFormattedHour } from "../../../utils/getFormattedHour";
import { Task, useTasksContext } from "../../../context/TasksContext";
import {
  MainContainer,
  HeaderContainer,
  ExitButton,
  TimeSettingsContainerLink,
  AddItemsContainer,
  ItemInputContainer,
  ItemContainer,
  ChildContainer,
  ClockImg,
  DescriptionImg,
  DescriptionTextArea,
  TaskTitle,
  Form,
} from "../AddTaskModal/AddTask.styles";

import {
  ViewRadiosContainer,
  IsDoneTaskButton,
  Footer,
} from "./ViewTask.styles";
import { useTaskSelectedIdContext } from "../../../context/TaskSelectedIdContext";
import { useAreModalsVisibleContext } from "../../../context/ModalsContext";

const ViewTask = () => {
  const { taskSelectedId } = useTaskSelectedIdContext();
  const { tasks } = useTasksContext();
  const {
    isViewTaskModalVisible,
    setIsViewTaskModalVisible,
    isAddTaskModalVisible,
    setIsAddTaskModalVisible,
  } = useAreModalsVisibleContext();
  const [taskSelected, setViewedTask] = useState<Task>({} as Task);
  const { removeTask, setTask, toggleIsDoneTask } = useTasksContext();

  useEffect(() => {
    const taskRetrieved = tasks.find((task) => task.id === taskSelectedId);
    if (!taskRetrieved) {
      setIsViewTaskModalVisible(false);
      return;
    }
    setViewedTask(taskRetrieved);
  }, [taskSelectedId]);

  const handleIsDoneTaskButtonClick = () => {
    toggleIsDoneTask(taskSelected.id);
    setIsViewTaskModalVisible(false);
    if (isAddTaskModalVisible) setIsAddTaskModalVisible(false);
  };

  return (
    <MainContainer>
      <HeaderContainer>
        <ExitButton
          alt="exitButton"
          src="https://cdn2.iconfinder.com/data/icons/e-commerce-line-10-1/1024/close10-64.png"
          onClick={() => setIsViewTaskModalVisible(false)}
        />
      </HeaderContainer>
      <ChildContainer>
        <TaskTitle> {taskSelected.title && taskSelected.title} </TaskTitle>

        <TimeSettingsContainerLink>
          <ClockImg src="https://cdn-icons-png.flaticon.com/512/3114/3114812.png" />
          <p>
            {taskSelected.dueDate &&
              format(taskSelected.dueDate, "d MMMM yyyy")}
          </p>
          <p>{taskSelected.hour && getFormattedHour(taskSelected.hour)}</p>
        </TimeSettingsContainerLink>

        {taskSelected.description && (
          <>
            <DescriptionImg src="https://www.svgrepo.com/show/532195/menu.svg" />
            <DescriptionTextArea>
              {taskSelected.description}
            </DescriptionTextArea>
          </>
        )}
        <ViewRadiosContainer>
          Priority: {taskSelected.priority} <br /> Complexity:
          {taskSelected.complexity}
        </ViewRadiosContainer>

        <AddItemsContainer>
          {taskSelected.checks && taskSelected.checks.length > 0 && (
            <Form>
              Checks
              <ItemInputContainer>
                {taskSelected.checks.map((check) => (
                  <ItemContainer key={check.id}>{check.name}</ItemContainer>
                ))}
              </ItemInputContainer>
            </Form>
          )}
          {taskSelected.labels && taskSelected.labels.length > 0 && (
            <Form>
              Labels
              <ItemInputContainer>
                {taskSelected.labels.map((label) => (
                  <ItemContainer key={label.id}>{label.name}</ItemContainer>
                ))}
              </ItemInputContainer>
            </Form>
          )}
        </AddItemsContainer>
      </ChildContainer>
      <Footer>
        <IsDoneTaskButton onClick={() => handleIsDoneTaskButtonClick()}>
          {taskSelected.isDone
            ? "Mark task as unfinished"
            : "Mark task as finished"}
        </IsDoneTaskButton>
      </Footer>
    </MainContainer>
  );
};

export default ViewTask;
