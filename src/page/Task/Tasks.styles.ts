import styled from "styled-components";

export const MainContainer = styled.div`
  padding: 20px;
  background-color: #0f1011;
  overflow-x: hidden;

  div {
    display: flex;
  }
`;

export const HeaderTasksContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 4;
  background-color: #2a2e31;
  padding: 20px;
  display: flex;
  gap: 40px;
`;

export const TaskContainer = styled.div<{ $isDone: boolean; $dueDateLeft: number }>`
  display: flex;
  justify-content: space-between;
  text-decoration: ${({ $isDone }) => $isDone && "line-through"};
  background-color: ${({ $isDone, $dueDateLeft }) =>
    $isDone
      ? "#425682"
      : $dueDateLeft < 1
      ? "red"
      : $dueDateLeft < 4
      ? "orange"
      : "#1a3b86"};
  border-radius: 5px;
  width: 100%;
  color: white;
  font-weight: bold;
  margin-bottom: 20px;
  padding-left: 2%;
  margin-right: 1%;
  &:hover {
    cursor: pointer;
  }
`;

export const DeleteButtonContainer = styled.div`
  width: 50px;
  padding-left: 20px;
  &:hover {
    background-color: red;
    border-radius: 5px;
    height: 50px;
    cursor: pointer;
  }
`;

export const DeleteButton = styled.img`
  filter: invert(1);
  width: 25px;
  height: 25px;
  margin-top: 15px;
`;

export const Text = styled.p`
  color: white;
`;

export const LabelsSelectedContainer = styled.div`
  display: flex;
  gap: 20px;
  padding-left: 15px;
  border-bottom: 1px solid grey;
  font-weight: bold;
`;

export const LabelSelected = styled.div`
  background-color: #6eaedd;
  padding: 10px;
  border-radius: 10px;
  height: 20px;
  &:hover {
    cursor: pointer;
    background-color: red;
  }
`;

export const SearchTaskInput = styled.input`
  color: #e2e3e2;
  left: 80px;
  background-color: #1e1e21;
  border: 0;
  font-size: 25px;
  margin-bottom: 10px;
  border-bottom: 2px solid grey;
  &:focus {
    outline: 0;
    border-bottom: 2px solid rgb(22, 85, 187);
  }
  &::placeholder {
    color: #777472;
    padding-left: 10px;
  }
`;

export const PowerModeBackground = styled.div`
  position: absolute;
  width: 100%;
  height: 100vh;
  background-color: rgba(11, 16, 24, 0.73);
  z-index: 5;
`;
