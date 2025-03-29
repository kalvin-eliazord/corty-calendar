import { useState, useEffect, useMemo } from "react";
import { differenceInDays, isSameDay } from "date-fns";
import { CalendarContainer } from "../../component/MonthCalendar/MonthCalendar.styles";
import { useTasksContext, Task } from "../../context/TasksContext";
import { getFormattedHour } from "../../utils/getFormattedHour";
import { useAreModalsVisibleContext } from "../../context/ModalsContext";
import { useTaskSelectedIdContext } from "../../context/TaskSelectedIdContext";
import { CalendarViewSelector } from "../../component/Navbar/Navbar.styles";
import { HeaderButton } from "../../component/TaskModals/AddTaskModal/AddTaskModal.styles";
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
  HeaderLeftPart,
  HeaderRightPart,
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

type TaskPipingType = {
  id: string;
  taskPiping: (tasks: Task[]) => Task[];
};

const Tasks = () => {
  // Context
  const { isViewTaskModalVisible, setIsViewTaskModalVisible } =
    useAreModalsVisibleContext();
  const { setTaskSelectedId } = useTaskSelectedIdContext();
  const { tasks, removeTask } = useTasksContext();

  // State
  const [sortType, setSortType] = useState<string>("default");
  const [sortValue, setSortValue] = useState<string>("");
  const [renderedTasks, setRenderedTasks] = useState<number>(20);
  const [labelsSelected, setLabelSelected] = useState<string[]>([] as string[]);
  const [taskSearchedInput, setTaskSearchedInput] = useState<string>("");
  const [taskPiping, setTaskPiping] = useState<TaskPipingType[]>(
    [] as TaskPipingType[]
  );
  const [isPowerModeModalVisible, setIsPowerModeModalVisible] =
    useState<boolean>(false);

  // Sorting
  const getDueDateSortedTasks = (sortValue: string) => {
    return (tasks: Task[]) => {
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
  };

  const getPrioritySortedTasks = (sortValue: string) => {
    return (tasks: Task[]) => {
      switch (sortValue) {
        case "ascending":
          return [...tasks].sort((a, b) => a.priority - b.priority);
        case "descending":
          return [...tasks].sort((a, b) => b.priority - a.priority);
        default:
          return tasks;
      }
    };
  };

  const getComplexitySortedTasks = (sortValue: string) => {
    return (tasks: Task[]) => {
      switch (sortValue) {
        case "ascending":
          return [...tasks].sort((a, b) => a.complexity - b.complexity);
        case "descending":
          return [...tasks].sort((a, b) => b.complexity - a.complexity);
        default:
          return tasks;
      }
    };
  };

  const getSortedTasks = (sortType: string, sortValue: string) => {
    switch (sortType) {
      case "complexity":
        return getComplexitySortedTasks(sortValue);
      case "priority":
        return getPrioritySortedTasks(sortValue);
      case "dueDate":
        return getDueDateSortedTasks(sortValue);
      default:
        return () => [...tasks];
    }
  };

  const handleSortValueChange = (newSortValue: string) => {
    if (sortValue !== "default") {
      removePiping(sortType);
    }
    addPiping(sortType, getSortedTasks(sortType, newSortValue));
    setSortValue((prev) => newSortValue);
  };

  const handleSortTypeChange = (newSortType: string) => {
    removePiping(sortType);
    setSortType(newSortType);
    setSortValue("default");
  };

  // Filtering
  const labelFiltering = (labelsSelected: string[]) => {
    return (tasks: Task[]) => {
      return tasks.filter((task) =>
        task.labels.some((label) => labelsSelected.includes(label.name))
      );
    };
  };

  useEffect(() => {
    if (labelsSelected.length < 1) {
      removePiping("labelFiltering");
    } else {
      addPiping("labelFiltering", labelFiltering(labelsSelected));
    }
  }, [labelsSelected]);

  const filterTaskName = (taskSearchedInput: string) => {
    return (tasks: Task[]) => {
      const taskSearchedTrimmed = taskSearchedInput.trim();
      return tasks.filter((task) =>
        task.title.toLowerCase().includes(taskSearchedTrimmed.toLowerCase())
      );
    };
  };

  useEffect(() => {
    if (!taskSearchedInput || !taskSearchedInput.trim()) {
      removePiping("taskNameFiltering");
    } else {
      addPiping("taskNameFiltering", filterTaskName(taskSearchedInput));
    }
  }, [taskSearchedInput]);

  // Piping
  const removePiping = (pipingId: string) => {
    const updatePiping = taskPiping.find((piping) => piping.id === pipingId);
    if (updatePiping) {
      setTaskPiping((prev) => prev.filter((piping) => piping.id !== pipingId));
    }
  };

  const addPiping = (pipingId: string, pipingFn: (tasks: Task[]) => Task[]) => {
    setTaskPiping((prev) => {
      const updatePiping = prev.find((piping) => piping.id === pipingId);
      if (updatePiping) {
        return prev.map((piping) =>
          piping.id === pipingId ? { ...piping, taskPiping: pipingFn } : piping
        );
      } else {
        return [
          ...prev,
          {
            id: pipingId,
            taskPiping: pipingFn,
          },
        ];
      }
    });
  };

  const pipedTasks = useMemo(() => {
    return taskPiping.reduce(
      (acc, pipingItem) => pipingItem.taskPiping(acc),
      tasks
    );
  }, [taskPiping, tasks]);

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

  const handlePowerModeButtonClick = () => {
    const sortedTasks = pipedTasks;
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
    <CalendarContainer onScroll={(e: any) => handleOnScroll(e)}>
      {isPowerModeModalVisible && (
        <PowerModeBackground
          onClick={() => setIsPowerModeModalVisible(false)}
        />
      )}

      <HeaderTasksContainer>
        <HeaderLeftPart>
          <HeaderButton
            alt="powerMode"
            src="https://cdn-icons-png.flaticon.com/512/159/159607.png"
            onClick={() => handlePowerModeButtonClick()}
          />
          <SearchTaskInput
            value={taskSearchedInput}
            placeholder="Search a task"
            onChange={(e: any) => {
              tasks.length > 0 && setTaskSearchedInput(e.target.value);
            }}
          />
          <TaskUnfinishedText>
            {tasks.length > 0 &&
              tasks.filter((task) => !task.isDone).length > 0 &&
              `${tasks.filter((task) => !task.isDone).length} unfinished tasks`}
          </TaskUnfinishedText>
        </HeaderLeftPart>
        <HeaderRightPart>
          <CalendarViewSelector
            value={sortType}
            onChange={(e: any) => handleSortTypeChange(e.target.value)}
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
              value={sortValue}
              onChange={(e: any) => handleSortValueChange(e.target.value)}
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
            setLabelSelected={setLabelSelected}
          />
        </HeaderRightPart>
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
        {tasks.length < 1 && <Text>No tasks! 🍕</Text>}

        {pipedTasks.slice(0, renderedTasks).map((task: Task) => (
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
                onClick={() => removeTask(task.id)}
              />
            </DeleteButtonContainer>
          </div>
        ))}
      </MainContainer>
    </CalendarContainer>
  );
};

export default Tasks;
