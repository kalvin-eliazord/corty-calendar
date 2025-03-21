import styled from "styled-components";

export const CalendarContainer = styled.div`
  color: white;
  width: 73%;
  height: 90%;
  border-radius: 20px;
  background-color: #0f1011;
  margin-left: 5%;
  position: absolute;
  left: 18%;
  top: 12%;
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
`;

export const MonthCalendarContainer = styled.div<{
  $customCss: boolean;
}>`
  position: ${({ $customCss }) => ($customCss ? "none" : "fixed")};
  padding: 10px;
  top: ${({ $customCss }) => ($customCss ? 240 : -20)}px;
  left: ${({ $customCss }) => ($customCss ? 30 : 100)}px;
  transform: translate(
    ${({ $customCss }) => ($customCss ? `${0}%, ${0}% ` : `${-10}%, ${50}% `)}
  );
  background-color: #0f1110;
  z-index: 10;
  display: flex;
  border-radius: 10px;
  flex-direction: column;
  height: 300px;
  width: 260px;
`;

export const MonthCalendarHeader = styled.div`
  border-radius: 10px;
  display: flex;
  background-color: #0f1110;
  font-size: 14px;
  padding-left: 30px;
  justify-content: space-between;

  height: 35px;
  p {
    margin-right: 10px;
    font-weight: bold;
  }
`;

export const ArrowsContainer = styled.div<{ $customCss: boolean }>`
  padding-top: 15px;
  margin-right: 30px;
  display:flex;
  gap: ${({ $customCss }) => ($customCss ? "40px" : "20px")};
  &:hover {
    cursor: pointer;
  }
`;

export const LeftArrowButton = styled.img`
  width: 10px;
  height: 10px;
  filter: invert(1);
  transform: scaleX(-100%);
`;

export const RightArrowButton = styled.img`
  width: 10px;
  height: 10px;
  filter: invert(1);
`;

export const DaysLetterContainer = styled.div`
  background-color: #0f1110;
  height: 35px;
  display: flex;
  font-size: 10px;
  padding-inline: 30px;
  justify-content: space-between;
`;

export const WeekContainer = styled.div`
  display: flex;
  gap: 20px;
  padding-inline: 30px;
  background-color: #0f1110;

  &:hover {
    /* background-color: lightgrey; */
  }
`;

export const DayContainer = styled.div`
  height: 35px;
  font-size: 10px;
  background-color: #0f1110;
  &:hover {
    cursor: pointer;
    /* background-color: lightgrey; */
  }
`;
