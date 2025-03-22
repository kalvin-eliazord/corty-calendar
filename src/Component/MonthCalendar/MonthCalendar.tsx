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
import { addMonths, subMonths } from "date-fns";

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
  }, [monthIndexProps]);

  useEffect(() => {
    const today = new Date(calendar.year, calendar.month, calendar.day);
    setCurrentWeek(getWeekIndexOfMonth(weeks, today));
  }, [weeks, calendar]);

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
  // Context
  const { calendar } = useCalendarContext();

  // State
  const [customCss, setCustomCss] = useState<boolean>(customCssProps);
  const [privateMonth, setPrivateMonth] = useState<number>(calendar.month);
  const [privateYear, setPrivateYear] = useState<number>(calendar.year);
  const [monthName, setMonthName] = useState<string>("");

  useEffect(() => {
    setPrivateMonth(calendar.month);
    setPrivateYear(calendar.year);
  }, [calendar]);

  useEffect(() => {
    setMonthName(getMonthByIndex(privateMonth));
  }, [privateMonth]);

  useEffect(() => {
    setCustomCss(customCssProps);
  }, [customCssProps]);

  const getPrivateCurrentDate = (): Date => {
    return new Date(privateYear, privateMonth, calendar.day);
  };

  const previousMonth = () => {
    const currentDate = getPrivateCurrentDate();

    const newDate = subMonths(currentDate, 1);
    setPrivateYear(newDate.getFullYear());
    setPrivateMonth(newDate.getMonth());
  };

  const nextMonth = () => {
    const currentDate = getPrivateCurrentDate();

    const newDate = addMonths(currentDate, 1);
    setPrivateYear(newDate.getFullYear());
    setPrivateMonth(newDate.getMonth());
  };

  return (
    <MonthCalendarContainer $customCss={customCss}>
      <MonthCalendarHeader>
        <p>
          {monthName} {privateYear}
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

      <MonthBody monthIndexProps={privateMonth} />
    </MonthCalendarContainer>
  );
};

export { MonthCalendar, CalendarContainer, MonthBody };
