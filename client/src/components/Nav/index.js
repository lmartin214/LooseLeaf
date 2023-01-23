import React from "react";
import Auth from "../../utils/auth"; //Import auth for login and logout
import { Link } from "react-router-dom";
//Semantic UI for styling 
import { Menu, Button, MenuItem, Header, Image, Segment } from 'semantic-ui-react'

function Nav() {

  function showNavigation() {
    if (Auth.loggedIn()) {
      return (
        <Menu>
          <Menu.Item>
            <Link to="/orderHistory">
              Order History
            </Link>
          </Menu.Item>
          <Menu.Item>
            {/* this is not using the Link component to logout or user and then refresh the application to the start */}
            <Button href="/" onClick={() => Auth.logout()}>
              Logout
            </Button>
          </Menu.Item>
        </Menu>
      );
    } else {
      return (
        <Menu>
          <MenuItem>
            <Link to="/signup">
              Signup
            </Link>
          </MenuItem>
          <MenuItem>
            <Link to="/login">
              Login
            </Link>
          </MenuItem>
        </Menu>
      );
    }
  }

  return (
    <><Segment as="h1" textAlign="center">
 <Image
    src='../../images/looseLeafLogo.jpg'
    as='a'
    size='large'
    href='/'
    target='_blank'
  />
    </Segment><Header.Subheader>
        {showNavigation()}
      </Header.Subheader></>
  );
}

export default Nav;