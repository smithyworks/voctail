import React from "react";
import { Grid, Typography as T } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import AppPage from "./common/AppPage";

import backgroundImage from "../images/logo_green.png";

const useStyles = makeStyles({
  grid: {
    height: "100%",
    width: "100%",
  },
  bar: { backgroundColor: "#555" },
  backgroundImage: "frontend/src/images/logo_green.png",
  backgroundPosition: "center",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
});

function IntroPage() {
  const classes = useStyles();
  return (
    <AppPage id="intro-page">
      <img src={backgroundImage} alt="" />
      <Grid className={classes.grid} container justify="center" alignItems="center" direction="column">
        <T variant="h4">Welcome to the world of Voctail! This is our Product page.</T>
      </Grid>
    </AppPage>
  );
}

export default IntroPage;
