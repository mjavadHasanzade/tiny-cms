import React from "react";
import styled from "styled-components";

type Props = {
  children: any;
};

const Message = (props: Props) => {
  return <MessageST>{props.children}</MessageST>;
};

export default Message;

const MessageST = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  color: #f00;
`;
