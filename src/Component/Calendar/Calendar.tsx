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
import { getMonthByIndex } from "../../utils/getMonth";
import { CalendarType, CalendarAction } from "../../utils/calendarTypes";

const CalendarContainer = styled.div`
  width: 70%;
  height: 90%;

  border-radius: 20px;
  background-color: #0f1011;
  margin-left: 5%;
  position: absolute;
  left: 22%;
  top: 9%;
  overflow-y: auto;

  &::-webkit-scrollbar {
  }
  overflow-x: hidden;
`;

const MonthCalendarContainer = styled.div`
  border: solid 1px black;
  display: flex;
  flex-direction: column;
`;
const MonthCalendarHeader = styled.div`
  p {
    color: black;
    font-weight: bold;
  }
  img {
    padding-top: 1.5vh;
    &:hover {
      cursor: pointer;
    }
  }
`;
const DaysLetterContainer = styled.div`
  display: flex;
  gap: 15px;
`;

const WeekContainer = styled.div``;
const DayContainer = styled.div`
  font-size: 12px;
  &:hover {
    cursor: pointer;
  }
`;

const LeftArrowButton = styled.img`
  width: 20px;
  height: 20px;
  border: 1px solid red;
  transform: scaleX(-100%);
`;

const RightArrowButton = styled.img`
  width: 20px;
  height: 20px;
  border: 1px solid red;
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

type MonthCalendarProps = {
  calendar: CalendarType;
  calendarDispatch: React.Dispatch<CalendarAction>;
};

const MonthCalendar: React.FC<MonthCalendarProps> = ({
  calendar,
  calendarDispatch,
}) => {
  const [monthName, setMonthName] = useState<string>("");
  const [weeks, setWeeks] = useState<string[][]>([] as string[][]);

  useEffect(() => {
    setMonthName(getMonthByIndex(calendar.month));
    setWeeks(getWeeksOfMonth(calendar.year, calendar.month));
  }, [calendar]);

  return (
    <MonthCalendarContainer>
      <MonthCalendarHeader>
        <p> {monthName}</p>
        <p>{calendar.year}</p>
        <LeftArrowButton
          onClick={() => calendarDispatch({ type: "PREVIOUS_MONTH" })}
          src="https://cdn-icons-png.flaticon.com/512/271/271228.png"
        />
        <RightArrowButton
          onClick={() => calendarDispatch({ type: "NEXT_MONTH" })}
          src="https://cdn-icons-png.flaticon.com/512/271/271228.png"
        />
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
              key={j + Math.random()}
              onClick={() =>
                calendarDispatch({ type: "SET_DAY", state: Number(day) })
              }
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
