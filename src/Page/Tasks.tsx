import { useState, useEffect, useContext, useMemo } from "react";
import styled from "styled-components";
import { Task } from "../Component/Task/TaskHandler";
import { CalendarContainer } from "../Component/Calendar/Calendar";
import { TasksContext } from "../Component/Task/TasksProvider";
import { format } from "date-fns";

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

  return (
    <CalendarContainer>
      {tasks.length < 1 && <Text>No tasks!</Text>}
      {tasks.map((task: Task) => (
        <Text key={task.id}>{format(task.dueDate, "e, MMMM yyyy")}</Text>
      ))}
    </CalendarContainer>
  );
};

export default Tasks;
