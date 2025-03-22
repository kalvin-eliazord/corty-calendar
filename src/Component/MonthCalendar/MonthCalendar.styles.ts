import styled from "styled-components";

export const CalendarContainer = styled.div`
  color: white;
  width: 78%;
  max-height: 85%;
  border-radius: 20px;
  background-color: #0f1011;
  margin-left: 5%;
  position: absolute;
  left: 16%;
  top: 12%;
  overflow-y: auto;
  overflow-x: hidden;

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

export const MonthCalendarContainer = styled.div<{ $customCss: boolean }>`
  position: ${({ $customCss }) => ($customCss ? "static" : "fixed")};
  padding: 10px;
  top: ${({ $customCss }) => ($customCss ? 240 : -50)}px;
  left: ${({ $customCss }) => ($customCss ? 30 : 100)}px;
  transform: translate(
    ${({ $customCss }) => ($customCss ? `0%, 0%` : `-10%, 50%`)}
  );
  background-color: #0f1110;
  z-index: 10;
  display: flex;
  border-radius: 10px;
  flex-direction: column;
  width: 260px;

  @media (max-width: 768px) {
    position: static;
    width: 90%;
    margin: 0 auto;
    top: 0;
    left: 0;
    transform: none;
  }
`;

export const MonthCalendarHeader = styled.div`
  border-radius: 10px;
  display: flex;
  background-color: #0f1110;
  font-size: 18px;
  padding-left: 30px;
  justify-content: space-between;
  padding-inline: 15px;
  padding-bottom: 0;
  height: 40px;
  p {
    position: relative;
    bottom: 5px;
    right: 5px;
    font-weight: bold;
  }

  @media (max-width: 768px) {
    font-size: 12px;
    padding-left: 15px;
    height: 30px;
  }
`;

export const ArrowsContainer = styled.div<{ $customCss: boolean }>`
  padding-top: 15px;
  display: flex;
  gap: ${({ $customCss }) => ($customCss ? "40px" : "20px")};

  img {
    width: 18px;
    height: 18px;
    filter: invert(1);
    border-radius: 50%;
    @media (max-width: 768px) {
      width: 8px;
      height: 8px;
    }

    &:hover {
      background-color: rgba(103, 104, 104, 0.45);
    }
  }
  &:hover {
    cursor: pointer;
  }

  @media (max-width: 768px) {
    gap: 15px;
    padding-top: 10px;
  }
`;

export const LeftArrowButton = styled.img`
  transform: scaleX(-100%);
`;

export const RightArrowButton = styled.img``;

export const DaysLetterContainer = styled.div`
  background-color: #0f1110;
  height: 35px;
  display: flex;
  font-size: 12px;
  padding-left: 12px;
  gap: 26.9px;
  /padding-inline: 12px;
  /justify-content: space-between;

  @media (max-width: 768px) {
    height: 30px;
    font-size: 9px;
    padding-inline: 10px;
  }
`;

export const WeekContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  background-color: #0f1110;

  @media (max-width: 768px) {
    justify-content: space-around;
  }
`;

export const DayContainer = styled.div<{ $isCurrentDay: boolean }>`
  text-align: center;
  width: 35px;
  height: 35px;
  font-size: 10px;
  margin-bottom: 10px;
  border-radius: 50%;
  color: ${({ $isCurrentDay }) => $isCurrentDay && `#C2E6FE`};
  background-color: ${({ $isCurrentDay }) =>
    $isCurrentDay ? `#004B76` : `#0f1110`};

  &:hover {
    cursor: pointer;
    background-color: rgba(103, 104, 104, 0.45);
  }

  @media (max-width: 768px) {
    width: 30px;
    height: 30px;
    font-size: 9px;
    margin-bottom: 8px;
  }
`;
