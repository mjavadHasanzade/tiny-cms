import Title from "@admin/atoms/title";
import objectExtracter from "@utils/objectExtracter";
import theme from "@utils/admin/theme";
import React, { FC, useEffect, useState } from "react";
import styled from "styled-components";
import { BiPencil } from "react-icons/bi";
import { FiTrash2 } from "react-icons/fi";
// import { getAxiosInstanse } from "api/api";
import Link from "next/link";
// import { useToasts } from "react-toast-notifications";
import generateDate from "@utils/dateGen";
import Check from "@admin/atoms/check";
import { getCookie } from "@utils/cookie";
import prisma from "lib/prisma";
import stripTags from "@utils/stripe-tags";

type Props = {
  head?: Array<string>;
  minus?: Array<string>;
  body: any;
  height?: string;
  title?: string;
  tablePath: string;
  apiPath: string;
  actions?: boolean;
};

interface ITableRows {
  cols: number;
  actions: boolean;
}

const Table: FC<Props> = ({
  body,
  head,
  height = "auto",
  title,
  minus = [""],
  actions = false,
  tablePath,
  apiPath,
}) => {
  const [tableBody, setTableBody] = useState(body);
  // const { addToast } = useToasts();
  //   const { setLoaderActiver } = useAppContext();

  if (minus.length >= 1) {
    head = objectExtracter(tableBody.length >= 1 ? tableBody[0] : {}, minus);
  } else {
    head = objectExtracter(tableBody[0], [""]);
  }

  let cols = head.length;

  const deleteItem = async (path: string, id: number | string) => {
    // setLoaderActiver(true);
    fetch(path + id, {
      method: "delete",
      headers: { xauth: getCookie("xauth", document.cookie) },
    }).then(async (res) => {
      const newrows = await fetch(apiPath);
      const tb = await newrows.json();
      setTableBody(tb.slogans);
    });
  };

  return (
    <div>
      {title && (
        <Title className="p-0" important="thired" hasBorder={false}>
          {title}
        </Title>
      )}
      <TableContainerST height={height}>
        <TableHead actions={actions} cols={cols}>
          <span>#</span>
          {head.length > 0 &&
            head.map((headItem, index: number) => (
              <span key={index}>{headItem}</span>
            ))}
        </TableHead>

        {tableBody.length <= 0 && <NetFoundText>No Items Found</NetFoundText>}

        {tableBody.map((item: any, index: number) => (
          <TableItem actions={actions} key={index} cols={cols}>
            <span>{index + 1}</span>
            {head &&
              head.length > 0 &&
              head.map((headItem: any, i) =>
                headItem === "content" || headItem === "description" ? (
                  <span className="tableSimpleDescription">
                    {stripTags(item[headItem])}
                  </span>
                ) : (
                  <span key={i}>
                    {headItem === "createdAt" || headItem === "updatedAt" ? (
                      generateDate(item[headItem], true)
                    ) : typeof item[headItem] === "boolean" ? (
                      <Check
                        checked={item[headItem]}
                        name="isActive"
                        disabled={true}
                      />
                    ) : (
                      item[headItem]
                    )}
                  </span>
                )
              )}
            {actions && (
              <>
                <span className="actions">
                  <Link href={tablePath + item.id} passHref>
                    <button className="edit">
                      <BiPencil />
                    </button>
                  </Link>
                </span>
                <span className="actions">
                  <button
                    className="delete"
                    onClick={() => deleteItem(apiPath, item.id)}
                  >
                    <FiTrash2 />
                  </button>
                </span>
              </>
            )}
          </TableItem>
        ))}
      </TableContainerST>
    </div>
  );
};

export default Table;

interface ITableContainerST {
  height: string;
}

export const TableContainerST = styled.div<ITableContainerST>`
  display: flex;
  position: relative;
  flex-direction: column;
  height: ${(props) => props.height};
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 0 8px;

  &::-webkit-scrollbar {
    width: 0.5rem;
  }

  &::-webkit-scrollbar-track {
    background-color: ${theme.colors.tertiary};
    border-radius: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${theme.colors.primary};
    border-radius: 5px;
  }
`;
const TableItem = styled.span<ITableRows>`
  display: flex;
  border-bottom: 1px solid ${theme.colors.primary}40;

  span {
    padding: 0.6rem 0;
    flex: 0 0
      calc(
        ${(props) => (props.actions ? "85%" : "95%")} /
          ${(props) => (props.cols ? props.cols : 1)}
      );
    text-align: center;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-size: 0.9rem;
    display: flex;
    justify-content: center;
    align-items: center;

    &:first-child {
      flex: 0 0 5%;
      border-bottom: 0;
    }

    &.tableSimpleDescription {
      white-space: nowrap;
      justify-content: start;
    }

    &.actions {
      flex: 0 0 5%;

      button {
        border: none;
        padding: 0.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 10px;
        color: #fff;

        &.edit {
          background-color: #33b9f3;
        }

        &.delete {
          background-color: #fa5c34;
        }
      }
    }
  }
`;

const TableHead = styled(TableItem)`
  position: sticky;
  top: 0;
  background-color: #fff;
  border-bottom: 2px solid ${theme.colors.primary};
  span {
    font-weight: 700;
  }
`;

const NetFoundText = styled.p`
  color: ${theme.colors.texts};
  justify-self: center;
  align-self: center;
  font-size: 0.9rem;
  letter-spacing: 0.75px;
  margin-top: 2rem;
`;
