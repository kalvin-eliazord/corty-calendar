export type CalendarType = {
  year: number;
  month: number;
  day: number;
};

export type CalendarAction =
  | { type: "SET_YEAR"; state: number }
  | { type: "NEXT_YEAR" }
  | { type: "PREVIOUS_YEAR" }
  | { type: "SET_MONTH"; state: number }
  | { type: "NEXT_MONTH" }
  | { type: "PREVIOUS_MONTH" }
  | { type: "SET_DAY"; state: number }
  | { type: "NEXT_DAY" }
  | { type: "PREVIOUS_DAY" };

const calendarReducer = (
  state: CalendarType,
  action: CalendarAction
): CalendarType => {
  switch (action.type) {
    case "SET_YEAR":
      return { ...state, year: action.state };
    case "NEXT_YEAR":
      return { ...state, year: state.year + 1 };
    case "PREVIOUS_YEAR":
      return { ...state, year: state.year - 1 };
    case "SET_MONTH":
      return { ...state, month: action.state };
    case "NEXT_MONTH":
      return state.month > 11
        ? { ...state, month: 1, year: state.year + 1 }
        : { ...state, month: state.month + 1 };
    case "PREVIOUS_MONTH":
      return state.month < 2
        ? { ...state, month: 12, year: state.year - 1 }
        : { ...state, month: state.month - 1 };
    case "SET_DAY":
      return { ...state, day: action.state };
    case "NEXT_DAY":
      return { ...state, day: state.day + 1 };
    case "PREVIOUS_DAY":
      return { ...state, day: state.day - 1 };
    default:
      return state;
  }
};

export { calendarReducer };
