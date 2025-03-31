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
} from "./AddTaskModal.styles";
import { useTaskSelectedIdContext } from "../../../context/TaskSelectedIdContext";
import { useDateSelectedContext } from "../../../context/DateSelectedContext";

const recurringTypeOptions = {
  oneTime: "Only one time",
  everyDay: "Every day",
  everyWeek: "Every week",
  everyMonth: "Every month",
  everyYear: "Every year",
};

type TaskForm = {
  id: string;
  title: string;
  description: string;
  date: string;
  hour: string;
  priority: string;
  complexity: string;
  recurring: "oneTime" | "daily" | "weekly" | "monthly";
  isAllDay: boolean;
  checks: Check[];
  labels: Label[];
  isDone: boolean;
};

function useTaskForm(initialState = {}) {
  const [taskForm, setTaskState] = useState<TaskForm>({
    id: "",
    title: "",
    description: "",
    date: "",
    hour: "",
    priority: "1",
    complexity: "1",
    recurring: "oneTime",
    isAllDay: false,
    checks: [],
    labels: [],
    isDone: false,
    ...initialState,
  });

  const updateTaskFormField = (field: string, value: any) => {
    setTaskState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return {
    taskForm,
    updateTaskFormField,
  };
}

const AddTaskModal = () => {
  // Context
  const { calendar } = useCalendarContext();
  const { dateSelected } = useDateSelectedContext();
  const { taskSelectedId } = useTaskSelectedIdContext();
  const { addTask, getTask, setTask } = useTasksContext();
  const { setIsAddTaskModalVisible } = useAreModalsVisibleContext();

  // State
  const { taskForm, updateTaskFormField } = useTaskForm();

  // Form
  const [checkInput, setCheckInput] = useState<string>("");
  const [labelInput, setLabelInput] = useState<string>("");
  const [prioritySliderValue, setPrioritySliderValue] = useState<string>("1");
  const [complexitySliderValue, setComplexitySliderValue] =
    useState<string>("1");
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [formattedHour, setFormattedHour] = useState<string>("");

  // UI
  const [isHourDropDownVisible, setIsHourDropDownVisible] =
    useState<boolean>(false);
  const [isMonthCalendarVisible, setIsMonthCalendarVisible] =
    useState<boolean>(false);
  const [isDateContainerClicked, setIsDateContainerClicked] =
    useState<boolean>(false);
  const [isCalendarClicked, setIsCalendarClicked] = useState<boolean>(false);

  // Ref
  const recurringSelectorRef = useRef<HTMLSelectElement | null>(null);

  // Task form setting
  useEffect(() => {
    if (!dateSelected) return;

    updateTaskFormField("date", format(dateSelected, "d MMMM yyyy"));

    const newFormattedHour = getFormattedHour(calendar.hour);
    setFormattedHour(newFormattedHour);
    updateTaskFormField("hour", newFormattedHour);
  }, [dateSelected]);

  useEffect(() => {
    if (!taskSelectedId) return;

    const taskRetrieved = getTask(taskSelectedId);
    if (!taskRetrieved) return;

    // Update task form using taskRetrieved
    updateTaskFormField("id", taskRetrieved.id);
    updateTaskFormField("title", taskRetrieved.title);
    updateTaskFormField("description", taskRetrieved.description);
    updateTaskFormField("priority", taskRetrieved.priority.toString());
    updateTaskFormField("complexity", taskRetrieved.complexity.toString());
    updateTaskFormField("isAllDay", taskRetrieved.isAllDay);

    const formattedHr = getFormattedHour(taskRetrieved.hour);
    updateTaskFormField("hour", formattedHr);

    const newFormattedDate = format(taskRetrieved.dueDate, "d MMMM yyyy");
    updateTaskFormField("date", newFormattedDate);
  }, [taskSelectedId]);

  const getStringNoSpace = (stringValue: string): string =>
    stringValue.replace(/\s+/g, "");

  const getFirstFormattedPart = (stringNoSpace: string): string =>
    stringNoSpace.slice(0, Number(stringNoSpace[1]) >= 0 ? 2 : 1);

  const handleOnBlurHour = () => {
    if (!taskForm.hour || !taskForm.hour.trim()) {
      updateTaskFormField("hour", formattedHour);
      return;
    }

    const hourNoSpace = getStringNoSpace(taskForm.hour);
    const hourValue = getFirstFormattedPart(hourNoSpace);
    const hourValueCasted = Number(hourValue);
    if (!hourValueCasted || hourValueCasted < 0 || hourValueCasted > 12) {
      updateTaskFormField("hour", formattedHour);
      return;
    }

    const hourFormat = hourNoSpace.slice(hourValue.length).toUpperCase();
    if (
      (hourFormat !== "AM" && hourFormat !== "PM") ||
      (hourFormat === "AM" && hourValueCasted > 12) ||
      (hourFormat === "PM" && hourValueCasted > 12)
    ) {
      updateTaskFormField("hour", formattedHour);
      return;
    }

    updateTaskFormField("hour", `${hourValue} ${hourFormat}`);
  };

  const handleOnBlurDate = () => {
    if (!taskForm.date || !taskForm.date.trim()) {
      updateTaskFormField("date", formattedDate);
      return;
    }

    const dateNoSpace = getStringNoSpace(taskForm.date);
    const day = getFirstFormattedPart(dateNoSpace);
    if (!Number(day)) {
      updateTaskFormField("date", formattedDate);
      return;
    }

    const month = getFilteredMonth(dateNoSpace.slice(day.length));
    if (!month) {
      updateTaskFormField("date", formattedDate);
      return;
    }

    const year = dateNoSpace.slice(day.length + month.length);
    if (!year) {
      updateTaskFormField("date", formattedDate);
      return;
    }

    const date = new Date(`${day}-${month}-${year}`);
    if (!date.getTime()) {
      updateTaskFormField("date", formattedDate);
      return;
    }

    updateTaskFormField("date", `${day} ${month} ${year}`);
  };

  useEffect(() => {
    if (!isCalendarClicked) return;

    const newFormattedDate = format(
      new Date(calendar.year, calendar.month - 1, calendar.day),
      "d MMMM yyyy"
    );

    setFormattedDate(newFormattedDate);
    updateTaskFormField("date", newFormattedDate);
    setIsCalendarClicked(false);
    setIsMonthCalendarVisible(false);
  }, [calendar.day]);

  const handleCheckSubmit = (e: any) => {
    e.preventDefault();
    if (!checkInput.trim()) return;

    updateTaskFormField("checks", [
      ...taskForm.checks,
      { id: crypto.randomUUID(), name: checkInput.trim(), isDone: false },
    ]);
    setCheckInput("");
  };

  const handleLabelSubmit = (e: any) => {
    e.preventDefault();
    const labelTrimmed = labelInput ? labelInput.trim() : null;
    if (
      !labelTrimmed ||
      taskForm.labels.find((label) => label.name === labelTrimmed)
    )
      return;

    updateTaskFormField("labels", [
      ...taskForm.labels,
      { id: crypto.randomUUID(), name: labelTrimmed },
    ]);
    setLabelInput("");
  };

  // Task submit
  const createTaskFromInputs = (): Task => {
    const parsedDueDate =
      parse(taskForm.date, "d MMMM yyyy", new Date()) || new Date();

    const newHour = taskForm.isAllDay
      ? 0
      : getNonFormattedHour(
          Number(taskForm.hour.slice(0, 2)),
          taskForm.hour.slice(2)
        );

    return {
      id: taskForm.id ? taskForm.id : crypto.randomUUID(),
      title: taskForm.title.trim() || "No title",
      description: taskForm.description ? taskForm.description.trim() : "",
      isAllDay: taskForm.isAllDay,
      hour: newHour,
      complexity: Number(taskForm.complexity),
      priority: Number(taskForm.priority),
      dueDate: parsedDueDate,
      checks: taskForm.checks,
      labels: taskForm.labels,
      isDone: false,
    };
  };

  const handleTaskSubmit = async () => {
    try {
      const newTask = createTaskFromInputs();
      taskSelectedId ? setTask(newTask) : addTask(newTask, taskForm.recurring);
      setIsAddTaskModalVisible(false);
    } catch (error) {
      console.error("Failed to add task:", error);
      alert("An error occurred while adding the task. Please try again.");
    }
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
            handleTaskSubmit();
          }}
        >
          <TitleTaskInput
            type="text"
            value={taskForm.title}
            onChange={(e: any) => updateTaskFormField("title", e.target.value)}
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
              {taskForm.date}
            </DateLink>
            <HourLink onClick={() => setIsHourDropDownVisible(true)}>
              {taskForm.hour}
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
                  value={taskForm.date}
                  onClick={() => setIsMonthCalendarVisible(true)}
                  onChange={(e: any) =>
                    updateTaskFormField("date", e.target.value)
                  }
                  onBlur={handleOnBlurDate}
                />
                {!taskForm.isAllDay && (
                  <HourInput
                    type="text"
                    value={taskForm.hour}
                    onClick={() => setIsHourDropDownVisible(true)}
                    onChange={(e: any) =>
                      updateTaskFormField("hour", e.target.value)
                    }
                    onBlur={handleOnBlurHour}
                  />
                )}
              </TimeContainer>
              {isHourDropDownVisible && (
                <HoursDropDown>
                  {formattedHours.map((formattedHour) => (
                    <div
                      key={formattedHour}
                      onClick={() => {
                        updateTaskFormField("hour", formattedHour);
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
                  onClick={() => setIsCalendarClicked(true)}
                >
                  <MonthCalendar customCssProps={false} isYearView={false}/>
                </MonthCalendarWrapper>
              )}
            </TimeSettingsContainerLink>
            <TimeContainer>
              <StyledSelect
                ref={recurringSelectorRef}
                onChange={(e: any) =>
                  updateTaskFormField("recurring", e.target.value)
                }
                value={taskForm.recurring}
              >
                {Object.entries(recurringTypeOptions).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </StyledSelect>
              <AllDayContainer>
                <label htmlFor="checkbox"> All day </label>
                <input
                  id="checkbox"
                  type="checkbox"
                  checked={taskForm.isAllDay}
                  onChange={() =>
                    updateTaskFormField("isAllDay", !taskForm.isAllDay)
                  }
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
            onChange={(e: any) =>
              updateTaskFormField("description", e.target.value)
            }
            value={taskForm.description}
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
              onChange={(e: any) => setCheckInput(e.target.value)}
            />
            <ItemInputContainer>
              {taskForm.checks.map((check) => (
                <ItemContainer
                  key={check.id}
                  onClick={() =>
                    updateTaskFormField(
                      "checks",
                      taskForm.checks.filter((c) => c.id !== check.id)
                    )
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
              onChange={(e: any) => setLabelInput(e.target.value)}
            />
            <ItemInputContainer>
              {taskForm.labels.map((label) => (
                <ItemContainer
                  key={label.id}
                  onClick={() =>
                    updateTaskFormField(
                      "labels",
                      taskForm.labels.filter((l) => l.id !== label.id)
                    )
                  }
                >
                  {label.name}
                </ItemContainer>
              ))}
            </ItemInputContainer>
          </Form>
        </AddItemsContainer>

        <Footer>
          <div onClick={handleTaskSubmit}> Save </div>
        </Footer>
      </BodyContainer>
    </MainAddTaskContainer>
  );
};

export default AddTaskModal;
