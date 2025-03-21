import { useState, useRef, useEffect } from "react";
import { format, parse } from "date-fns";
import Slider from "../../Slider/Slider";
import { getFilteredMonth } from "../../../utils/getMonth";
import {
  getFormattedHour,
  getNonFormattedHour,
} from "../../../utils/getFormattedHour";
import {
  Task,
  useTasksContext,
  Check,
  Label,
} from "../../../context/TasksContext";
import { useCalendarContext } from "../../../context/CalendarContext";
import { useAreModalsVisibleContext } from "../../../context/ModalsContext";
import { MonthCalendar } from "../../MonthCalendar/MonthCalendar";
import formattedHours from "../../../utils/formattedHours";
import {
  MainAddTaskContainer,
  HeaderContainer,
  HeaderButton,
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
  BodyContainer,
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
  DescriptionContainer,
  TimeContainer,
} from "./AddTask.styles";
import { useTaskSelectedIdContext } from "../../../context/TaskSelectedIdContext";
import { useDateSelectedContext } from "../../../context/DateSelectedContext";

const AddTask = () => {
  // Context
  const { calendar } = useCalendarContext();
  const { dateSelected } = useDateSelectedContext();
  const { taskSelectedId, setTaskSelectedId } = useTaskSelectedIdContext();
  const { addTask, getTask, setTask } = useTasksContext();
  const { setIsAddTaskModalVisible } = useAreModalsVisibleContext();

  // Form input states
  const [dateInput, setDateInput] = useState<string>("");
  const [descriptionInput, setDescriptionInput] = useState<string>("");
  const [hourInput, setHourInput] = useState<string>("");
  const [recurringValue, setRecurringValue] = useState<string>("oneTime");
  const [checkInput, setCheckInput] = useState<string>("");
  const [labelInput, setLabelInput] = useState<string>("");
  const [taskTitleInput, setTaskTitleInput] = useState<string>("");
  const [prioritySliderValue, setPrioritySliderValue] = useState<string>("1");
  const [complexitySliderValue, setComplexitySliderValue] =
    useState<string>("1");
  const [checks, setChecks] = useState<Check[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [isHourDropDownVisible, setIsHourDropDownVisible] =
    useState<boolean>(false);
  const [isMonthCalendarVisible, setIsMonthCalendarVisible] =
    useState<boolean>(false);
  const [isDateContainerClicked, setIsDateContainerClicked] =
    useState<boolean>(false);
  const [isAllDayInput, setIsAllDay] = useState<boolean>(false);
  const [taskId, setTaskId] = useState<string>("");
  const [isCalendarClicked, setIsCalendarClicked] = useState<boolean>(false);

  // Refs for inputs
  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const hourInputRef = useRef<HTMLInputElement | null>(null);
  const recurringSelectorRef = useRef<HTMLSelectElement | null>(null);
  const monthCalendarModalRef = useRef<HTMLDivElement | null>(null);
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [formattedHour, setFormattedHour] = useState<string>("");

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
  };

  // Add Task inputs setting
  useEffect(() => {
    if (!dateSelected) return;

    setDateInput(format(dateSelected, "d MMMM yyyy"));

    const newFormattedHour = getFormattedHour(calendar.hour);
    setFormattedHour(newFormattedHour);
    setHourInput(newFormattedHour);
  }, [dateSelected]);

  // Edit Task inputs setting
  useEffect(() => {
    if (!taskSelectedId) return;
    const taskRetrieved = getTask(taskSelectedId);
    if (!taskRetrieved) return;

    setTaskId(taskRetrieved.id);
    setTaskTitleInput(taskRetrieved.title);
    setDescriptionInput(taskRetrieved.description);
    setPrioritySliderValue(taskRetrieved.priority.toString());
    setComplexitySliderValue(taskRetrieved.complexity.toString());
    setIsAllDay(taskRetrieved.isAllDay);

    const formattedHr = getFormattedHour(taskRetrieved.hour);
    setHourInput(formattedHr);

    const newFormattedDate = format(taskRetrieved.dueDate, "d MMMM yyyy");
    setDateInput(newFormattedDate);
  }, [taskSelectedId]);

  useEffect(() => {
    if (!isCalendarClicked) return;

    const newFormattedDate = format(
      new Date(calendar.year, calendar.month - 1, calendar.day),
      "d MMMM yyyy"
    );

    setFormattedDate(newFormattedDate);
    setDateInput(newFormattedDate);
    setIsCalendarClicked(false);
    setIsMonthCalendarVisible(false);
  }, [calendar.day]);

  const createTaskFromInputs = (): Task => {
    const parsedDueDate =
      parse(dateInput, "d MMMM yyyy", new Date()) || new Date();

    const newHour = isAllDayInput
      ? 0
      : getNonFormattedHour(Number(hourInput.slice(0, 2)), hourInput.slice(2));

    return {
      id: taskId ? taskId : crypto.randomUUID(),
      title: taskTitleInput.trim() || "No title",
      description: descriptionInput ? descriptionInput.trim() : "",
      isAllDay: isAllDayInput,
      hour: newHour,
      complexity: Number(complexitySliderValue),
      priority: Number(prioritySliderValue),
      dueDate: parsedDueDate,
      checks: checks,
      labels: labels,
      isDone: false,
    };
  };

  const handleCreateTask = () => {
    const newTask = createTaskFromInputs();

    taskSelectedId ? setTask(newTask) : addTask(newTask, recurringValue);

    setTaskSelectedId("");
    setIsAddTaskModalVisible(false);
  };

  const handleCheckSubmit = (e: any) => {
    e.preventDefault();
    if (!checkInput.trim()) return;
    setChecks([
      ...checks,
      { id: crypto.randomUUID(), name: checkInput.trim(), isDone: false },
    ]);
    setCheckInput("");
  };

  const handleLabelSubmit = (e: any) => {
    e.preventDefault();
    const labelTrimmed = labelInput ? labelInput.trim() : null;
    if (!labelTrimmed || labels.find((label) => label.name === labelTrimmed))
      return;

    setLabels([...labels, { id: crypto.randomUUID(), name: labelTrimmed }]);
    setLabelInput("");
  };

  const handleIsAllDayChange = () => {
    setIsAllDay((prev) => !prev);
  };

  const handleClickModal = () => {
    if (isMonthCalendarVisible) {
      setIsMonthCalendarVisible(false);
    }
    if (isHourDropDownVisible) {
      setIsHourDropDownVisible(false);
    }
  };

  return (
    <MainAddTaskContainer onClick={handleClickModal}>
      <HeaderContainer>
        <HeaderButton
          alt="exitButton"
          src="https://cdn2.iconfinder.com/data/icons/e-commerce-line-10-1/1024/close10-64.png"
          onClick={() => setIsAddTaskModalVisible(false)}
        />
      </HeaderContainer>
      <BodyContainer>
        <Form
          onSubmit={(e: any) => {
            e.preventDefault();
            handleCreateTask();
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
          <TimeSettingsContainerLink
            onClick={() => setIsDateContainerClicked(true)}
          >
            <ClockImg
              src="https://cdn-icons-png.flaticon.com/512/3114/3114812.png"
              alt="clock"
            />
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
        ) : (
          <>
            <TimeSettingsContainerLink>
              <TimeContainer>
                <ClockImg
                  src="https://cdn-icons-png.flaticon.com/512/3114/3114812.png"
                  alt="clock"
                />
                <DateInput
                  type="text"
                  ref={dateInputRef}
                  value={dateInput}
                  onClick={() => setIsMonthCalendarVisible(true)}
                  onChange={(e) => setDateInput(e.target.value)}
                  onBlur={handleOnBlurDate}
                />
                {!isAllDayInput && (
                  <HourInput
                    ref={hourInputRef}
                    type="text"
                    value={hourInput}
                    onClick={() => setIsHourDropDownVisible(true)}
                    onChange={(e) => setHourInput(e.target.value)}
                    onBlur={handleOnBlurHour}
                  />
                )}
              </TimeContainer>
              {isHourDropDownVisible && (
                <HoursDropDown>
                  {formattedHours.map((formattedHour, index) => (
                    <div
                      key={formattedHour}
                      onClick={() => {
                        setHourInput(formattedHour);
                        setIsHourDropDownVisible(false);
                      }}
                    >
                      {formattedHour}
                    </div>
                  ))}
                </HoursDropDown>
              )}
              {isMonthCalendarVisible && (
                <MonthCalendarWrapper
                  ref={monthCalendarModalRef}
                  onClick={() => setIsCalendarClicked(true)}
                >
                  <MonthCalendar customCssProps={false} />
                </MonthCalendarWrapper>
              )}
            </TimeSettingsContainerLink>
            <TimeContainer>
              <StyledSelect
                ref={recurringSelectorRef}
                onChange={(e) => setRecurringValue(e.target.value)}
              >
                <option value="oneTime">Only one time</option>
                <option value="everyDay">Every day</option>
                <option value="everyWeek">Every week</option>
                <option value="everyMonth">Every month</option>
                <option value="everyYear">Every year</option>
              </StyledSelect>
              <AllDayContainer>
                <label htmlFor="checkbox"> All day </label>
                <input
                  id="checkbox"
                  type="checkbox"
                  checked={isAllDayInput}
                  onChange={handleIsAllDayChange}
                />
              </AllDayContainer>
            </TimeContainer>
          </>
        )}

        <DescriptionContainer>
          <DescriptionImg
            src="https://www.svgrepo.com/show/532195/menu.svg"
            alt="description icon"
          />
          <DescriptionTextArea
            onChange={(e) => setDescriptionInput(e.target.value)}
            value={descriptionInput}
            placeholder="Add a description"
          />
        </DescriptionContainer>

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
          <Form onSubmit={handleCheckSubmit}>
            <ItemInput
              placeholder="Add a check"
              value={checkInput}
              onChange={(e) => setCheckInput(e.target.value)}
            />
            <ItemInputContainer>
              {checks.map((check) => (
                <ItemContainer
                  key={check.id}
                  onClick={() =>
                    setChecks(checks.filter((c) => c.id !== check.id))
                  }
                >
                  {check.name}
                </ItemContainer>
              ))}
            </ItemInputContainer>
          </Form>
          <Form onSubmit={handleLabelSubmit}>
            <ItemInput
              placeholder="Add a label"
              value={labelInput}
              onChange={(e) => setLabelInput(e.target.value)}
            />
            <ItemInputContainer>
              {labels.map((label) => (
                <ItemContainer
                  key={label.id}
                  onClick={() =>
                    setLabels(labels.filter((l) => l.id !== label.id))
                  }
                >
                  {label.name}
                </ItemContainer>
              ))}
            </ItemInputContainer>
          </Form>
        </AddItemsContainer>

        <Footer>
          <div onClick={handleCreateTask}> Save </div>
        </Footer>
      </BodyContainer>
    </MainAddTaskContainer>
  );
};

export default AddTask;
