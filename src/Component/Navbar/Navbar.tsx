// Navbar.tsx
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
} from "./Navbar.styles";
import { MonthCalendar } from "../MonthCalendar/MonthCalendar";
import { useCalendarContext } from "../../context/CalendarContext";
import { getMonthByIndex } from "../../utils/getMonth";
import { useAreModalsVisibleContext } from "../../context/ModalsContext";
import { useTaskSelectedIdContext } from "../../context/TaskSelectedIdContext";

const calendarViews = ["", "day", "week", "month", "year"];

const getFirstDay = (year: number, month: number) =>
  new Date(year, month - 1, 1).getDate();
const getLastDay = (year: number, month: number) =>
  new Date(year, month, 0).getDate();

const Navbar = () => {
  // Context
  const {  setTaskSelectedId } = useTaskSelectedIdContext();
  const { calendar, calendarDispatch } = useCalendarContext();
  const {
    isAddTaskModalVisible,
    setIsAddTaskModalVisible,
    isViewTaskModalVisible,
  } = useAreModalsVisibleContext();

  // State
  const [currentDate, setCurrentDate] = useState({ year: 0, month: 0, day: 0 });
  const [calendarView, setCalendarView] = useState<string>("day");
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [isPreviousMonthReady, setIsPreviousMonthReady] =
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

    if (calendarView === "day") {
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

  useEffect(() => {
    if (!isPreviousMonthReady) return;

    calendarDispatch({
      type: "SET_DAY",
      state: getLastDay(calendar.year, calendar.month),
    });

    setIsPreviousMonthReady(false);
  }, [calendar.month]);

  const handlePreviousDay = () => {
    if (calendar.day < 2) {
      calendarDispatch({ type: "PREVIOUS_MONTH" });
      setIsPreviousMonthReady(true);
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
        <CalendarToggleButton
          alt="calendarToggleButton"
          src="https://www.svgrepo.com/show/532195/menu.svg"
        />
        <StyledLink to="/tasks"> My Tasks</StyledLink>
        <StyledLink to="" onClick={handleClickToday}>
          Today
        </StyledLink>
        <ArrowsContainer>
          <LeftArrowButton
            onClick={handlePreviousDay}
            src="https://cdn-icons-png.flaticon.com/512/271/271228.png"
          />
          <RightArrowButton
            onClick={handleNextDay}
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
