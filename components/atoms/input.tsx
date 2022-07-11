import theme from "@utils/theme";
import React, { FC, useRef, useState } from "react";
import { useEffect } from "react";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import styled from "styled-components";

interface IInput {
  name: string;
  type?: string;
  className?: string;
  style?: any;
  placeHolder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
}

const Input: FC<IInput> = ({
  name,
  placeHolder,
  type = "text",
  className,
  ...rest
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const labelRef = useRef() as React.MutableRefObject<HTMLLabelElement>;

  const handlePasswordVisible = () => {
    setPasswordVisible(!passwordVisible);

    if (!passwordVisible) inputRef.current.type = "text";
    else inputRef.current.type = "password";
  };

  useEffect(() => {
    labelRef.current.click();
  }, []);

  // console.log(inputRef.current.value);

  return (
    <InputContainer>
      <Inputer
        name={name.replace(" ", "-")}
        type={type}
        placeholder={placeHolder}
        ref={inputRef}
        className={`${className} ${inputRef.current?.value ? "active" : ""}`}
        {...rest}
      />
      <Label
        className="input-label"
        ref={labelRef}
        onClick={() => inputRef.current.focus()}
      >
        {placeHolder}
      </Label>
      {type === "password" && (
        <i className="passEye" onClick={() => handlePasswordVisible()}>
          {passwordVisible ? <BsFillEyeSlashFill /> : <BsFillEyeFill />}
        </i>
      )}
    </InputContainer>
  );
};

export default Input;

const Inputer = styled.input`
  background-color: ${theme.colors.secondary};
  border-radius: 10px;
  border: 0.5px solid ${theme.colors.primary};
  padding: 1rem;
  display: inline-block;
  margin: 2rem 0 0 0;
  width: 100%;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
  text-align: ${(props) => (props.theme.rtl ? "right" : "left")};
  transition: 0.3s ease all;
  &::placeholder {
    color: #bdbdbd;
  }

  &:focus {
    &::placeholder {
      opacity: 0;
    }
  }

  &:focus + .input-label {
    top: 1rem;
    left: 0;
    z-index: 1;
    cursor: pointer;
  }

  &.active + .input-label {
    top: 1rem;
    left: 0;
    z-index: 1;
    cursor: pointer;
  }
`;

const InputContainer = styled.div`
  position: relative;

  .passEye {
    color: #cccccc;
    position: absolute;
    top: calc(50% + 1rem);
    transform: translateY(-50%);
    ${(props) => (props.theme.rtl ? "left" : "right")}: 1rem;
    cursor: pointer;
    font-size: 1.2rem;
  }
`;

const Label = styled.label`
  transition: 0.3s ease all;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
  text-align: ${(props) => (props.theme.rtl ? "right" : "left")};
  color: #bdbdbd;
  margin: 0;
  position: absolute;
  top: 3.6rem;
  transform: translateY(-50%);
  left: 1rem;
  z-index: -1;
  cursor: text;
`;
