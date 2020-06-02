import React, { useState, useEffect } from "react";
import { Grid, Typography as T } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import AppPage from "./AppPage.js";
import { api } from "../utils";

const useStyles = makeStyles({
  container: { height: "100%", width: "100%" },
  grid: { height: "100%", width: "100%" },
  userItem: { width: "150px" },
});

function Dashboard({ ...props }) {
  const classes = useStyles();
  const [user, setUser] = useState();

  useEffect(() => {
    api
      .user()
      .then(res => {
        if (res) setUser(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <AppPage location="dashboard" id="dashboard-page">
      <Grid className={classes.grid} container justify="center" alignItems="center" direction="column">
        <T variant="h4">Welcome to your Dashboard, {user ? user.name : "..."}!</T>
      </Grid>
    </AppPage>
  );
}

export default Dashboard;
