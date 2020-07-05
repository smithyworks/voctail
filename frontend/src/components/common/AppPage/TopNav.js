import React from "react";
import { Link } from "react-router-dom";
import { Grid, AppBar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import logo from "../../../assets/logo_white.png";
import colors from "../../../assets/colors.json";
import SigninButtons from "./SigninButtons.js";
import UserMenuButton from "./UserMenuButton.js";
import NavButtons from "./NavButtons.js";

const useStyles = makeStyles({
  bar: { ...colors.topNav.bar },
  toolbar: {
    height: "50px",
  },
  leftButtons: { height: "100%" },
  logoLink: { height: "50px", padding: "0 10px" },
  logo: {
    height: "40px",
    margin: "5px 0",
  },
});

function TopNav({ location, loggedIn, isAdmin, masquerading, premium }) {
  const classes = useStyles();

  const navButtons = loggedIn ? <NavButtons location={location} isAdmin={isAdmin} /> : null;
  const rightContent = loggedIn ? <UserMenuButton masquerading={masquerading} premium={premium} /> : <SigninButtons />;

  return (
    <AppBar position="static" className={classes.bar}>
      <Grid className={classes.toolbar} container alignItems="stretch" justify="space-between">
        <Grid item>
          <Grid container alignItems="stretch" className={classes.leftButtons}>
            <Link to="/" className={classes.logoLink}>
              <img src={logo} className={classes.logo} alt="VocTail" />
            </Link>
            {navButtons}
          </Grid>
        </Grid>

        <Grid item>{rightContent}</Grid>
      </Grid>
    </AppBar>
  );
}

export default TopNav;
