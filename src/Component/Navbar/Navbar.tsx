import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MainContainer,
  AddTaskButton,
  Header,
  LeftSide,
  CalendarToggleButton,
  CalendarDateText,
  ArrowsContainer,
  LeftArrowButton,
  RightArrowButton,
  CalendarViewSelector,
  StyledLink,
  Logo,
  LogoContainer,
} from "./Navbar.styles";
import { MonthCalendar } from "../MonthCalendar/MonthCalendar";
import { useCalendarContext } from "../../context/CalendarContext";
import { getMonthByIndex } from "../../utils/getMonth";
import { useAreModalsVisibleContext } from "../../context/ModalsContext";
import { useTaskSelectedIdContext } from "../../context/TaskSelectedIdContext";

const calendarViews = ["", "day", "week", "month", "year"];

const Navbar = () => {
  // Context
  const { setTaskSelectedId } = useTaskSelectedIdContext();
  const {
    calendar,
    calendarDispatch,
    nextDay,
    previousDay,
    nextMonth,
    previousMonth,
    previousWeek,
    nextWeek,
  } = useCalendarContext();
  const {
    isAddTaskModalVisible,
    setIsAddTaskModalVisible,
    isViewTaskModalVisible,
  } = useAreModalsVisibleContext();

  // State
  const [currentDate, setCurrentDate] = useState({ year: 0, month: 0, day: 0 });
  const [calendarView, setCalendarView] = useState<string>("day");
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [isArrowMonthClicked, setIsArrowMonthClicked] =
    useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isViewTaskModalVisible && !isAddTaskModalVisible)
      setTaskSelectedId("");
  }, [isViewTaskModalVisible]);

  useEffect(() => {
    setFormattedDate(
      `${calendar.day} ${getMonthByIndex(calendar.month)} ${calendar.year}`
    );
  }, [calendar]);

  useEffect(() => {
    if (calendarView === "day" && !isAddTaskModalVisible) {
      navigate(
        `/calendar/${calendarView}/${calendar.year}/${calendar.month}/${calendar.day}`
      );
    }
  }, [calendar.day]);

  useEffect(() => {
    if (isArrowMonthClicked) {
      setFormattedDate(
        `${calendar.day} ${getMonthByIndex(calendar.month)} ${calendar.year}`
      );
      setIsArrowMonthClicked(false);
    }
  }, [calendar.month]);

  useEffect(() => {
    setCurrentDate({
      year: calendar.year,
      month: calendar.month,
      day: calendar.day,
    });

    setFormattedDate(
      `${calendar.day} ${getMonthByIndex(calendar.month)} ${calendar.year}`
    );
  }, []);

  const handleClickToday = () => {
    setCalendarView("day");

    calendarDispatch({
      type: "SET_DATE",
      year: currentDate.year,
      month: currentDate.month,
      day: currentDate.day,
    });
  };

  const handlePreviousView = () => {
    switch (calendarView) {
      case "day":
        previousDay();
        break;
      case "week":
        previousWeek();
        break;
      case "month":
        previousMonth();
        setIsArrowMonthClicked(true);
        break;
      case "year":
        calendarDispatch({ type: "PREVIOUS_YEAR" });
        break;
    }
  };

  const handleNextView = () => {
    switch (calendarView) {
      case "day":
        nextDay();
        break;
      case "week":
        nextWeek();
        break;
      case "month":
        nextMonth();
        setIsArrowMonthClicked(true);
        break;
      case "year":
        calendarDispatch({ type: "NEXT_YEAR" });
        break;
    }
  };

  const handleClickDayView = (view: string) => {
    if (!view) return;

    setCalendarView(view);
    navigate(
      `/calendar/${view}/${calendar.year}/${calendar.month}/${calendar.day}`
    );
  };

  return (
    <MainContainer>
      <Header>
        <LogoContainer>
          <CalendarToggleButton
            alt="calendarToggleButton"
            src="https://www.svgrepo.com/show/532195/menu.svg"
          />
          <Logo src="https://ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_21_2x.png" />
        </LogoContainer>
        <StyledLink to="/tasks"> My Tasks</StyledLink>
        <StyledLink to="" onClick={handleClickToday}>
          Today
        </StyledLink>
        <ArrowsContainer>
          <LeftArrowButton
            onClick={handlePreviousView}
            src="https://cdn-icons-png.flaticon.com/512/271/271228.png"
          />
          <RightArrowButton
            onClick={handleNextView}
            src="https://cdn-icons-png.flaticon.com/512/271/271228.png"
          />
        </ArrowsContainer>
        <CalendarDateText>{formattedDate}</CalendarDateText>
        <CalendarViewSelector
          onChange={(e) => handleClickDayView(e.target.value)}
          value={calendarView}
        >
          {calendarViews.map((view) => (
            <option key={view} value={view}>
              {view === ""
                ? "Pick a view"
                : view.charAt(0).toUpperCase() + view.slice(1)}
            </option>
          ))}
        </CalendarViewSelector>
      </Header>
      <AddTaskButton onClick={() => setIsAddTaskModalVisible(true)}>
        + Add Task
      </AddTaskButton>
      <LeftSide>
        <MonthCalendar customCssProps />
      </LeftSide>
    </MainContainer>
  );
};

export default Navbar;
