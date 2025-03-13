import {
  useState,
  useReducer,
  useEffect,
  createContext,
  ReactNode,
} from "react";
import { format } from "date-fns";
import styled from "styled-components";
import Radio from "../Radio/Radio";
import { getFilteredMonth } from "../../utils/getMonth";
import {
  getFormattedHour,
  getNonFormattedHour,
} from "../../utils/getFormattedHour";

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
`;

const ChildContainer = styled.div`
  max-width: 500px;
  margin: auto;
  padding-top: 10%;
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

const DateInput = styled.input``;
const HourInput = styled.input``;

type Check = {
  id: string;
  name: string;
  isDone: boolean;
};

type Label = {
  id: string;
  name: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  isAllDay: boolean;
  hour: number;
  complexity: number;
  priority: number;
  dueDate: Date;
  checks: Check[];
  labels: Label[];
  isDone: boolean;
};

type TaskAction =
  | { type: "SET_TITLE"; state: string }
  | { type: "SET_DESCRIPTION"; state: string }
  | { type: "SET_ALL_DAY"; state: boolean }
  | { type: "SET_HOUR"; state: number }
  | { type: "SET_COMPLEXITY"; state: string }
  | { type: "SET_PRIORITY"; state: string }
  | { type: "SET_DUE_DATE"; state: Date }
  | { type: "SET_IS_ALL_DAY"; state: boolean }
  | { type: "ADD_CHECK"; state: string }
  | { type: "REMOVE_CHECK"; state: string }
  | { type: "ADD_LABEL"; state: string }
  | { type: "REMOVE_LABEL"; state: string }
  | { type: "SET_IS_DONE"; state: boolean };

const taskReducer = (state: Task, action: TaskAction): Task => {
  switch (action.type) {
    case "SET_TITLE":
      return { ...state, title: action.state };
    case "SET_DESCRIPTION":
      return { ...state, description: action.state };
    case "SET_ALL_DAY":
      return { ...state, isAllDay: action.state };
    case "SET_HOUR":
      return { ...state, hour: action.state };
    case "SET_COMPLEXITY":
      return { ...state, complexity: Number(action.state) };
    case "SET_PRIORITY":
      return { ...state, priority: Number(action.state) };
    case "SET_DUE_DATE":
      return { ...state, dueDate: action.state };
    case "SET_IS_ALL_DAY":
      return { ...state, isAllDay: action.state };
    case "ADD_CHECK":
      return {
        ...state,
        checks: [
          ...state.checks,
          { id: crypto.randomUUID(), name: action.state, isDone: false },
        ],
      };
    case "REMOVE_CHECK":
      return {
        ...state,
        checks: state.checks.filter((check) => check.id !== action.state),
      };
    case "ADD_LABEL":
      return {
        ...state,
        labels: [
          ...state.labels,
          { id: crypto.randomUUID(), name: action.state },
        ],
      };
    case "REMOVE_LABEL":
      return {
        ...state,
        labels: state.labels.filter((label) => label.id !== action.state),
      };
    case "SET_IS_DONE":
      return { ...state, isDone: action.state };
    default:
      return state;
  }
};

type ModalVisibilityContextType = {
  isAddTaskModalVisible: boolean;
  setIsAddTaskModalVisible(isAddTaskModalVisible: boolean): void;
  isViewTaskModalVisible: boolean;
  setIsViewTaskModalVisible(isAddTaskModalVisible: boolean): void;
};

const ModalVisibilityContext = createContext<
  ModalVisibilityContextType | undefined
>(undefined);

const AreModalsVisibleProvider = ({ children }: { children: ReactNode }) => {
  const [isAddTaskModalVisible, setIsAddTaskModalVisible] =
    useState<boolean>(false);

  const [isViewTaskModalVisible, setIsViewTaskModalVisible] =
    useState<boolean>(false);

  return (
    <ModalVisibilityContext.Provider
      value={{
        isAddTaskModalVisible,
        setIsAddTaskModalVisible,
        isViewTaskModalVisible,
        setIsViewTaskModalVisible,
      }}
    >
      {children}
    </ModalVisibilityContext.Provider>
  );
};

type AddTaskProps = {
  defaultTask: Task;
  addTask: (task: Task, recurringValue: string) => void;
  setIsAddTaskModalVisible: (isAddTaskModalVisible: boolean) => void;
};

const radioValues = ["1", "2", "3"];

const AddTask: React.FC<AddTaskProps> = ({
  defaultTask,
  addTask,
  setIsAddTaskModalVisible,
}) => {
  const [isTaskReady, setIsTaskReady] = useState<boolean>(false);
  const [isDateFocused, setIsDateFocused] = useState(false);
  const [isHourFocused, setIsHourFocused] = useState(false);
  const [isRecurringFocused, setIsRecurringFocused] = useState(false);
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [dateInput, setDateInput] = useState<string>("");
  const [formattedHour, setFormattedHour] = useState<string>("");
  const [hourInput, setHourInput] = useState<string>("");
  const [recurringValue, setRecurringValue] = useState<string>("");
  const [task, dispatch] = useReducer(taskReducer, defaultTask as Task);
  const [isDateContainerClicked, setIsDateContainerClicked] =
    useState<boolean>(false);

  useEffect(() => {
    if (!isTaskReady) return;
    addTask(task, recurringValue);
    setIsAddTaskModalVisible(false);
  }, [isTaskReady]);

  const handleAddTask = (): void => {
    dispatch({
      type: "SET_TITLE",
      state: task.title === "" ? "No title" : task.title.trim(),
    });

    setIsTaskReady(true);
  };

  const handleTitleChange = (titleInputValue: string): void => {
    if (!titleInputValue || !titleInputValue.trim()) return;

    dispatch({ type: "SET_TITLE", state: titleInputValue });
  };

  const handleDescriptionChange = (descriptionInputValue: string): void => {
    if (!descriptionInputValue || !descriptionInputValue.trim()) return;

    dispatch({ type: "SET_DESCRIPTION", state: descriptionInputValue.trim() });
  };

  const handleIsAllDayChange = () => {
    dispatch({ type: "SET_IS_ALL_DAY", state: !task.isAllDay });
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
    dispatch({
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
    dispatch({ type: "SET_DUE_DATE", state: date });
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

  useEffect(() => {
    const newFormattedHour = getFormattedHour(defaultTask.hour);
    setFormattedHour(newFormattedHour);
    setHourInput(newFormattedHour);

    const newFormattedDate = format(defaultTask.dueDate, "d MMMM yyyy");
    setFormattedDate(newFormattedDate);
    setDateInput(newFormattedDate);
  }, [defaultTask]);

  return (
    <MainContainer>
      <HeaderContainer />
      <h2> Add Task </h2>
      <ChildContainer>
        <Form
          onSubmit={(e: any) => {
            e.preventDefault();
            handleAddTask();
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
                onBlur={() => handleOnBlurDate()}
                autoFocus={isDateFocused}
              />

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
          values={radioValues}
          setRadio={(priority: string) =>
            dispatch({ type: "SET_PRIORITY", state: priority })
          }
          radioChecked={task.priority}
        />

        <Radio
          name={"Complexity"}
          values={radioValues}
          setRadio={(complexity: string) =>
            dispatch({ type: "SET_COMPLEXITY", state: complexity })
          }
          radioChecked={task.complexity}
        />

        <Form>
          <div>
            <div>{task.checks.map((check) => check.name)}</div>
            <input
              type="text"
              onChange={(e) =>
                dispatch({ type: "ADD_CHECK", state: e.target.value })
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
                dispatch({ type: "ADD_LABEL", state: e.target.value })
              }
              placeholder="Add label"
            />
          </div>
        </Form>
        <button onClick={() => handleAddTask()}> confirm </button>
        <button onClick={() => setIsAddTaskModalVisible(false)}> X </button>
      </ChildContainer>
    </MainContainer>
  );
};

type ViewTaskProps = {
  clickedTask: Task;
  setTask: (task: Task) => void;
};

const ViewTask: React.FC<ViewTaskProps> = ({ clickedTask, setTask }) => {
  const [task, dispatch] = useReducer(taskReducer, clickedTask as Task);
  const [isLabelTitleVisible, setIsLabelTitleVisible] = useState<boolean>(true);

  const [dateInput, setDateInput] = useState<string>("");

  const [hour, setHour] = useState<string>("");
  const [isAllDay, setIsAllDay] = useState<boolean>(clickedTask.isAllDay);

  const getFormattedDate = (date: string): null | string => {
    let day = "";
    let month: string | null = "";
    let year = "";

    for (let i = 0; i < 2; i++) {
      if (!isNaN(Number(date[i]))) day += date[i];
    }

    if (!day) return null;

    month = getFilteredMonth(date.substring(day.length));
    if (!month) return null;

    year = date.substring(day.length + month.length);
    if (!year) return null;

    return `${day} ${month} ${year}`;
  };

  useEffect(() => {
    dispatch({ type: "SET_ALL_DAY", state: isAllDay });
  }, [isAllDay]);

  useEffect(() => {
    if (!dateInput || !dateInput.trim()) return;

    const formattedDate: string | null = getFormattedDate(
      dateInput.replace(/\s+/g, "")
    );
    if (!formattedDate) return;
    //dispatch({ type: "SET_DUE_DATE", state: formattedDate }); its Date now
  }, [dateInput]);

  useEffect(() => {}, [clickedTask]);

  return (
    <MainContainer>
      <HeaderContainer />
      <h2> View Task </h2>
      <ChildContainer>
        <Form
          onSubmit={(e: any) => {
            e.preventDefault();
            setTask(task);
          }}
        >
          {isLabelTitleVisible ? (
            <label onClick={() => setIsLabelTitleVisible(!isLabelTitleVisible)}>
              {task.title}
            </label>
          ) : (
            <input
              type="text"
              value={task.title}
              onChange={(e: any) =>
                dispatch({ type: "SET_TITLE", state: e.target.value })
              }
              placeholder="Insert title"
            />
          )}
        </Form>
        <div>
          <DateInput
            type="text"
            value={dateInput}
            onChange={(e: any) => setDateInput(e.target.value)}
          />
          {!isAllDay && (
            <HourInput
              type="text"
              value={getFormattedHour(task.hour)}
              onChange={(e: any) => setHour(e.target.value)}
            />
          )}
        </div>
        <label htmlFor="checkbox"> All day </label>
        <input
          id="checkbox"
          type="checkbox"
          checked={isAllDay}
          onChange={() => setIsAllDay(!isAllDay)}
        />
        <select>
          <option value="1"> Just one time </option>
          <option> Every day </option>
          <option> Every week </option>
          <option> Every month </option>
        </select>
        <Radio
          name={"Priority"}
          values={radioValues}
          setRadio={(priority: string) =>
            dispatch({ type: "SET_PRIORITY", state: priority })
          }
          radioChecked={task.priority}
        />
        <Radio
          name={"Complexity"}
          values={radioValues}
          setRadio={(complexity: string) =>
            dispatch({ type: "SET_COMPLEXITY", state: complexity })
          }
          radioChecked={task.complexity}
        />

        <Form>
          <input
            type="text"
            onChange={(e) =>
              dispatch({ type: "ADD_CHECK", state: e.target.value })
            }
            placeholder="Add a check"
          />
        </Form>
        <Form>
          <input
            type="text"
            onChange={(e) =>
              dispatch({ type: "ADD_LABEL", state: e.target.value })
            }
            placeholder="Add label"
          />
        </Form>
        <button onClick={() => setTask(task)}> confirm </button>
      </ChildContainer>
    </MainContainer>
  );
};

export { AddTask, ViewTask, AreModalsVisibleProvider, ModalVisibilityContext };
