import { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { Task } from "../context/TasksContext";
import { CalendarContainer } from "../component/MonthCalendar/MonthCalendar";
import { useTasksContext } from "../context/TasksContext";
import { getFormattedHour } from "../utils/getFormattedHour";
import { useAreModalsVisibleContext } from "../context/ModalsContext";
import { useTaskSelectedIdContext } from "../context/TaskSelectedIdContext";
import { format } from "date-fns";
import { CalendarViewSelector } from "../component/Navbar/Navbar.styles";

const MainContainer = styled.div`
  padding: 20px;
  background-color: #0f1011;

  div {
    display: flex;
  }
`;

const HeaderContainer = styled.div`
  position: sticky;
  top: 0;
  background-color: #2a2e31;
  padding: 20px;
  margin-bottom: 10px;
  display: flex;
  gap: 40px;
`;

const TaskContainer = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #246694;
  border-radius: 5px;
  width: 100%;
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
  width: 25px;
  height: 25px;
  margin-top: 20px;
  position: relative;
  bottom: 4px;
  right: 40px;
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
  const { setTaskSelectedId } = useTaskSelectedIdContext();
  const { tasks, tasksDispatch } = useTasksContext();
  const [originalTasks, setOriginalTasks] = useState<Task[]>([] as Task[]);
  const [sortType, setSortType] = useState<string>("");
  const [sortValue, setSortValue] = useState<string>("");
  const [renderedTasks, setRenderedTasks] = useState<number>(10);

  const handleUndoSort = () => {
    tasksDispatch({ type: "SET_TASKS", state: originalTasks });
  };

  const getDueDateSortedTasks = (sortValue: string) => {
    switch (sortValue) {
      case "ascending":
        return [...tasks].sort(
          (a, b) =>
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        );
      case "descending":
        return [...tasks].sort(
          (a, b) =>
            new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
        );
      default:
        return tasks;
    }
  };

  const getPrioritySortedTasks = (sortValue: string) => {
    switch (sortValue) {
      case "ascending":
        return [...tasks].sort((a, b) => a.priority - b.priority);
      case "descending":
        return [...tasks].sort((a, b) => b.priority - a.priority);
      default:
        return tasks;
    }
  };

  const getComplexitySortedTasks = (sortValue: string) => {
    switch (sortValue) {
      case "ascending":
        return [...tasks].sort((a, b) => a.complexity - b.complexity);
      case "descending":
        return [...tasks].sort((a, b) => b.complexity - a.complexity);
      default:
        return tasks;
    }
  };

  const sortedTask = useMemo(() => {
    if (sortValue === "default") return originalTasks;

    switch (sortType) {
      case "complexity":
        return getComplexitySortedTasks(sortValue);
      case "priority":
        return getPrioritySortedTasks(sortValue);
      case "dueDate":
        return getDueDateSortedTasks(sortValue);
      default:
        return tasks;
    }
  }, [tasks, sortValue]);

  useEffect(() => {
    setOriginalTasks(tasks);
  }, [tasks]);

  const handleOnScroll = (e: any) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    if (Math.floor(scrollTop + clientHeight) === scrollHeight - 1)
      setRenderedTasks((prev) => prev + 10);
  };

  const handleTaskClick = (taskId: string) => {
    setIsViewTaskModalVisible(!isViewTaskModalVisible);
    setTaskSelectedId(taskId);
  };

  return (
    <CalendarContainer onScroll={(e) => handleOnScroll(e)}>
      <HeaderContainer>
        <CalendarViewSelector
          onChange={(e: any) => setSortType(e.target.value)}
        >
          <option value="default"> Pick a sort type</option>
          <option value="priority"> Priority </option>
          <option value="complexity"> Complexity </option>
          <option value="dueDate"> Due date </option>
        </CalendarViewSelector>

        <CalendarViewSelector
          onChange={(e: any) => setSortValue(e.target.value)}
        >
          <option value="default"> Default </option>
          <option value="ascending"> Ascending </option>
          <option value="descending"> Descending </option>
        </CalendarViewSelector>
      </HeaderContainer>
      <MainContainer>
        {tasks.length < 1 && <Text>No tasks!</Text>}
        {sortedTask.slice(0, renderedTasks).map((task: Task) => (
          <div key={task.id}>
            <TaskContainer onClick={() => handleTaskClick(task.id)}>
              <Text>
                {task.title}, {getFormattedHour(task.hour)}
              </Text>
            </TaskContainer>
            <DeleteButton
              alt="DeleteButton"
              src="https://cdn2.iconfinder.com/data/icons/e-commerce-line-10-1/1024/close10-64.png"
              onClick={() =>
                tasksDispatch({ type: "REMOVE_TASK", state: task.id })
              }
            />
          </div>
        ))}
      </MainContainer>
    </CalendarContainer>
  );
};

export default Tasks;
