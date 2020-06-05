import React, { useState, useEffect } from "react";
import { Typography as T, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import AppPage from "./AppPage.js";
import { api } from "../utils";

const useStyles = makeStyles({
  container: { height: "100%", width: "100%" },
  grid: { height: "100%", width: "100%" },
  userItem: { display: "inline-block", width: "200px" },
});

function AdminPage({ ...props }) {
  const classes = useStyles();
  const [user, setUser] = useState();
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    api
      .user()
      .then((res) => {
        if (res) setUser(res.data);
      })
      .catch((err) => console.log(err));

    api
      .users()
      .then((res) => {
        if (res) setUsersList(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const userRows = usersList.map((u, i) => {
    return (
      <T key={i}>
        <span className={classes.userItem}>{u?.user_id}</span>
        <span className={classes.userItem}>{u?.name}</span>
        <span className={classes.userItem}>{u?.email}</span>
      </T>
    );
  });

  return (
    <AppPage id="admin-page">
      <T variant="h4" gutterBottom>
        Admin Page
      </T>
      <Divider style={{ margin: "10px 0 20px 0" }} />
      <T variant="h5" gutterBottom>
        Current User
      </T>
      <T>
        <span className={classes.userItem}>{user?.user_id}</span>
        <span className={classes.userItem}>{user?.name}</span>
        <span className={classes.userItem}>{user?.email}</span>
      </T>
      <Divider style={{ margin: "10px 0 20px 0" }} />
      <T variant="h5" gutterBottom>
        All Users
      </T>
      {userRows}
    </AppPage>
  );
}

export default AdminPage;
