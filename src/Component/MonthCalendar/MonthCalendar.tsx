import React, { useState, useEffect } from "react";
import daysLetterWeek from "../../utils/daysLetterWeek";
import { getMonthByIndex } from "../../utils/getMonth";
import { useCalendarContext } from "../../context/CalendarContext";
import getWeeksOfMonth, {
  getWeekIndexOfMonth,
} from "../../utils/getWeeksOfMonth";
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

type MonthBodyProps = {
  monthIndexProps: number;
};

const MonthBody: React.FC<MonthBodyProps> = ({ monthIndexProps }) => {
  // Context
  const { calendar, calendarDispatch, previousMonthAtDay, nextMonthAtDay } =
    useCalendarContext();

  // State
  const [monthIndex, setMonthIndex] = useState<number>(0);
  const [weeks, setWeeks] = useState<string[][]>([]);
  const [currentWeek, setCurrentWeek] = useState<number>(0);

  useEffect(() => {
    setMonthIndex(monthIndexProps);
    const today = new Date(calendar.year, monthIndexProps, calendar.day);
    setCurrentWeek(getWeekIndexOfMonth(weeks, today));
  }, [monthIndexProps]);

  useEffect(() => {
    const today = new Date(calendar.year, calendar.month, calendar.day);
    setCurrentWeek(getWeekIndexOfMonth(weeks, today));
  }, [calendar.day]);

  useEffect(() => {
    setWeeks(getWeeksOfMonth(calendar.year, calendar.month));
  }, [calendar.year]);

  const handleDayClick = (weekOfTheMonth: number, day: string) => {
    const dayCasted = Number(day);
    const previousMonthClicked = weekOfTheMonth < 3 && dayCasted > 20;
    const nextMonthClicked = weekOfTheMonth > 4 && dayCasted < 15;

    if (previousMonthClicked) {
      previousMonthAtDay(monthIndex, dayCasted);
    } else if (nextMonthClicked) {
      nextMonthAtDay(monthIndex, dayCasted);
    } else {
      calendarDispatch({
        type: "SET_DATE",
        year: calendar.year,
        month: monthIndex,
        day: dayCasted,
      });
    }
  };

  return (
    <>
      {weeks.map((week, indexWeek) => (
        <WeekContainer key={indexWeek}>
          {week.map((day, j) => (
            <DayContainer
              key={j}
              onClick={() => handleDayClick(indexWeek, day)}
              $isCurrentDay={
                calendar.day === Number(day) &&
                calendar.month === monthIndex &&
                currentWeek === indexWeek
              }
            >
              <h4>{day}</h4>
            </DayContainer>
          ))}
        </WeekContainer>
      ))}
    </>
  );
};

type MonthCalendarProps = {
  customCssProps: boolean;
};

const MonthCalendar: React.FC<MonthCalendarProps> = ({ customCssProps }) => {
  const [customCss, setCustomCss] = useState<boolean>(customCssProps);
  const { calendar, nextMonth, previousMonth } = useCalendarContext();
  const [monthName, setMonthName] = useState<string>("");

  useEffect(() => {
    setMonthName(getMonthByIndex(calendar.month));
  }, [calendar.month]);

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
            onClick={() => previousMonth()}
            src="https://cdn-icons-png.flaticon.com/512/271/271228.png"
          />
          <RightArrowButton
            onClick={() => nextMonth()}
            src="https://cdn-icons-png.flaticon.com/512/271/271228.png"
          />
        </ArrowsContainer>
      </MonthCalendarHeader>

      <DaysLetterContainer>
        {daysLetterWeek.map((dayLetter, i) => (
          <h4 key={i}> {dayLetter}</h4>
        ))}
      </DaysLetterContainer>

      <MonthBody monthIndexProps={calendar.month} />
    </MonthCalendarContainer>
  );
};

export { MonthCalendar, CalendarContainer, MonthBody };
