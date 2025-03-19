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
ViewRadiosContainer
} from "./ViewTask.styles";
import { useTaskSelectedIdContext } from "../../../context/TaskSelectedIdContext";
import { useAreModalsVisibleContext } from "../../../context/ModalsContext";

const ViewTask = () => {
  const { taskSelectedId } = useTaskSelectedIdContext();
  const { tasks } = useTasksContext();
  const { isViewTaskModalVisible, setIsViewTaskModalVisible } =
    useAreModalsVisibleContext();
  const [viewedTask, setViewedTask] = useState<Task>({} as Task);
  const { removeTask, setTask } = useTasksContext();

  useEffect(() => {
    const taskRetrieved = tasks.find((task) => task.id === taskSelectedId);
    if (!taskRetrieved) {
      setIsViewTaskModalVisible(false);
      return;
    }
    setViewedTask(taskRetrieved);
  }, [taskSelectedId]);

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
        <TaskTitle> {viewedTask.title && viewedTask.title} </TaskTitle>

        <TimeSettingsContainerLink>
          <ClockImg src="https://cdn-icons-png.flaticon.com/512/3114/3114812.png" />
          <p>
            {viewedTask.dueDate && format(viewedTask.dueDate, "d MMMM yyyy")}
          </p>
          <p>{viewedTask.hour && getFormattedHour(viewedTask.hour)}</p>
        </TimeSettingsContainerLink>

        {viewedTask.description && (
          <>
            <DescriptionImg src="https://www.svgrepo.com/show/532195/menu.svg" />
            <DescriptionTextArea>{viewedTask.description}</DescriptionTextArea>
          </>
        )}
        <ViewRadiosContainer>
          Priority: {viewedTask.priority} <br /> Complexity:
          {viewedTask.complexity}
        </ViewRadiosContainer>

        <AddItemsContainer>
          {viewedTask.checks && viewedTask.checks.length > 0 && (
            <Form>
              Checks
              <ItemInputContainer>
                {viewedTask.checks.map((check) => (
                  <ItemContainer key={check.id}>{check.name}</ItemContainer>
                ))}
              </ItemInputContainer>
            </Form>
          )}
          {viewedTask.labels && viewedTask.labels.length > 0 && (
            <Form>
              Labels
              <ItemInputContainer>
                {viewedTask.labels.map((label) => (
                  <ItemContainer key={label.id}>{label.name}</ItemContainer>
                ))}
              </ItemInputContainer>
            </Form>
          )}
        </AddItemsContainer>
      </ChildContainer>
    </MainContainer>
  );
};

export default ViewTask;
