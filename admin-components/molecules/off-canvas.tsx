import React, { FC, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import styled from "styled-components";

type Props = {
  children: React.ReactNode;
  active: boolean;
  handler: (active: boolean) => void;
};

const OffCanvas: FC<Props> = ({ children, active, handler }) => {
  useEffect(() => {
    if (active) {
      const offcanvasContainer = document.querySelector<HTMLDivElement>(
        ".offcanvasContainer"
      );
      if (offcanvasContainer) {
        let x = 0;
        const anim = setInterval(() => animate(offcanvasContainer), 1);
        const animate = (element: HTMLDivElement) => {
          x--;
          if (x == -25) {
            clearInterval(anim);
          } else {
            element.style.left = `${x}%`;
          }
        };
      }
    }
  }, [active]);

  if (!active) return <></>;
  return (
    <OffCanvasContainerST className="offcanvasContainer">
      <div className="background" onClick={() => handler(false)}></div>
      <OffCanvasSection>
        <HeaderSection>
          <span className="icon" onClick={() => handler(false)}>
            <FiPlus />
          </span>
        </HeaderSection>
        <div className="content">{children}</div>
      </OffCanvasSection>
    </OffCanvasContainerST>
  );
};

export default OffCanvas;

const OffCanvasContainerST = styled.div`
  position: fixed;
  width: calc(100vw + 25%);
  height: 100vh;
  top: 0;
  z-index: 1;

  .background {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    background-color: #0007;
    z-index: 0;
  }
`;

const OffCanvasSection = styled.div`
  background-color: #fff;
  width: 25%;
  height: 100vh;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 2;
  padding: 2.5rem 1.5rem;
  overflow-y: scroll;
  .content {
    width: 100%;
  }
`;

const HeaderSection = styled.div`
  padding-bottom: 0.5rem;
  border-bottom: 1px solid;

  .icon {
    transform: rotateZ(45deg);
    font-size: 1.5rem;
    display: inline-block;
    cursor: pointer;
  }
`;
