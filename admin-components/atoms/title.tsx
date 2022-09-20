import theme from "@utils/admin/theme";
import React, { FC, CSSProperties } from "react";
import styled from "styled-components";

interface Props {
  children: string | React.ReactNode;
  hasBorder?: boolean;
  className?: string;
  important?: "primary" | "secondary" | "thired";
  styles?: CSSProperties;
  tag?: React.ElementType | undefined;
}

const Title: FC<Props> = ({
  children,
  hasBorder = true,
  className,
  important,
  styles,
  tag,
  ...rest
}) => {
  return (
    <TitleST
      styles={styles}
      hasBorder={hasBorder}
      className={className}
      important={important}
      as={tag}
      {...rest}
    >
      {children}
    </TitleST>
  );
};

export default Title;

interface ITitleST {
  hasBorder?: boolean;
  important?: "primary" | "secondary" | "thired";
  styles?: string;
  tag?: React.ElementType | undefined;
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

  ${(props) => (props.styles ? props.styles : undefined)}
`;
