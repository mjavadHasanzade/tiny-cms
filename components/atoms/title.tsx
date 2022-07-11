import theme from "@utils/theme";
import React, { FC } from "react";
import styled from "styled-components";

interface Props {
  children: string | React.ReactNode;
  hasBorder?: boolean;
  className?: string;
  important?: "primary" | "secondary" | "thired";
}

const Title: FC<Props> = ({
  children,
  hasBorder = true,
  className,
  important,
}) => {
  return (
    <TitleST hasBorder={hasBorder} className={className} important={important}>
      {children}
    </TitleST>
  );
};

export default Title;

interface ITitleST {
  hasBorder?: boolean;
  important?: "primary" | "secondary" | "thired";
}

const TitleST = styled.h3<ITitleST>`
  padding: 0.5rem 0;
  padding-top: 0;
  font-size: ${(props) =>
    props.important === "thired"
      ? "1.2rem"
      : props.important === "secondary"
      ? "1.5rem"
      : "1.8rem"};
  font-weight: 500;
  letter-spacing: 2px;
  border-bottom: ${(props) =>
    props.hasBorder ? "1px solid" + theme.colors.primary : null};
  color: ${theme.colors.primary};
`;