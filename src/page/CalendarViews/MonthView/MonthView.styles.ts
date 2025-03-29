import styled from "styled-components";

export const DaysLetterContainer = styled.div`
  position: sticky;
  top: 0;
  display: flex;
  gap: 14.2%;

  z-index: 10;
  padding-left: 6.5%;
  @media (min-width: 2100px) {
    padding-left: 6.8%;
    gap: 14.8%;
  }
  font-weight: bold;
  font-size: 20px;
  background-color: rgb(116, 116, 116);
`;

export const DayTasksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
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
  border: 1px solid #37393b;
  display: flex;
  flex-direction: column;
`;

export const WeekCalendarContainer = styled.div`
  display: flex;
  overflow-x: hidden;
  overflow-y: hidden;
`;

export const DayCalendarContainer = styled.div`
  text-align: center;
  width: 30%;
  height: 20vh;
  max-height: 20vh;
  border: 1px solid #37393b;

  @media (min-width: 2100px) {
    padding-inline: 2%;
  }

  background-color: #0f1110;
  &:hover {
    background-color: rgba(116, 116, 116, 0.08);
  }
`;

export const MonthTaskContainer = styled.div<{ $isDone: boolean }>`
  background-color: ${({ $isDone }) => ($isDone ? "#425682" : "#1a3b86")};
  border-radius: 15px;
  height: 100%;
  z-index: 1;
  padding-inline: 5%;
  color: white;
  font-weight: bold;
  text-wrap: nowrap;
  text-decoration: ${({ $isDone }) => $isDone && "line-through"};
  animation: slideIn 1s linear;
  @keyframes slideIn {
    from {
      transform: translateX(-40%);
    }
    to {
      transform: translateX(0);
    }
  }
  &:hover {
    cursor: pointer;
  }
`;
