import styled from "styled-components"
import DayView from "../CalendarViews/DayView";

const WeekContainer = styled.div`
display:flex;
justify-content:space-between;


`
const daysView = Array.from({length:7}, (_, i) => i);

const WeekView = () => {

  return (
    <WeekContainer>
    {daysView.map((dayView, i)  => <DayView key={i}/>)}
    </WeekContainer>
  )
};

export default WeekView;
