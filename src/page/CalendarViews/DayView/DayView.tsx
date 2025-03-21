import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarContainer } from "../../../component/MonthCalendar/MonthCalendar";
import { useTasksContext } from "../../../context/TasksContext";
import { useAreModalsVisibleContext } from "../../../context/ModalsContext";
import { getFormattedHour } from "../../../utils/getFormattedHour";
import { useTaskSelectedIdContext } from "../../../context/TaskSelectedIdContext";
import { useCalendarContext } from "../../../context/CalendarContext";
import formattedHours from "../../../utils/formattedHours";
import { useDateSelectedContext } from "../../../context/DateSelectedContext";

// Import styles
import {
  DayViewContainer,
  DayViewNameContainer,
  AllDayTasksContainer,
  AllDayTask,
  HoursTitleContainer,
  HoursTitle,
  HourRangeContainer,
  TaskPlaceholderContainer,
  TaskContainer,
  Calendar,
} from "./DayView.styles";

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
    <CalendarContainer>
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
                      <AllDayTask key={task.id}>{task.title} </AllDayTask>
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
              </HourRangeContainer>
            ))}
          </DayViewContainer>
        ))}
      </Calendar>
    </CalendarContainer>
  );
};

export default DayView;
