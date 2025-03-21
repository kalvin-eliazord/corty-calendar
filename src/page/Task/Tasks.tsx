import {
  MainContainer,
  HeaderTasksContainer,
  TaskContainer,
  DeleteButtonContainer,
  DeleteButton,
  Text,
  LabelsSelectedContainer,
  LabelSelected,
  SearchTaskInput,
  PowerModeBackground,
} from "././Tasks.styles";

const Tasks = () => {
  return (
    <MainContainer>
      <HeaderTasksContainer>
        <SearchTaskInput placeholder="Search tasks..." />
      </HeaderTasksContainer>

      <LabelsSelectedContainer>
        <LabelSelected>Work</LabelSelected>
        <LabelSelected>Personal</LabelSelected>
      </LabelsSelectedContainer>

      <TaskContainer $isDone={false} $dueDateLeft={2}>
        <Text>Finish React project</Text>
        <DeleteButtonContainer>
          <DeleteButton src="/delete-icon.svg" alt="Delete" />
        </DeleteButtonContainer>
      </TaskContainer>

      <PowerModeBackground />
    </MainContainer>
  );
};

export default Tasks;
