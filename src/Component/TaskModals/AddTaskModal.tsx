import { useState, useRef, useReducer, useEffect } from "react";
import { format } from "date-fns";
import styled from "styled-components";
import Radio from "../Radio";
import { getFilteredMonth, getMonthByIndex } from "../../utils/getMonth";
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
  width: 30%;
  background-color: #17181B;
  z-index: 9;
    text-align: left;
  }
`;

const HeaderContainer = styled.div`
  padding: 10px;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
  &:hover {
    cursor: move;
    background-color: lightgrey;
  }
`;

const ExitButton = styled.img`
  filter: invert(1);
  width: 20px;
`;

const TitleTaskInput = styled.input`
  height: 30px;
  position: relative;
  width: 85%;
  left: 60px;
  background-color: #17181b;
  border: 0;
  font-size: 25px;
  margin-bottom: 10px;
  &:placeholder {
  }
`;

const TimeSettingsContainerLink = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  img {
    position: relative;
    margin-right: 20px;
    left: 20px;
    width: 20px;
    height: 20px;
  }
`;

const DateLink = styled.p`
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

const HourLink = styled.p`
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

const RecurringLink = styled.p`
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
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

const MonthCalendarWrapper = styled.div.attrs(() => ({
  tabIndex: -1,
}))`
  .month-calendar-container {
  }

  .month-calendar-header {
    justify-content: space-between;
  }

  .month-calendar-weeks {
    background-color: #0f1110;
  }
`;

const LeftImagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 70px;
  justify-content: space-between;
  height: 100%;
`;

const ClockImg = styled.img`
  width: 20px;
  filter: invert(1);
  position: relative;
  top: 20px;
`;

const DescriptionImg = styled.img`
  filter: invert(1);
  width: 25px;
`;

const StyledTextArea = styled.textarea`
  border: 0;
`;

const DateInput = styled.input`
  background-color: #292b2c;
  height: 40px;
  border: 0;
  border-radius: 5px;
  &::placeholder {
    text-align: center;
    padding-left: 20px;
  }
`;
const HourInput = styled.input`
  background-color: #292b2c;
  height: 40px;

  border: 0;
  border-radius: 5px;
  &:placeholder {
    padding-left: 20px;
  }
`;

const AddTask = () => {
  const { calendar } = useCalendarContext();
  const { addTask } = useTasksContext();
  const { isAddTaskModalVisible, setIsAddTaskModalVisible } =
    useAreModalsVisibleContext();
  const [isTaskReady, setIsTaskReady] = useState<boolean>(false);
  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const hourInputRef = useRef<HTMLInputElement | null>(null);
  const recurringSelectorRef = useRef<HTMLSelectElement | null>(null);
  const monthCalendarModalRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    setDateInput(
      `${calendar.day} ${getMonthByIndex(calendar.month)} ${calendar.year}`
    );
  }, [calendar.day]);

  useEffect(() => {
    const newFormattedHour = getFormattedHour(task.hour);
    setFormattedHour(newFormattedHour);
    setHourInput(newFormattedHour);

    const newFormattedDate = format(task.dueDate, "d MMMM yyyy");
    setFormattedDate(newFormattedDate);
    setDateInput(newFormattedDate);
  }, [isAddTaskModalVisible]);

  useEffect(() => {
    if (isMonthCalendarVisible && monthCalendarModalRef.current)
      monthCalendarModalRef.current.focus();
  }, [isMonthCalendarVisible]);

  return (
    <MainContainer>
      <HeaderContainer>
        <ExitButton
          alt="exitButton"
          src="https://cdn2.iconfinder.com/data/icons/e-commerce-line-10-1/1024/close10-64.png"
          onClick={() => setIsAddTaskModalVisible(false)}
        />
      </HeaderContainer>
      <ChildContainer>
        <Form
          onSubmit={(e: any) => {
            e.preventDefault();
            handleSubmitTask();
          }}
        >
          <TitleTaskInput
            type="text"
            value={task.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Add a title"
            autoFocus
          />
        </Form>
        <div
          onClick={() => {
            !isDateContainerClicked && setIsDateContainerClicked(true);
          }}
        >
          {!isDateContainerClicked ? (
            <>
              <TimeSettingsContainerLink>
                <LeftImagesContainer>
                  <ClockImg src="https://cdn-icons-png.flaticon.com/512/3114/3114812.png" />
                  <DescriptionImg src="https://www.svgrepo.com/show/532195/menu.svg" />
                </LeftImagesContainer>
                <DateLink onClick={() => setIsMonthCalendarVisible(true)}>
                  {dateInput}
                </DateLink>
                <HourLink onClick={() => hourInputRef.current?.focus()}>
                  {hourInput}
                </HourLink>
                <RecurringLink
                  onClick={() => recurringSelectorRef.current?.focus()}
                >
                  Only one time
                </RecurringLink>
              </TimeSettingsContainerLink>
            </>
          ) : (
            <>
              <TimeSettingsContainerLink>
                <LeftImagesContainer>
                  <ClockImg src="https://cdn-icons-png.flaticon.com/512/3114/3114812.png" />
                  <DescriptionImg src="https://www.svgrepo.com/show/532195/menu.svg" />
                </LeftImagesContainer>
                <DateInput
                  type="text"
                  ref={dateInputRef}
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  onBlur={() => handleOnBlurDate()}
                />

                {!task.isAllDay && (
                  <HourInput
                    ref={hourInputRef}
                    type="text"
                    value={hourInput}
                    onChange={(e) => setHourInput(e.target.value)}
                    onBlur={() => handleOnBlurHour()}
                  />
                )}

                {isMonthCalendarVisible && (
                  <MonthCalendarWrapper
                    ref={monthCalendarModalRef}
                    onBlur={() => {
                      dateInputRef.current === document.activeElement &&
                        setIsMonthCalendarVisible(false);
                    }}
                  >
                    <MonthCalendar />
                  </MonthCalendarWrapper>
                )}
              </TimeSettingsContainerLink>

              <select
                ref={recurringSelectorRef}
                onChange={(e) => setRecurringValue(e.target.value)}
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
        <StyledTextArea
          onChange={(e) => handleDescriptionChange(e.target.value)}
          value={task.description}
          placeholder="Add a description"
        ></StyledTextArea>
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
      </ChildContainer>
    </MainContainer>
  );
};

export default AddTask;
