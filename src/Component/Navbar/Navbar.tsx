import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import useGetUrlCalendarView from "../../hooks/useGetUrlCalendarView";
import { MonthCalendar } from "../../Component/Calendar/Calendar";
import { useGetTodayCalendar } from "../../hooks/useGetTodayCalendar";
import { getMonthByIndex } from "../../utils/getMonth";
import { Task, AddTask } from "../../Component/Task/TaskHandler";
import { TasksContext } from "../../Component/Task/TasksProvider";

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
  border: 1px solid red;
  transform: scaleX(-100%);
  &:hover {
    cursor: pointer;
  }
`;

const RightArrowButton = styled.img`
  width: 20px;
  height: 20px;
  border: 1px solid red;
  &:hover {
    cursor: pointer;
  }
`;

const calendarViews = ["day", "week", "month", "year"];

const Navbar = () => {
  const context = useContext(TasksContext);
  if (!context)
    throw new Error("Day View must be wrapped within TasksProvider");

  const [calendar, calendarDispatch] = useGetTodayCalendar();
  const [todayNavigation, setTodayNavigation] = useState<string>("");
  const view = useGetUrlCalendarView();
  const [calendarView, setCalendarView] = useState<string>("day");
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [isAddTaskModalVisible, setIsAddTaskModalVisible] =
    useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    setCalendarView(view);
  }, [view]);

  useEffect(() => {
    const monthName = getMonthByIndex(calendar.month);
    setFormattedDate(`${calendar.day} ${monthName} ${calendar.year}`);

    navigate(
      `/calendar/${calendarView ? calendarView : "day"}/${calendar.year}/${
        calendar.month
      }/${calendar.day}`
    );
  }, [calendar.day]);

  useEffect(() => {
    setTodayNavigation(
      `/calendar/day/${calendar.year}/${calendar.month}/${calendar.day}`
    );
  }, []);

  useEffect(() => {}, [calendar.day]);

  const handleClickDayView = (calendarView: string) => {
    setCalendarView(calendarView);
    navigate(
      `/calendar/${calendarView}/${calendar.year}/${calendar.month}/${calendar.day}`
    );
  };

  return (
    <>
      {isAddTaskModalVisible && (
        <AddTask
          addTask={addTask}
          setIsAddTaskModalVisible={setIsAddTaskModalVisible}
          defaultTask={{
            id: crypto.randomUUID(),
            title: "",
            hour: 0,
            description: "",
            complexity: 1,
            priority: 1,
            dueDate: new Date(),
            checks: [],
            labels: [],
            isAllDay: false,
            isDone: false,
          }}
        ></AddTask>
      )}
      <MainContainer>
        <Header>
          <CalendarToggleButton
            alt="calendarToggleButton"
            src="https://www.svgrepo.com/show/532195/menu.svg"
          />
          <Link to={todayNavigation}> Today </Link>
          <LeftArrowButton
            onClick={() => calendarDispatch({ type: "PREVIOUS_DAY" })}
            src="https://cdn-icons-png.flaticon.com/512/271/271228.png"
          />
          <RightArrowButton
            onClick={() => calendarDispatch({ type: "NEXT_DAY" })}
            src="https://cdn-icons-png.flaticon.com/512/271/271228.png"
          />
          <Link to="/tasks"> My Tasks</Link>
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
          onClick={setIsAddTaskModalVisible(!isAddTaskModalVisible)}
        >
          {" "}
          + Add Task{" "}
        </AddTaskButton>
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
    </>
  );
};

export default Navbar;
