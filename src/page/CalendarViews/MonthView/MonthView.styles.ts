import styled from "styled-components";
import { CalendarContainer } from "../../../component/MonthCalendar/MonthCalendar";

export const YearContainer = styled.div<{ $yearMode: boolean }>`
  ${({ $yearMode }) =>
    $yearMode &&
    `
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
    `}
`;

export const MonthCalendarContainer = styled.div`
  background-color: #7a7264;
`;

export const WeekCalendarContainer = styled.div`
  border: 1px solid #7a7264;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
`;

export const DayCalendarContainer = styled.div`
  aspect-ratio: 1;
  background-color: #0f1110;
  &:hover {
    background-color: rgba(190, 182, 168, 0.17);
  }
`;

export { CalendarContainer };
