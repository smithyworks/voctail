import React, { useContext, useState, useRef, useEffect } from "react";
import { Grid, Container, Snackbar, IconButton, Typography } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core/styles";

import { localStorage, api } from "../../../utils";
import { UserContext } from "../../../App.js";
import TopNav from "./TopNav.js";
import { useRouteMatch, Link } from "react-router-dom";

export const toasts = {
  _toast: (type, msg) => console.log(type, msg), // will be overwritten
  toastSuccess: function (msg) {
    this._toast("success", msg);
  },
  toastError: function (msg) {
    this._toast("error", msg);
  },
  toastWarning: function (msg) {
    this._toast("warning", msg);
  },
  toastInfo: function (msg) {
    this._toast("info", msg);
  },
};

const useStyles = makeStyles({
  pageContainer: {
    height: "100%",
  },
  bodyContainer: { overflowX: "hidden", overflowY: "auto", height: "100%" },
  body: {
    height: "100%",
  },
  noPadding: {
    padding: 0,
    margin: 0,
    height: "100%",
  },
  alert: {
    minWidth: "500px",
  },
  snackbarCloseIcon: {
    margin: "-12px 0 -12px 5px",
  },
  breadcrumbs: {
    padding: "10px 0",
  },
});

// The AppPage is meant to be rendered directly into the id="root" element.

function AppPage({ children, id, location, title, noPadding, noBreadcrumbs, maxWidth }) {
  const classes = useStyles();
  const user = useContext(UserContext);

  const { path, params } = useRouteMatch();
  const [breadcrumbs, setBreadcrumbs] = useState();
  useEffect(() => {
    // console.log(path);
    if (path === "/documents/:document_id") {
      api.documentTitle(params.document_id).then((res) => {
        setBreadcrumbs(
          <Typography className={classes.breadcrumbs}>
            <Link to="/dashboard">Dashboard</Link> > {res.data}
          </Typography>
        );
      });
    } else if (path === "/quizzes/:id") {
      api.quizTitle(params.id).then((res) => {
        setBreadcrumbs(
          <Typography className={classes.breadcrumbs}>
            <Link to="/quizzes">Quizzes</Link> > {res.data}
          </Typography>
        );
      });
    }
  }, [path, params]); // eslint-disable-line

  if (title) window.document.title = title;
  else if (location === "dashboard") window.document.title = "VocTail | Dashboard";
  else if (location === "documents") window.document.title = "VocTail | Documents";
  else if (location === "quizzes") window.document.title = "VocTail | Quizzes";
  else if (location === "classrooms") window.document.title = "VocTail | Classrooms";
  else if (location === "admin") window.document.title = "VocTail | Admin";
  else window.document.title = "VocTail";

  const [snackbarOpen, setSnackbarOpen] = useState();
  const snackbarProps = useRef();
  toasts._toast = (severity, message) => {
    snackbarProps.current = { severity, message };
    setSnackbarOpen(true);
  };

  return (
    <Grid container direction="column" className={classes.pageContainer}>
      <TopNav
        location={location}
        loggedIn={localStorage.hasTokens()}
        isAdmin={!!user?.admin}
        masquerading={!!user?.masquerading}
        premium={!!user?.premium}
      />

      <Grid item xs className={classes.bodyContainer}>
        <Container
          id={id}
          className={noPadding ? classes.noPadding : classes.body}
          maxWidth={!!noPadding ? false : maxWidth ?? "lg"}
        >
          {!noBreadcrumbs && breadcrumbs}
          {children}
        </Container>
      </Grid>

      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          elevation={6}
          variant="filled"
          severity={snackbarProps.current?.severity}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              onClick={() => setSnackbarOpen(false)}
              className={classes.snackbarCloseIcon}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
          className={classes.alert}
        >
          {snackbarProps.current?.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
}

export default AppPage;
