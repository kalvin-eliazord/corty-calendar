import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarContainer } from "../../../component/MonthCalendar/MonthCalendar";
import { useTasksContext } from "../../../context/TasksContext";
import { useAreModalsVisibleContext } from "../../../context/ModalsContext";
import { getFormattedHour } from "../../../utils/getFormattedHour";
import { useTaskSelectedIdContext } from "../../../context/TaskSelectedIdContext";
import { useCalendarContext } from "../../../context/CalendarContext";
import formattedHours from "../../../utils/formattedHours";
import React from "react";
import { useDateSelectedContext } from "../../../context/DateSelectedContext";

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
  isWeekView: boolean;
};

const DayView: React.FC<DayViewProps> = ({ dayRangeProps, isWeekView }) => {
  // Context
  const { tasks } = useTasksContext();
  const { taskSelectedId, setTaskSelectedId } = useTaskSelectedIdContext();
  const { dateSelected, setDateSelected } = useDateSelectedContext();
  const { calendar, calendarDispatch } = useCalendarContext();
  const {
    isAddTaskModalVisible,
    setIsAddTaskModalVisible,
    setIsViewTaskModalVisible,
  } = useAreModalsVisibleContext();

  // State
  const [days, setDays] = useState<DayType[]>([]);
  const [dayRange, setDayRange] = useState<number>(0);

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
          <DayViewContainer key={day.name} $isWeekView={isWeekView}>
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
                $isWeekView={isWeekView}
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
                        onClick={(e: any) => {
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
