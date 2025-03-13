import { useReducer, createContext, ReactNode } from "react";
import { addDays, addWeeks, addMonths, addYears } from "date-fns";
import { Task } from "./TaskHandler";

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
      console.error("Unknown task recurring type.");
      return [];
  }
};

const tasksReducer = (state: Task[], action: TasksAction): Task[] => {
  switch (action.type) {
    case "SET_TASKS":
      return action.state;
    case "ADD_TASK":
      return [...state, action.state];
    case "ADD_TASKS_RECURRING":
      return [...state, ...handleTaskRecurring(action.task, action.recurring)];
    case "REMOVE_TASK":
      return state.filter((task: Task) => task.id !== action.state);
    default:
      return state;
  }
};

type TasksContextType = {
  tasks: Task[];
  tasksDispatch: React.Dispatch<TasksAction>;
};

const TasksContext = createContext<TasksContextType | undefined>(undefined);

const TasksProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, tasksDispatch] = useReducer(tasksReducer, [] as Task[]);

  return (
    <TasksContext.Provider value={{ tasks, tasksDispatch }}>
      {children}
    </TasksContext.Provider>
  );
};

export { TasksProvider, TasksContext };
