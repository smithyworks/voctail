import React from "react";
import { Link } from "react-router-dom";
import { Grid, Typography as T } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  container: { height: "100%", width: "100%" },
  grid: { height: "100%", width: "100%" },
});

function Error404Page({ ...props }) {
  const classes = useStyles();
  return (
    <div id="404-page" className={classes.container}>
      <Grid className={classes.grid} container justify="center" alignItems="center" direction="column">
        <T variant="h4">404! You seem to have gotten yourself lost!</T>
        <Link to="/dashboard">Dashboard</Link> | <Link to="/signin">Signin</Link>
      </Grid>
    </div>
  );
}

export default Error404Page;
