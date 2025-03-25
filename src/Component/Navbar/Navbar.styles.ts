import styled from "styled-components";
import { Link } from "react-router-dom";

export const NavbarBodyContainer = styled.div`
  display: flex;
`;

export const MainContainer = styled.div`
  background-color: #141617;
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
  padding-top: 30px;
  display: flex;

  @media (min-width: 2000px) {
    gap: 120px;
  }
  justify-content: space-evenly;
  background-color: #141617;
`;

export const LeftSide = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

export const AddTaskButton = styled.div`
  padding: 20px;
  padding-right: 80px;
  margin-bottom: 20px;
  text-wrap: nowrap;
  width: 100px;
  border-radius: 15px;
  background-color: #36393a;
  width: 6%;
  &:hover {
    cursor: pointer;
    background-color: rgb(85, 90, 92);
  }
`;

export const LogoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 35px;
  position: relative;
  right: 4%;

  @media (min-width: 2000px) {
    right: 4.5%;
  }

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
`;

export const Logo = styled.img`
  width: 40px;
  height: 40px;
  position: relative;
  bottom: 10px;
`;

export const CalendarDateText = styled.p`
  position: relative;
  bottom: 15px;
  margin-right: 90px;
  text-wrap: nowrap;
`;

export const ArrowsContainer = styled.div`
  display: flex;
  gap: 70px;
  margin-right: 120px;

  img {
    padding: 10px;
    border-radius: 30px;
    position: relative;
    bottom: 10px;
  }
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
    background-color: rgba(85, 90, 92, 0.18);
  }
`;

export const RightArrowButton = styled.img`
  width: 20px;
  height: 20px;
  filter: invert(1);
  &:hover {
    cursor: pointer;
    background-color: rgba(85, 90, 92, 0.18);
  }
`;

export const CalendarViewSelector = styled.select`
  border: 1px solid grey;
  font-weight: bold;
  font-size: 15px;
  color: white;
  background-color: #1b1b1b;
  border-radius: 30px;
  position: relative;
  bottom: 10px;
  padding-inline: 10px;
  text-align: center;

  &:hover {
    cursor: pointer;
    background-color: rgba(85, 90, 92, 0.18);

    &:focus {
      background-color: #1b1b1b;
    }
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
    background-color: rgba(85, 90, 92, 0.18);
  }
`;
