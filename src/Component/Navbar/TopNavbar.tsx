import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MainContainer,
  Header,
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
import { useCalendarContext } from "../../context/CalendarContext";
import { getMonthByIndex } from "../../utils/getMonth";
import { useAreModalsVisibleContext } from "../../context/ModalsContext";

const calendarViews = ["", "day", "week", "month", "year"];

const TopNavbar = () => {
  // Context
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
  const { isAddTaskModalVisible } = useAreModalsVisibleContext();

  // State
  const [currentDate, setCurrentDate] = useState({ year: 0, month: 0, day: 0 });
  const [calendarView, setCalendarView] = useState<string>("day");
  const [formattedDate, setFormattedDate] = useState<string>("");

  const navigate = useNavigate();

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
          onChange={(e: any) => handleClickDayView(e.target.value)}
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
    </MainContainer>
  );
};

export default TopNavbar;
