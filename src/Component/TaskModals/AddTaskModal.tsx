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
import formattedHours from "../../utils/formattedHours";

const MainContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  background-color: #1e1e21;
  z-index: 9;
  text-align: left;
  border-radius: 20px;
  overflow-y: auto;
  overflow-x: hidden;
  color: #e2e3e2;
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
  &:hover {
    cursor: pointer;
  }
`;

const TitleTaskInput = styled.input`
  height: 30px;
  position: relative;
  width: 67%;
  color: #e2e3e2;
  left: 80px;
  background-color: #1e1e21;
  border: 0;
  font-size: 25px;
  margin-bottom: 10px;
  border-bottom: 2px solid grey;
  &:focus {
    outline: 0;
    border-bottom: 2px solidrgb(22, 85, 187);
  }
  &::placeholder {
    color: #777472;
    padding-left: 10px;
  }
`;

const TimeSettingsContainerLink = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  height: 100px;
  color: #e2e3e2;
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

const AddItemsContainer = styled.div`
  margin-left: 80px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;

  div {
    position: relative;
    top: 27px;
    display: flex;
    flex-direction: row;
    gap: 10px;
    padding-left: 5px;
  }
`;

const ItemsContainer = styled.div``;

const ItemInput = styled.input`
  overflow-x: scroll;
  margin-bottom: 10px;
  color: white;

  border: 0;
  width: 85%;
  height: 40px;
  background-color: #292b2c;
  border-radius: 5px;
  height: 65px;
  span {
    color: #777472;
  }
  &:hover {
    cursor: text;
  }
  &::placeholder {
    padding-left: 10px;
    color: #777472;
  }
`;

const ItemInputContainer = styled.div<{
  $nbOfLettersItem: number;
  $nbOfItemPadding: number;
}>`
  overflow-x: scroll;
  margin-bottom:10px;
  
  border: 0;
  width: 85%;
  height: 40px;
  text-indent: ${({ $nbOfLettersItem, $nbOfItemPadding }) =>
    `${$nbOfLettersItem * 10 + $nbOfItemPadding}px;`}

  background-color: #292b2c;
  border-radius: 5px;
  height:65px;
  span{
  color:#777472;
  }
  &:hover{
  cursor:text;
  }
  &::placeholder {
    padding-left: 10px;
  }

`;

const ItemContainer = styled.div`
  border: 1px solid white;
  background-color: #013a5f;
  border-radius: 5px;
  padding: 5px;
  &:hover {
    cursor: pointer;
    background-color: lightred;
  }
`;

const ChildContainer = styled.div`
  max-width: 500px;
  margin: auto;
  padding-top
`;

const MonthCalendarWrapper = styled.div`
  .month-calendar-container {
  }

  .month-calendar-header {
    justify-content: space-between;
  }

  .month-calendar-weeks {
    background-color: #0f1110;
  }
`;

const ClockImg = styled.img`
  width: 20px;
  filter: invert(1);
  position: relative;
  top: 5px;
  padding-inline: 10px;
`;

const DescriptionImg = styled.img`
  filter: invert(1);
  width: 25px;
  padding-inline: 30px;
  position: relative;
  bottom: 40px;
`;

const DescriptionTextArea = styled.textarea`
  border: 0;
  resize: none;
  color: #e2e3e2;
  width: 67%;
  padding-top: 20px;
  padding-bottom: 20px;
  background-color: #292b2c;
  border-radius: 5px;

  &::placeholder {
    padding-left: 10px;
    color: #777472;
    font-weight: bold;
  }

  &:focus {
    outline: 0;
    border-bottom: 2px solid #093377;
  }
`;

const DateInput = styled.input.attrs(() => ({
  tabIndex: -2,
}))`
  background-color: #333436;
  height: 40px;
  border: 0;
  color: #e2e3e2;
  border-radius: 5px;

  &::placeholder {
    text-align: center;
    padding-left: 20px;
  }
`;

const HourInput = styled.input.attrs(() => ({
  tabIndex: -3,
}))`
  color: #e2e3e2;
  background-color: #333436;
  height: 40px;
  border: 0;
  border-radius: 5px;

  &:placeholder {
    padding-left: 20px;
  }
`;

const StyledSelect = styled.select`
  position: relative;
  left: 18%;
  bottom: 40px;
  border: 0;
  border-radius: 5px;
  background-color: #333436;
  color: white;
`;

const AllDayContainer = styled.div`
  position: relative;
  left: 55%;
  bottom: 60px;
  border: 0;
  border-radius: 5px;

  &:hover {
    cursor: pointer;
  }

  input {
    border: 1px solid white;
    accent: #333436;
    background-color: #333436;
    color: #333436;
  }
`;

const HoursDropDown = styled.div`
  position: absolute;
  left: 55%;
  top: 22%;
  width: 140px;
  height: 200px;
  overflow-y: scroll;
  background-color: #0f1110;
  z-index: 55;
  border-radius: 5px;
  display: flex;
  flex-direction: column;

  div {
    padding: 10px;
    &:hover {
      background-color: grey;
    }
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-block: 40px;
  text-align: right;

  div {
    padding-inline: 12px;
    padding-block: 5px;
    background-color: #8dc3f8;
    color: blue;
    border-radius: 20px;
    margin-right: 50px;

    &:hover {
      cursor: pointer;
    }
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
  const [isMonthCalendarMouseOn, setIsMonthCalendarMouseOn] =
    useState<boolean>(false);
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [dateInput, setDateInput] = useState<string>("");
  const [descriptionInput, setDescriptionInput] = useState<string>("");
  const [formattedHour, setFormattedHour] = useState<string>("");
  const [hourInput, setHourInput] = useState<string>("");
  const [recurringValue, setRecurringValue] = useState<string>("oneTime");
  const [checkInput, setCheckInput] = useState<string>("");
  const [labelInput, setLabelInput] = useState<string>("");
  const [taskTitleInput, setTaskTitleInput] = useState<string>("");

  const [isHourDropDownVisible, setIsHourDropDownVisible] =
    useState<boolean>(false);
  const [isMonthCalendarVisible, setIsMonthCalendarVisible] =
    useState<boolean>(false);
  const [isDateContainerClicked, setIsDateContainerClicked] =
    useState<boolean>(false);
  const [nbOfLettersCheck, setNbOfLettersCheck] = useState<number>(0);
  const [nbOfLettersLabel, setNbOfLettersLabel] = useState<number>(0);
  const checkInputContainerRef = useRef<HTMLDivElement | null>(null);
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
  }, [isTaskReady]);

  const handleSubmitTask = (): void => {
    taskDispatch({
      type: "SET_TITLE",
      state: task.title === "" ? "No title" : task.title.trim(),
    });

    setDescriptionTask();

    setIsTaskReady(true);
  };

  const handleTitleChange = (titleInputValue: string): void => {
    if (!titleInputValue || !titleInputValue.trim()) return;

    taskDispatch({ type: "SET_TITLE", state: titleInputValue });
  };

  const setDescriptionTask = (): void => {
    if (!descriptionInput || !descriptionInput.trim()) return;

    taskDispatch({
      type: "SET_DESCRIPTION",
      state: descriptionInput.trim(),
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
    if (!isMonthCalendarMouseOn) setIsMonthCalendarVisible(false);

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
    if (!year || year.length === 3 || year.length < 2) {
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
    setIsMonthCalendarVisible(false);
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
    if (
      isDateContainerClicked &&
      dateInputRef.current &&
      isMonthCalendarVisible
    )
      dateInputRef.current?.focus();
  }, [isDateContainerClicked]);

  useEffect(() => {
    if (isDateContainerClicked && hourInputRef.current && isHourDropDownVisible)
      hourInputRef.current?.focus();
  }, [isHourDropDownVisible]);

  const handleClickModal = () => {
    if (isMonthCalendarVisible) {
      isDateContainerClicked &&
        dateInputRef.current !== document.activeElement &&
        !isMonthCalendarMouseOn &&
        setIsMonthCalendarVisible(false);
    } else if (isHourDropDownVisible) {
      isDateContainerClicked &&
        hourInputRef.current !== document.activeElement &&
        setIsHourDropDownVisible(false);
    }
  };

  const handleFormattedHourClick = (formattedHour: string) => {
    setHourInput(formattedHour);
    setIsHourDropDownVisible(false);
  };

  useEffect(() => {
    if (task.labels.length < 1) return;

    setLabelInput("");
    setNbOfLettersLabel(
      (prev) => prev + task.labels[task.labels.length - 1].name.length
    );
  }, [task.labels]);

  useEffect(() => {
    if (task.checks.length < 1) return;

    setCheckInput("");
    setNbOfLettersCheck(
      (prev) => prev + task.checks[task.checks.length - 1].name.length
    );
  }, [task.checks]);

  const handleCheckSubmit = (e: any) => {
    e.preventDefault();
    taskDispatch({ type: "ADD_CHECK", state: checkInput });
  };

  const handleLabelSubmit = (e: any) => {
    e.preventDefault();
    taskDispatch({ type: "ADD_LABEL", state: labelInput });
  };

  const handleItemInputKeyDown = (e: any) => {
    setCheckInput(e.target.value);

    if (e.key === "Enter") {
      e.preventDefault();
      setCheckInput(" ");
    }
  };

  return (
    <MainContainer onClick={() => handleClickModal()}>
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
            value={taskTitleInput}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Add a title"
            autoFocus
          />
        </Form>

        {!isDateContainerClicked ? (
          <>
            <TimeSettingsContainerLink
              onClick={() => setIsDateContainerClicked(true)}
            >
              <ClockImg src="https://cdn-icons-png.flaticon.com/512/3114/3114812.png" />
              <DateLink onClick={() => setIsMonthCalendarVisible(true)}>
                {dateInput}
              </DateLink>
              <HourLink onClick={() => setIsHourDropDownVisible(true)}>
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
              <ClockImg src="https://cdn-icons-png.flaticon.com/512/3114/3114812.png" />

              <DateInput
                type="text"
                ref={dateInputRef}
                value={dateInput}
                onClick={() => setIsMonthCalendarVisible(true)}
                onChange={(e) => setDateInput(e.target.value)}
                onBlur={() => handleOnBlurDate()}
              />

              {!task.isAllDay && (
                <HourInput
                  ref={hourInputRef}
                  type="text"
                  value={hourInput}
                  onClick={() => setIsHourDropDownVisible(true)}
                  onChange={(e) => setHourInput(e.target.value)}
                  onBlur={() => handleOnBlurHour()}
                />
              )}
              {isHourDropDownVisible && (
                <HoursDropDown>
                  {formattedHours.map((formattedHour) => (
                    <div
                      key={formattedHour}
                      onClick={() => handleFormattedHourClick(formattedHour)}
                    >
                      {formattedHour}
                    </div>
                  ))}
                </HoursDropDown>
              )}

              {isMonthCalendarVisible && (
                <MonthCalendarWrapper
                  ref={monthCalendarModalRef}
                  onMouseEnter={() => setIsMonthCalendarMouseOn((prev) => true)}
                  onMouseLeave={() =>
                    setIsMonthCalendarMouseOn((prev) => false)
                  }
                >
                  <MonthCalendar />
                </MonthCalendarWrapper>
              )}
            </TimeSettingsContainerLink>

            <StyledSelect
              ref={recurringSelectorRef}
              onChange={(e) => setRecurringValue(e.target.value)}
            >
              <option value="oneTime">Only one time</option>
              <option value="everyDay"> Everyday </option>
              <option value="everyWeek"> Every week</option>
              <option value="everyMonth">Every month</option>
              <option value="everyYear">Every year</option>
            </StyledSelect>

            <AllDayContainer>
              <label htmlFor="checkbox"> All day </label>
              <input
                id="checkbox"
                type="checkbox"
                checked={task.isAllDay}
                onChange={() => handleIsAllDayChange()}
              />
            </AllDayContainer>
          </>
        )}
        <DescriptionImg src="https://www.svgrepo.com/show/532195/menu.svg" />
        <DescriptionTextArea
          onChange={(e) => setDescriptionInput(e.target.value)}
          value={descriptionInput}
          placeholder="Add a description"
        ></DescriptionTextArea>
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
        <AddItemsContainer>
          <Form onSubmit={(e) => handleCheckSubmit(e)}>
            <ItemInputContainer
              onFocus={() => setCheckInput("")}
              $nbOfLettersItem={0}
              $nbOfItemPadding={0}
              contentEditable="true"
              onKeyDown={(e: any) => handleItemInputKeyDown(e)}
            >
              {task.checks.map((check) => (
                <ItemContainer key={check.id}> {check.name}</ItemContainer>
              ))}
            </ItemInputContainer>
          </Form>

          <Form onSubmit={(e) => handleLabelSubmit(e)}>
            <div>
              {task.labels.map((label) => (
                <ItemContainer key={label.id}>{label.name} </ItemContainer>
              ))}
            </div>
            <ItemInputContainer
              onClick={() => checkInputContainerRef.current?.focus()}
              onFocus={() => setLabelInput("")}
              $nbOfLettersItem={0}
              $nbOfItemPadding={0}
            >
              {labelInput || <span>Add a label</span>}
            </ItemInputContainer>
          </Form>
        </AddItemsContainer>
        <Footer>
          <div onClick={() => handleSubmitTask()}> Save </div>
        </Footer>
      </ChildContainer>
    </MainContainer>
  );
};

export default AddTask;
