import { useReducer, createContext, ReactNode } from "react";
import { Task } from "./TaskHandler";

type TasksAction =
  | { type: "SET_TASKS"; state: Task[] }
  | { type: "ADD_TASK"; state: Task }
  | { type: "REMOVE_TASK"; state: number }
  | { type: "ASCENDING_COMPLEXITY_TASKS" }
  | { type: "DESCENDING_COMPLEXITY_TASKS" }
  | { type: "ASCENDING_PRIORITY_TASKS" }
  | { type: "DESCENDING_PRIORITY_TASKS" }
  | { type: "ASCENDING_DUE_DATE_TASKS" }
  | { type: "DESCENDING_DUE_DATE_TASKS" };

const tasksReducer = (state: Task[], action: TasksAction): Task[] => {
  switch (action.type) {
    case "SET_TASKS":
      return action.state;
    case "ADD_TASK":
      return [...state, action.state];
    case "REMOVE_TASK":
      return state.filter((task: Task) => task.id !== action.state);
      case "ASCENDING_COMPLEXITY_TASKS":
      return [...state].sort((a: Task, b: Task) => a.complexity - b.complexity);
    case "DESCENDING_COMPLEXITY_TASKS":
      return [...state].sort((a: Task, b: Task) => b.complexity - a.complexity);
    case "ASCENDING_PRIORITY_TASKS":
      return [...state].sort((a: Task, b: Task) => a.priority - b.priority);
    case "DESCENDING_PRIORITY_TASKS":
      return [...state].sort((a: Task, b: Task) => b.priority - a.priority);
    case "ASCENDING_DUE_DATE_TASKS":
      return [...state].sort((a: Task, b: Task) => {
        const dateA = new Date(a.dueDate);
        const dateB = new Date(b.dueDate);
        return dateA.getTime() - dateB.getTime();
      });
    case "DESCENDING_DUE_DATE_TASKS":
      return [...state].sort((a: Task, b: Task) => {
        const dateA = new Date(a.dueDate);
        const dateB = new Date(b.dueDate);
        return dateB.getTime() - dateA.getTime();
      });
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
