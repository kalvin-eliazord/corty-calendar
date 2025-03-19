import { useState, useEffect } from "react";
import {
  eachWeekOfInterval,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  format,
} from "date-fns";
import styled from "styled-components";
import { getMonthByIndex } from "../utils/getMonth";
import { useCalendarContext } from "../context/CalendarContext";

const CalendarContainer = styled.div`
  width: 73%;
  height: 95%;
  border-radius: 20px;
  background-color: #0f1011;
  margin-left: 5%;
  position: absolute;
  left: 21%;
  top: 10%;
  overflow-y: auto;
`;

const MonthCalendarContainer = styled.div`
  position: fixed;
  top: 58%;
  left: 45%;
  transform: translate(-50%, -50%);
  background-color: #0f1110;

  z-index: 10;
  display: flex;
  border-radius: 10px;
  height: 200px;
  flex-direction: column;
`;
const MonthCalendarHeader = styled.div`
  border-radius: 10px;

  display: flex;
  background-color: #0f1110;
  font-size: 14px;
  padding-top: 5px;
  padding-left: 30px;
  justify-content: space-between;

  p {
    margin-right: 10px;
    font-weight: bold;
  }
`;

const ArrowsContainer = styled.div`
      padding-top: 15px;
  position: relative;
  right: 25px;
      &:hover {
      cursor: pointer;
`;

const LeftArrowButton = styled.img`
  width: 10px;
  height: 10px;
  filter: invert(1);
  transform: scaleX(-100%);
`;

const RightArrowButton = styled.img`
  width: 10px;
  height: 10px;
  filter: invert(1);
`;

const DaysLetterContainer = styled.div`
  background-color: #0f1110;
  height: 35px;

  display: flex;
  font-size: 10px;
  padding-inline: 30px;
`;

const WeekContainer = styled.div`
  display: flex;
  gap: 16px;
  padding-inline: 30px;

  &:hover {
    /background-color: lightgrey;
  }
`;

const DayContainer = styled.div`
  height: 35px;
  font-size: 10px;
  background-color: #0f1110;

  &:hover {
    cursor: pointer;
    /background-color: lightgrey;
  }
`;

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
    const weeks = eachDayOfInterval({ start: weekStart, end: weekEnd }).map(
      (date): string => format(date, "dd")
    );

    return weeks;
  });
};

const daysLetterWeek = ["M", "T", "W", "T", "F", "Sa", "Su"];

const MonthCalendar = () => {
  const { calendar, calendarDispatch } = useCalendarContext();
  const [monthName, setMonthName] = useState<string>("");
  const [weeks, setWeeks] = useState<string[][]>([] as string[][]);

  useEffect(() => {
    setMonthName(getMonthByIndex(calendar.month));
    setWeeks(getWeeksOfMonth(calendar.year, calendar.month));
  }, [calendar]);

  return (
    <MonthCalendarContainer className={"month-calendar-container"}>
      <MonthCalendarHeader className={"month-calendar-container"}>
        <p>
          {monthName} {calendar.year}
        </p>
        <ArrowsContainer>
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

      <DaysLetterContainer className="month-calendar-header">
        {daysLetterWeek.map((dayLetter, i) => (
          <h4 key={i}> {dayLetter}</h4>
        ))}
      </DaysLetterContainer>
      {weeks.map((week, i) => (
        <WeekContainer key={i} className="month-calendar-weeks">
          {week.map((day, j) => (
            <DayContainer
              key={j * Math.random()}
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

export { CalendarContainer, MonthCalendar };
