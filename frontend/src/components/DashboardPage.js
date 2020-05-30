import React from "react";
import { Link } from "react-router-dom";
import { Grid, Typography as T } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  container: { height: "100%", width: "100%" },
  grid: { height: "100%", width: "100%" },
});

function Dashboard({ ...props }) {
  const classes = useStyles();
  return (
    <div id="404-page" className={classes.container}>
      <Grid className={classes.grid} container justify="center" alignItems="center" direction="column">
        <T variant="h4">Welcome to your Dashboard!</T>
        <Link to="/signout">Signout</Link>
      </Grid>
    </div>
  );
}

export default Dashboard;
