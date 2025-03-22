import {
  eachDayOfInterval,
  startOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format,
} from "date-fns";

export const getWeekIndexOfMonth = (
  weeks: string[][],
  calendarDate: Date
): number => {
  let isCurrentMonthDate = false;

  for (let weekIndex = 0; weekIndex < weeks.length; weekIndex++) {
    const week = weeks[weekIndex];
    for (let j = 0; j < week.length; j++) {
      const day = week[j];
      if (Number(day) === 1) isCurrentMonthDate = !isCurrentMonthDate;

      if (isCurrentMonthDate) {
        const currentDate = new Date(
          calendarDate.getFullYear(),
          calendarDate.getMonth(),
          Number(day)
        );

        if (calendarDate.getTime() === currentDate.getTime()) return weekIndex;
      }
    }
  }

  return 0;
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
