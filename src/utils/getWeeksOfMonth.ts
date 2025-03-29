import {
  eachDayOfInterval,
  startOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format,
} from "date-fns";

export const getDatePosition = (
  weeks: string[][],
  weekIndex: number,
  dayIndex: number
): string => {
  let datePosition = "previousMonth";

  for (let currWeekIndex = 0; currWeekIndex < weeks.length; currWeekIndex++) {
    const week = weeks[currWeekIndex];
    for (let j = 0; j < week.length; j++) {
      const dayCasted = Number(week[j]);

      if (dayCasted === 1 && datePosition === "currentMonth")
        datePosition = "nextMonth";
      else if (dayCasted === 1 && datePosition === "previousMonth")
        datePosition = "currentMonth";

      if (weekIndex === currWeekIndex && dayIndex === dayCasted)
        return datePosition;
    }
  }

  return "";
};

export const getWeekIndexOfMonth = (
  weeksDays: string[][],
  calendarDate: Date
): number => {
  let isCurrentMonthDate = false;
  let foundWeekIndex = 0;

  weeksDays.forEach((weekDays, weekIndex) => {
    weekDays.forEach((day) => {
      const dayCasted = Number(day);

      if (dayCasted === 1) isCurrentMonthDate = !isCurrentMonthDate;
      console.log("dayCasted", dayCasted);

      if (isCurrentMonthDate) {
        const currentDate = new Date(
          calendarDate.getFullYear(),
          calendarDate.getMonth(),
          dayCasted
        );

        if (calendarDate.getTime() === currentDate.getTime())
          foundWeekIndex = weekIndex;
      }
    });
  });

  return foundWeekIndex;
};

const getWeeksOfMonth = (year: number, month: number): string[][] => {
  const monthStart = startOfMonth(new Date(year, month - 1, 1));
  const firstWeekStart = startOfWeek(monthStart, { weekStartsOn: 1 });

  let weeks: string[][] = [];

  for (let i = 0; i < 6; i++) {
    const weekStart = addDays(firstWeekStart, i * 7);
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });

    weeks.push(
      eachDayOfInterval({ start: weekStart, end: weekEnd }).map((date) =>
        format(date, "dd")
      )
    );
  }

  return weeks;
};

export default getWeeksOfMonth;
