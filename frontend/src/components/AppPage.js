import React, { useRef, useState, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Grid,
  AppBar,
  Button,
  IconButton,
  MenuList,
  MenuItem,
  Paper,
  ClickAwayListener,
  Popper,
  Container,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

import { localStorage, api } from "../utils";
import { UserContext } from "../App.js";

import logo from "../images/logo_white.png";

const useStyles = makeStyles({
  bar: { backgroundColor: "#555" },
  toolbar: {
    height: "50px",
  },
  leftButtons: { height: "100%" },
  logoLink: { height: "50px", padding: "0 10px" },
  logo: {
    height: "40px",
    margin: "5px 0",
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
  endMasquerade: { marginRight: "10px" },
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

function NavButtons({ location, isAdmin }) {
  const classes = useStyles();

  const dashboardLinkClass = location === "dashboard" ? classes.activeLink : classes.link;
  const documentsLinkClass = location === "documents" ? classes.activeLink : classes.link;
  const quizzesLinkClass = location === "quizzes" ? classes.activeLink : classes.link;
  const classroomsLinkClass = location === "classrooms" ? classes.activeLink : classes.link;
  const adminLinkClass = location === "admin" ? classes.activeLink : classes.link;

  const adminLink = isAdmin ? (
    <Link to="/admin" className={adminLinkClass}>
      Admin
    </Link>
  ) : null;

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
      {adminLink}
    </>
  );
}

function TopNav({ location, loggedIn, isAdmin, masquerading }) {
  const classes = useStyles();

  const navButtons = loggedIn ? <NavButtons location={location} isAdmin={isAdmin} /> : null;
  const rightContent = loggedIn ? <UserMenuButton masquerading={masquerading} /> : <SigninButtons />;

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

// The AppPage is meant to be rendered directly into the id="root" element.

function AppPage({ children, id, location, title }) {
  const user = useContext(UserContext);

  if (title) window.document.title = title;
  else if (location === "dashboard") window.document.title = "VocTail | Dashboard";
  else if (location === "documents") window.document.title = "VocTail | Documents";
  else if (location === "quizzes") window.document.title = "VocTail | Quizzes";
  else if (location === "classrooms") window.document.title = "VocTail | Classrooms";
  else if (location === "admin") window.document.title = "VocTail | Admin";
  else window.document.title = "VocTail";

  return (
    <Grid container direction="column" style={{ height: "100%" }}>
      <TopNav
        location={location}
        loggedIn={localStorage.hasTokens()}
        isAdmin={!!user?.admin}
        masquerading={!!user?.masquerading}
      />
      <Grid item xs style={{ overflowX: "hidden", overflowY: "auto" }}>
        <Container id={id} style={{ height: "100%" }}>
          {children}
        </Container>
      </Grid>
    </Grid>
  );
}

export default AppPage;
