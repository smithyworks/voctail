import React from "react";
import { Link } from "react-router-dom";
import { Grid, Typography as T } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import AppPage from "./AppPage.js";

const useStyles = makeStyles({
  grid: { height: "100%", width: "100%" },
});

function IntroPage() {
  const classes = useStyles();
  return (
    <AppPage id="intro-page">
      <Grid className={classes.grid} container justify="center" alignItems="center" direction="column">
        <T variant="h4">Welcome to the world of Voctail! This is our Product page.</T>
      </Grid>
    </AppPage>
  );
}

export default IntroPage;
