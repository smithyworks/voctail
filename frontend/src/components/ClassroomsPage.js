import React, { useContext } from "react";
import { Grid, Typography as T } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import AppPage from "./AppPage.js";
import { UserContext } from "../App.js";

const useStyles = makeStyles({
  container: { height: "100%", width: "100%" },
  grid: { height: "100%", width: "100%" },
  userItem: { width: "150px" },
});

function Classrooms() {
  const classes = useStyles();
  const user = useContext(UserContext);

  return (
    <AppPage location="classrooms" id="classrooms-page">
      <Grid className={classes.grid} container justify="center" alignItems="center" direction="column">
        <T variant="h4">Welcome to your Classrooms, {user ? user.name : "..."}!</T>
      </Grid>
    </AppPage>
  );
}

export default Classrooms;