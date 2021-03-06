import theme from "@utils/theme";
import Link from "next/link";
import React from "react";
import styled from "styled-components";
import {
  GrHomeRounded,
  GrHtml5,
  GrIteration,
  GrShieldSecurity,
} from "react-icons/gr";
import { RiSettingsLine, RiBubbleChartLine } from "react-icons/ri";
import { useRouter } from "next/router";
import TClogo from "@atoms/tc-logo";

type Props = {};

const Sidebar = (props: Props) => {
  const router = useRouter();

  return (
    <SidebarContainerST>
      <SidebarItemsST>
        <SidebarLogo>
          <TClogo active={false} />
        </SidebarLogo>

        {/* <p className="pTitle">Menu</p> */}

        <Link href="/admin" passHref>
          <LinkItemST className={router.pathname == "/admin" ? "active" : ""}>
            <GrHomeRounded className="icon" />
            <span>Home</span>
          </LinkItemST>
        </Link>
        <Link href="/admin/slogans" passHref>
          <LinkItemST
            className={router.pathname == "/admin/slogans" ? "active" : ""}
          >
            <GrHtml5 className="icon" />
            <span>Slogans</span>
          </LinkItemST>
        </Link>
        <Link href="/admin/posts" passHref>
          <LinkItemST
            className={router.pathname == "/admin/posts" ? "active" : ""}
          >
            <GrIteration className="icon" />
            <span>Posts</span>
          </LinkItemST>
        </Link>
        <Link href="/admin/site-settings" passHref>
          <LinkItemST
            className={
              router.pathname == "/admin/site-settings" ? "active" : ""
            }
          >
            <RiSettingsLine className="icon" />
            <span>Site Settings</span>
          </LinkItemST>
        </Link>
        <Link href="/admin/site-settings" passHref>
          <LinkItemST
            className={
              router.pathname == "/admin/site-settings" ? "active" : ""
            }
          >
            <RiBubbleChartLine className="icon" />
            <span>Site Statistics</span>
          </LinkItemST>
        </Link>
        <Link href="/admin/site-statistics" passHref>
          <LinkItemST
            className={
              router.pathname == "/admin/site-statistics" ? "active" : ""
            }
          >
            <GrShieldSecurity className="icon" />
            <span>Admin Settings</span>
          </LinkItemST>
        </Link>
      </SidebarItemsST>

      <SidebarProfileAreaST>
        <div className="img__holder">
          <ImageProfile
            className="img-fluid"
            src="https://food-pricer.netlify.app/img/user.jpg"
          />
          <span className="active"></span>
        </div>
        <strong>John Doe</strong>
      </SidebarProfileAreaST>
    </SidebarContainerST>
  );
};

export default Sidebar;

const SidebarContainerST = styled.div`
  width: 15%;
  flex: 0 0 15%;
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  margin: 32px 0;
  border-right: 1px solid ${theme.colors.tertiary};
`;

const SidebarLogo = styled.div`
  margin: 1rem 2rem 2rem 2rem;
`;

const SidebarItemsST = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  width: 100%;
  .pTitle {
    width: 100%;
    letter-spacing: 2px;
    margin: 1rem 0;
    color: ${theme.colors.primary};
    padding: 0 3rem;
  }
`;

const LinkItemST = styled.a`
  width: 100%;
  padding: 0.25rem 2rem;
  margin: 0.5rem 0;
  color: ${theme.colors.texts};
  border-radius: 0 8px 8px 0;
  font-size: 0.8rem;
  letter-spacing: 1px;
  transition: 0.3s ease all;

  span {
    margin: 0 0.5rem 0 1rem;
    font-weight: 500;
    font-size: 0.8rem;
  }

  .icon {
    color: ${theme.colors.primary};
    padding: 0.35rem;
    font-size: 2rem;
  }

  &.active {
    color: ${theme.colors.primary};
    border-left: 4px solid ${theme.colors.primary};

    .icon {
      color: ${theme.colors.primary};
    }
  }
`;

const SidebarProfileAreaST = styled.div`
  margin: auto 0;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .img__holder {
    position: relative;
    border: 2px solid ${theme.colors.tertiary}55;
    padding: 5px;
    border-radius: 15px;
    width: 55px;
    height: 55px;
  }

  span.active {
    background-color: #11be11;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    position: absolute;
    top: 70%;
    right: -6px;
  }

  strong {
    font-weight: 600;
    font-size: 0.85rem;
    margin-top: 0.5rem;
    width: 150px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: center;
  }
`;

const ImageProfile = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  object-fit: cover;
`;
