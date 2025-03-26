import { differenceInDays, format, isSameDay } from "date-fns";
import { Task, useTasksContext } from "../../../context/TasksContext";
import {
  DeleteButton,
  DeleteButtonContainer,
  MainContainer,
  TaskContainer,
  Text,
} from "../../../page/Task/Tasks.styles";
import { MainAddTaskContainer } from "../AddTaskModal/AddTaskModal.styles";
import { getFormattedHour } from "../../../utils/getFormattedHour";
import { useDateSelectedContext } from "../../../context/DateSelectedContext";
import { YearViewTasksModalHeader } from "./ViewTaskModal.styles";

const YearViewTasksModal = () => {
  const { removeTask, tasks } = useTasksContext();
  const { dateSelected } = useDateSelectedContext();

  const filteredTasks = tasks.filter(
    (task: Task) => task.dueDate.getTime() === dateSelected.getTime()
  );

  return (
    <MainAddTaskContainer>
   <YearViewTasksModalHeader>   {format(dateSelected, "dd, MMMM yyyy")}</YearViewTasksModalHeader>
        <MainContainer>
          {filteredTasks.length < 1 && "No task here! 🍕"}
          {filteredTasks.map((task: Task) => (
            <div key={task.id}>
              <TaskContainer
                $isDone={task.isDone}
                $dueDateLeft={
                  isSameDay(task.dueDate, new Date())
                    ? 0
                    : differenceInDays(task.dueDate, new Date()) + 1
                }
              >
                <Text>
                  {task.title}, {getFormattedHour(task.hour)}
                </Text>
              </TaskContainer>

              <DeleteButtonContainer>
                <DeleteButton
                  alt="DeleteButton"
                  src="https://cdn-icons-png.flaticon.com/512/3405/3405244.png"
                  onClick={() => removeTask(task.id)}
                />
              </DeleteButtonContainer>
            </div>
          ))}
        </MainContainer>
    </MainAddTaskContainer>
  );
};

export default YearViewTasksModal;
