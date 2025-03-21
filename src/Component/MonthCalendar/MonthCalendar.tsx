import React, { useState, useEffect } from "react";
import {
  eachWeekOfInterval,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  format,
} from "date-fns";
import daysLetterWeek from "../../utils/daysLetterWeek";
import { getMonthByIndex } from "../../utils/getMonth";
import { useCalendarContext } from "../../context/CalendarContext";
import {
  MonthCalendarContainer,
  MonthCalendarHeader,
  ArrowsContainer,
  LeftArrowButton,
  RightArrowButton,
  DaysLetterContainer,
  WeekContainer,
  DayContainer,
  CalendarContainer,
} from "./MonthCalendar.styles";

interface MonthCalendarProps {
  customCssProps: boolean;
}

const getWeeksOfMonth = (year: number, month: number): string[][] => {
  const monthStart = startOfMonth(new Date(year, month - 1, 1));
  const monthEnd = endOfMonth(new Date(year, month - 1, 1));
  // Get start dates of each week in the month
  const weeks = eachWeekOfInterval(
    { start: monthStart, end: monthEnd },
    { weekStartsOn: 1 } // Monday start
  );
  // Get all days for each week
  return weeks.map((weekStart): string[] => {
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: weekStart, end: weekEnd }).map((date) =>
      format(date, "dd")
    );
  });
};

const MonthCalendar: React.FC<MonthCalendarProps> = ({ customCssProps }) => {
  const [customCss, setCustomCss] = useState<boolean>(customCssProps);
  const { calendar, calendarDispatch } = useCalendarContext();
  const [monthName, setMonthName] = useState<string>("");
  const [weeks, setWeeks] = useState<string[][]>([]);

  useEffect(() => {
    setMonthName(getMonthByIndex(calendar.month));
    setWeeks(getWeeksOfMonth(calendar.year, calendar.month));
  }, [calendar]);

  useEffect(() => {
    setCustomCss(customCssProps);
  }, [customCssProps]);

  return (
    <MonthCalendarContainer $customCss={customCss}>
      <MonthCalendarHeader>
        <p>
          {monthName} {calendar.year}
        </p>
        <ArrowsContainer $customCss={customCss}>
          <LeftArrowButton
            onClick={() => calendarDispatch({ type: "PREVIOUS_MONTH" })}
            src="https://cdn-icons-png.flaticon.com/512/271/271228.png"
          />
          <RightArrowButton
            onClick={() => calendarDispatch({ type: "NEXT_MONTH" })}
            src="https://cdn-icons-png.flaticon.com/512/271/271228.png"
          />
        </ArrowsContainer>
      </MonthCalendarHeader>

      <DaysLetterContainer>
        {daysLetterWeek.map((dayLetter, i) => (
          <h4 key={i}> {dayLetter}</h4>
        ))}
      </DaysLetterContainer>
      {weeks.map((week, i) => (
        <WeekContainer key={i}>
          {week.map((day, j) => (
            <DayContainer
              key={j}
              onClick={() => {
                calendarDispatch({ type: "SET_DAY", state: Number(day) });
              }}
            >
              <h4>{day}</h4>
            </DayContainer>
          ))}
        </WeekContainer>
      ))}
    </MonthCalendarContainer>
  );
};

export { MonthCalendar, CalendarContainer };
