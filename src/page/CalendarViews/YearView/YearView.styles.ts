import styled from "styled-components";

export const YearContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
`;

export const MonthContainer = styled.div``;

export const MonthNameContainer = styled.p`
  text-align: left;
  padding-left: 7%;

  @media (min-width: 2100px) {
    padding-left: 8%;
  }
  font-weight: bold;
`;
