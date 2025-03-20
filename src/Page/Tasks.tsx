import { useState, useEffect, useMemo } from "react";
import { differenceInDays, isSameDay } from "date-fns";
import styled from "styled-components";
import { Task } from "../context/TasksContext";
import { CalendarContainer } from "../component/MonthCalendar/MonthCalendar";
import { useTasksContext } from "../context/TasksContext";
import { getFormattedHour } from "../utils/getFormattedHour";
import { useAreModalsVisibleContext } from "../context/ModalsContext";
import { useTaskSelectedIdContext } from "../context/TaskSelectedIdContext";
import { CalendarViewSelector } from "../component/Navbar/Navbar.styles";
import { HeaderButton } from "../component/TaskModals/AddTaskModal/AddTask.styles";

const MainContainer = styled.div`
  padding: 20px;
  background-color: #0f1011;
  overflow-x: hidden;

  div {
    display: flex;
  }
`;

const HeaderTasksContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 4;
  background-color: #2a2e31;
  padding: 20px;
  display: flex;
  gap: 40px;
`;

const TaskContainer = styled.div<{ $isDone: boolean; $dueDateLeft: number }>`
  display: flex;
  justify-content: space-between;
  text-decoration: ${({ $isDone }) => $isDone && "line-through"};
  background-color: ${({ $isDone, $dueDateLeft }) =>
    $isDone
      ? "#425682"
      : $dueDateLeft < 1
      ? "red"
      : $dueDateLeft < 4
      ? "orange"
      : "#1a3b86"};
  border-radius: 5px;
  width: 100%;
  color: white;
  font-weight: bold;
  margin-bottom: 20px;
  padding-left: 2%;
  margin-right: 1%;
  &:hover {
    cursor: pointer;
  }
`;

const DeleteButtonContainer = styled.div`
  width: 50px;
  padding-left: 20px;
  &:hover {
    background-color: red;
    border-radius: 5px;
    height: 50px;
    cursor: pointer;
  }
`;

const DeleteButton = styled.img`
  filter: invert(1);
  width: 25px;
  height: 25px;
  margin-top: 15px;
`;

const Text = styled.p`
  color: white;
`;

const LabelsSelectedContainer = styled.div`
  display: flex;
  gap: 20px;
  padding-left: 15px;
  border-bottom: 1px solid grey;
  font-weight: bold;
`;

const LabelSelected = styled.div`
  background-color: #6eaedd;
  padding: 10px;
  border-radius: 10px;
  height: 20px;
  &:hover {
    cursor: pointer;
    background-color: red;
  }
`;

const SearchTaskInput = styled.input`
  color: #e2e3e2;
  left: 80px;
  background-color: #1e1e21;
  border: 0;
  font-size: 25px;
  margin-bottom: 10px;
  border-bottom: 2px solid grey;
  &:focus {
    outline: 0;
    border-bottom: 2px solid rgb(22, 85, 187);
  }
  &::placeholder {
    color: #777472;
    padding-left: 10px;
  }
`;

const PowerModeBackground = styled.div`
  position: absolute;
  width: 100%;
  height: 100vh;
  background-color: rgba(11, 16, 24, 0.73);
  z-index: 5;
`;

const Tasks = () => {
  const {
    isAddTaskModalVisible,
    setIsAddTaskModalVisible,
    isViewTaskModalVisible,
    setIsViewTaskModalVisible,
  } = useAreModalsVisibleContext();
  const { setTaskSelectedId } = useTaskSelectedIdContext();
  const { tasks, tasksDispatch } = useTasksContext();
  const [originalTasks, setOriginalTasks] = useState<Task[]>([] as Task[]);
  const [sortType, setSortType] = useState<string>("");
  const [sortValue, setSortValue] = useState<string>("");
  const [renderedTasks, setRenderedTasks] = useState<number>(10);
  const [labelsAvailable, setLabelsAvailable] = useState<string[]>([]);
  const [labelsSelected, setLabelSelected] = useState<string[]>([]);
  const [taskSearched, setTaskSearched] = useState<string>("");
  const [isPowerModeModalVisible, setIsPowerModeModalVisible] =
    useState<boolean>(false);

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
        return originalTasks;
    }
  };

  const getPrioritySortedTasks = (sortValue: string) => {
    switch (sortValue) {
      case "ascending":
        return [...tasks].sort((a, b) => a.priority - b.priority);
      case "descending":
        return [...tasks].sort((a, b) => b.priority - a.priority);
      default:
        return originalTasks;
    }
  };

  const getComplexitySortedTasks = (sortValue: string) => {
    switch (sortValue) {
      case "ascending":
        return [...tasks].sort((a, b) => a.complexity - b.complexity);
      case "descending":
        return [...tasks].sort((a, b) => b.complexity - a.complexity);
      default:
        return originalTasks;
    }
  };

  const sortedTasks = useMemo(() => {
    let newSortedTasks: Task[] = [];

    switch (sortType) {
      case "complexity":
        newSortedTasks = getComplexitySortedTasks(sortValue);
        break;
      case "priority":
        newSortedTasks = getPrioritySortedTasks(sortValue);
        break;
      case "dueDate":
        newSortedTasks = getDueDateSortedTasks(sortValue);
        break;
      default:
        newSortedTasks = tasks;
    }

    if (labelsSelected.length > 0) {
      newSortedTasks = newSortedTasks.filter((task) =>
        task.labels.some((label) => labelsSelected.includes(label.name))
      );
    }

    if (taskSearched !== "" && taskSearched.trim() !== "") {
      const taskSearchedTrimmed = taskSearched.trim();
      newSortedTasks = newSortedTasks.filter((task) =>
        task.title.toLowerCase().includes(taskSearchedTrimmed.toLowerCase())
      );
    }

    return newSortedTasks;
  }, [tasks, sortValue, labelsSelected, taskSearched]);

  const handleOnScroll = (e: any) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    if (Math.floor(scrollTop + clientHeight) === scrollHeight - 1)
      setRenderedTasks((prev) => prev + 10);
  };

  const handleTaskClick = (taskId: string) => {
    if (isAddTaskModalVisible) {
      setIsAddTaskModalVisible(false);
      return;
    }

    setIsViewTaskModalVisible(!isViewTaskModalVisible);
    setTaskSelectedId(taskId);
  };

  const handleTasksContainerClick = () => {
    if (isViewTaskModalVisible) setIsViewTaskModalVisible(false);
    if (isAddTaskModalVisible) setIsAddTaskModalVisible(false);
  };

  const updateLabelsAvailable = () => {
    let labelsName: string[] = [];

    for (let i = 0; i < tasks.length; i++)
      labelsName = labelsName.concat(
        tasks[i].labels.map((label) => label.name)
      );

    setLabelsAvailable((prev) =>
      labelsName.filter((labelName) => !labelsSelected.includes(labelName))
    );
  };

  useEffect(() => {
    updateLabelsAvailable();
  }, [labelsSelected]);

  useEffect(() => {
    setOriginalTasks(tasks);
    updateLabelsAvailable();
  }, [tasks]);

  useEffect(() => {
    if (isPowerModeModalVisible && !isViewTaskModalVisible)
      setIsPowerModeModalVisible(false);
  }, [isViewTaskModalVisible]);

  const handlePowerModeButtonClick = () => {
    if (!sortedTasks.find((task) => !task.isDone)) return;

    const tasksPowerMode = [...sortedTasks].sort(
      (a, b) => b.complexity + b.priority - (a.complexity + a.priority)
    );

    const taskPowerMode = tasksPowerMode.find((task) => !task.isDone);
    if (!taskPowerMode) return;

    setTaskSelectedId(taskPowerMode.id);
    setIsPowerModeModalVisible(true);
    setIsViewTaskModalVisible(true);
  };

  return (
    <CalendarContainer
      onScroll={(e) => handleOnScroll(e)}
      onClick={() => handleTasksContainerClick()}
    >
      {isPowerModeModalVisible && <PowerModeBackground></PowerModeBackground>}

      <HeaderTasksContainer>
        <SearchTaskInput
          value={taskSearched}
          placeholder="Search a task"
          onChange={(e: any) => {
            tasks.length > 0 && setTaskSearched(e.target.value);
          }}
        />
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
        <CalendarViewSelector
          onChange={(e: any) =>
            setLabelSelected([...labelsSelected, e.target.value])
          }
        >
          <option value="default"> Select a label </option>
          {labelsAvailable.map((labelAvailable) => (
            <option key={labelAvailable} value={labelAvailable}>
              {labelAvailable}
            </option>
          ))}
        </CalendarViewSelector>
        <HeaderButton
          alt="powerMode"
          src="https://cdn-icons-png.flaticon.com/512/159/159607.png"
          onClick={() => handlePowerModeButtonClick()}
        />
      </HeaderTasksContainer>

      {labelsSelected.length > 0 && (
        <LabelsSelectedContainer>
          <p>Labels selected:</p>
          {labelsSelected.map((labelName) => (
            <LabelSelected
              key={labelName}
              onClick={() =>
                setLabelSelected(
                  labelsSelected.filter((label) => label !== labelName)
                )
              }
            >
              {labelName}
            </LabelSelected>
          ))}
        </LabelsSelectedContainer>
      )}

      <MainContainer>
        {tasks.length < 1 && <Text>No tasks!</Text>}
        {sortedTasks.slice(0, renderedTasks).map((task: Task) => (
          <div key={task.id}>
            <TaskContainer
              onClick={() => handleTaskClick(task.id)}
              $isDone={task.isDone}
              $dueDateLeft={
                isSameDay(task.dueDate, new Date())
                  ? 0
                  : differenceInDays(task.dueDate, new Date()) + 1
              }
            >
              <Text>
                {task.title}, {getFormattedHour(task.hour)}
              </Text>
            </TaskContainer>
            <DeleteButtonContainer>
              <DeleteButton
                alt="DeleteButton"
                src="https://cdn-icons-png.flaticon.com/512/3405/3405244.png"
                onClick={() =>
                  tasksDispatch({ type: "REMOVE_TASK", state: task.id })
                }
              />
            </DeleteButtonContainer>
          </div>
        ))}
      </MainContainer>
    </CalendarContainer>
  );
};

export default Tasks;
