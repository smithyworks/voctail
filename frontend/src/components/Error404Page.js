import React from "react";
import { Grid, Typography as T } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AppPage from "./AppPage";

const useStyles = makeStyles({
  grid: { height: "100%", width: "100%" },
});

function Error404Page({ ...props }) {
  const classes = useStyles();
  return (
    <AppPage id="404-page">
      <Grid className={classes.grid} container justify="center" alignItems="center" direction="column">
        <T variant="h4">404! You seem to have gotten yourself lost!</T>
      </Grid>
    </AppPage>
  );
}

export default Error404Page;
