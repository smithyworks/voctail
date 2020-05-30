import React from "react";
import { Link } from "react-router-dom";
import { Grid, Typography as T } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  container: { height: "100%", width: "100%" },
  grid: { height: "100%", width: "100%" },
});

function IntroPage({ ...props }) {
  const classes = useStyles();
  return (
    <div id="intro-page" className={classes.container}>
      <Grid className={classes.grid} container justify="center" alignItems="center" direction="column">
        <T variant="h4">Welcome to the world of Voctail!</T>
        <Link to="/signin">Sign in</Link> or <Link to="/signup">sign up!</Link>
      </Grid>
    </div>
  );
}

export default IntroPage;
