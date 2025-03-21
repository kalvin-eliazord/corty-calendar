import { useState, createContext, useContext, ReactNode } from "react";

type DateSelectedType = {
  dateSelected: Date;
  setDateSelected(dateSelected: Date): void;
};

const DateSelectedContext = createContext<DateSelectedType | undefined>(
  undefined
);

const DateSelectedProvider = ({ children }: { children: ReactNode }) => {
  const [dateSelected, setDateSelected] = useState<Date>(new Date());

  return (
    <DateSelectedContext.Provider
      value={{ dateSelected, setDateSelected }}
    >
      {children}
    </DateSelectedContext.Provider>
  );
};

export const useDateSelectedContext = () => {
  const context = useContext(DateSelectedContext);
  if (!context)
    throw new Error(
      "useDateSelectedContext must be used within DateSelectedProvider"
    );

  return context;
};

export default DateSelectedProvider;
