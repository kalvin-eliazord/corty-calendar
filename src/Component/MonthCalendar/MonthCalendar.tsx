import React, { useState, useEffect } from "react";
import daysLetterWeek from "../../utils/daysLetterWeek";
import { getMonthByIndex } from "../../utils/getMonth";
import { useCalendarContext } from "../../context/CalendarContext";
import getWeeksOfMonth from "../../utils/getWeeksOfMonth";
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
  const [monthIndex, setMonthIndex] = useState<number>(0);
  const [weeks, setWeeks] = useState<string[][]>([]);
  const { calendar, calendarDispatch } = useCalendarContext();

  useEffect(() => {
    setMonthIndex(monthIndexProps);
  }, [monthIndexProps]);

  useEffect(() => {
    setWeeks(getWeeksOfMonth(calendar.year, calendar.month));
  }, [calendar]);

  return (
    <>
      {weeks.map((week, indexWeek) => (
        <WeekContainer key={indexWeek}>
          {week.map((day, j) => (
            <DayContainer
              key={j}
              onClick={() => {
                calendarDispatch({ type: "SET_DAY", state: Number(day) });
              }}
              $isCurrentDay={
                calendar.day === Number(day) &&
                calendar.month === monthIndex &&
                indexWeek < 4
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
  const { calendar, calendarDispatch } = useCalendarContext();
  const [monthName, setMonthName] = useState<string>("");

  useEffect(() => {
    setMonthName(getMonthByIndex(calendar.month));
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

      <MonthBody monthIndexProps={calendar.month} />
    </MonthCalendarContainer>
  );
};

export { MonthCalendar, CalendarContainer, MonthBody };
