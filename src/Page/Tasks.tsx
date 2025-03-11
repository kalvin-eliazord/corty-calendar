import { useContext } from "react";
import styled from "styled-components";
import { Task } from "../Component/Task/TaskHandler";
import { CalendarContainer } from "../Component/Calendar/Calendar";
import { TasksContext } from "../Component/Task/TasksProvider";

const Text = styled.p`
  color: white;
`;
const Tasks = () => {
  const context = useContext(TasksContext);
  if (!context)
    throw new Error("Tasks component must be wrapped within TasksProvider.");
  const { tasks, tasksDispatch } = context;
  //  task.view/delete/create
  // can sort tasks by prio, complex, due date and filter by name

  return (
    <CalendarContainer>
      {tasks.length < 1 && <Text>No tasks!</Text>}
      {tasks.map((task: Task) => (
        <Text key={task.id}>{task.dueDate}</Text>
      ))}
    </CalendarContainer>
  );
};

export default Tasks;
