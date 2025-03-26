import styled from "styled-components";

export const DayViewContainer = styled.div<{ $isWeekView: boolean }>`
  border-inline: solid #7a7264 1px;
  margin-top: 2%;
  width: 100%;
  ${({ $isWeekView }) => $isWeekView && `max-width: 300px;`}
`;

export const DayViewNameContainer = styled.div`
  z-index: 2;
  position: sticky;
  padding-top: 2px;
  background-color: #0f1110;
  top: 0;
  border-bottom: solid #7a7264 1px;
  @media (min-width: 2000px) {
    gap: 120px;
  }
  p {
    margin-left: 2%;
    color: #246694;
    font-weight: bold;
    font-size: 13px;
  }

  span {
    font-size: 28px;
    position: relative;
  }
`;

export const AllDayTasksContainer = styled.div`
  width: 100%;
  display: flex;
  overflow-x: auto;
  padding-left: 10px;
  overflow-y: hidden;
  height: 20px;
  max-height: 20px;
`;

export const AllDayTask = styled.div`
  background-color: #1a3b86;
  margin-right: 20px;
  z-index: 1;
  color: white;
  font-weight: bold;
  border-radius: 15px;
  padding-inline: 5%;

  &:hover {
    cursor: pointer;
  }
`;

export const HoursTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  margin-top: 80px;
  padding-bottom: 10px;
  margin-right: 10px;
`;

export const HoursTitle = styled.div`
  text-align: right;
  color: white;
  font-size: 14px;
  text-wrap: nowrap;
  margin-bottom: 1.5px;
`;

export const HourRangeContainer = styled.div<{ $isWeekView: boolean }>`
  display: flex;
  border-bottom: solid #7a7264 1px;
  @media (max-width: 2000px) {
    ${({ $isWeekView }) => $isWeekView && `max-width: 130px;`}
  }
  max-height: 0px;
  padding: 28px;
  padding-bottom: 40px;
  overflow-y: hidden;
  overflow-x: auto;

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

  &:hover {
    background-color: rgba(190, 182, 168, 0.17);
  }
`;

export const TaskPlaceholderContainer = styled.div`
  width: 50%;
  height: 100%;
  position: relative;
  right: 3rem;
  margin-left: 40px;
  padding-inline: 5%;
  animation: fadeIn 1s linear forwards;
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const TaskContainer = styled.div<{ $isDone: boolean }>`
  background-color: ${({ $isDone }) => ($isDone ? "#425682" : "#1a3b86")};
  margin-right: 40px;
  border-radius: 15px;
  width: 100%;
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

export const Calendar = styled.div`
  display: flex;
  justify-content: center;
`;
