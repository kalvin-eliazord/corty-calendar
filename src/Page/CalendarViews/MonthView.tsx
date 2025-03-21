//import styled from "styled-components";
import { CalendarContainer } from "../../component/MonthCalendar/MonthCalendar";

type MonthViewProps = {
  monthRangeProps: number;
};
const MonthView: React.FC<MonthViewProps> = ({ monthRangeProps }) => {
  return <CalendarContainer $displayType="block">Month page </CalendarContainer>;
};

export default MonthView;
