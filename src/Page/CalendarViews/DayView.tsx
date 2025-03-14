import { useState, useEffect } from "react";
import { format } from "date-fns";
import styled from "styled-components";
import { CalendarContainer } from "../../Component/MonthCalendar";
import { useTasksContext } from "../../context/TasksContext";
import { useAreModalsVisibleContext } from "../../context/ModalsContext";
import { getFormattedHour } from "../../utils/getFormattedHour";
import { Task } from "../../context/TasksContext";
import { useTaskSelectedIdContext } from "../../context/TaskSelectedIdContext";
import { useCalendarContext } from "../../context/CalendarContext";

const DayViewContainer = styled.div`
  border-inline: solid #7b7364 1px;
  margin-left: 8%;
  margin-top: 5%;
`;

const DayViewNameContainer = styled.div`
  p {
    color: #246694;
    font-weight: bold;
  }
`;

const AllDayTasksContainer = styled.div`
  width: 100%;
  border-bottom: solid #7b7364 1px;
`;

const HoursTitle = styled.div`
  text-align: center;
  position: relative;
  width: 20px;
  right: 6%;
  bottom: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: white;
  font-size: 12px;
`;

const HourRangeContainer = styled.div`
  display: flex;
  flex-direction: row;
  border-radius: 5px;
  border-bottom: solid #7b7364 1px;
  &:hover {
    background-color: lightgrey;
  }
`;

const Hour = styled.div`
  width: 100%;
  position: relative;
  right: 3rem;
  height: 50px;
  margin-left: 30px;
`;

const TasksContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 100%;
`;

const TaskContainer = styled.div`
  background-color: #246694;
  width: 100%;
  margin-right: 50px;
  border-radius: 5px;
  z-index: 1;
  color: white;
  font-weight: bold;
  padding-left: 2%;
  padding-top: 2%;
  &:hover {
    cursor: pointer;
  }
`;

type HourSlot = {
  id: number;
  tasks: Task[];
};

const hours: HourSlot[] = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  tasks: [],
}));

type DayType = {
  name: string;
  index: string;
};

const DayView = () => {
  const { tasks, tasksDispatch } = useTasksContext();
  const { setTaskSelectedId } = useTaskSelectedIdContext();
  const { calendar, calendarDispatch } = useCalendarContext();
  const [day, setDay] = useState<DayType>();
  const [date, setDate] = useState<Date>(new Date());
  const [dayViewTasks, setDayViewTasks] = useState<Task[]>([]);
  const {
    isAddTaskModalVisible,
    setIsAddTaskModalVisible,
    isViewTaskModalVisible,
    setIsViewTaskModalVisible,
  } = useAreModalsVisibleContext();

  const toggleAddTaskModal = (clickedHour: number) => {
    if (isViewTaskModalVisible) {
      setIsViewTaskModalVisible(false);
      return;
    }

    setIsAddTaskModalVisible(!isAddTaskModalVisible);
    calendarDispatch({ type: "SET_HOUR", state: clickedHour });
  };

  const toggleViewTaskModal = (taskId: string) => {
    const isTaskFound = dayViewTasks.find((task) => task.id === taskId);
    if (!isTaskFound) {
      console.warn("Task not found for ID:", taskId);
      return;
    }

    setTaskSelectedId(taskId);
    setIsViewTaskModalVisible(true);
  };

  // START DEBUG
  useEffect(() => {
    if (tasks.length < 1) return;

    console.log("Current Date range Tasks: ", dayViewTasks);
    console.log("list of tasks: ", tasks);
  }, [dayViewTasks, tasks]);
  // END DEBUG

  useEffect(() => {
    if (tasks.length < 1) return;

    setDayViewTasks(
      tasks.filter((task: Task) => task.dueDate.getTime() === date?.getTime())
    );
  }, [date, tasks]);

  useEffect(() => {
    const newDate = new Date(calendar.year, calendar.month - 1, calendar.day);
    setDate(newDate);
    setDay({ name: format(newDate, "eee"), index: calendar.day.toString() });
  }, [calendar.day]);

  return (
    <div className="App">
      <CalendarContainer>
        <DayViewContainer>
          <DayViewNameContainer>
            <p>
              {day?.index} <br /> {day?.name}.
            </p>
          </DayViewNameContainer>
          <AllDayTasksContainer>
            {dayViewTasks.map((task) => task.isAllDay && task.title)}
          </AllDayTasksContainer>
          {hours.map((hour) => (
            <HourRangeContainer key={hour.id}>
              <HoursTitle>{getFormattedHour(hour.id)}</HoursTitle>

              {dayViewTasks.map(
                (task) =>
                  !task.isAllDay &&
                  task.hour === hour.id && (
                    <TaskContainer
                      key={task.id}
                      onClick={() => toggleViewTaskModal(task.id)}
                    >
                      {task.title}
                      {!task.isAllDay && `, ${getFormattedHour(task.hour)}`}
                    </TaskContainer>
                  )
              )}

              <Hour onClick={() => toggleAddTaskModal(hour.id)}>
                <TasksContainer>
                  {isAddTaskModalVisible &&
                    !isViewTaskModalVisible &&
                    calendar.hour === hour.id && (
                      <TaskContainer>
                        (No title) {getFormattedHour(calendar.hour)}
                      </TaskContainer>
                    )}
                </TasksContainer>
              </Hour>
            </HourRangeContainer>
          ))}
        </DayViewContainer>
      </CalendarContainer>
    </div>
  );
};

export default DayView;
