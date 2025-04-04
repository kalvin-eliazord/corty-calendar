import styled from "styled-components";

export const MainContainer = styled.div`
  padding: 20px;
  background-color: #0f1011;
  overflow-x: hidden;
  div {
    display: flex;
  }
`;

export const TaskUnfinishedText = styled.p`
  font-size: 20px;
  font-weight: bold;
  text-wrap: nowrap;
  padding-left: 10px;
`;

export const HeaderTasksContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 4;
  background-color: #2a2e31;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  padding-right: 5%;
  padding-left: 3%;
  @media (min-width: 2100px) {
    gap: 50%;
  }

  select {
    postion: relative;
    top: 0.5px;
  }

  img {
    width: 30px;
    height: 30px;
  }
`;

export const HeaderLeftPart = styled.div`
  display: flex;
  gap: 5%;
`;

export const SearchTaskInput = styled.input`
  color: #e2e3e2;
  background-color: #2a2f30;
  border: 0;
  font-size: 25px;
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

export const HeaderRightPart = styled.div`
  display: flex;
  gap: 5%;
`;

export const TaskContainer = styled.div<{
  $isDone: boolean;
  $dueDateLeft: number;
}>`
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
  animation: slideIn 0.2s linear;
  @keyframes slideIn {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }

  &:hover {
    cursor: pointer;
  }
`;

export const DeleteButtonContainer = styled.div`
  width: 50px;
  padding-left: 20px;
  animation: fadeIn 1s linear;
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
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
  padding-top: 15px;
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

export const PowerModeBackground = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  width: 200%;
  height: 200%;
  background-color: rgba(105, 42, 86, 0.73);
  z-index: 5;
`;
