import { useState, useEffect } from "react";
import { format } from "date-fns";
import styled from "styled-components";
import { CalendarContainer } from "../../component/MonthCalendar/MonthCalendar";
import { useTasksContext } from "../../context/TasksContext";
import { useAreModalsVisibleContext } from "../../context/ModalsContext";
import { getFormattedHour } from "../../utils/getFormattedHour";
import { useTaskSelectedIdContext } from "../../context/TaskSelectedIdContext";
import { useCalendarContext } from "../../context/CalendarContext";
import formattedHours from "../../utils/formattedHours";
import React from "react";
import { useDateSelectedContext } from "../../context/DateSelectedContext";

const DayViewContainer = styled.div`
  border-inline: solid #7a7264 1px;
  margin-top: 2%;
  width: 100%;
`;

const DayViewNameContainer = styled.div`
  z-index: 1;

  position: sticky;
  padding-top: 2px;
  background-color: #0f1110;
  top: 0;
  border-bottom: solid #7a7264 1px;
  p {
    margin-left: 2%;
    color: #246694;
    font-weight: bold;
    font-size: 13px;
  }

  span {
    font-size: 28px;
    position: relative;
  }
`;

const AllDayTasksContainer = styled.div`
  width: 100%;
  display: flex;
  overflow-x: auto;
  padding-left: 20px;
`;

const AllDayTask = styled.div`
  background-color: #1a3b86;
  margin-right: 20px;
  z-index: 1;
  color: white;
  font-weight: bold;
  padding-inline: 1%;
  border-radius: 15px;

  &:hover {
    cursor: pointer;
  }
`;

const HoursTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 90px;
  gap: 40px;
  margin-right: 10px;
`;

const HoursTitle = styled.div`
  text-align: right;
  color: white;
  font-size: 14px;
  text-wrap: nowrap;
  margin-bottom: 1.5px;
`;

const HourRangeContainer = styled.div`
  display: flex;
  border-bottom: solid #7a7264 1px;
  max-height: 0px;
  padding: 18px;
  padding-bottom: 40px;
  overflow-y: hidden;
  overflow-x: auto;

  &::-webkit-scrollbar {
    width: 15px;
    height: 12px;
  }

  &::-webkit-scrollbar-track {
    background: #1e1e1e;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #3a3a3a;
    border-radius: 10px;
    border: 3px solid #1e1e1e;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  &::-webkit-scrollbar-thumb:active {
    background: #777;
  }

  &::-webkit-scrollbar-button {
    display: none;
  }

  &::-webkit-scrollbar-corner {
    background: #1e1e1e;
  }
  &:hover {
    background-color: rgba(190, 182, 168, 0.17);
  }
`;

const TaskPlaceholderContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  right: 3rem;
  margin-left: 30px;
`;

const TaskContainer = styled.div<{ $isDone: boolean }>`
  background-color: ${({ $isDone }) => ($isDone ? "#425682" : "#1a3b86")};
  margin-right: 40px;
  border-radius: 15px;
  width: 100%;
  height: 100%;
  z-index: 1;
  color: white;
  font-weight: bold;
  padding-inline: 2%;
  text-wrap: nowrap;
  text-decoration: ${({ $isDone }) => $isDone && "line-through"};
  &:hover {
    cursor: pointer;
  }
`;

const Calendar = styled.div`
  display: flex;
`;

type DayType = {
  name: string;
  index: string;
  date: Date;
};

type DayViewProps = {
  dayRangeProps: number;
  displayType: string;
};

const DayView: React.FC<DayViewProps> = ({ dayRangeProps, displayType }) => {
  const { tasks } = useTasksContext();
  const { taskSelectedId, setTaskSelectedId } = useTaskSelectedIdContext();
  const { dateSelected, setDateSelected } = useDateSelectedContext();
  const { calendar, calendarDispatch } = useCalendarContext();
  const [days, setDays] = useState<DayType[]>([]);
  const [dayRange, setDayRange] = useState<number>(0);

  const {
    isAddTaskModalVisible,
    setIsAddTaskModalVisible,
    isViewTaskModalVisible,
    setIsViewTaskModalVisible,
  } = useAreModalsVisibleContext();

  useEffect(() => {
    setDayRange(dayRangeProps);
  }, [dayRangeProps]);

  const handleHourRangeClick = (clickedHour: number, clickedDate: Date) => {
    setIsAddTaskModalVisible(true);

    calendarDispatch({ type: "SET_HOUR", state: clickedHour });
    setDateSelected(clickedDate);
  };

  const handleTaskContainerClick = (taskId: string) => {
    setTaskSelectedId(taskId);
    setIsViewTaskModalVisible(true);
  };

  useEffect(() => {
    const today = new Date(calendar.year, calendar.month - 1, calendar.day);

    setDays(
      Array.from({ length: dayRange }, (_, i) => {
        const nextDay = new Date(today);
        nextDay.setDate(today.getDate() + i);
        return {
          name: format(nextDay, "eee").toUpperCase(),
          index: nextDay.getDate().toString(),
          date: nextDay,
        };
      })
    );
  }, [calendar.day, dayRange]);

  return (
    <CalendarContainer $displayType={displayType}>
      <Calendar>
        <HoursTitleContainer>
          {formattedHours.map((formattedHour, i) => (
            <HoursTitle key={formattedHour + i}>{formattedHour}</HoursTitle>
          ))}
        </HoursTitleContainer>
        {days.map((day) => (
          <DayViewContainer key={day.name}>
            <DayViewNameContainer>
              <p>
                {day.name}. <br /> <span>{day.index} </span>
              </p>
              <AllDayTasksContainer>
                {tasks.map(
                  (task) =>
                    task.isAllDay &&
                    task.dueDate.getTime() === day.date.getTime() && (
                      <AllDayTask>{task.title} </AllDayTask>
                    )
                )}
              </AllDayTasksContainer>
            </DayViewNameContainer>

            {formattedHours.map((formattedHour, i) => (
              <HourRangeContainer
                key={formattedHour}
                onClick={() => handleHourRangeClick(i, day.date)}
              >
                <TaskPlaceholderContainer>
                  {isAddTaskModalVisible &&
                    !taskSelectedId &&
                    calendar.hour === i &&
                    day.date.getTime() === dateSelected.getTime() && (
                      <TaskContainer $isDone={false}>
                        (No title), {getFormattedHour(calendar.hour)}
                      </TaskContainer>
                    )}
                </TaskPlaceholderContainer>

                {tasks.map(
                  (task) =>
                    !task.isAllDay &&
                    task.dueDate.getTime() === day.date.getTime() &&
                    task.hour === i && (
                      <TaskContainer
                        key={task.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTaskContainerClick(task.id);
                        }}
                        $isDone={task.isDone}
                      >
                        {task.title}

                        {`, ${getFormattedHour(task.hour)}`}
                      </TaskContainer>
                    )
                )}
              </HourRangeContainer>
            ))}
          </DayViewContainer>
        ))}
      </Calendar>
    </CalendarContainer>
  );
};

export default DayView;
