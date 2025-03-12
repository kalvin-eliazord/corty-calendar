const getFormattedHour = (hour: number | null): string => {
  if (hour === null) return "";
  else if (hour < 12) return `${hour} AM`;
  else if (hour === 12) return `${hour} PM`;
  else if (hour > 12) return `${hour - 12} PM`;

  return "";
};

const getNonFormattedHour = (hourValue: number, hourFormat: string): number => {
  if (hourFormat === "AM") {
    return hourValue === 12 ? 0 : hourValue;
  } else {
    return hourValue === 12 ? hourValue : hourValue + 12;
  }
};

export { getFormattedHour, getNonFormattedHour };
