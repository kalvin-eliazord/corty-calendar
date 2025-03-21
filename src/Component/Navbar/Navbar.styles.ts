import styled from "styled-components";
import { Link } from "react-router-dom";

export const MainContainer = styled.div`
  padding: 10px;
  background-color: #1b1b1b;
  color: #e2e3e2;

  p {
    color: white;
  }
  a {
    text-decoration: none;
    color: inherit;
  }
`;

export const Header = styled.div`
  margin-bottom: 60px;
  padding-top: 20px;
  display: flex;
`;

export const LeftSide = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  height: 100vh;
  div {
    bottom: 20vh;
  }
`;

export const AddTaskButton = styled.div`
  padding: 20px;
  margin-left: 15px;
  margin-bottom: 20px;

  border-radius: 15px;
  background-color: #36393a;
  width: 6%;
  &:hover {
    cursor: pointer;
    background-color: rgb(85, 90, 92);
  }
`;

export const CalendarToggleButton = styled.img`
  width: 25px;
  filter: invert(1);
  position: relative;
  bottom: 15px;
  left: 20px;
  margin-right: 200px;
  &:hover {
    cursor: pointer;
  }
`;

export const CalendarDateText = styled.p`
  position: relative;
  bottom: 15px;
  margin-right: 40px;
  text-wrap: nowrap;
`;

export const ArrowsContainer = styled.div`
  display: flex;
  gap: 70px;
  margin-right: 120px;

  &:hover {
    cursor: pointer;
  }
`;

export const LeftArrowButton = styled.img`
  width: 20px;
  height: 20px;
  filter: invert(1);
  transform: scaleX(-100%);
  &:hover {
    cursor: pointer;
  }
`;

export const RightArrowButton = styled.img`
  width: 20px;
  height: 20px;
  filter: invert(1);
  &:hover {
    cursor: pointer;
  }
`;

export const CalendarViewSelector = styled.select`
  position: relative;
  height: 20px;
  right: 10px;
  border: 0;
  font-weight: bold;
  font-size: 15px;
  color: white;
  background-color: #1b1b1b;
  border-radius: 5px;
  &:hover {
    cursor: pointer;
    background-color: rgb(85, 90, 92);
  }
`;

export const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  position: relative;
  bottom: 8px;
  border: 1px solid #818380;
  height: 20px;
  padding-block: 8px;
  padding-inline: 15px;
  border-radius: 30px;
  margin-right: 120px;
  text-wrap: nowrap;
  &:hover {
    background-color: rgb(85, 90, 92);
  }
`;
