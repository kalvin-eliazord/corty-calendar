import { useState, useEffect } from "react";
import { format } from "date-fns";
import { getFormattedHour } from "../../../utils/getFormattedHour";
import { Task, useTasksContext } from "../../../context/TasksContext";
import {
  MainAddTaskContainer,
  HeaderButton,
  TimeSettingsContainerLink,
  AddItemsContainer,
  ItemInputContainer,
  BodyContainer,
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
  ProgressBarContainer,
  ProgressBar,
  Footer,
  SliderView,
} from "./ViewTask.styles";
import { useTaskSelectedIdContext } from "../../../context/TaskSelectedIdContext";
import { useAreModalsVisibleContext } from "../../../context/ModalsContext";

const ViewTask = () => {
  // Context
  const { tasks, removeTask, getTask, toggleIsDoneTask, toggleIsDoneCheck } =
    useTasksContext();
  const { taskSelectedId } = useTaskSelectedIdContext();
  const { setIsViewTaskModalVisible, setIsAddTaskModalVisible } =
    useAreModalsVisibleContext();

  // State
  const [taskSelected, setTaskSelected] = useState<Task>({} as Task);
  const [taskProgress, setTaskProgress] = useState<number>(0);

  // Progress bar setting
  useEffect(() => {
    if (!taskSelected || !taskSelected.checks || taskSelected.checks.length < 1)
      return;

    const checksDoneLength = taskSelected.checks.filter(
      (check) => check.isDone
    ).length;

    setTaskProgress((prev) =>
      checksDoneLength > 0
        ? (checksDoneLength / taskSelected.checks.length) * 100
        : 0
    );
  }, [taskSelected]);

  // Buttons
  const handleIsDoneTaskButtonClick = () => {
    toggleIsDoneTask(taskSelected.id);
    setIsViewTaskModalVisible(false);
  };

  const handleDeleteButtonClick = () => {
    removeTask(taskSelected.id);
    setIsViewTaskModalVisible(false);
  };

  const handleEditTaskButton = () => {
    setIsViewTaskModalVisible(false);
    setIsAddTaskModalVisible(true);
  };

  useEffect(() => {
    const taskRetrieved = getTask(taskSelectedId);
    if (!taskRetrieved) {
      setIsViewTaskModalVisible(false);
      return;
    }
    setTaskSelected(taskRetrieved);
  }, [taskSelectedId, tasks]);

  return (
    <MainAddTaskContainer>
      <HeaderContainer>
        {taskSelected.checks && taskSelected.checks.length > 0 && (
          <ProgressBarContainer>
            <ProgressBar $progress={taskProgress} />
          </ProgressBarContainer>
        )}
        <HeaderButton
          alt="editButton"
          src="https://cdn-icons-png.flaticon.com/512/1250/1250615.png"
          onClick={() => handleEditTaskButton()}
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
      <BodyContainer>
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
            <DescriptionTextArea
              value={taskSelected.description}
              disabled
            ></DescriptionTextArea>
          </>
        )}
        <SlidersViewContainer>
          <SliderView>
            <div>Priority:</div> <p>{taskSelected.priority}</p>
          </SliderView>

          <SliderView>
            <div>Complexity:</div> <p>{taskSelected.complexity} </p>
          </SliderView>
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
      </BodyContainer>
      <Footer>
        <IsDoneTaskButton onClick={() => handleIsDoneTaskButtonClick()}>
          {taskSelected.isDone
            ? "Mark task as unfinished"
            : "Mark task as finished"}
        </IsDoneTaskButton>
      </Footer>
    </MainAddTaskContainer>
  );
};

export default ViewTask;
