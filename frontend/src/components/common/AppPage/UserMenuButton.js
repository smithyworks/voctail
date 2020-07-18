import React, { useRef, useState, useContext } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { MenuList, MenuItem, Paper, ClickAwayListener, Popper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import StarIcon from "@material-ui/icons/Star";

import { localStorage, api } from "../../../utils";
import { VTButton } from "../../common";
import colors from "../../../assets/colors.json";
import { UserContext } from "../../../App";
import ProfilePicture from "../../ProfilePage/ProfilePicture";

const useStyles = makeStyles({
  container: { height: "60px", display: "flex", alignItems: "center" },
  menuPaper: { zIndex: "1000", borderTopLeftRadius: "0", borderTopRightRadius: 0, ...colors.userMenu.paper },
  menuItem: {
    ...colors.userMenu.button,
    "&:hover": {
      ...colors.userMenu.buttonHover,
    },
  },
  menuItemActive: {
    ...colors.topNav.buttonHover,
    "&:hover": {
      ...colors.userMenu.buttonHover,
    },
  },
  endMasquerade: { margin: "0 10px" },
  profileButton: {
    height: "60px",
    width: "60px",
    display: "inline-block",
    padding: "5px",
    cursor: "pointer",

    ...colors.topNav.button,
    "&:hover": {
      ...colors.topNav.buttonHover,
    },
  },
  profileButtonActive: {
    height: "60px",
    width: "60px",
    display: "inline-block",
    padding: "5px",
    cursor: "pointer",

    ...colors.topNav.activeButton,
    "&:hover": {
      ...colors.topNav.activeButtonHover,
    },
  },
});

function UserMenuButton({ masquerading, premium }) {
  const classes = useStyles();

  const userButtonRef = useRef();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const user = useContext(UserContext);

  const { path } = useRouteMatch();
  const profileButtonActive = path === "/profile" || path === "/account";

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
    <div className={classes.container}>
      {goPremiumButton}

      {endMasqueradeButton}

      <div
        className={profileButtonActive ? classes.profileButtonActive : classes.profileButton}
        ref={userButtonRef}
        aria-controls={userMenuOpen ? "menu-list-grow" : undefined}
        aria-haspopup="true"
        onClick={() => setUserMenuOpen(!userMenuOpen)}
      >
        <ProfilePicture dimension="50px" user={user} fontSize="20px" />
      </div>

      <Popper open={userMenuOpen} anchorEl={userButtonRef.current} placement="bottom-end" disablePortal>
        <Paper className={classes.menuPaper}>
          <ClickAwayListener onClickAway={() => setUserMenuOpen(false)}>
            <MenuList autoFocusItem={userMenuOpen} id="menu-list-grow">
              <MenuItem
                component={Link}
                to="/account"
                className={path === "/account" ? classes.menuItemActive : classes.menuItem}
              >
                Account
              </MenuItem>
              <MenuItem
                component={Link}
                to="/profile"
                className={path === "/profile" ? classes.menuItemActive : classes.menuItem}
              >
                Profile
              </MenuItem>
              <MenuItem component={Link} to="/signout" className={classes.menuItem}>
                Sign Out
              </MenuItem>
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Popper>
    </div>
  );
}

export default UserMenuButton;
