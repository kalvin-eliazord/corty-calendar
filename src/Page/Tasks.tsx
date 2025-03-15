import { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { Task } from "../context/TasksContext";
import { CalendarContainer } from "../component/MonthCalendar";
import { useTasksContext } from "../context/TasksContext";
import { format } from "date-fns";
import { getFormattedHour } from "../utils/getFormattedHour";

const MainContainer = styled.div`
  padding: 20px;
  background-color: pink;
`;

const HeaderContainer = styled.div`
  position: fixed;
  top: 20;
  background-color: orange;
  width: 71.8%;
`;

const TaskContainer = styled.div`
  background-color: #246694;
  width: 90%;
  margin-right: 50px;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  padding-left: 2%;
  &:hover {
    cursor: pointer;
  }
`;

const Text = styled.p`
  color: white;
`;

const Tasks = () => {
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
          <TaskContainer key={task.id}>
            <Text>
              id: {index} title: {task.title}
            </Text>
            <Text>description: {task.description}</Text>
            <Text>isAllDay: {`${task.isAllDay}`}</Text>

            <Text>hour: {getFormattedHour(task.hour)}</Text>

            <Text>complexity: {task.complexity}</Text>
            <Text>priority: {task.priority}</Text>
            <Text>dueDate: {format(task.dueDate, "d MMMM yyyy")}</Text>
            <Text>isDone: {`${task.isDone}`}</Text>
          </TaskContainer>
        ))}
      </MainContainer>
    </CalendarContainer>
  );
};

export default Tasks;
