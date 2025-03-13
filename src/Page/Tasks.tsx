import { useState, useEffect, useContext, useMemo } from "react";
import styled from "styled-components";
import { Task } from "../Component/Task/TaskHandler";
import { CalendarContainer } from "../Component/Calendar/Calendar";
import { TasksContext } from "../Component/Task/TasksProvider";
import { format } from "date-fns";

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
  const context = useContext(TasksContext);
  if (!context)
    throw new Error("Tasks component must be wrapped within TasksProvider.");
  const { tasks, tasksDispatch } = context;
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
              {task.title} {index}
            </Text>
            <Text>{format(task.dueDate, "d, MMMM yyyy")}</Text>
          </TaskContainer>
        ))}
      </MainContainer>
    </CalendarContainer>
  );
};

export default Tasks;
