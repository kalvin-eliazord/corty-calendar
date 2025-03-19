import { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { Task } from "../context/TasksContext";
import { CalendarContainer } from "../component/MonthCalendar";
import { useTasksContext } from "../context/TasksContext";
import { getFormattedHour } from "../utils/getFormattedHour";
import { useAreModalsVisibleContext } from "../context/ModalsContext";

const MainContainer = styled.div`
  padding: 20px;
  background-color: #0f1011;
`;

const HeaderContainer = styled.div`
  position: sticky;
  top: 0;
  background-color: #2a2e31;
  padding: 20px;
  margin-bottom: 10px;
`;

const TaskContainer = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #246694;
  border-radius: 5px;
  padding: 5px;
  color: white;
  font-weight: bold;
  margin-bottom: 20px;
  padding-left: 2%;
  &:hover {
    cursor: pointer;
    background-color: grey;
  }
`;

const DeleteButton = styled.img`
  filter: invert(1);
  width: 15px;
  height: 15px;
  margin-top: 20px;
  position: relative;
  bottom: 4px;
  margin-right: 20px;
  &:hover {
    cursor: pointer;
  }
`;

const Text = styled.p`
  color: white;
`;

const Tasks = () => {
  const { isViewTaskModalVisible, setIsViewTaskModalVisible } =
    useAreModalsVisibleContext();
  const { tasks, tasksDispatch } = useTasksContext();
  const [originalTasks, setOriginalTasks] = useState<Task[]>([] as Task[]);
  const [sortType, setSortType] = useState<string>("");
  const [renderedTasks, setRenderedTasks] = useState<number>(10);

  const handleUndoSort = () => {
    tasksDispatch({ type: "SET_TASKS", state: originalTasks });
  };

  const sortedTask = useMemo(() => {
    switch (sortType) {
      case "ASCENDING_COMPLEXITY_TASKS":
        return [...tasks].sort((a, b) => a.complexity - b.complexity);
      case "DESCENDING_COMPLEXITY_TASKS":
        return [...tasks].sort((a, b) => b.complexity - a.complexity);
      case "ASCENDING_PRIORITY_TASKS":
        return [...tasks].sort((a, b) => a.priority - b.priority);
      case "DESCENDING_PRIORITY_TASKS":
        return [...tasks].sort((a, b) => b.priority - a.priority);
      case "ASCENDING_DUE_DATE_TASKS":
        return [...tasks].sort(
          (a, b) =>
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        );
      case "DESCENDING_DUE_DATE_TASKS":
        return [...tasks].sort(
          (a, b) =>
            new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
        );
      default:
        return tasks;
    }
  }, [tasks, sortType]);

  useEffect(() => {
    setOriginalTasks(tasks);
  }, [tasks]);

  const handleOnScroll = (e: any) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    if (Math.floor(scrollTop + clientHeight) === scrollHeight - 1)
      setRenderedTasks((prev) => prev + 10);
  };

  return (
    <CalendarContainer onScroll={(e) => handleOnScroll(e)}>
      <HeaderContainer>
        <button> sorting </button>
      </HeaderContainer>
      <MainContainer>
        {tasks.length < 1 && <Text>No tasks!</Text>}
        {sortedTask.slice(0, renderedTasks).map((task: Task, index) => (
          <TaskContainer
            key={task.id}
            onClick={() => setIsViewTaskModalVisible(!isViewTaskModalVisible)}
          >
            <Text>
              {task.title}, {getFormattedHour(task.hour)}
            </Text>
            <DeleteButton
              alt="DeleteButton"
              src="https://cdn2.iconfinder.com/data/icons/e-commerce-line-10-1/1024/close10-64.png"
              onClick={() =>
                tasksDispatch({ type: "REMOVE_TASK", state: task.id })
              }
            />
          </TaskContainer>
        ))}
      </MainContainer>
    </CalendarContainer>
  );
};

export default Tasks;
