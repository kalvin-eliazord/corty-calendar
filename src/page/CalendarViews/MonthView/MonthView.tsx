import { useState, useEffect } from "react";
import getWeeksOfMonth, {
  getDatePosition,
} from "../../../utils/getWeeksOfMonth";
import { CalendarContainer } from "../../../component/MonthCalendar/MonthCalendar.styles";
import daysLetterWeek from "../../../utils/daysLetterWeek";
import {
  MonthCalendarContainer,
  WeekCalendarContainer,
  DayCalendarContainer,
  DaysLetterContainer,
  DayTasksContainer,
  MonthTaskContainer,
} from "./MonthView.styles";
import { useCalendarContext } from "../../../context/CalendarContext";
import { Task, useTasksContext } from "../../../context/TasksContext";
import { useTaskSelectedIdContext } from "../../../context/TaskSelectedIdContext";
import { useDateSelectedContext } from "../../../context/DateSelectedContext";
import { useAreModalsVisibleContext } from "../../../context/ModalsContext";
import { getFormattedHour } from "../../../utils/getFormattedHour";

const MonthView = () => {
  // Context
  const { tasks } = useTasksContext();
  const { setTaskSelectedId } = useTaskSelectedIdContext();
  const { setDateSelected } = useDateSelectedContext();
  const { calendar } = useCalendarContext();
  const { setIsAddTaskModalVisible, setIsViewTaskModalVisible } =
    useAreModalsVisibleContext();

  // State
  const [weeks, setWeeks] = useState<string[][]>([]);

  const handleDayClicked = (dayClicked: string) => {
    setDateSelected(
      new Date(calendar.year, calendar.month - 1, Number(dayClicked))
    );
    setIsAddTaskModalVisible(true);
  };

  const handleTaskContainerClick = (e: any, taskId: string) => {
    e.stopPropagation();
    setTaskSelectedId(taskId);
    setIsViewTaskModalVisible(true);
  };

  const isSameDay = (currentTask: Task, weekIndex: number, day: string) => {
    const dayCasted = Number(day);

    if (
      currentTask.dueDate.getTime() !==
      new Date(calendar.year, calendar.month - 1, dayCasted).getTime()
    )
      return false;

    const weeksDays = getWeeksOfMonth(calendar.year, calendar.month);
    const datePosition = getDatePosition(weeksDays, weekIndex, dayCasted);

    return datePosition === "currentMonth" ? true : false;
  };

  useEffect(() => {
    setWeeks(getWeeksOfMonth(calendar.year, calendar.month));
  }, [calendar.year, calendar.month]);

  return (
    <CalendarContainer>
      <MonthCalendarContainer>
        <DaysLetterContainer>
          {daysLetterWeek.map((dayLetter, dayLetterIndex) => (
            <div key={dayLetterIndex + 40}>{dayLetter}</div>
          ))}
        </DaysLetterContainer>
        {weeks.map((week, weekIndex) => (
          <WeekCalendarContainer key={weekIndex}>
            {week.map((day) => (
              <DayCalendarContainer
                key={day + 10}
                onClick={() => {
                  handleDayClicked(day);
                }}
              >
                {day}
                <DayTasksContainer>
                  {tasks.flatMap(
                    (task) =>
                      isSameDay(task, weekIndex, day) && (
                        <MonthTaskContainer
                          key={task.id}
                          onClick={(e: any) => {
                            handleTaskContainerClick(e, task.id);
                          }}
                          $isDone={task.isDone}
                        >
                          {task.title}

                          {`, ${getFormattedHour(task.hour)}`}
                        </MonthTaskContainer>
                      )
                  )}
                </DayTasksContainer>
              </DayCalendarContainer>
            ))}
          </WeekCalendarContainer>
        ))}
      </MonthCalendarContainer>
    </CalendarContainer>
  );
};

export default MonthView;
