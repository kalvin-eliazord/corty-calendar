import styled from "styled-components";
import { CalendarContainer } from "../../../component/MonthCalendar/MonthCalendar";

// 1* month div -> 5* week div -> 7* day div
const MonthCalendarContainer = styled.div``
type MonthViewProps = {
  monthRangeProps: number;
};
const MonthView: React.FC<MonthViewProps> = ({ monthRangeProps }) => {
  return <CalendarContainer >Month page </CalendarContainer>;
};

export default MonthView;

