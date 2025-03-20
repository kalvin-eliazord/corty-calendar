import styled from "styled-components";

export const MainContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  height: 450px;
  background-color: #1e1e21;
  z-index: 9;
  text-align: left;
  border-radius: 20px;

  overflow-y: auto;
  overflow-x: hidden;
  color: #e2e3e2;

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

export const TaskTitle = styled.h2`
  padding-left: 80px;
`;

export const HeaderContainer = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  padding-bottom: 10px;
  margin-bottom: 40px;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
  &:hover {
    cursor: move;
    background-color: rgb(64, 64, 70);
  }
`;

export const ExitButton = styled.img`
  filter: invert(1);
  width: 15px;
  margin-top: 20px;
  position: relative;
  bottom: 4px;
  margin-right: 20px;
  &:hover {
    cursor: pointer;
  }
`;

export const TitleTaskInput = styled.input`
  height: 30px;
  position: relative;
  width: 67%;
  color: #e2e3e2;
  left: 80px;
  background-color: #1e1e21;
  border: 0;
  font-size: 25px;
  margin-bottom: 10px;
  border-bottom: 2px solid grey;
  &:focus {
    outline: 0;
    border-bottom: 2px solid rgb(22, 85, 187);
  }
  &::placeholder {
    color: #777472;
    padding-left: 10px;
  }
`;

export const TimeSettingsContainerLink = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  height: 100px;
  color: #e2e3e2;
  img {
    position: relative;
    margin-right: 20px;
    left: 20px;
  }
`;

export const DateLink = styled.p`
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

export const HourLink = styled.p`
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

export const RecurringLink = styled.p`
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

export const AddItemsContainer = styled.div`
  margin-left: 80px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 10px;
  div {
    display: flex;
    flex-direction: row;
    gap: 10px;
  }
`;

export const SlidersContainer = styled.div`
  border: 1px solid #333436;
  margin-left: 85px;
  margin-bottom: 40px;
  width: 67%;
  border-radius: 5px;
`;

export const ItemInput = styled.input`
  overflow-x: scroll;
  color: white;
  margin-left: 4px;
  border: 0;
  width: 81%;
  background-color: #333436;
  border-radius: 5px;
  height: 25px;
  span {
    color: #777472;
  }
  &:hover {
    cursor: text;
  }
  &::placeholder {
    padding-left: 10px;
    color: #777472;
  }
`;

export const ItemInputContainer = styled.div`
  overflow-x: auto;
  margin-bottom: 10px;
  overflow-y: hidden;
  border: 0;
  width: 82%;
  margin-left: 5px;
  background-color: #292b2c;
  border-radius: 5px;
  span {
    color: #777472;
  }
  &::placeholder {
    padding-left: 10px;
  }
`;

export const ItemContainer = styled.div`
  border: 1px solid white;
  background-color: #013a5f;
  border-radius: 5px;
  &:hover {
    cursor: pointer;
    background-color: red;
  }
`;

export const ChildContainer = styled.div`
  max-width: 500px;
  margin: auto;
`;

export const MonthCalendarWrapper = styled.div`
  .month-calendar-container {
  }
  .month-calendar-header {
    justify-content: space-between;
  }
  .month-calendar-weeks {
    background-color: #0f1110;
  }
`;

export const ClockImg = styled.img`
  width: 20px;
  height: 20px;
  filter: invert(1);
  position: relative;
  top: 15px;
  padding-inline: 10px;
`;

export const DescriptionImg = styled.img`
  filter: invert(1);
  width: 25px;
  padding-inline: 30px;
  position: relative;
  bottom: 70px;
  right: 4px;
`;

export const DescriptionTextArea = styled.textarea`
  border: 0;
  resize: none;
  color: #e2e3e2;
  width: 67%;
  padding-bottom: 30px;
  margin-bottom: 40px;
  background-color: #333436;
  border-radius: 5px;
  &::placeholder {
    padding-left: 10px;
    color: #777472;
  }
  &:focus {
    outline: 0;
    border-bottom: 2px solid #093377;
  }
`;

export const DateInput = styled.input.attrs(() => ({
  tabIndex: -2,
}))`
  background-color: #333436;
  height: 40px;
  border: 0;
  color: #e2e3e2;
  border-radius: 5px;
  &::placeholder {
    text-align: center;
    padding-left: 20px;
  }
`;

export const HourInput = styled.input.attrs(() => ({
  tabIndex: -3,
}))`
  color: #e2e3e2;
  background-color: #333436;
  height: 40px;
  width: 24%;
  border: 0;
  border-radius: 5px;
  &:placeholder {
    padding-left: 20px;
  }
`;

export const StyledSelect = styled.select`
  position: relative;
  left: 19%;
  bottom: 40px;
  padding: 5px;
  border: 0;
  border-radius: 5px;
  background-color: #333436;
  color: white;
`;

export const AllDayContainer = styled.div`
  position: relative;
  left: 64%;
  bottom: 65px;
  border: 0;
  border-radius: 5px;
  &:hover {
    cursor: pointer;
  }
  input {
    border: 1px solid white;
    accent: #333436;
    background-color: #333436;
    color: #333436;
  }
`;

export const HoursDropDown = styled.div`
  position: absolute;
  left: 61.5%;
  top: 36%;
  width: 110px;
  height: 200px;
  overflow-y: scroll;
  background-color: #0f1110;
  z-index: 55;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  div {
    padding: 10px;
    &:hover {
      background-color: grey;
    }
  }
`;

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-block: 10px;
  div {
    padding-inline: 16px;
    padding-block: 10px;
    background-color: #333639;
    color: #8dc3f8;
    border-radius: 20px;
    margin-right: 20px;
    &:hover {
      cursor: pointer;
    }
  }
`;
