import { useState, useReducer, useEffect } from "react";
import { format } from "date-fns";
import styled from "styled-components";
import Radio from "../Radio";
import { getFilteredMonth } from "../../utils/getMonth";
import {
  getFormattedHour,
  getNonFormattedHour,
} from "../../utils/getFormattedHour";
import { Task, taskReducer, useTasksContext } from "../../context/TasksContext";
import { useCalendarContext } from "../../context/CalendarContext";
import { useAreModalsVisibleContext } from "../../context/ModalsContext";
import { MonthCalendar } from "../MonthCalendar";

const MainContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50vh;
  background-color: #17191a;
  z-index: 2;
  overflow-y:hidden;
  border-radius: 30px;
    font-weight: 500;
    color: white;
    text-align: center;
  }
`;

const DateLink = styled.p`
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

const HeaderContainer = styled.div`
  height: 50px;
  &:hover {
    cursor: move;
    background-color: lightgrey;
  }
  :10% ;
  background-color: lightblue;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const RadioContainer = styled.div`
  display: flex;
`;

const ItemsContainer = styled.ul`
  display: flex;
  li {
    margin-right: 40px;
  }
`;

const Footer = styled.div`
  text-align: center;

  button {
    margin-right: 50px;
  }
`;

const ChildContainer = styled.div`
  max-width: 500px;
  margin: auto;
  padding-top
`;

const MonthCalendarWrapper = styled.div`
  .month-calendar-container {
    display: flex;
    flex-direction: row;
    background-color: pink;
    position: absolute;
    z-index: 2;
  }

  .month-calendar-header {
    background-color: red;
    transform: translate(-0%, 10%);
  }

  .month-calendar-weeks {

    background-color: yellow;
  }
`;

const DateInput = styled.input``;
const HourInput = styled.input``;

const AddTask = () => {
  const { calendar } = useCalendarContext();
  const { addTask } = useTasksContext();
  const { isAddTaskModalVisible, setIsAddTaskModalVisible } =
    useAreModalsVisibleContext();
  const [isTaskReady, setIsTaskReady] = useState<boolean>(false);
  const [isDateFocused, setIsDateFocused] = useState(false);
  const [isHourFocused, setIsHourFocused] = useState(false);
  const [isRecurringFocused, setIsRecurringFocused] = useState(false);
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [dateInput, setDateInput] = useState<string>("");
  const [formattedHour, setFormattedHour] = useState<string>("");
  const [hourInput, setHourInput] = useState<string>("");
  const [recurringValue, setRecurringValue] = useState<string>("oneTime");
  const [isMonthCalendarVisible, setIsMonthCalendarVisible] =
    useState<boolean>(false);
  const [isDateContainerClicked, setIsDateContainerClicked] =
    useState<boolean>(false);
  const [task, taskDispatch] = useReducer(taskReducer, {
    id: crypto.randomUUID(),
    title: "",
    description: "",
    isAllDay: false,
    hour: calendar.hour,
    complexity: 1,
    priority: 1,
    dueDate: new Date(calendar.year, calendar.month - 1, calendar.day),
    checks: [],
    labels: [],
    isDone: false,
  } as Task);

  useEffect(() => {
    if (!isTaskReady) return;

    addTask(task, recurringValue);
    setIsTaskReady(false);
    setIsAddTaskModalVisible(false);
  }, [task.title]);

  const handleSubmitTask = (): void => {
    taskDispatch({
      type: "SET_TITLE",
      state: task.title === "" ? "No title" : task.title.trim(),
    });

    setIsTaskReady(true);
  };

  const handleTitleChange = (titleInputValue: string): void => {
    if (!titleInputValue || !titleInputValue.trim()) return;

    taskDispatch({ type: "SET_TITLE", state: titleInputValue });
  };

  const handleDescriptionChange = (descriptionInputValue: string): void => {
    if (!descriptionInputValue || !descriptionInputValue.trim()) return;

    taskDispatch({
      type: "SET_DESCRIPTION",
      state: descriptionInputValue.trim(),
    });
  };

  const handleIsAllDayChange = () => {
    taskDispatch({ type: "SET_IS_ALL_DAY", state: !task.isAllDay });
  };

  const handleOnBlurHour = () => {
    if (!hourInput || !hourInput.trim()) {
      setHourInput(formattedHour);
      return;
    }

    const hourNoSpace = hourInput.replace(/\s+/g, "");
    const hourValue = hourNoSpace.slice(0, Number(hourNoSpace[1]) >= 0 ? 2 : 1);
    const hourValueCasted = Number(hourValue);
    if (!hourValueCasted || hourValueCasted < 0 || hourValueCasted > 12) {
      setHourInput(formattedHour);
      return;
    }

    const hourFormat = hourNoSpace.slice(hourValue.length).toUpperCase();
    if (
      (hourFormat !== "AM" && hourFormat !== "PM") ||
      (hourFormat === "AM" && hourValueCasted > 12) ||
      (hourFormat === "PM" && hourValueCasted > 12)
    ) {
      setHourInput(formattedHour);
      return;
    }

    setHourInput(`${hourValue} ${hourFormat}`);
    taskDispatch({
      type: "SET_HOUR",
      state: getNonFormattedHour(hourValueCasted, hourFormat),
    });
  };

  const handleOnBlurDate = () => {
    if (!dateInput || !dateInput.trim()) {
      setDateInput(formattedDate);
      return;
    }

    const dateNoSpace = dateInput.replace(/\s+/g, "");
    const day = dateNoSpace.slice(0, Number(dateNoSpace[1]) >= 0 ? 2 : 1);
    if (!Number(day)) {
      setDateInput(formattedDate);
      return;
    }

    const month = getFilteredMonth(dateNoSpace.slice(day.length));
    if (!month) {
      setDateInput(formattedDate);
      return;
    }

    const year = dateNoSpace.slice(day.length + month.length);
    if (!year) {
      setDateInput(formattedDate);
      return;
    }

    const date = new Date(`${day}-${month}-${year}`);
    if (!date.getTime()) {
      setDateInput(formattedDate);
      return;
    }

    setDateInput(`${day} ${month} ${year}`);
    taskDispatch({ type: "SET_DUE_DATE", state: date });
  };

  const handleAutoFocus = (elementName: string): void => {
    switch (elementName) {
      case "date":
        setIsDateFocused(true);
        break;
      case "hour":
        setIsHourFocused(true);
        break;
      case "recurring":
        setIsRecurringFocused(true);
        break;
    }
  };

  const handleDateInputFocus = () => {
    setIsMonthCalendarVisible(true);
  };

  useEffect(() => {
    const newFormattedHour = getFormattedHour(task.hour);
    setFormattedHour(newFormattedHour);
    setHourInput(newFormattedHour);

    const newFormattedDate = format(task.dueDate, "d MMMM yyyy");
    setFormattedDate(newFormattedDate);
    setDateInput(newFormattedDate);
  }, [isAddTaskModalVisible]);

  return (
    <MainContainer>
      <HeaderContainer />
      <h2> Add Task </h2>
      <ChildContainer>
        <Form
          onSubmit={(e: any) => {
            e.preventDefault();
            handleSubmitTask();
          }}
        >
          <input
            type="text"
            value={task.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Insert title"
            autoFocus
          />
        </Form>
        <div
          onClick={() => {
            !isDateContainerClicked && setIsDateContainerClicked(true);
            handleAutoFocus("date");
          }}
        >
          {!isDateContainerClicked ? (
            <>
              <DateLink onClick={() => handleAutoFocus("date")}>
                {dateInput}
              </DateLink>
              <DateLink onClick={() => handleAutoFocus("hour")}>
                {hourInput}
              </DateLink>
              <DateLink onClick={() => handleAutoFocus("recurring")}>
                Only one time
              </DateLink>
            </>
          ) : (
            <>
              <DateInput
                type="text"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                onFocus={handleDateInputFocus}
                onBlur={() => handleOnBlurDate()}
                autoFocus={isDateFocused}
              />
              {isMonthCalendarVisible && (
                <MonthCalendarWrapper>
                  <MonthCalendar />
                </MonthCalendarWrapper>
              )}

              {!task.isAllDay && (
                <HourInput
                  type="text"
                  value={hourInput}
                  onChange={(e) => setHourInput(e.target.value)}
                  onBlur={() => handleOnBlurHour()}
                  autoFocus={isHourFocused}
                />
              )}
              <select
                onChange={(e) => setRecurringValue(e.target.value)}
                autoFocus={isRecurringFocused}
              >
                <option value="oneTime">Only one time</option>
                <option value="everyDay"> Everyday </option>
                <option value="everyWeek"> Every week</option>
                <option value="everyMonth">Every month</option>
                <option value="everyYear">Every year</option>
              </select>

              <label htmlFor="checkbox"> All day </label>
              <input
                id="checkbox"
                type="checkbox"
                checked={task.isAllDay}
                onChange={() => handleIsAllDayChange()}
              />
            </>
          )}
        </div>
        <textarea
          onChange={(e) => handleDescriptionChange(e.target.value)}
          value={task.description}
          placeholder="Add a description"
        ></textarea>
        <Radio
          name={"Priority"}
          setRadio={(priority: string) =>
            taskDispatch({ type: "SET_PRIORITY", state: priority })
          }
          radioChecked={task.priority}
        />

        <Radio
          name={"Complexity"}
          setRadio={(complexity: string) =>
            taskDispatch({ type: "SET_COMPLEXITY", state: complexity })
          }
          radioChecked={task.complexity}
        />

        <Form>
          <div>
            <div>{task.checks.map((check) => check.name)}</div>
            <input
              type="text"
              onChange={(e) =>
                taskDispatch({ type: "ADD_CHECK", state: e.target.value })
              }
              placeholder="Add a check"
            />
          </div>
        </Form>
        <Form>
          <div>
            <div>{task.labels.map((label) => label.name)}</div>
            <input
              type="text"
              onChange={(e) =>
                taskDispatch({ type: "ADD_LABEL", state: e.target.value })
              }
              placeholder="Add label"
            />
          </div>
        </Form>
        <button onClick={() => handleSubmitTask()}> confirm </button>
        <button onClick={() => setIsAddTaskModalVisible(false)}> X </button>
      </ChildContainer>
    </MainContainer>
  );
};

export default AddTask;
