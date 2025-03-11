const getFormattedHour = (hour: number) => {
    if (hour > 0 && hour < 12) return `${hour} AM`;
    else if (hour === 12) return `${hour} PM`;
    else if (hour > 12) return `${hour - 12} PM`;
  };
  
  export default getFormattedHour;
  