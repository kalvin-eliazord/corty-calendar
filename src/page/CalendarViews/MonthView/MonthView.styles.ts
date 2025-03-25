import styled from "styled-components";
import { CalendarContainer } from "../../../component/MonthCalendar/MonthCalendar";

export const DaysLetterContainer = styled.div`
  position: sticky;
  top: 0;
  display: flex;
  z-index: 70;
  padding-left: 85px;
  justify-content: space-between;
  font-weight: bold;
  padding-inline: 155px;
  font-size: 20px;
  background-color: rgb(116, 116, 116);
`;

export const DayTasksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-inline: 10px;
  max-width: 300px;
  @media (max-width: 2000px) {
    max-height: 100px;
  }
  overflow-x: hidden;
  overflow-y: auto;
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
  background-color: #37393b;
  border-right: 1px solid #37393b;
`;

export const WeekCalendarContainer = styled.div`
  border: 1px solid #37393b;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  overflow-x: hidden;
  overflow-y: hidden;
`;

export const DayCalendarContainer = styled.div`
  text-align: center;
  aspect-ratio: 1;

  @media (max-width: 2000px) {
    width: 170px;
    height: 170px;
    max-width: 170px;
    max-height: 170px;
  }

  background-color: #0f1110;
  &:hover {
    background-color: rgba(116, 116, 116, 0.08);
  }
`;

export { CalendarContainer };
