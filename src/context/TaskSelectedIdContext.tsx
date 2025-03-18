import { useState, createContext, useContext, ReactNode } from "react";

type TaskSelectedIdType = {
  taskSelectedId: string;
  setTaskSelectedId(taskSelectedId: string): void;
};

const TaskSelectedIdContext = createContext<TaskSelectedIdType | undefined>(
  undefined
);

const TaskSelectedIdProvider = ({ children }: { children: ReactNode }) => {
  const [taskSelectedId, setTaskSelectedId] = useState<string>("");

  return (
    <TaskSelectedIdContext.Provider
      value={{ taskSelectedId, setTaskSelectedId }}
    >
      {children}
    </TaskSelectedIdContext.Provider>
  );
};

export const useTaskSelectedIdContext = () => {
  const context = useContext(TaskSelectedIdContext);
  if (!context)
    throw new Error(
      "TaskSelectedIdContext must be used within TaskSelectedIdProvider"
    );

  return context;
};

export default TaskSelectedIdProvider;
