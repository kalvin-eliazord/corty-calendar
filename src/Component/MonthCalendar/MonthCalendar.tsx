import React, { useState, useEffect } from "react";
import daysLetterWeek from "../../utils/daysLetterWeek";
import { getMonthByIndex } from "../../utils/getMonth";
import { useCalendarContext } from "../../context/CalendarContext";
import getWeeksOfMonth, {
  getDatePosition,
  getWeekIndexOfMonth,
} from "../../utils/getWeeksOfMonth";
import {
  MonthCalendarContainer,
  MonthCalendarHeader,
  ArrowsContainer,
  LeftArrowButton,
  RightArrowButton,
  DaysLetterContainer,
  WeekContainer,
  DayContainer,
} from "./MonthCalendar.styles";
import { addMonths, subMonths } from "date-fns";
import { useTasksContext } from "../../context/TasksContext";
import { useAreModalsVisibleContext } from "../../context/ModalsContext";
import { useDateSelectedContext } from "../../context/DateSelectedContext";

type MonthBodyProps = {
  yearIndexProps: number | null;
  monthIndexProps: number;
  isYearView: boolean;
};

const MonthBody: React.FC<MonthBodyProps> = ({
  yearIndexProps,
  monthIndexProps,
  isYearView,
}) => {
  // Context
  const { tasks } = useTasksContext();
  const { calendar, calendarDispatch, previousMonthAtDay, nextMonthAtDay } =
    useCalendarContext();
  const { setIsYearViewTasksModalVisible } = useAreModalsVisibleContext();
  const { setDateSelected } = useDateSelectedContext();

  // State
  const [weeksDays, setWeeksDays] = useState<string[][]>([]);
  const [currentWeek, setCurrentWeek] = useState<number>(0);

  useEffect(() => {
    const today = new Date(calendar.year, calendar.month, calendar.day);
    setCurrentWeek(getWeekIndexOfMonth(weeksDays, today));
  }, [weeksDays, calendar]);

  useEffect(() => {
    setWeeksDays(getWeeksOfMonth(calendar.year, calendar.month));
  }, [calendar.year]);

  const handleDayClick = (weekOfTheMonth: number, day: string) => {
    const dayCasted = Number(day);
    const datePosition = getDatePosition(weeksDays, weekOfTheMonth, dayCasted);

    switch (datePosition) {
      case "previousMonth":
        previousMonthAtDay(monthIndexProps, dayCasted);
        break;
      case "currentMonth":
        calendarDispatch({
          type: "SET_DATE",
          year: yearIndexProps || calendar.year,
          month: monthIndexProps,
          day: dayCasted,
        });
        break;
      case "nextMonth":
        nextMonthAtDay(monthIndexProps, dayCasted);
        break;
      default:
        console.error("Could not get the date position");
        break;
    }

    const clickedDate = new Date(calendar.year, monthIndexProps - 1, dayCasted);

    const taskFound = tasks.find(
      (task) => task.dueDate.getTime() === clickedDate.getTime()
    );

    if (taskFound && !yearIndexProps) {
      setDateSelected(clickedDate);
      setIsYearViewTasksModalVisible(true);
    }
  };

  const isTaskFound = (dayCasted: number, indexWeek: number): boolean => {
    return tasks.some(
      (task) =>
        task.dueDate.getTime() ===
          new Date(calendar.year, monthIndexProps - 1, dayCasted).getTime() &&
        getWeekIndexOfMonth(weeksDays, task.dueDate) === indexWeek
    );
  };

  return (
    <>
      {weeksDays.map((week, indexWeek) => (
        <WeekContainer key={indexWeek}>
          {week.map((day, j) => (
            <DayContainer
              key={j}
              onClick={() => handleDayClick(indexWeek, day)}
              $isTaskHere={
                !yearIndexProps && isTaskFound(Number(day), indexWeek)
              }
              $isCurrentDay={
                calendar.day === Number(day) &&
                calendar.month === monthIndexProps &&
                currentWeek === indexWeek
              }
              $isYearView={isYearView}
            >
              <h4>{day}</h4>
            </DayContainer>
          ))}
        </WeekContainer>
      ))}
    </>
  );
};

type MonthCalendarProps = {
  customCssProps: boolean;
  isYearView: boolean;
};

const MonthCalendar: React.FC<MonthCalendarProps> = ({
  customCssProps,
  isYearView,
}) => {
  // Context
  const { calendar } = useCalendarContext();

  // State
  const [privateMonth, setPrivateMonth] = useState<number>(calendar.month);
  const [privateYear, setPrivateYear] = useState<number>(calendar.year);

  useEffect(() => {
    setPrivateMonth(calendar.month);
    setPrivateYear(calendar.year);
  }, [calendar]);

  const getPrivateCurrentDate = (): Date =>
    new Date(privateYear, privateMonth, calendar.day);

  const previousMonth = () => {
    const currentDate = getPrivateCurrentDate();

    const newDate = subMonths(currentDate, 1);
    setPrivateYear(newDate.getFullYear());
    setPrivateMonth(
      newDate.getMonth() === -1
        ? 0
        : newDate.getMonth() === 0
        ? 12
        : newDate.getMonth()
    );
  };

  const nextMonth = () => {
    const currentDate = getPrivateCurrentDate();

    const newDate = addMonths(currentDate, 1);
    setPrivateYear(newDate.getFullYear());
    setPrivateMonth(newDate.getMonth() === 0 ? 1 : newDate.getMonth());
  };

  return (
    <MonthCalendarContainer $customCss={customCssProps}>
      <MonthCalendarHeader>
        <p>
          {getMonthByIndex(privateMonth)} {privateYear}
        </p>
        <ArrowsContainer $customCss={customCssProps}>
          <LeftArrowButton
            onClick={() => previousMonth()}
            src="https://cdn-icons-png.flaticon.com/512/271/271228.png"
          />
          <RightArrowButton
            onClick={() => nextMonth()}
            src="https://cdn-icons-png.flaticon.com/512/271/271228.png"
          />
        </ArrowsContainer>
      </MonthCalendarHeader>

      <DaysLetterContainer>
        {daysLetterWeek.map((dayLetter, i) => (
          <h4 key={i}> {dayLetter}</h4>
        ))}
      </DaysLetterContainer>

      <MonthBody
        yearIndexProps={privateYear}
        monthIndexProps={privateMonth}
        isYearView={isYearView}
      />
    </MonthCalendarContainer>
  );
};

export { MonthCalendar, MonthBody };
