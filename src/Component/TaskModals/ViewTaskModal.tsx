import {
  useState,
  useReducer,
  useEffect,
} from "react";
import { format } from "date-fns";
import styled from "styled-components";
import Radio from "../Radio";
import { getFilteredMonth } from "../../utils/getMonth";
import {
  getFormattedHour,
  getNonFormattedHour,
} from "../../utils/getFormattedHour";
import {Task, taskReducer} from "../../context/TasksContext"


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

  const ViewTask = () => {
    /*const {tasks, dispatch} = useReducer(taskReducer, clickedTask as Task);
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
             // setTask(task);
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
    */
  };
export default  ViewTask;
  