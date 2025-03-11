import { useReducer } from "react";
import {
  CalendarType,
  CalendarAction,
  calendarReducer,
} from "../utils/calendarTypes";

const useGetTodayCalendar = (): [
  CalendarType,
  React.Dispatch<CalendarAction>
] => {
  const today = new Date();

  return useReducer(calendarReducer, {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
  });
};

export { useGetTodayCalendar };
