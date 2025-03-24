const getFormattedHour = (hour: number): string => {
  if (hour === 0) return "12 AM";
  else if (hour < 12) return `${hour} AM`;
  else if (hour === 12) return `${hour} PM`;
  else if (hour > 12) return `${hour - 12} PM`;

  return "";
};

const getNonFormattedHour = (hourValue: number, hourFormat: string): number => {
  if (hourFormat.trim() === "AM") {
    return hourValue === 12 ? 0 : hourValue;
  } else {
    return hourValue === 12 ? hourValue : hourValue + 12;
  }
};

export { getFormattedHour, getNonFormattedHour };
