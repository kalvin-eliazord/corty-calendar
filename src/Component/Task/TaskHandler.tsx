import { useState, useReducer, useEffect } from "react";
import styled from "styled-components";
import Radio from "../Radio/Radio";
import { getFilteredMonth } from "../../utils/getMonth";

const MainContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70vh;
  height: 70vh;
  background-color: #17191a;
  z-index: 2;
  overflow-y:hidden;
  border-radius: 30px;
    font-weight: 500;
    color: white;
    text-align: center;
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

const InputDate = styled.input``;

type Check = {
  id: number;
  name: string;
  isDone: boolean;
};

type Label = {
  id: number;
  name: string;
};

export type Task = {
  id: number;
  title?: string;
  description?: string;
  isAllDay: boolean;
  hour: number | null;
  complexity: number;
  priority: number;
  dueDate: string;
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
  | { type: "SET_DUE_DATE"; state: string }
  | { type: "ADD_CHECK"; state: string }
  | { type: "REMOVE_CHECK"; state: number }
  | { type: "ADD_LABEL"; state: string }
  | { type: "REMOVE_LABEL"; state: number };

const taskReducer = (state: Task, action: TaskAction): Task => {
  switch (action.type) {
    case "SET_TITLE":
      return { ...state, title: action.state ?? "No title" };
    case "SET_DESCRIPTION":
      return { ...state, description: action.state };
    case "SET_COMPLEXITY":
      return { ...state, complexity: Number(action.state) };
    case "SET_PRIORITY":
      return { ...state, priority: Number(action.state) };
    case "SET_DUE_DATE":
      return { ...state, dueDate: action.state };
    default:
      return state;
  }
};

type ViewTaskProps = {
  clickedTask: Task;
  setTask: (task: Task) => void;
};

const ViewTask: React.FC<ViewTaskProps> = ({ clickedTask, setTask }) => {
  const [task, dispatch] = useReducer(taskReducer, clickedTask as Task);
  const [isLabelTitleVisible, setIsLabelTitleVisible] = useState<boolean>(true);
  const [dueDate, setDueDate] = useState<string>(task.dueDate);

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
    if (!dueDate || !dueDate.trim()) return;

    const formattedDate: string | null = getFormattedDate(
      dueDate.replace(/\s+/g, "")
    );
    if (!formattedDate) return;
    console.log("form", formattedDate);
    dispatch({ type: "SET_DUE_DATE", state: formattedDate });
  }, [dueDate]);

  return (
    <MainContainer>
      <HeaderContainer />
      <h2> View Task</h2>
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
          <InputDate
            type="text"
            value={dueDate}
            onChange={(e: any) => setDueDate(e.target.value)}
          />
          {/* InputHour*/}
        </div>

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

type AddTaskProps = {
  addTask: (task: Task) => void;
  date: string;
  hour: number | null;
};

const radioValues = ["1", "2", "3"];

const AddTask: React.FC<AddTaskProps> = ({ addTask, date, hour }) => {
  const [task, dispatch] = useReducer(taskReducer, {
    id: Math.random() * Date.now(),
    title: "",
    hour: hour,
    description: "",
    complexity: 1,
    priority: 1,
    dueDate: date,
    checks: [],
    labels: [],
    isAllDay: false,
    isDone: false,
  });

  return (
    <MainContainer>
      <HeaderContainer />
      <h2>Add Task</h2>
      <ChildContainer>
        <Form
          onSubmit={(e: any) => {
            e.preventDefault();
            addTask(task);
          }}
        >
          <input
            type="text"
            value={task.title}
            onChange={(e: any) =>
              dispatch({ type: "SET_TITLE", state: e.target.value })
            }
            placeholder="Insert title"
          />
        </Form>
        <Radio
          name={"Priority"}
          values={radioValues}
          setRadio={(priority: string) =>
            dispatch({ type: "SET_PRIORITY", state: priority })
          }
          radioChecked={null}
        />
        <Radio
          name={"Complexity"}
          values={radioValues}
          setRadio={(complexity: string) =>
            dispatch({ type: "SET_COMPLEXITY", state: complexity })
          }
          radioChecked={null}
        />

        <input
          type="date"
          value={task.dueDate}
          onChange={(e) =>
            dispatch({ type: "SET_DUE_DATE", state: e.target.value })
          }
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
        <Footer>
          <button> close</button>
          <button> validate</button>
        </Footer>
      </ChildContainer>
    </MainContainer>
  );
};

export { AddTask, ViewTask };
