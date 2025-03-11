import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import styled from "styled-components";
import { CalendarContainer } from "../../Component/Calendar/Calendar";
import { TasksContext } from "../../Component/Task/TasksProvider";
import { Task, AddTask, ViewTask } from "../../Component/Task/TaskHandler";
import getFormattedHour from "../../utils/getFormattedHour";

const DayViewContainer = styled.div`
  border-inline: solid #7b7364 1px;
  margin-left: 8%;
  margin-top: 5%;
`;

const DayViewNameContainer = styled.div`
  border: 1px solid red;
  p {
    color: #246694;
    font-weight: bold;
  }
`;

const HoursTitle = styled.div`
  text-align: center;
  position: relative;
  width: 20px;
  right: 6%;
  bottom: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: white;
  font-size: 12px;
`;

const HoursContainer = styled.div`
  display: flex;
  flex-direction: row;
  border-radius: 5px;
`;

const Hour = styled.div`
  width: 100%;
  border-bottom: solid #7b7364 1px;
  position: relative;
  right: 3rem;
  height: 50px;
  margin-left: 30px;
`;

const TasksContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 100%;
`;

const TaskContainer = styled.div`
  background-color: #246694;
  width: 100%;
  margin-right: 50px;
  border-radius: 5px;
  z-index: 1;
  color: white;
  font-weight: bold;
  padding-left: 2%;
  padding-top: 2%;
  &:hover {
    cursor: pointer;
  }
`;

type HourSlot = {
  id: number;
  tasks: Task[];
};

const hours: HourSlot[] = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  tasks: [],
}));

type DayType = {
  name: string;
  index: string;
};

const DayView = () => {
  const params = useParams();
  const [dateParams, setDateParams] = useState(useParams());
  const context = useContext(TasksContext);
  if (!context)
    throw new Error("Day View must be wrapped within TasksProvider");

  const [day, setDay] = useState<DayType>();
  const [formattedDate, setFormattedDate] = useState<string>("");
  const { tasks, tasksDispatch } = context;

  const [isAddTaskModalVisible, setIsAddTaskModalVisible] =
    useState<boolean>(false);
  const [clickedHour, setClickedHour] = useState<number | null>(null);
  const [isViewTaskModalVisible, setIsViewTaskModalVisible] =
    useState<boolean>(false);
  const [clickedTask, setClickedTask] = useState<Task>();
  const [dayViewTasks, setDayViewTasks] = useState<Task[]>([]);
  
  useEffect(() => {
    setDateParams(params);
    const { year, month, dayIndex } = dateParams;
    const date = new Date(Number(year), Number(month), Number(dayIndex));
    const dayName = format(date, "eee");
    setDay({ name: dayName, index: dayIndex || "" });
    setFormattedDate(format(date, "d MMMM yyyy"));
  }, [params, dateParams]);

  useEffect(() => {
    if (tasks.length < 1) return;
    setDayViewTasks(
      tasks.filter((task: Task) => task.dueDate === formattedDate)
    );
  }, [formattedDate, tasks]);

  useEffect(() => {
 //   console.log("newtasks: ", tasks);
    setDayViewTasks(
      tasks.filter((task: Task) => task.dueDate === formattedDate)
    );
  }, [tasks, formattedDate]);

  const addTask = (task: Task) => {
    tasksDispatch({ type: "ADD_TASK", state: task });
    setIsAddTaskModalVisible(!isAddTaskModalVisible);
  };

  const setTask = (task: Task) => {
    tasksDispatch({
      type: "SET_TASKS",
      state: tasks.map((currentTask: Task) =>
        currentTask.id === task.id ? task : currentTask
      ),
    });
    setIsViewTaskModalVisible(false);
    if (isAddTaskModalVisible) setIsAddTaskModalVisible(false);
  };

  const removeTask = (taskId: number) => {
    tasksDispatch({ type: "REMOVE_TASK", state: taskId });
  };

  const toggleAddTaskModal = (clickedHour: number) => {
    setIsAddTaskModalVisible(!isAddTaskModalVisible);
    isAddTaskModalVisible ? setClickedHour(null) : setClickedHour(clickedHour);
    if (isViewTaskModalVisible) setIsViewTaskModalVisible(false);
  };

  const toggleViewTaskModal = (taskId: number) => {
    const task = dayViewTasks.find((task) => task.id === taskId);
    if (!task) {
      console.warn("Task not found for ID:", taskId);
      return;
    }

    setClickedTask(task);
    setIsViewTaskModalVisible(true);
    if (isAddTaskModalVisible) setIsAddTaskModalVisible(false);
  };

  return (
    <div className="App">
      {isAddTaskModalVisible && (
        <AddTask addTask={addTask} date={formattedDate} hour={clickedHour} />
      )}
      {isViewTaskModalVisible && clickedTask && (
        <ViewTask clickedTask={clickedTask} setTask={setTask} />
      )}

      <CalendarContainer>
        <DayViewContainer>
          <DayViewNameContainer>
            <p>
              {day?.index } <br /> {day?.name}.
            </p>
          </DayViewNameContainer>

          {hours.map((hour) => (
            <HoursContainer key={hour.id}>
              <HoursTitle>{getFormattedHour(hour.id)}</HoursTitle>

              <Hour onClick={() => toggleAddTaskModal(hour.id)}>
                <TasksContainer>
                  {dayViewTasks.map(
                    (task) =>
                      task.hour === hour.id && (
                        <TaskContainer
                          key={task.id}
                          onClick={() => toggleViewTaskModal(task.id)}
                        >
                          {task.title}
                          {!task.isAllDay &&
                            `, ${getFormattedHour(task.hour)}`}
                        </TaskContainer>
                      )
                  )}
                </TasksContainer>
              </Hour>
            </HoursContainer>
          ))}
        </DayViewContainer>
      </CalendarContainer>
    </div>
  );
};

export default DayView;
