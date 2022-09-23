/* eslint-disable @next/next/no-img-element */
import theme from "@utils/admin/theme";
import React from "react";
import styled from "styled-components";
import { GoFile } from "react-icons/go";
import { BiFullscreen, BiPencil } from "react-icons/bi";
import { FiTrash2 } from "react-icons/fi";

type Props = {
  img?: string;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  onClickDelete?: (event: React.MouseEvent<HTMLElement>) => void;
};

const ImageSelector = (props: Props) => {
  return (
    <ImageSelectorST>
      {!props.img ? (
        <div className="uploadIcon" onClick={props.onClick}>
          <GoFile className="icon" />
        </div>
      ) : (
        <ImageContainer>
          <img src={ props.img} alt="image" />
          <div className="actions">
            <i>
              <BiFullscreen className="icon edit" />
            </i>
            <i onClick={props.onClickDelete}>
              <FiTrash2 className="icon delete" />
            </i>
          </div>
        </ImageContainer>
      )}
      {props.children}
    </ImageSelectorST>
  );
};

export default ImageSelector;

const ImageSelectorST = styled.div`
  width: 100px;
  height: 100px;
  border: 2px solid ${theme.colors.primary}55;
  margin: 2rem 0;
  .uploadIcon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  .icon {
    color: ${theme.colors.primary}55;
    font-size: 2rem;
  }

  cursor: pointer;
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 0.5rem;
  position: relative;

  img {
    width: 100%;
    height: 100%;
  }

  &:hover .actions {
    opacity: 1;
  }

  .actions {
    display: flex;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(4px) brightness(0.7);
    opacity: 0;
    transition: 0.3s ease all;
    .icon {
      font-size: 1.2rem;
      color: ${theme.colors.white};
      cursor: pointer;
      margin: 0 0.5rem;
    }
  }
`;
