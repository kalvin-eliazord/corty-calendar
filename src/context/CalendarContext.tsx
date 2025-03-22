import { createContext, useContext, ReactNode, useReducer } from "react";
import {
  addDays,
  subDays,
  addMonths,
  subMonths,
  subWeeks,
  addWeeks,
} from "date-fns";

type CalendarType = {
  year: number;
  month: number;
  day: number;
  hour: number;
};

type CalendarAction =
  | { type: "SET_DATE"; year: number; month: number; day: number }
  | { type: "NEXT_YEAR" }
  | { type: "PREVIOUS_YEAR" }
  | { type: "SET_HOUR"; state: number };

export const calendarReducer = (
  state: CalendarType,
  action: CalendarAction
): CalendarType => {
  switch (action.type) {
    case "SET_DATE":
      return {
        ...state,
        year: action.year,
        month: action.month,
        day: action.day,
      };
    case "NEXT_YEAR":
      return { ...state, year: state.year + 1 };
    case "PREVIOUS_YEAR":
      return { ...state, year: state.year - 1 };
    case "SET_HOUR":
      return { ...state, hour: action.state };
    default:
      return state;
  }
};

type CalendarContextType = {
  calendar: CalendarType;
  calendarDispatch: React.Dispatch<CalendarAction>;
  nextDay: () => void;
  previousDay: () => void;
  nextMonth: () => void;
  previousMonth: () => void;
  nextWeek: () => void;
  previousWeek: () => void;
  previousMonthAtDay: (month: number, day: number) => void;
  nextMonthAtDay: (month: number, day: number) => void;
};

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
);

const CalendarProvider = ({ children }: { children: ReactNode }) => {
  const today = new Date();
  const [calendar, calendarDispatch] = useReducer(calendarReducer, {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
    hour: today.getHours(),
  });

  const getCurrentDate = () => {
    return new Date(calendar.year, calendar.month - 1, calendar.day);
  };

  const nextDay = () => {
    const currentDate = getCurrentDate();

    const newDate = addDays(currentDate, 1);
    calendarDispatch({
      type: "SET_DATE",
      year: newDate.getFullYear(),
      month: newDate.getMonth() + 1,
      day: newDate.getDate(),
    });
  };

  const previousDay = () => {
    const currentDate = getCurrentDate();

    const newDate = subDays(currentDate, 1);
    calendarDispatch({
      type: "SET_DATE",
      year: newDate.getFullYear(),
      month: newDate.getMonth() + 1,
      day: newDate.getDate(),
    });
  };

  const previousMonthAtDay = (month: number, day: number) => {
    const currentDate = new Date(calendar.year, month - 1, day);

    const newDate = subMonths(currentDate, 1);
    calendarDispatch({
      type: "SET_DATE",
      year: newDate.getFullYear(),
      month: newDate.getMonth() + 1,
      day: newDate.getDate(),
    });
  };

  const nextMonthAtDay = (month: number, day: number) => {
    const currentDate = new Date(calendar.year, month - 1, day);

    const newDate = addMonths(currentDate, 1);
    calendarDispatch({
      type: "SET_DATE",
      year: newDate.getFullYear(),
      month: newDate.getMonth() + 1,
      day: newDate.getDate(),
    });
  };

  const previousMonth = () => {
    const currentDate = getCurrentDate();

    const newDate = subMonths(currentDate, 1);
    calendarDispatch({
      type: "SET_DATE",
      year: newDate.getFullYear(),
      month: newDate.getMonth() + 1,
      day: newDate.getDate(),
    });
  };

  const nextMonth = () => {
    const currentDate = getCurrentDate();

    const newDate = addMonths(currentDate, 1);
    calendarDispatch({
      type: "SET_DATE",
      year: newDate.getFullYear(),
      month: newDate.getMonth() + 1,
      day: newDate.getDate(),
    });
  };

  const previousWeek = () => {
    const currentDate = getCurrentDate();

    const newDate = subWeeks(currentDate, 1);
    calendarDispatch({
      type: "SET_DATE",
      year: newDate.getFullYear(),
      month: newDate.getMonth() + 1,
      day: newDate.getDate(),
    });
  };

  const nextWeek = () => {
    const currentDate = getCurrentDate();

    const newDate = addWeeks(currentDate, 1);
    calendarDispatch({
      type: "SET_DATE",
      year: newDate.getFullYear(),
      month: newDate.getMonth() + 1,
      day: newDate.getDate(),
    });
  };

  return (
    <CalendarContext.Provider
      value={{
        calendar,
        calendarDispatch,
        nextDay,
        previousDay,
        nextMonth,
        previousMonth,
        nextWeek,
        previousWeek,
        previousMonthAtDay,
        nextMonthAtDay,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendarContext = () => {
  const context = useContext(CalendarContext);
  if (!context)
    throw new Error("CalendarContext must be used within CalendarProvider");

  return context;
};

export default CalendarProvider;
