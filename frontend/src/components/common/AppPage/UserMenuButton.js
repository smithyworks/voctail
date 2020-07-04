import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { IconButton, MenuList, MenuItem, Paper, ClickAwayListener, Popper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import StarIcon from "@material-ui/icons/Star";

import { localStorage, api } from "../../../utils";
import { VTButton } from "../../common";
import colors from "../../../assets/colors.json";

const useStyles = makeStyles({
  menuPaper: { zIndex: "1000", borderTopLeftRadius: "0", borderTopRightRadius: 0, ...colors.userMenu.paper },
  menuItem: {
    ...colors.userMenu.button,
    "&:hover": {
      ...colors.userMenu.buttonHover,
    },
  },
  endMasquerade: { margin: "0 10px" },
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

function UserMenuButton({ masquerading, premium }) {
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

  const goPremiumButton = premium ? null : (
    <VTButton
      accept
      variant="contained"
      className={classes.endMasquerade}
      startIcon={<StarIcon />}
      component={Link}
      to="/account"
    >
      Go premium!
    </VTButton>
  );

  const endMasqueradeButton = masquerading ? (
    <VTButton
      neutral
      variant="contained"
      className={classes.endMasquerade}
      onClick={endMasquerade}
      startIcon={<ExitToAppIcon />}
    >
      End Masquerade
    </VTButton>
  ) : null;

  return (
    <>
      {goPremiumButton}

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
              <MenuItem component={Link} to="/account" className={classes.menuItem}>
                Account
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
