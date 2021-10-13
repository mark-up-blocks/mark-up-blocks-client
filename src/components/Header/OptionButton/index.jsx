import styled from "styled-components";
import Button from "../../shared/Button";

const OptionButton = styled(Button)`
  width: 100%;
  padding: 5px;
  color: ${({ theme }) => theme.color.text};
  background-color: ${({ theme, isCompleted }) => (isCompleted ? theme.color.inactive : "transparent")};
  text-align: left;

  :hover {
    background-color: ${({ theme }) => theme.color.focus};
  }
`;

export default OptionButton;
