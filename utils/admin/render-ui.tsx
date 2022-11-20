import { FC } from "react";
import ImageSelector from "@admin/atoms/image-selector";
import stripTags from "@utils/stripe-tags";
import styled from "styled-components";
import generateDate from "@utils/dateGen";
import Checkbox from "@admin/atoms/check";

type Props = {
  oKey: string;
  value: string;
};

const renderer = (oKey: string, value: any) => {
  switch (oKey) {
    case "cover":
    case "image":
    case "img":
      return <ImageSelector img={value}></ImageSelector>;
      break;

    case "content":
    case "description":
      return stripTags(value);
      break;

    case "createdAt":
    case "updatedAt":
      return generateDate(value, true);
      break;

    case "published":
      return (
        <Checkbox checked={Boolean(value)} name="isActive" disabled={true} />
      );
      break;

    case "subContent":
      return (
        <SubContentWrapperST>
          {value.map((item: any, index: number) => {
            return (
              <div key={index}>
                Name
                <div>{item.name}</div>
                Link
                <div>{item.link}</div>
                Content
                <div>{item.content}</div>
                Image
                <ImageSelector img={item.image}></ImageSelector>
              </div>
            );
          })}
        </SubContentWrapperST>
      );

    default:
      return <div>{JSON.stringify(value)}</div>;
      break;
  }
};

const RenderUI: FC<Props> = ({ oKey, value }) => {
  return (
    <ItemST>
      <div className="title">{oKey}</div>
      {renderer(oKey, value)}
    </ItemST>
  );
};

export default RenderUI;

const ItemST = styled.div`
  margin: 1rem 0;
  padding: 0 0.5rem;
  font-size: .9rem;
  .title {
    border-bottom: 1px solid #0007;
    font-size: 1rem;
    margin-bottom: 0.5rem;
    padding-bottom: 0.5rem;
    font-weight: 600;
  }
`;

const SubContentWrapperST = styled.div`
  display: flex;
  flex-wrap: wrap;

  & > * {
    flex: 0 0 calc(50% - 1rem);
    margin: 0.5rem;
    border: 1px solid #0004;
    padding: 0.5rem;

    .image-selector {
      margin: 0;
    }
  }
`;
