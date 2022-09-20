import theme from "@utils/admin/theme";
import React, { FC } from "react";
import styled from "styled-components";

type Props = {
  active?: boolean;
};

const TClogo: FC<Props> = ({ active = false }) => {
  return (
    <TCWrapper className={active ? "active" : ""}>
      <span>
        <i></i>
      </span>
      <span>
        <i></i>
      </span>
      <span>
        <i></i>
      </span>
      <span>
        <i></i>
      </span>
    </TCWrapper>
  );
};

export default TClogo;

const TCWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  transform-origin: center;

  span {
    flex: 0 0 50%;
    text-align: center;
    align-content: center;
    height: 30px;

    display: flex;
    justify-content: center;
    align-items: center;
    i {
      width: 15px;
      height: 15px;
      background-color: ${theme.colors.primary};
      display: inline-block;
      border-radius: 50%;
      transform: scale(0.6);
    }

    &:nth-child(1) {
      i {
        background-color: ${theme.colors.primary};
      }
    }
    &:nth-child(2) {
      i {
        background-color: #d6d4d2;
      }
    }
    &:nth-child(3) {
      i {
        background-color: ${theme.colors.tertiary};
      }
    }
    &:nth-child(4) {
      i {
        background-color: ${theme.colors.primary};
      }
    }
  }

  @keyframes rote {
    0% {
      transform: rotateZ(0deg);
    }
    50% {
      transform: rotateZ(180deg);
    }
    100% {
      transform: rotateZ(360deg);
    }
  }

  @keyframes dotter1 {
    0% {
      transform: translate(0, 0);
    }
    50% {
      transform: translate(50%, 50%);
    }
    100% {
      transform: translate(0, 0);
    }
  }

  @keyframes dotter2 {
    0% {
      transform: translate(0, 0);
    }
    50% {
      transform: translate(-50%, 50%);
    }
    100% {
      transform: translate(0, 0);
    }
  }

  @keyframes dotter3 {
    0% {
      transform: translate(0, 0);
    }
    50% {
      transform: translate(50%, -50%);
    }
    100% {
      transform: translate(0, 0);
    }
  }

  @keyframes dotter4 {
    0% {
      transform: translate(0, 0);
    }
    50% {
      transform: translate(-50%, -50%);
    }
    100% {
      transform: translate(0, 0);
    }
  }

  &.active {
    animation: rote 2s ease infinite;
    span {
      &:nth-child(1) {
        animation: dotter1 1s ease infinite;
      }
      &:nth-child(2) {
        animation: dotter2 2s ease infinite;
      }
      &:nth-child(3) {
        animation: dotter3 2s ease infinite;
      }
      &:nth-child(4) {
        animation: dotter4 1s ease infinite;
      }
    }
  }
`;
