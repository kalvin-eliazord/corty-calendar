import { useState, useEffect } from "react";
import { CalendarContainer } from "../../../component/MonthCalendar/MonthCalendar";
import daysLetterWeek from "../../../utils/daysLetterWeek";
import {
  YearContainer,
  MonthCalendarContainer,
  WeekCalendarContainer,
  DayCalendarContainer,
} from "./MonthView.styles";

type MonthViewProps = {
  monthRangeProps: number;
};

const numberOfWeeks = Array.from({ length: 5 }, (_, i) => i);

const MonthView: React.FC<MonthViewProps> = ({ monthRangeProps }) => {
  const [monthRange, setMonthRange] = useState<number[]>([]);

  useEffect(() => {
    setMonthRange(Array.from({ length: monthRangeProps }, (_, i) => i));
  }, [monthRangeProps]);

  return (
    <CalendarContainer>
      <YearContainer $yearMode={monthRange.length === 12}>
        {monthRange.map((month) => (
          <MonthCalendarContainer key={month}>
            {numberOfWeeks.map((week) => (
              <WeekCalendarContainer key={week}>
                {daysLetterWeek.map((day, i) => (
                  <DayCalendarContainer key={day + 10}>
                    {week === 0 && day}
                  </DayCalendarContainer>
                ))}
              </WeekCalendarContainer>
            ))}
          </MonthCalendarContainer>
        ))}
      </YearContainer>
    </CalendarContainer>
  );
};

export default MonthView;
