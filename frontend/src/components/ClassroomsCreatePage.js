import React from "react";
import { Grid, Typography as T } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import AppPage from "./common/AppPage";

import AccountCircle from "@material-ui/icons/AccountCircle";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles({
  text: {
    paddingTop: "5%",
    paddingBottom: "5%",
    margin: "auto",
    textAlign: "center",
    textShadow: "1px 1px",
  },
  form: {
    margin: "auto",
    textAlign: "center",
    paddingTop: "2%",
  },
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
    <AppPage location="classrooms" id="classrooms-page">
      <T className={classes.text} variant="h4">
        Creating a classroom...
      </T>
      <div>
        <div className={classes.form}>
          <Grid container spacing={1} alignItems="flex-end">
            <Grid item>
              <AccountCircle />
            </Grid>
            <Grid item>
              <TextField id="input-with-icon-grid" label="Name of your Classroom*" />
            </Grid>
          </Grid>
        </div>
        <div className={classes.form}>
          <Grid container spacing={1} alignItems="flex-end">
            <Grid item>
              <AccountCircle />
            </Grid>
            <Grid item>
              <TextField id="input-with-icon-grid" label="Select a topic for your Classroom" />
            </Grid>
          </Grid>
        </div>
        <div className={classes.form}>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item>
              <AccountCircle />
            </Grid>
            <Grid item>
              <TextField id="input-with-icon-grid" label="Write a description for your students" />
            </Grid>
          </Grid>
        </div>
      </div>
    </AppPage>
  );
}

export default ClassroomsCreatePage;
