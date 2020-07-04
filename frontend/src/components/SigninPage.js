import React, { useState, useRef } from "react";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import { Grid, Paper, Typography as T, TextField, Button, Checkbox } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Error as ErrorIcon, Info as InfoIcon } from "@material-ui/icons";

import { validateEmail, validatePassword, MIN_PASS_LENGTH } from "../utils/validation.js";
import { localStorage, api } from "../utils";
import { refresh } from "../App.js";
import AppPage from "./common/AppPage";
import logo from "../assets/logo_green.png";

const useStyles = makeStyles({
  page: {
    height: "100%",
    width: "100%",
  },
  paper: {
    display: "inline-block",
    width: "400px",
    padding: "30px 20px 20px 20px",
  },
  inputs: { margin: "10px 0" },
  captions: { color: "grey", marginTop: "30px" },
  message: { paddingLeft: "5px", marginTop: "2px" },
  checkbox: {
    marginLeft: "-10px",
    "& span": {
      paddingTop: "3px",
    },
  },
  logo: {
    textAlign: "center",
    "& img": { height: "100px", width: "auto", display: "inline-block" },
  },
});

function SigninPage({ signup: isSignupPage, onSignin }) {
  const classes = useStyles();

  isSignupPage = !!isSignupPage;
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [infoMessage, setInfoMessage] = useState();
  const [loggedIn, setLoggedIn] = useState(false);

  const pageTitle = isSignupPage ? "VocTail | Sign Up" : "VocTail | Sign In";

  function signin(e) {
    e.preventDefault();
    setInfoMessage();
    setErrorMessage();

    const email = emailRef.current;
    const password = passwordRef.current;
    if (!validateEmail(email)) {
      setInfoMessage("Please provide a valid email address.");
      return;
    }

    api
      .login(email, password, rememberMe)
      .then(({ data: { accessToken, refreshToken } }) => {
        localStorage.setTokens(accessToken, refreshToken);
        setErrorMessage();
        setInfoMessage();
        setLoggedIn(true);
      })
      .catch((err) => {
        setInfoMessage();
        if (err.response.status === 412) setErrorMessage(err.response.data);
        else setErrorMessage("Sorry, something went wrong and we couldn't log you in!");
      })
      .finally(() => {
        refresh();
      });
  }

  function signup(e) {
    e.preventDefault();

    const name = nameRef.current;
    const email = emailRef.current;
    const password = passwordRef.current;
    if (!name || name.length < 1) {
      setInfoMessage("Please provide a name.");
      return;
    } else if (!validateEmail(email)) {
      setInfoMessage("Please provide a valid email.");
      return;
    } else if (!validatePassword(password)) {
      setInfoMessage(`Please make sure your password is at least ${MIN_PASS_LENGTH} characters long. `);
      return;
    }

    api
      .register(name, email, password)
      .then((res) => setErrorMessage())
      .catch((err) => {
        try {
          if (err.response.status === 412) setErrorMessage(err.response.data);
        } catch {
          setErrorMessage("Sorry, something went wrong and we couldn't sign you up!");
        }
      })
      .then(() => {
        setInfoMessage();
        api
          .login(email, password, rememberMe)
          .then(({ data: { accessToken, refreshToken } }) => {
            localStorage.setTokens(accessToken, refreshToken);
            setLoggedIn(true);
          })
          .catch((err) => {
            try {
              if (err.response.status === 412) setErrorMessage(err.response.data);
            } catch {
              setErrorMessage("Sorry, something went wrong and we couldn't log you in!");
            }
          });
      });
  }

  if (loggedIn || localStorage.hasTokens()) return <Redirect to="/dashboard" />;

  return (
    <AppPage id="login-page" title={pageTitle}>
      <Grid className={classes.page} container alignItems="center" justify="center">
        <Paper component="span" elevation={4} className={classes.paper}>
          <div className={classes.logo}>
            <img src={logo} alt="logo" />
          </div>

          <form className={classes.inputs} onSubmit={isSignupPage ? signup : signin}>
            {!!errorMessage && (
              <T variant="caption" color="error" component={Grid} container alignItems="center">
                <ErrorIcon fontSize="small" />
                <span className={classes.message}>{errorMessage}</span>
              </T>
            )}
            {!!infoMessage && (
              <T variant="caption" color="secondary" component={Grid} container alignItems="center">
                <InfoIcon fontSize="small" />
                <span className={classes.message}>{infoMessage}</span>
              </T>
            )}

            {isSignupPage && (
              <TextField
                variant="outlined"
                placeholder="John Doe"
                label="Name"
                fullWidth
                margin="dense"
                className={classes.inputs}
                onChange={(e) => (nameRef.current = e.target.value)}
              ></TextField>
            )}

            <TextField
              variant="outlined"
              placeholder="username@example.com"
              label="Email"
              fullWidth
              margin="dense"
              className={classes.inputs}
              onChange={(e) => (emailRef.current = e.target.value)}
            ></TextField>

            <TextField
              variant="outlined"
              placeholder="password"
              label="Password"
              type="password"
              fullWidth
              margin="dense"
              className={classes.inputs}
              onChange={(e) => (passwordRef.current = e.target.value)}
            ></TextField>

            <Button
              type="submit"
              color="primary"
              variant="contained"
              fullWidth
              className={classes.inputs}
              disableElevation
            >
              {isSignupPage ? "Sign Up Now" : "Sign In"}
            </Button>

            <T variant="body2" className={classes.checkbox}>
              <Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
              <span>Remember me!</span>
            </T>
          </form>

          {isSignupPage ? (
            <T className={classes.captions}>
              Already have an account? Sign in <Link to="/signin">here</Link>!
            </T>
          ) : (
            <T className={classes.captions}>
              Don't have an account? Sign up <Link to="/signup">here</Link>!
            </T>
          )}
        </Paper>
      </Grid>
    </AppPage>
  );
}

export default SigninPage;
