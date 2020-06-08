import React, { useState, useEffect, useContext } from "react";
import { Grid, Typography as T } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import AppPage from "./AppPage.js";
import { api } from "../utils";
import { UserContext } from "../App.js";

const useStyles = makeStyles({
  container: { height: "100%", width: "100%" },
  grid: { height: "100%", width: "100%" },
  userItem: { width: "150px" },
});

function Quizzes({ ...props }) {
  const classes = useStyles();
  const user = useContext(UserContext);

  return (
    <AppPage location="quizzes" id="quizzes-page">
      <Grid className={classes.grid} container justify="center" alignItems="center" direction="column">
        <T variant="h4">Welcome to your Quizzes, {user ? user.name : "..."}!</T>
      </Grid>
    </AppPage>
  );
}

export default Quizzes;
