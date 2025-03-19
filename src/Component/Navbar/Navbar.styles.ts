import styled from "styled-components";
import { Link } from "react-router-dom";

export const MainContainer = styled.div`
  padding: 10px;
  background-color: #1b1b1b;
  color: #e2e3e2;
  div {
    display: flex;
    justify-content: space-between;
  }
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
`;

export const LeftSide = styled.div`
  display: flex;
  flex-direction: column;
  height: 80vh;
  div {
    bottom: 20vh;
  }
`;

export const AddTaskButton = styled.div`
  padding: 20px;
  margin-left: 20px;
  border-radius: 10px;
  background-color: #2a2e31;
  width: 6%;
  &:hover {
    cursor: pointer;
  }
`;

export const CalendarToggleButton = styled.img`
  width: 25px;
  filter: invert(1);
  position: relative;
  bottom: 15px;
  left: 20px;
  &:hover {
    cursor: pointer;
  }
`;

export const CalendarDateText = styled.p`
  position: relative;
  bottom: 15px;
`;

export const ArrowsContainer = styled.div`
  display: flex;
  position: relative;
  right: 55px;
  gap: 30px;
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
  }
`;

export const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;
