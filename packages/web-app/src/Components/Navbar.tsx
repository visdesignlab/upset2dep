import React, { FC } from 'react';
import { AppBar, Toolbar, Button } from '@material-ui/core';
import { serverPath } from '../App';
import { UserInfo } from '../Types/UserInfo';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

type NavbarProps = {
  user: UserInfo | null;
  logout: () => void;
};

const Navbar: FC<NavbarProps> = ({ user, logout }: NavbarProps) => {
  const loginButton = (
    <Button
      color="primary"
      variant="contained"
      href={`${serverPath}/api/user/oauth/google/login?return_url=${window.location.href}`}
      startIcon={<AccountCircleIcon />}
    >
      Login With Google
    </Button>
  );

  const logoutButton = (
    <Button
      color="primary"
      variant="contained"
      onClick={logout}
      startIcon={<ExitToAppIcon />}
    >
      Logout
    </Button>
  );

  return (
    <AppBar position="static" color="secondary">
      <Toolbar>{user ? logoutButton : loginButton}</Toolbar>
    </AppBar>
  );
};

export default Navbar;
