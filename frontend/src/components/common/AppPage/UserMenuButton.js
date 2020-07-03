import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button, IconButton, MenuList, MenuItem, Paper, ClickAwayListener, Popper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

import { localStorage, api } from "../../../utils";
import colors from "../../../assets/colors.json";

const useStyles = makeStyles({
  menuPaper: { zIndex: "1000", borderTopLeftRadius: "0", borderTopRightRadius: 0, ...colors.userMenu.paper },
  menuItem: {
    ...colors.userMenu.button,
    "&:hover": {
      ...colors.userMenu.buttonHover,
    },
  },
  endMasquerade: { marginRight: "10px" },
  profileButton: {
    color: "white",
    padding: "0",
    height: "100%",
    width: "50px",
    borderRadius: 0,
    "&:hover": {
      backgroundColor: "rgba(0,0,0,0.3)",
    },
  },
});

function UserMenuButton({ masquerading }) {
  const classes = useStyles();

  const userButtonRef = useRef();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  function endMasquerade() {
    api
      .endMasquerade()
      .then((res) => {
        const { accessToken, refreshToken } = res.data;
        localStorage.setTokens(accessToken, refreshToken);
        window.location.href = "/dashboard";
      })
      .catch((err) => console.log(err));
  }

  const endMasqueradeButton = masquerading ? (
    <Button variant="contained" color="secondary" className={classes.endMasquerade} onClick={endMasquerade}>
      End Masquerade
    </Button>
  ) : null;

  return (
    <>
      {endMasqueradeButton}
      <IconButton
        className={classes.profileButton}
        ref={userButtonRef}
        aria-controls={userMenuOpen ? "menu-list-grow" : undefined}
        aria-haspopup="true"
        onClick={() => setUserMenuOpen(!userMenuOpen)}
      >
        <AccountCircleIcon fontSize="large" />
      </IconButton>

      <Popper open={userMenuOpen} anchorEl={userButtonRef.current} placement="bottom-end" disablePortal>
        <Paper className={classes.menuPaper}>
          <ClickAwayListener onClickAway={() => setUserMenuOpen(false)}>
            <MenuList autoFocusItem={userMenuOpen} id="menu-list-grow">
              <MenuItem component={Link} to="/go-premium" className={classes.menuItem}>
                Go Premium!
              </MenuItem>
              <MenuItem component={Link} to="/profile" className={classes.menuItem}>
                Profile
              </MenuItem>
              <MenuItem component={Link} to="/signout" className={classes.menuItem}>
                Sign Out
              </MenuItem>
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Popper>
    </>
  );
}

export default UserMenuButton;
