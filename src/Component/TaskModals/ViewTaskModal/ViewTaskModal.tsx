import { useState, useEffect } from "react";
import { format } from "date-fns";
import { getFormattedHour } from "../../../utils/getFormattedHour";
import { Task, useTasksContext } from "../../../context/TasksContext";
import {
  MainContainer,
  HeaderButton,
  TimeSettingsContainerLink,
  AddItemsContainer,
  ItemInputContainer,
  ChildContainer,
  ClockImg,
  DescriptionImg,
  DescriptionTextArea,
  TaskTitle,
  Form,
} from "../AddTaskModal/AddTask.styles";

import {
  HeaderContainer,
  SlidersViewContainer,
  IsDoneTaskButton,
  LabelContainer,
  CheckContainer,
  Footer,
} from "./ViewTask.styles";
import { useTaskSelectedIdContext } from "../../../context/TaskSelectedIdContext";
import { useAreModalsVisibleContext } from "../../../context/ModalsContext";

const ViewTask = () => {
  const { taskSelectedId } = useTaskSelectedIdContext();
  const { tasks } = useTasksContext();
  const {
    setIsViewTaskModalVisible,
    isAddTaskModalVisible,
    setIsAddTaskModalVisible,
  } = useAreModalsVisibleContext();
  const [taskSelected, setTaskSelected] = useState<Task>({} as Task);
  const { removeTask, setTask, toggleIsDoneTask, toggleIsDoneCheck } =
    useTasksContext();

  useEffect(() => {
    const taskRetrieved = tasks.find((task) => task.id === taskSelectedId);
    if (!taskRetrieved) {
      setIsViewTaskModalVisible(false);
      return;
    }
    setTaskSelected(taskRetrieved);
  }, [taskSelectedId, tasks]);

  const handleIsDoneTaskButtonClick = () => {
    toggleIsDoneTask(taskSelected.id);
    setIsViewTaskModalVisible(false);
    if (isAddTaskModalVisible) setIsAddTaskModalVisible(false);
  };

  const handleDeleteButtonClick = () => {
    removeTask(taskSelected.id);
    setIsViewTaskModalVisible(false);
  };

  return (
    <MainContainer>
      <HeaderContainer>
        <HeaderButton
          alt="editButton"
          src="https://cdn-icons-png.flaticon.com/512/1250/1250615.png"
          onClick={() => setIsViewTaskModalVisible(false)}
        />
        <HeaderButton
          alt="deleteButton"
          src="https://cdn-icons-png.flaticon.com/512/3405/3405244.png"
          onClick={() => handleDeleteButtonClick()}
        />
        <HeaderButton
          alt="HeaderButton"
          src="https://cdn2.iconfinder.com/data/icons/e-commerce-line-10-1/1024/close10-64.png"
          onClick={() => setIsViewTaskModalVisible(false)}
        />
      </HeaderContainer>
      <ChildContainer>
        <TaskTitle $isDone={taskSelected.isDone}>
          {taskSelected.title && taskSelected.title}
        </TaskTitle>

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
        <SlidersViewContainer>
          <div>Priority:</div> <p>{taskSelected.priority}</p>
          <div>Complexity:</div> <p>{taskSelected.complexity} </p>
        </SlidersViewContainer>

        <AddItemsContainer>
          {taskSelected.checks && taskSelected.checks.length > 0 && (
            <Form>
              Checks
              <ItemInputContainer>
                {taskSelected.checks.map((check) => (
                  <CheckContainer
                    key={check.id}
                    onClick={() => toggleIsDoneCheck(taskSelected.id, check.id)}
                    $isDone={check.isDone}
                  >
                    {check.name}
                  </CheckContainer>
                ))}
              </ItemInputContainer>
            </Form>
          )}
          {taskSelected.labels && taskSelected.labels.length > 0 && (
            <Form>
              Labels
              <ItemInputContainer>
                {taskSelected.labels.map((label) => (
                  <LabelContainer key={label.id}>{label.name}</LabelContainer>
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
