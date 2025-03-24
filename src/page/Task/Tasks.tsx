import { useState, useEffect, useMemo } from "react";
import { differenceInDays, isSameDay } from "date-fns";
import { CalendarContainer } from "../../component/MonthCalendar/MonthCalendar";
import { useTasksContext, Task } from "../../context/TasksContext";
import { getFormattedHour } from "../../utils/getFormattedHour";
import { useAreModalsVisibleContext } from "../../context/ModalsContext";
import { useTaskSelectedIdContext } from "../../context/TaskSelectedIdContext";
import { CalendarViewSelector } from "../../component/Navbar/Navbar.styles";
import { HeaderButton } from "../../component/TaskModals/AddTaskModal/AddTask.styles";
import {
  MainContainer,
  HeaderTasksContainer,
  TaskContainer,
  DeleteButtonContainer,
  DeleteButton,
  Text,
  LabelsSelectedContainer,
  LabelSelected,
  SearchTaskInput,
  PowerModeBackground,
  TaskUnfinishedText,
} from "././Tasks.styles";
import LabelSelector from "../../component/LabelOption";

const sortTypeOptions = {
  default: "Pick a sort type",
  priority: "Priority",
  complexity: "Complexity",
  dueDate: "Due date",
};

const sortValueOptions = {
  default: "Default",
  ascending: "Ascending",
  descending: "Descending",
};

const Tasks = () => {
  // Context
  const { isViewTaskModalVisible, setIsViewTaskModalVisible } =
    useAreModalsVisibleContext();
  const { setTaskSelectedId } = useTaskSelectedIdContext();
  const { tasks, tasksDispatch } = useTasksContext();

  // State
  const [originalTasks, setOriginalTasks] = useState<Task[]>([] as Task[]);
  const [sortType, setSortType] = useState<string>("default");
  const [sortValue, setSortValue] = useState<string>("");
  const [renderedTasks, setRenderedTasks] = useState<number>(20);
  const [labelsSelected, setLabelSelected] = useState<string[]>([]);
  const [taskSearched, setTaskSearched] = useState<string>("");
  const [isPowerModeModalVisible, setIsPowerModeModalVisible] =
    useState<boolean>(false);

  const labelFiltering = (newSortedTasks: Task[]) => {
    if (labelsSelected.length < 1) return newSortedTasks;

    return newSortedTasks.filter((task) =>
      task.labels.some((label) => labelsSelected.includes(label.name))
    );
  };

  const searchFiltering = (newSortedTasks: Task[]) => {
    if (!taskSearched || !taskSearched.trim()) return newSortedTasks;

    const taskSearchedTrimmed = taskSearched.trim();
    return newSortedTasks.filter((task) =>
      task.title.toLowerCase().includes(taskSearchedTrimmed.toLowerCase())
    );
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

  const getSortedTasks = (sortType: string): Task[] => {
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
  };

  const sortedTasks = useMemo(() => {
    const newSortedTasks = getSortedTasks(sortType);

    const labelFilteredTasks = labelFiltering(newSortedTasks);

    const searchFilteredTasks = searchFiltering(labelFilteredTasks);

    return searchFilteredTasks;
  }, [tasks, sortValue, labelsSelected, taskSearched]);

  const handleOnScroll = (e: any) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    if (scrollHeight - Math.floor(scrollTop + clientHeight) < 50)
      if (renderedTasks >= tasks.length) setRenderedTasks(tasks.length);
      else setRenderedTasks((prev) => prev + 10);
  };

  const handleTaskClick = (taskId: string) => {
    setIsViewTaskModalVisible(!isViewTaskModalVisible);
    setTaskSelectedId(taskId);
  };

  const handleLabelSelectChange = (labelName: string) => {
    setLabelSelected((prev) => [...prev, labelName]);
  };

  useEffect(() => {
    setOriginalTasks(tasks);
  }, [tasks]);

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

  useEffect(() => {
    if (!isViewTaskModalVisible && isPowerModeModalVisible)
      setIsPowerModeModalVisible(false);
  }, [isViewTaskModalVisible]);

  return (
    <CalendarContainer onScroll={(e) => handleOnScroll(e)}>
      {isPowerModeModalVisible && (
        <PowerModeBackground
          onClick={() => setIsPowerModeModalVisible(false)}
        />
      )}

      <HeaderTasksContainer>
        <TaskUnfinishedText>
          {tasks.length > 0 &&
            tasks.filter((task) => !task.isDone).length > 0 &&
            `${tasks.filter((task) => !task.isDone).length} tasks unfinished`}
          {" , tasks rendered: " + renderedTasks}
        </TaskUnfinishedText>
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
          {Object.entries(sortTypeOptions).map(([key, value]) => (
            <option
              key={key}
              value={key}
              disabled={sortType !== "default" && key === "default"}
            >
              {value}
            </option>
          ))}
        </CalendarViewSelector>

        {sortType !== "" && (
          <CalendarViewSelector
            onChange={(e: any) => setSortValue(e.target.value)}
          >
            {Object.entries(sortValueOptions).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </CalendarViewSelector>
        )}
        <LabelSelector
          tasks={tasks}
          labelsSelected={labelsSelected}
          handleLabelSelectChange={handleLabelSelectChange}
        />
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
        {/* no need a state for sorted task, just call the piping func on my tasks array*/}
        {tasks.length < 1 && <Text>No tasks! 🍕</Text>}

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
