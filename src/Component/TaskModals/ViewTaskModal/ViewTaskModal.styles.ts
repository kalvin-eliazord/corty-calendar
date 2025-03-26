import styled from "styled-components";

export const HeaderContainer = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
  background-color: #212324;
  z-index: 4;
  padding: 10px;
`;

export const YearViewTasksModalHeader = styled.p`
  font-weight: bold;
  text-align: left;
  padding-left: 20px;
`;

export const ProgressBarContainer = styled.div`
  width: 50%;
  height: 40px;
  margin-right: 30px;
  border: 1px solid white;
  border-radius: 10px;
  overflow-x: hidden;
  padding: 5px;
`;

export const ProgressBar = styled.div<{ $progress: number }>`
  background-color: green;
  width: ${({ $progress }) => $progress}%;
  height: 100%;
  border-radius: 10px;
`;

export const SlidersViewContainer = styled.div`
  border: 1px solid #333436;
  margin-left: 75px;
  margin-bottom: 20px;
  width: 68%;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  div {
    font-weight: bold;
  }
`;

export const SliderView = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px;
  div {
  }
`;

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  background-color: #212324;
`;

export const IsDoneTaskButton = styled.p`
  font-weight: bold;
  margin-right: 20px;
  color: #92c7f8;
  &:hover {
    cursor: pointer;
  }
`;

export const ItemTitle = styled.div`
  position: relative;
  right: 5px;
`;

export const CheckContainer = styled.div<{ $isDone: boolean }>`
  border: 1px solid white;
  background-color: ${({ $isDone }) => ($isDone ? "green" : "#013a5f")};

  padding: 5px;
  border-radius: 5px;
  text-decoration: ${({ $isDone }) => ($isDone ? "line-through" : "")};

  &:hover {
    cursor: pointer;
    background-color: ${({ $isDone }) => ($isDone ? "#013a5f" : "green")};
    text-decoration: ${({ $isDone }) => ($isDone ? "" : "line-through")};
  }
`;

export const LabelContainer = styled.div`
  border: 1px solid white;
  background-color: #013a5f;
  padding: 5px;
  border-radius: 5px;
`;
