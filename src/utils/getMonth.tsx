const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  
  const getMonthByIndex = (monthIndex: number): string => months[monthIndex - 1];
  const getFilteredMonth = (value: string): null | string => {
    for (const month of months) {
      let isFound = true;
      for (let j = 0; j < month.length; j++) {
        if (month[j] !== value[j]) {
          isFound = false;
          break;
        }
      }
      if (isFound) return month;
    }
  
    return null;
  };
  export { getMonthByIndex, getFilteredMonth };
  