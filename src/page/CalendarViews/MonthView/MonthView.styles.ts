import styled from "styled-components";
import { CalendarContainer } from "../../../component/MonthCalendar/MonthCalendar";

export const DaysLetterContainer = styled.div`
  position: sticky;
  top: 0;
  background-color: #7a7264;
  display: flex;
  padding-left: 75px;
  gap: 153px;
  font-weight: bold;
  font-size: 20px;
`;

export const DayTasksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-x: hidden;
  overflow-y: auto;
  padding-right: 10px;

  &::-webkit-scrollbar {
    width: 15px;
    height: 12px;
  }

  &::-webkit-scrollbar-track {
    background: #1e1e1e;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #3a3a3a;
    border-radius: 10px;
    border: 3px solid #1e1e1e;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  &::-webkit-scrollbar-thumb:active {
    background: #777;
  }

  &::-webkit-scrollbar-button {
    display: none;
  }

  &::-webkit-scrollbar-corner {
    background: #1e1e1e;
  }

  @media (max-width: 768px) {
    width: 90%;
    left: 5%;
    top: 10%;
    max-height: 90%;
  }
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
  text-align: center;
  aspect-ratio: 1;
  background-color: #0f1110;
  &:hover {
    background-color: rgba(114, 114, 114, 0.04);
  }
`;

export { CalendarContainer };
