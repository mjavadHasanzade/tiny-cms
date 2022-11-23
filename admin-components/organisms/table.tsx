/* eslint-disable @next/next/no-img-element */
import Title from "@admin/atoms/title";
import objectExtracter from "@utils/objectExtracter";
import theme from "@utils/admin/theme";
import React, { FC, useEffect, useState } from "react";
import styled from "styled-components";
import { BiPencil } from "react-icons/bi";
import { FiEye, FiTrash2 } from "react-icons/fi";
// import { getAxiosInstanse } from "api/api";
import Link from "next/link";
// import { useToasts } from "react-toast-notifications";
import generateDate from "@utils/dateGen";
import Check from "@admin/atoms/check";
import { getCookie } from "@utils/cookie";
import prisma from "lib/prisma";
import stripTags from "@utils/stripe-tags";
import { useAppContext } from "context/app-context";
import { toast } from "react-hot-toast";
import OffCanvas from "@admin/molecules/off-canvas";
import RenderUI from "@utils/admin/render-ui";

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
  const [offCanvasActive, setOffCanvasActive] = useState<any | null>();

  const { setLoaderActiver } = useAppContext();

  if (minus.length >= 1) {
    head = objectExtracter(tableBody.length >= 1 ? tableBody[0] : {}, minus);
  } else {
    head = objectExtracter(tableBody[0], [""]);
  }

  let cols = head.length;

  const deleteItem = async (path: string, id: number | string) => {
    setLoaderActiver(true);
    fetch(path + id, {
      method: "delete",
      headers: { xauth: getCookie("xauth", document.cookie) },
    }).then(async (res) => {
      const newrows = await fetch(apiPath);
      const tb = await newrows.json();
      setTableBody(tb.rows);
      setLoaderActiver(false);
      const data = await res.json();
      toast.success(data.message);
    });
  };

  const openCanvas = async (path: string, id: number | string) => {
    setLoaderActiver(true);
    fetch(path + id, {
      method: "get",
      headers: { xauth: getCookie("xauth", document.cookie) },
    }).then(async (res) => {
      setLoaderActiver(false);
      const data = await res.json();
      setOffCanvasActive(data);
    });
  };

  return (
    <>
      <OffCanvas active={!!offCanvasActive} handler={setOffCanvasActive}>
        {offCanvasActive &&
          Object.keys(offCanvasActive).map((oKey, index) => {
            return (
              <RenderUI key={index} oKey={oKey} value={offCanvasActive[oKey]} />
            );
          })}
      </OffCanvas>
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
                  headItem === "content" ||
                  headItem === "description" ||
                  headItem === "text" ? (
                    <span className="tableSimpleDescription">
                      {stripTags(item[headItem]).slice(0, 15) + "..."}
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
                      ) : headItem === "cover" ||
                        headItem === "image" ||
                        headItem === "img" ? (
                        <img src={item[headItem]} alt={item["title"]} />
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
                  <span className="actions">
                    <button
                      className="info"
                      onClick={() => openCanvas(apiPath, item.id)}
                    >
                      <FiEye />
                    </button>
                  </span>
                </>
              )}
            </TableItem>
          ))}
        </TableContainerST>
      </div>
    </>
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
        ${(props) => (props.actions ? "80%" : "95%")} /
          ${(props) => (props.cols ? props.cols : 1)}
      );
    width: calc(
      ${(props) => (props.actions ? "80%" : "95%")} /
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
      justify-content: center;
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

        &.info {
          background-color: #8a8640;
        }
      }
    }

    img {
      width: 50px;
      height: 50px;
      border-radius: 10px;
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
