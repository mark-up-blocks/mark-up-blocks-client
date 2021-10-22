import styled from "styled-components";
import Button from "../../shared/Button";

const OptionButton = styled(Button)`
  width: 100%;
  padding: 5px;
  color: ${({ theme, isCompleted }) => (isCompleted ? theme.color.inactive : theme.color.inner)};
  text-align: left;

  :hover {
    background-color: ${({ theme }) => theme.color.preview};
  }
`;

export default OptionButton;
