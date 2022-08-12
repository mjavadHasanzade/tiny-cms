import React, { FC } from "react";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import styled from "styled-components";

interface IQuill {
  value: string;
  onChange: Function;
  className?: string;
}

const Quill: FC<IQuill> = ({ value, onChange, className }) => {
  return (
    <QuillContainerST className={className}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        style={{ minHeight: "30vh" }}
      />
    </QuillContainerST>
  );
};

export default Quill;

const QuillContainerST = styled.div`
  margin: 1rem 0;

  .ql-editor {
    min-height: 30vh !important;
    overflow: hidden;
  }
`;
