import { useState, useRef, useReducer, useEffect } from "react";
import { format } from "date-fns";
import Slider from "../../Slider";
import { getFilteredMonth, getMonthByIndex } from "../../../utils/getMonth";
import {
  getFormattedHour,
  getNonFormattedHour,
} from "../../../utils/getFormattedHour";
import {
  Task,
  taskReducer,
  useTasksContext,
} from "../../../context/TasksContext";
import { useCalendarContext } from "../../../context/CalendarContext";
import { useAreModalsVisibleContext } from "../../../context/ModalsContext";
import { MonthCalendar } from "../../MonthCalendar/MonthCalendar";
import formattedHours from "../../../utils/formattedHours";
import {
  MainContainer,
  HeaderContainer,
  ExitButton,
  TitleTaskInput,
  TimeSettingsContainerLink,
  DateLink,
  HourLink,
  RecurringLink,
  AddItemsContainer,
  Form,
  ItemInput,
  ItemInputContainer,
  SlidersContainer,
  ItemContainer,
  ChildContainer,
  MonthCalendarWrapper,
  ClockImg,
  DescriptionImg,
  DescriptionTextArea,
  DateInput,
  HourInput,
  StyledSelect,
  AllDayContainer,
  HoursDropDown,
  Footer,
} from "./AddTask.styles";

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
  const [prioritySliderValue, setPrioritySliderValue] = useState<string>("1");
  const [complexitySliderValue, setComplexitySliderValue] =
    useState<string>("1");
  const [isHourDropDownVisible, setIsHourDropDownVisible] =
    useState<boolean>(false);
  const [isMonthCalendarVisible, setIsMonthCalendarVisible] =
    useState<boolean>(false);
  const [isDateContainerClicked, setIsDateContainerClicked] =
    useState<boolean>(false);
  const [task, taskDispatch] = useReducer(taskReducer, {
    id: "",
    title: "",
    description: "",
    isAllDay: false,
    hour: 0,
    complexity: 1,
    priority: 1,
    dueDate: new Date(),
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

  const setDescriptionTask = (): void => {
    if (!descriptionInput || !descriptionInput.trim()) return;

    taskDispatch({
      type: "SET_DESCRIPTION",
      state: descriptionInput.trim(),
    });
  };

  const handleSubmitTask = (): void => {
    taskDispatch({
      type: "SET_TITLE",
      state: taskTitleInput === "" ? "No title" : taskTitleInput.trim(),
    });

    setDescriptionTask();

    if (task.isAllDay) taskDispatch({ type: "SET_HOUR", state: 0 });

    taskDispatch({ type: "SET_COMPLEXITY", state: complexitySliderValue });
    taskDispatch({ type: "SET_PRIORITY", state: prioritySliderValue });

    setIsTaskReady(true);
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

    taskDispatch({
      type: "SET_DUE_DATE",
      state: new Date(calendar.year, calendar.month - 1, calendar.day),
    });

    setIsMonthCalendarVisible(false);
  }, [calendar.day]);

  useEffect(() => {
    const newFormattedHour = getFormattedHour(calendar.hour);
    setFormattedHour(newFormattedHour);
    setHourInput(newFormattedHour);

    taskDispatch({ type: "SET_HOUR", state: calendar.hour });

    const newFormattedDate = format(
      new Date(calendar.year, calendar.month - 1, calendar.day),
      "d MMMM yyyy"
    );
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

  const handleFormattedHourClick = (hourIndex: number) => {
    setHourInput(getFormattedHour(hourIndex));
    taskDispatch({ type: "SET_HOUR", state: hourIndex });

    setIsHourDropDownVisible(false);
  };

  const handleCheckSubmit = (e: any) => {
    e.preventDefault();
    if (!checkInput || !checkInput.trim()) return;

    taskDispatch({ type: "ADD_CHECK", state: checkInput.trim() });
    setCheckInput("");
  };

  const handleLabelSubmit = (e: any) => {
    e.preventDefault();
    if (!labelInput || !labelInput.trim()) return;

    const labelTrimmed = labelInput.trim();
    if (task.labels.find((label) => label.name === labelTrimmed)) return;

    taskDispatch({ type: "ADD_LABEL", state: labelTrimmed });
    setLabelInput("");
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
            onChange={(e) => setTaskTitleInput(e.target.value)}
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
                  {formattedHours.map((formattedHour, index) => (
                    <div
                      key={formattedHour}
                      onClick={() => handleFormattedHourClick(index)}
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
                  <MonthCalendar customCssProps={false} />
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
        <SlidersContainer>
          <Slider
            name={"Priority"}
            min="1"
            max="10"
            sliderValue={prioritySliderValue}
            setSliderValue={setPrioritySliderValue}
          />
          <Slider
            name={"Complexity"}
            min="1"
            max="5"
            sliderValue={complexitySliderValue}
            setSliderValue={setComplexitySliderValue}
          />
        </SlidersContainer>
        <AddItemsContainer>
          <Form onSubmit={(e) => handleCheckSubmit(e)}>
            <ItemInput
              placeholder="Add a check"
              value={checkInput}
              onChange={(e) => setCheckInput(e.target.value)}
            />

            <ItemInputContainer>
              {task.checks.map((check) => (
                <ItemContainer
                  key={check.id}
                  onClick={() =>
                    taskDispatch({ type: "REMOVE_CHECK", state: check.id })
                  }
                >
                  {check.name}
                </ItemContainer>
              ))}
            </ItemInputContainer>
          </Form>

          <Form onSubmit={(e) => handleLabelSubmit(e)}>
            <ItemInput
              placeholder="Add a label"
              value={labelInput}
              onChange={(e) => setLabelInput(e.target.value)}
            />
            <ItemInputContainer>
              {task.labels.map((label) => (
                <ItemContainer
                  key={label.id}
                  onClick={() =>
                    taskDispatch({ type: "REMOVE_LABEL", state: label.id })
                  }
                >
                  {label.name}
                </ItemContainer>
              ))}
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
