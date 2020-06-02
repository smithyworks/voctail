import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Grid,
  Typography as T,
  AppBar,
  Button,
  Toolbar,
  IconButton,
  Menu,
  MenuList,
  MenuItem,
  Paper,
  ClickAwayListener,
  Grow,
  Popper,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

const useStyles = makeStyles({
  bar: { backgroundColor: "#555" },
  toolbar: {
    height: "50px",
  },
  leftButtons: { height: "100%" },
  logo: {
    textDecoration: "none",
    color: "white",
    padding: "0 20px",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    fontSize: "24px",
    fontWeight: "bold",
  },
  link: {
    textDecoration: "none",
    color: "#ddd",
    padding: "4px 20px 0 20px",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    "&:hover": {
      color: "white",
      backgroundColor: "rgba(0,0,0,0.3)",
    },
  },
  activeLink: {
    textDecoration: "none",
    color: "black",
    backgroundColor: "#ddd",
    padding: "4px 20px 0 20px",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
  },
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
  menuPaper: { zIndex: "1000", borderTopLeftRadius: "0", borderTopRightRadius: 0 },
  signinButtonsContainer: { height: "100%" },
  signinButton: { margin: "0 10px", color: "white" },
  signupButton: { margin: "0 10px", color: "white", borderColor: "white" },
});

function SigninButtons() {
  const classes = useStyles();

  return (
    <Grid container alignItems="center" className={classes.signinButtonsContainer}>
      <Button component={Link} to="/signin" className={classes.signinButton}>
        Sign In
      </Button>
      <Button component={Link} to="/signup" variant="outlined" className={classes.signupButton}>
        Sign Up
      </Button>
    </Grid>
  );
}

function UserMenuButton() {
  const classes = useStyles();

  const userButtonRef = useRef();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <>
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
              <MenuItem ocomponent={Link} to="/profile">
                Profile
              </MenuItem>
              <MenuItem component={Link} to="/account">
                Account
              </MenuItem>
              <MenuItem component={Link} to="/signout">
                Sign Out
              </MenuItem>
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Popper>
    </>
  );
}

function NavButtons({ location }) {
  const classes = useStyles();

  const dashboardLinkClass = location === "dashboard" ? classes.activeLink : classes.link;
  const documentsLinkClass = location === "documents" ? classes.activeLink : classes.link;
  const quizzesLinkClass = location === "quizzes" ? classes.activeLink : classes.link;
  const classroomsLinkClass = location === "classrooms" ? classes.activeLink : classes.link;

  return (
    <>
      <Link to="/dashboard" className={dashboardLinkClass}>
        Dashboard
      </Link>
      <Link to="/documents" className={documentsLinkClass}>
        Documents
      </Link>
      <Link to="/quizzes" className={quizzesLinkClass}>
        Quizzes
      </Link>
      <Link to="/classrooms" className={classroomsLinkClass}>
        Classrooms
      </Link>
    </>
  );
}

function TopNav({ location, loggedIn }) {
  const classes = useStyles();

  const navButtons = loggedIn ? <NavButtons location={location} /> : null;
  const rightContent = loggedIn ? <UserMenuButton /> : <SigninButtons />;

  return (
    <AppBar position="absolute" className={classes.bar}>
      <Grid className={classes.toolbar} container alignItems="stretch" justify="space-between">
        <Grid item>
          <Grid container alignItems="stretch" className={classes.leftButtons}>
            <Link to="/" className={classes.logo}>
              VocTail
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
