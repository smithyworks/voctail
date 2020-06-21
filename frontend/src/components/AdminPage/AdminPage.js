import React, { useState, useEffect, useRef } from "react";
import { Typography as T, Divider } from "@material-ui/core";

import WarningDialog from "./WarningDialog.js";
import UsersPaginatedTable from "./UsersPaginatedTable.js";
import AppPage from "../common/AppPage";
import { api, localStorage } from "../../utils";

function AdminPage({ ...props }) {
  const dialogInfo = useRef();
  const [dialogOpen, setDialogOpen] = useState(false);

  const [count, setCount] = useState(0);
  const refresh = () => setCount(count + 1);
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    api
      .users()
      .then((res) => {
        if (res) setUsersList(res.data);
      })
      .catch((err) => console.log(err));
  }, [count]);

  function revoke(id) {
    setDialogOpen(false);
    if (id)
      api
        .revokeToken(id)
        .catch((err) => console.log(err))
        .finally(() => {
          refresh();
        });
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
        .catch((err) => console.log(err));
  }

  function deleteUser(id) {
    setDialogOpen(false);
    if (id)
      api
        .deleteUser(id)
        .catch((err) => console.log(err))
        .finally(() => {
          refresh();
        });
  }

  return (
    <AppPage id="admin-page" location="admin">
      <T variant="h6" gutterBottom style={{ marginTop: "20px" }}>
        Users
      </T>
      <Divider style={{ margin: "10px 0 20px 0" }} />

      <UsersPaginatedTable
        users={usersList}
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
