import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import useGetCalendarView from "../../hooks/useGetCalendarView";
import { MonthCalendar } from "../../Component/Calendar/Calendar";
import { useGetTodayCalendar } from "../../hooks/useGetTodayCalendar";

const MainContainer = styled.div`
  background-color: #141617;
  div {
    display: flex;
    justify-content: space-between;
  }
  p {
    color: white;
  }
`;

const Header = styled.div`
  background-color: orange;

  height: 7vh;
`;

const LeftSide = styled.div`
  display: flex;
  flex-direction: column;
  background-color: pink;
  width: 25%;
  height: 100vh;
  div {
    bottom: 20vh;
  }
`;

const CalendarViewsContainer = styled.div``;

const CalendarView = styled.div`
  font-weight: bold;
  &:hover {
    cursor: pointer;
  }
`;

const calendarViews = ["day", "week", "month", "year"];

const Navbar = () => {
  const [calendar, calendarDispatch] = useGetTodayCalendar();
  const view = useGetCalendarView();
  const [calendarView, setCalendarView] = useState<string>("day");
  const navigate = useNavigate();

  useEffect(() => {
    setCalendarView(view);
  }, [view]);

  useEffect(() => {
    navigate(
      `/calendar/${calendarView}/${calendar.year}/${calendar.month}/${calendar.day}`
    );
  }, [calendar.day]);

  const handleClickDayView = (calendarView: string) => {
    setCalendarView(calendarView);
    navigate(
      `/calendar/${calendarView}/${calendar.year}/${calendar.month}/${calendar.day}`
    );
  };
  return (
    <MainContainer>
      <Header>
        <Link to="/tasks"> My Tasks</Link>
        {calendarViews.map((calendarView) => (
          <CalendarView
            key={calendarView}
            onClick={() => handleClickDayView(calendarView)}
          >
            {calendarView} View
          </CalendarView>
        ))}
      </Header>
      <div>
        <LeftSide>
          {/* Todo:Create new Task*/}
          <MonthCalendar
            calendar={calendar}
            calendarDispatch={calendarDispatch}
          ></MonthCalendar>
        </LeftSide>
      </div>
    </MainContainer>
  );
};

export default Navbar;
