import React from "react";
import { Grid, Typography as T } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import AppPage from "./AppPage.js";

import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
  container: { height: "100%", width: "100%" },
  grid: { height: "100%", width: "100%" },
  userItem: { width: "150px" },
  button: {
    textDecoration: "none",
    color: "#555",
    padding: "4px 20px 0 20px",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    width: "30%",
    height: "25%",
    borderWidth: "3px",
    "&:hover": {
      color: "white",
      backgroundColor: "rgba(0,0,0,0.3)",
    },
  },
});

function ClassroomsCreatePage({ ...props }) {
  const classes = useStyles();

  return (
    <AppPage location="classrooms" id="classrooms-create-page">
      <Grid className={classes.grid} container justify="space-evenly" alignItems="center" direction="row">
        <T variant="h4">Here, you will be soon able to create a classroom</T>
      </Grid>
    </AppPage>
  );
}

export default ClassroomsCreatePage;
