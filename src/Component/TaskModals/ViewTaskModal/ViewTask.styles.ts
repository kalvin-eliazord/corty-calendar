import styled from "styled-components";

export const HeaderContainer = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
`;

export const SlidersViewContainer = styled.div`
  border: 1px solid #333436;
  margin-left: 75px;
  margin-bottom: 40px;
  width: 67%;
  border-radius: 5px;
  display: flex;
  gap: 20px;
  div {
    font-weight: bold;
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
