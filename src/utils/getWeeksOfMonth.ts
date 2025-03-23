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
  let foundWeekIndex = 0;

  weeks.forEach((week, weekIndex) => {
    week.forEach((day) => {
      const dayCasted = Number(day);

      if (dayCasted === 1) isCurrentMonthDate = !isCurrentMonthDate;

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
