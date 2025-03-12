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
      return [
        ...state,
        {
          ...action.state,
          id: state.length,
          title: !action.state.title ? "No title" : action.state.title,
        },
      ];
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
