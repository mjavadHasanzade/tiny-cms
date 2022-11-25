/* eslint-disable @next/next/no-img-element */
import theme from "@utils/admin/theme";
import React, { useState } from "react";
import styled from "styled-components";
import { GoFile } from "react-icons/go";
import { BiFullscreen } from "react-icons/bi";
import { FiPlus, FiTrash2 } from "react-icons/fi";

type Props = {
  img?: string;
  name?: string;
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  onClickDelete?: (event: React.MouseEvent<HTMLElement>) => void;
};

const ImageSelector = (props: Props) => {
  const [fullWidth, setFullWidth] = useState(false);
  const handleFullWidth = () => {
    setFullWidth(true);
  };

  return (
    <>
      {props.img && fullWidth && (
        <>
          <FullWidthImage img={props.img} />
          <BackgroundCloserST
            onClick={() => setFullWidth(false)}
          ></BackgroundCloserST>
          <FullWidthMenuBar className="menuBarImageSelector">
            <div className="text">{props.name ? props.name : props.img.split('/').pop()}</div>
            <span className="icon" onClick={() => setFullWidth(false)}>
              <FiPlus />
            </span>
          </FullWidthMenuBar>
        </>
      )}
      <ImageSelectorST className="image-selector">
        <>
          {!props.img ? (
            <div className="uploadIcon" onClick={props.onClick}>
              <GoFile className="icon" />
            </div>
          ) : (
            <ImageContainer>
              <img src={props.img} alt="image" />
              <div className="actions">
                <i>
                  <BiFullscreen
                    className="icon edit"
                    onClick={() => handleFullWidth()}
                  />
                </i>
                <i onClick={props.onClickDelete}>
                  <FiTrash2 className="icon delete" />
                </i>
              </div>
            </ImageContainer>
          )}
          {props.children}
        </>
      </ImageSelectorST>
    </>
  );
};

const FullWidthImage = ({ img }: { img: string }) => {
  return (
    <FullWidthST className="fullWidthImage">
      <img src={img} alt="image" />
    </FullWidthST>
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

const FullWidthST = styled.div`
  position: fixed;
  left: 50%;
  top: calc(50% + 30px);
  transform: translate(-50%, -50%);
  object-fit: cover;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(80% - 60px);

  img {
    border-radius: 20px;
    max-width: 100%;
    height: 100%;
  }
`;

const BackgroundCloserST = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background-color: #0007;
  z-index: 1;
`;

const FullWidthMenuBar = styled.div`
  height: 60px;
  width: 100%;
  background-color: #fff;
  display: flex;
  justify-content: end;
  align-items: center;
  padding: 1.5rem;
  position: fixed;
  top: 0;
  width: 100vw;
  left: 0;
  z-index: 2;

  .icon {
    transform: rotate(45deg);
    display: inline-block;
    font-size: 1.5rem;
    cursor: pointer;
  }
  .text {
    font-size: 1.1rem;
    font-weight: 400;
    margin: 0 auto;
  }
`;
