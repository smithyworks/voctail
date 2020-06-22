import React from "react";
import { Link } from "react-router-dom";
import { Grid, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
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

export default SigninButtons;
