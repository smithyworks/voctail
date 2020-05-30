import React, { useState, useRef } from "react";
import { Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Link, useRouteMatch } from "react-router-dom";
import { validateEmail, validatePassword, MIN_PASS_LENGTH } from "voctail-utils";
import { Grid, Paper, Typography as T, TextField, Button, Checkbox } from "@material-ui/core";
import { Error as ErrorIcon, Info as InfoIcon } from "@material-ui/icons/";
import { tokens, requests as r } from "../utils";

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
  checkbox: { margin: "0 5px 0 -10px" },
  captions: { color: "grey", marginTop: "30px" },
  message: { paddingLeft: "5px", marginTop: "2px" },
});

function SigninPage({ signup: isSignupPage }) {
  const classes = useStyles();
  const { path } = useRouteMatch();
  console.log("SigninPage", path);

  isSignupPage = !!isSignupPage;
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [errorMessage, setErrorMessage] = useState();
  const [infoMessage, setInfoMessage] = useState();
  const [loggedIn, setLoggedIn] = useState(false);

  function signin(e) {
    e.preventDefault();

    const email = emailRef.current;
    const password = passwordRef.current;

    if (!validateEmail(email)) {
      setInfoMessage("Please provide a valid email address.");
      return;
    }

    r.login(email, password)
      .then(({ data: { accessToken, refreshToken } }) => {
        console.log("login success");
        tokens.setTokens(accessToken, refreshToken);
        setErrorMessage();
        setInfoMessage();
        setLoggedIn(true);
      })
      .catch(err => {
        setInfoMessage();
        try {
          if (err.response.status === 412) setErrorMessage(err.response.data);
        } catch {
          setErrorMessage("Sorry, omething went wrong and we couldn't log you in!");
        }
      });
  }

  function signup() {
    const name = nameRef.current;
    const email = emailRef.current;
    const password = passwordRef.current;

    console.log(name, email, password);
    console.log(process.env);

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

    const promise = r.register(name, email, password);
    console.log(promise);
    promise
      .then(res => {
        setErrorMessage();
        setInfoMessage();

        signin();
      })
      .catch(err => {
        setInfoMessage();
        try {
          if (err.response.status === 412) setErrorMessage(err.response.data);
        } catch {
          setErrorMessage("Sorry, omething went wrong and we couldn't sign you up!");
        }
      });
  }

  if (loggedIn) {
    console.log("tokens", tokens.getTokens());
    console.log("redirect");
    return <Redirect to="/dashboard" />;
  }
  return (
    <Grid id="login-page" className={classes.page} container alignItems="center" justify="center">
      <Paper component="span" elevation={4} className={classes.paper}>
        <div className={classes.logo}>
          <T variant="h3" align="center" gutterBottom>
            VocTail
          </T>
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
              onChange={e => (nameRef.current = e.target.value)}
            ></TextField>
          )}

          <TextField
            variant="outlined"
            placeholder="username@example.com"
            label="Email"
            fullWidth
            margin="dense"
            className={classes.inputs}
            onChange={e => (emailRef.current = e.target.value)}
          ></TextField>

          <TextField
            variant="outlined"
            placeholder="password"
            label="Password"
            type="password"
            fullWidth
            margin="dense"
            className={classes.inputs}
            onChange={e => (passwordRef.current = e.target.value)}
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

          {!isSignupPage && (
            <Grid container alignItems="center">
              <Checkbox disableRipple className={classes.checkbox} />
              <T display="inline">Remember Me</T>
            </Grid>
          )}
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
  );
}

export default SigninPage;
