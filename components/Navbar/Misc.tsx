import React from "react";
import * as UI from "./style";
import { faUserCircle } from "@fortawesome/free-regular-svg-icons";
import {
  Navbar as ReactNavbar,
  Nav as ReactNav,
  Dropdown,
} from "react-bootstrap";
import { useActiveUser, UserCurrentStatus } from "../UserProvider";
import { useRouter } from "next/router";
import Link from "next/link";

/**
 * Nav component
 */
export const Navbar: React.FC = () => {
  const { user, status } = useActiveUser();
  const router = useRouter();

  const navbarUserDropdown = (
    <Dropdown>
      <UI.NavbarDropdownToggle id="navbar-account-dropdown">
        <UI.NavbarUserIcon icon={faUserCircle} />
      </UI.NavbarDropdownToggle>
      <Dropdown.Menu style={{overflow: 'hidden'}} className="dropdown-menu-right">
        <Dropdown.Header>{user?.email}</Dropdown.Header>
        <Dropdown.Item href="/auth/logout?r=/apply">Logout</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );

  return (
    <UI.Navbar expand="sm">
      <UI.NavbarSpan>
        <ReactNavbar.Toggle aria-controls="navbar-responsive-dropdown" />
        {/* <Link href = '/' as="/"> */}
          <UI.NavbarLogo
            src="/static/img/logos/main-23.svg"
            className="d-none d-sm-block" // Hide icon below sm screens.
          ></UI.NavbarLogo>
        {/* </Link> */}
      </UI.NavbarSpan>
      <ReactNavbar.Collapse
        id="navbar-responsive-dropdown"
        className="justify-content-center"
      >
        <ReactNav>
          <UI.NavLink href="/">Home</UI.NavLink>
          <UI.NavLink href="/apply">Dashboard</UI.NavLink>
          <UI.NavLink href="/apply/application">Application</UI.NavLink>
          {user?.isAdmin ? ( <UI.NavLink href="/apply/admin">Admin</UI.NavLink> ) : null}
        </ReactNav>
        <span
          className="d-sm-none" // Hide above sm screens.
        >
          <UI.NavUserInfoDivider />
          {status === UserCurrentStatus.LoggedIn ? (
            <>
              <UI.NavUserInfo className="text-muted">
                {user?.email}
              </UI.NavUserInfo>
              <UI.NavLink
                href={`/auth/logout?r=${
                  process.browser
                    ? window.location.pathname
                    : `${router.basePath}${router.asPath}`
                }`}
              >
                Logout
              </UI.NavLink>
            </>
          ) : (
            <UI.NavLink
              href={
                `/auth/login?r=
                ${process.browser
                  ? window.location.pathname 
                  : `${router.basePath}${router.asPath}`.replace(/\/$/, '')}`
              }
            >
              Login / Signup
            </UI.NavLink>
          )}
        </span>
      </ReactNavbar.Collapse>
      <UI.NavbarSpan
        className="d-none d-sm-block text-right" // Hide icon below sm screens.
      >
        {status === UserCurrentStatus.LoggedIn ? (
          navbarUserDropdown
        ) : (
          <UI.NavbarLoginLink
          href={
            `/auth/login?r=
            ${process.browser
              ? window.location.pathname 
              : `${router.basePath}${router.asPath}`.replace(/\/$/, '')}`
          }
          >
            Login / Signup
          </UI.NavbarLoginLink>
        )}
      </UI.NavbarSpan>
    </UI.Navbar>
  );
};
