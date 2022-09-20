import Title from "@admin/atoms/title";
import theme from "@utils/admin/theme";
import React, { FC } from "react";
import styled from "styled-components";

type Props = {
  title: string;
  description: string;
  counter: string;
  icon: React.ReactNode;
};

const Tile: FC<Props> = (props: Props) => {
  return (
    <TileContainerST>
      <div className="tile__info">
        <Title tag={"p"} hasBorder={false} className="tile__title">
          {props.title}
        </Title>
        <span className="tile__per">{props.description}</span>
        <strong className="tile__num">{props.counter}</strong>
      </div>
      <div className="tile__icons">
        <div className="tile__iconholder">{props.icon}</div>
      </div>
    </TileContainerST>
  );
};

export default Tile;

const TileContainerST = styled.div`
  width: 100%;
  background-color: ${theme.colors.tertiary}12;
  padding: 1.5rem;
  border-radius: 15px;
  display: flex;
  font-size: 1.5rem;

  .tile {
    &__info {
      flex: 0 0 60%;
    }
    &__icons {
      flex: 0 0 40%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &__title {
      font-size: 1.3rem;
      margin: 0;
      padding: 0;
      font-weight: 700;
    }
    &__per {
      font-size: 0.9rem;
      margin-top: 0.25rem;
      display: block;
      color: ${theme.colors.tertiary};
    }
    &__num {
      font-size: 2rem;
      font-weight: 800;
      font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
        "Lucida Sans", Arial, sans-serif;
      padding: 0 1rem;
    }

    &__iconholder {
      font-size: 1.5rem;
      padding: 1.25rem;
      background-color: ${theme.colors.tertiary};
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
    }
  }
`;
