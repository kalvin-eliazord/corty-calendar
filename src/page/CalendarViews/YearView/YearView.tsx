import { MonthBody } from "../../../component/MonthCalendar/MonthCalendar";
import { getMonthByIndex } from "../../../utils/getMonth";
import { CalendarContainer } from "../MonthView/MonthView.styles";
import {
  MonthContainer,
  MonthNameContainer,
  YearContainer,
} from "./YearView.styles";

const numberOfMonth = Array.from({ length: 12 }, (_, i) => i);
const YearView = () => {
  return (
    <CalendarContainer>
      <YearContainer>
        {numberOfMonth.map((month) => (
          <MonthContainer key={month}>
            <MonthNameContainer>
              {getMonthByIndex(month + 1)}
            </MonthNameContainer>
            <MonthBody monthIndexProps={month + 1} />
          </MonthContainer>
        ))}
      </YearContainer>
    </CalendarContainer>
  );
};

export default YearView;
