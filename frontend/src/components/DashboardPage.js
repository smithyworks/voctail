import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Grid, Typography as T } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { api } from "../utils";

const useStyles = makeStyles({
  container: { height: "100%", width: "100%" },
  grid: { height: "100%", width: "100%" },
  userItem: { width: "150px" },
});

function Dashboard({ ...props }) {
  const classes = useStyles();
  const [user, setUser] = useState();
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    api
      .user()
      .then(res => {
        setUser(res.data);
      })
      .catch(err => console.log(err));

    api
      .users()
      .then(res => {
        console.log(res.data);
        setUsersList(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  const userRows = usersList.map(u => {
    return (
      <T>
        <span className={classes.userItem}>{u.user_id}</span>
        <span className={classes.userItem}>{u.name}</span>
        <span className={classes.userItem}>{u.email}</span>
      </T>
    );
  });

  return (
    <div id="404-page" className={classes.container}>
      <Grid className={classes.grid} container justify="center" alignItems="center" direction="column">
        <T variant="h4">Welcome to your Dashboard, {user ? user.name : "..."}!</T>

        {userRows}

        <Link to="/signout">Signout</Link>
      </Grid>
    </div>
  );
}

export default Dashboard;
