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
  yearMonthIndexProps: number | null;
  monthIndexProps: number;
};

const MonthBody: React.FC<MonthBodyProps> = ({
  yearMonthIndexProps,
  monthIndexProps,
}) => {
  // Context
  const { calendar, calendarDispatch, previousMonthAtDay, nextMonthAtDay } =
    useCalendarContext();

  // State
  const [weeks, setWeeks] = useState<string[][]>([]);
  const [currentWeek, setCurrentWeek] = useState<number>(0);

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
      previousMonthAtDay(monthIndexProps, dayCasted);
    } else if (nextMonthClicked) {
      nextMonthAtDay(monthIndexProps, dayCasted);
    } else {
      calendarDispatch({
        type: "SET_DATE",
        year: yearMonthIndexProps || calendar.year,
        month: monthIndexProps,
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
                calendar.month === monthIndexProps &&
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
  const [privateMonth, setPrivateMonth] = useState<number>(calendar.month);
  const [privateYear, setPrivateYear] = useState<number>(calendar.year);

  useEffect(() => {
    setPrivateMonth(calendar.month);
    setPrivateYear(calendar.year);
  }, [calendar]);

  const getPrivateCurrentDate = (): Date =>
    new Date(privateYear, privateMonth, calendar.day);

  const previousMonth = () => {
    const currentDate = getPrivateCurrentDate();

    const newDate = subMonths(currentDate, 1);
    setPrivateYear(newDate.getFullYear());
    setPrivateMonth(
      newDate.getMonth() === -1
        ? 0
        : newDate.getMonth() === 0
        ? 12
        : newDate.getMonth()
    );
  };

  const nextMonth = () => {
    const currentDate = getPrivateCurrentDate();

    const newDate = addMonths(currentDate, 1);
    setPrivateYear(newDate.getFullYear());
    setPrivateMonth(newDate.getMonth() === 0 ? 1 : newDate.getMonth());
  };

  return (
    <MonthCalendarContainer $customCss={customCssProps}>
      <MonthCalendarHeader>
        <p>
          {getMonthByIndex(privateMonth)} {privateYear}
        </p>
        <ArrowsContainer $customCss={customCssProps}>
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

      <MonthBody
        yearMonthIndexProps={privateYear}
        monthIndexProps={privateMonth}
      />
    </MonthCalendarContainer>
  );
};

export { MonthCalendar, CalendarContainer, MonthBody };
