import React, { useState, useEffect, useRef, useCallback } from "react";
import { Typography as T, Divider, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import WarningDialog from "./WarningDialog.js";
import SearchField from "./SearchField.js";
import UsersPaginatedTable from "./UsersPaginatedTable.js";
import AppPage, { toasts } from "../common/AppPage";
import { api, localStorage } from "../../utils";

const useStyles = makeStyles({
  pageHeader: { marginTop: "10px" },
  searchIcon: {
    color: "darkgrey",
  },
});

function AdminPage({ ...props }) {
  const classes = useStyles();

  const dialogInfo = useRef();
  const [dialogOpen, setDialogOpen] = useState(false);

  const [count, setCount] = useState(0);
  const refresh = () => setCount(count + 1);
  const [usersList, setUsersList] = useState();
  const [filteredUsers, setFilteredUsers] = useState();
  const searchString = useRef();

  useEffect(() => {
    api
      .users()
      .then((res) => {
        if (res) {
          setUsersList(res.data);
          setFilteredUsers(res.data);
        }
      })
      .catch((err) => toasts.toastError("Error communicating with the server!"));
  }, [count]);

  const filterUsers = useCallback(
    (searchString) => {
      if (searchString && searchString.length > 0) {
        const pattern = new RegExp(searchString);
        return usersList?.filter((u) => {
          return u.name.match(pattern, "i") || u.email.match(pattern, "i");
        });
      } else return usersList;
    },
    [usersList]
  );

  function revoke(id) {
    setDialogOpen(false);
    if (id)
      api
        .revokeToken(id)
        .then(() => {
          toasts.toastSuccess("The user's tokens were successfully revoked!");
          refresh();
        })
        .catch((err) => toasts.toastError("Error communicating with the server!"));
  }

  function masquerade(id) {
    setDialogOpen(false);
    if (id)
      api
        .masquerade(id)
        .then(({ data }) => {
          const { accessToken, refreshToken } = data;
          localStorage.setTokens(accessToken, refreshToken);
          window.location.href = "/dashboard";
        })
        .catch((err) => toasts.toastError("Error communicating with the server!"));
  }

  function deleteUser(id) {
    setDialogOpen(false);
    if (id)
      api
        .deleteUser(id)
        .then(() => {
          toasts.toastSuccess("The user was successfully deleted!");
          refresh();
        })
        .catch((err) => toasts.toastError("Error communicating with the server!"));
  }

  return (
    <AppPage id="admin-page" location="admin">
      <Grid container justify="space-between" className={classes.pageHeader}>
        <T variant="h6" gutterBottom style={{ marginTop: "20px" }}>
          Users
        </T>
        <SearchField
          onSearch={(s) => {
            searchString.current = s;
            setFilteredUsers(filterUsers(s));
          }}
        />
      </Grid>
      <Divider />

      <UsersPaginatedTable
        users={filteredUsers}
        searchString={searchString.current}
        onMasquerade={(user_id, name) => {
          dialogInfo.current = {
            title: "You are about to masquerade!",
            body: `Are you sure you want to masquerade as user "${name}" (${user_id})?\nBe careful what you as this person!`,
            onClose: () => {
              setDialogOpen(false);
              dialogInfo.current.onConfirm = null;
            },
            onConfirm: () => masquerade(user_id),
          };
          setDialogOpen(true);
        }}
        onRevoke={(user_id, name) => {
          dialogInfo.current = {
            title: "You are about to revoke a user's tokens!",
            body: `Are you sure you want to delete the tokens for user "${name}" (${user_id})?\nThey will need to log back in to access the website!`,
            onClose: () => {
              setDialogOpen(false);
              dialogInfo.current.onConfirm = null;
            },
            onConfirm: () => revoke(user_id),
          };
          setDialogOpen(true);
        }}
        onDelete={(user_id, name) => {
          dialogInfo.current = {
            title: "You are about to delete a user forever!",
            body: `Are you sure you want to delete user "${name}" (${user_id})?\nThis cannot be undone!`,
            confirmText: name,
            onClose: () => {
              setDialogOpen(false);
              dialogInfo.current.onConfirm = null;
            },
            onConfirm: () => deleteUser(user_id),
          };
          setDialogOpen(true);
        }}
      />

      <WarningDialog open={dialogOpen} info={dialogInfo.current} />
    </AppPage>
  );
}

export default AdminPage;
