import { useState, ReactNode, createContext, useContext } from "react";

type AreModalsVisibleContextType = {
  isAddTaskModalVisible: boolean;
  setIsAddTaskModalVisible(isAddTaskModalVisible: boolean): void;
  isViewTaskModalVisible: boolean;
  setIsViewTaskModalVisible(isAddTaskModalVisible: boolean): void;
};

const AreModalsVisibleContext = createContext<
  AreModalsVisibleContextType | undefined
>(undefined);

const AreModalsVisibleProvider = ({ children }: { children: ReactNode }) => {
  const [isAddTaskModalVisible, setIsAddTaskModalVisible] =
    useState<boolean>(false);

  const [isViewTaskModalVisible, setIsViewTaskModalVisible] =
    useState<boolean>(false);

  return (
    <AreModalsVisibleContext.Provider
      value={{
        isAddTaskModalVisible,
        setIsAddTaskModalVisible,
        isViewTaskModalVisible,
        setIsViewTaskModalVisible,
      }}
    >
      {children}
    </AreModalsVisibleContext.Provider>
  );
};

export const useAreModalsVisibleContext = () => {
  const context = useContext(AreModalsVisibleContext);
  if (!context)
    throw new Error(
      "AreModalsVisibleContext must be used within AreModalsVisibleProvider"
    );

  return context;
};

export default AreModalsVisibleProvider;
