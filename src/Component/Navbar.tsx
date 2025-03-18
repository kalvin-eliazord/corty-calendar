import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { MonthCalendar } from "./MonthCalendar";
import { useCalendarContext } from "../context/CalendarContext";
import { getMonthByIndex } from "../utils/getMonth";
import { useAreModalsVisibleContext } from "../context/ModalsContext";

const MainContainer = styled.div`
  padding: 10px;
  div {
    display: flex;
    justify-content: space-between;
  }
  p {
    color: white;
  }
`;

const AddTaskButton = styled.div`
  padding: 20px;
  border-radius: 10px;
  background-color: #2a2e31;
  width: 10%;
  margin-bottom: 20px;
  &:hover {
    cursor: pointer;
  }
`;

const Header = styled.div`
  margin-bottom: 60px;
`;

const LeftSide = styled.div`
  display: flex;
  flex-direction: column;
  width: 10%;
  height: 100vh;
  div {
    bottom: 20vh;
  }
`;

const CalendarToggleButton = styled.img`
  width: 40px;
  filter: invert(1);
  &:hover {
    cursor: pointer;
  }
`;

const CalendarView = styled.div`
  font-weight: bold;
  &:hover {
    cursor: pointer;
  }
`;

const CalendarDateText = styled.p``;

const LeftArrowButton = styled.img`
  width: 20px;
  height: 20px;
  filter: invert(1);
  transform: scaleX(-100%);
  &:hover {
    cursor: pointer;
  }
`;

const RightArrowButton = styled.img`
  width: 20px;
  height: 20px;
  filter: invert(1);
  &:hover {
    cursor: pointer;
  }
`;

const calendarViews = ["day", "week", "month", "year"];

const getFirstDay = (year: number, month: number) =>
  new Date(year, month - 1, 1).getDate();
const getLastDay = (year: number, month: number) =>
  new Date(year, month, 0).getDate();

const Navbar = () => {
  const { calendar, calendarDispatch } = useCalendarContext();
  const { isAddTaskModalVisible, setIsAddTaskModalVisible } =
    useAreModalsVisibleContext();
  const [todayNavigation, setTodayNavigation] = useState<string>("");
  const [currentDate, setCurrentDate] = useState({ year: 0, month: 0, day: 0 });
  const [calendarView, setCalendarView] = useState<string>("day");
  const [formattedDate, setFormattedDate] = useState<string>("");
  const navigate = useNavigate();
  const [isPreviousMonthReady, setIsPreviousMonthReady] =
    useState<boolean>(false);

  useEffect(() => {
    setFormattedDate(
      `${calendar.day} ${getMonthByIndex(calendar.month)} ${calendar.year}`
    );

    navigate(
      `/calendar/${calendarView ? calendarView : "day"}/${calendar.year}/${
        calendar.month
      }/${calendar.day}`
    );
  }, [calendar.day]);

  useEffect(() => {
    setCurrentDate({
      year: calendar.year,
      month: calendar.month,
      day: calendar.day,
    });
  }, []);

  const handleClickToday = () => {
    calendarDispatch({
      type: "SET_DATE",
      year: currentDate.year,
      month: currentDate.month,
      day: currentDate.day,
    });
  };

  useEffect(() => {
    if (!isPreviousMonthReady) return;

    calendarDispatch({
      type: "SET_DAY",
      state: getLastDay(calendar.year, calendar.month),
    });

    setIsPreviousMonthReady((prev) => false);
  }, [calendar.month]);

  const handlePreviousDay = () => {
    if (calendar.day < 2) {
      calendarDispatch({ type: "PREVIOUS_MONTH" });

      setIsPreviousMonthReady((prev) => true);
    } else {
      calendarDispatch({ type: "PREVIOUS_DAY" });
    }
  };

  const handleNextDay = () => {
    const lastDay = getLastDay(calendar.year, calendar.month);

    if (calendar.day >= lastDay) {
      calendarDispatch({ type: "NEXT_MONTH" });

      calendarDispatch({
        type: "SET_DAY",
        state: getFirstDay(calendar.year, calendar.month),
      });
    } else {
      calendarDispatch({ type: "NEXT_DAY" });
    }
  };

  const handleClickDayView = (calendarView: string) => {
    setCalendarView(calendarView);
    navigate(
      `/calendar/${calendarView}/${calendar.year}/${calendar.month}/${calendar.day}`
    );
  };

  return (
    <MainContainer onClick={() => setIsAddTaskModalVisible(false)}>
      <Header>
        <CalendarToggleButton
          alt="calendarToggleButton"
          src="https://www.svgrepo.com/show/532195/menu.svg"
        />
        <Link to="/tasks"> My Tasks</Link>

        <Link to={todayNavigation} onClick={handleClickToday}>
          Today
        </Link>
        <LeftArrowButton
          onClick={() => handlePreviousDay()}
          src="https://cdn-icons-png.flaticon.com/512/271/271228.png"
        />
        <RightArrowButton
          onClick={() => handleNextDay()}
          src="https://cdn-icons-png.flaticon.com/512/271/271228.png"
        />
        <CalendarDateText>{formattedDate}</CalendarDateText>
        <select onChange={(e) => handleClickDayView(e.target.value)}>
          {calendarViews.map((calendarView) => (
            <option key={calendarView} value={calendarView}>
              {calendarView} View
            </option>
          ))}
        </select>
      </Header>
      <AddTaskButton
        onClick={() => setIsAddTaskModalVisible(!isAddTaskModalVisible)}
      >
        + Add Task
      </AddTaskButton>
      <div>
        <LeftSide>
         {/* */} 
         {/* */} 
        </LeftSide>
      </div>
    </MainContainer>
  );
};

export default Navbar;
