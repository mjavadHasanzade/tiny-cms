import theme from "@utils/admin/theme";
import React, { FC } from "react";
import styled from "styled-components";

interface IButton {
  as?: React.ElementType;
  children: any;
  href?: string;
  type?: string;
  className?: string;
  style?: any;
  round?: "normal" | "pill" | "semiRound";
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

const Button: FC<IButton> = ({
  as = "a",
  children,
  type = "primary",
  ...rest
}) => {
  return (
    <ButtonST type={type} {...rest}>
      {children}
    </ButtonST>
  );
};

const ButtonST = styled(({ ...rest }) => <button {...rest} />)`
  background-color: ${(props) =>
    props.type === "primary"
      ? theme.colors.primary
      : props.type === "secondary"
      ? theme.colors.secondary
      : "#F1F1F1"};
  color: ${(props) =>
    props.type === "primary" || props.type === "secondary"
      ? "#fff !important"
      : theme.colors.primary};
  padding: 0.65rem 0.75rem;
  border: none;
  border-radius: ${(props) =>
    props.round === "pill"
      ? "34px"
      : props.round === "semiRound"
      ? "20px"
      : "5px"};
  font-weight: 600;
  font-size: 12px;
  margin: 0 0.25rem;
  cursor: ${(props) => (props.disabled ? "no-drop" : "pointer")};
  position: relative;
  width: max-content;
  transform: 0.3s ease all;
  direction: ltr;
  opacity: ${(props) => (props.disabled ? ".5" : "1")};

  &:hover {
    box-shadow: 0 10px 10px -10px #ccc;
    .icon {
      transform: scale(1.1);
    }
  }

  ${(props) => props.style}
`;

export default Button;
