import {
  useReducer,
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { addDays, addWeeks, addMonths, addYears } from "date-fns";

export type Check = {
  id: string;
  name: string;
  isDone: boolean;
};

export type Label = {
  id: string;
  name: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  isAllDay: boolean;
  hour: number;
  complexity: number;
  priority: number;
  dueDate: Date;
  checks: Check[];
  labels: Label[];
  isDone: boolean;
};

const handleTaskRecurring = (task: Task, recurringValue: string): Task[] => {
  switch (recurringValue) {
    case "everyDay":
      return Array.from(
        { length: 36500 },
        (_, i): Task => ({
          ...task,
          id: crypto.randomUUID(),
          dueDate: addDays(new Date(task.dueDate), i),
        })
      );
    case "everyWeek":
      return Array.from(
        { length: 5200 },
        (_, i): Task => ({
          ...task,
          id: crypto.randomUUID(),
          dueDate: addWeeks(new Date(task.dueDate), i),
        })
      );
    case "everyMonth":
      return Array.from(
        { length: 1200 },
        (_, i): Task => ({
          ...task,
          id: crypto.randomUUID(),
          dueDate: addMonths(new Date(task.dueDate), i),
        })
      );
    case "everyYear":
      return Array.from(
        { length: 100 },
        (_, i): Task => ({
          ...task,
          id: crypto.randomUUID(),
          dueDate: addYears(new Date(task.dueDate), i),
        })
      );
    default:
      console.error(recurringValue, ": unknown task recurring type.");
      return [];
  }
};

const tasksReducer = (state: Task[], action: TasksAction): Task[] => {
  switch (action.type) {
    case "SET_TASKS":
      return action.state;
    case "ADD_TASK":
      return [...state, { ...action.state, id: crypto.randomUUID() }];
    case "ADD_TASKS_RECURRING":
      return [...state, ...handleTaskRecurring(action.task, action.recurring)];
    case "REMOVE_TASK":
      return state.filter((task: Task) => task.id !== action.state);
    default:
      return state;
  }
};

type TasksAction =
  | { type: "SET_TASKS"; state: Task[] }
  | { type: "ADD_TASK"; state: Task }
  | { type: "ADD_TASKS_RECURRING"; task: Task; recurring: string }
  | { type: "REMOVE_TASK"; state: string }
  | { type: "ASCENDING_COMPLEXITY_TASKS" }
  | { type: "DESCENDING_COMPLEXITY_TASKS" }
  | { type: "ASCENDING_PRIORITY_TASKS" }
  | { type: "DESCENDING_PRIORITY_TASKS" }
  | { type: "ASCENDING_DUE_DATE_TASKS" }
  | { type: "DESCENDING_DUE_DATE_TASKS" };

type TasksContextType = {
  tasks: Task[];
  tasksDispatch: React.Dispatch<TasksAction>;
  addTask(task: Task, recurringValue: string): void;
  removeTask(taskId: string): void;
  setTask(task: Task): void;
  toggleIsDoneTask(taskId: string): void;
  toggleIsDoneCheck(taskId: string, checkId: string): void;
  getTask(taskId: string): Task | undefined;
};

const TasksContext = createContext<TasksContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "calendarTasks";

const TasksProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, tasksDispatch] = useReducer(tasksReducer, [], () => {
    const savedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedTasks
      ? JSON.parse(savedTasks).map((task: Task) => ({
          ...task,
          dueDate: new Date(task.dueDate),
        }))
      : [];
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
    }, 1000);

    return () => clearTimeout(timeout);
  }, [tasks]);

  useEffect(() => {}, []);

  const setTask = (task: Task) => {
    tasksDispatch({
      type: "SET_TASKS",
      state: tasks.map((currentTask: Task) =>
        currentTask.id === task.id ? task : currentTask
      ),
    });
  };

  const toggleIsDoneTask = (taskId: string) => {
    tasksDispatch({
      type: "SET_TASKS",
      state: tasks.map((currentTask: Task) =>
        currentTask.id === taskId
          ? { ...currentTask, isDone: !currentTask.isDone }
          : currentTask
      ),
    });
  };

  const removeTask = (taskId: string) => {
    tasksDispatch({ type: "REMOVE_TASK", state: taskId });
  };

  const addTask = (task: Task, recurringValue: string) => {
    if (recurringValue === "oneTime")
      tasksDispatch({ type: "ADD_TASK", state: task });
    else
      tasksDispatch({
        type: "ADD_TASKS_RECURRING",
        task: task,
        recurring: recurringValue,
      });
  };

  const toggleIsDoneCheck = (taskId: string, checkId: string) => {
    tasksDispatch({
      type: "SET_TASKS",
      state: tasks.map((currentTask: Task) =>
        currentTask.id === taskId
          ? {
              ...currentTask,
              checks: currentTask.checks.map((check) =>
                check.id === checkId
                  ? { ...check, isDone: !check.isDone }
                  : check
              ),
            }
          : currentTask
      ),
    });
  };

  const getTask = (taskId: string): Task | undefined => {
    return tasks.find((task) => task.id === taskId);
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        tasksDispatch,
        addTask,
        removeTask,
        setTask,
        toggleIsDoneTask,
        toggleIsDoneCheck,
        getTask,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export const useTasksContext = () => {
  const context = useContext(TasksContext);
  if (!context)
    throw new Error("Tasks component must be wrapped within TasksProvider.");
  return context;
};

export { TasksProvider, TasksContext };
