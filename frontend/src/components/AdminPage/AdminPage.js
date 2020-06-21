import React, { useState, useEffect, useRef } from "react";
import {
  Typography as T,
  Divider,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  IconButton,
} from "@material-ui/core";
import {
  Block as BlockIcon,
  DeleteForever as DeleteForeverIcon,
  SupervisedUserCircle as SupervisedUserCircleIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import timediff from "timediff";

import WarningDialog from "./WarningDialog.js";
import AppPage from "../common/AppPage";
import { api, localStorage } from "../../utils";

const useStyles = makeStyles({
  greyed: { color: "#aaa" },
  userRow: {
    "&:hover": {
      backgroundColor: "#efefef",
    },
  },
  cell: {
    padding: "0 10px",
  },
});

function Grey({ children }) {
  const classes = useStyles();
  return <span className={classes.greyed}>{children}</span>;
}

function AdminPage({ ...props }) {
  const classes = useStyles();

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

  const userRows = usersList.map((u, i) => {
    if (!u) return <TableRow />;

    let d = <Grey>never</Grey>;
    if (u.last_seen) {
      const { days, hours, minutes } = timediff(new Date(u.last_seen), new Date(), "DHm");
      d = "";
      if (days > 0 || hours > 0 || minutes > 0) {
        if (days > 0) d += `${hours}d `;
        if (hours > 0) d += `${hours}h `;
        if (minutes > 0) d += `${minutes}min `;
        d += "ago";
      } else d = "just now";
    }
    return (
      <TableRow key={i} className={classes.userRow}>
        <TableCell align="right" className={classes.cell}>
          {u.user_id}
        </TableCell>
        <TableCell className={classes.cell}>{u.name}</TableCell>
        <TableCell className={classes.cell}>{u.email}</TableCell>
        <TableCell className={classes.cell}>{u.premium ? "premium" : <Grey>free</Grey>}</TableCell>
        <TableCell align="right" className={classes.cell}>
          {d}
        </TableCell>
        <TableCell align="right" className={classes.cell}>
          {u.valid_token ? "valid" : <Grey>invalid</Grey>}
        </TableCell>
        <TableCell align="right" className={classes.cell}>
          <IconButton
            style={{ color: "darkblue", margin: "0 3px" }}
            onClick={() => {
              dialogInfo.current = {
                title: "You are about to masquerade!",
                body: `Are you sure you want to masquerade as user "${u.name}" (${u.user_id})?\nBe careful what you as this person!`,
                onClose: () => {
                  setDialogOpen(false);
                  dialogInfo.current.onConfirm = null;
                },
                onConfirm: () => masquerade(u.user_id),
              };
              setDialogOpen(true);
            }}
          >
            <SupervisedUserCircleIcon />
          </IconButton>
          <IconButton
            style={{ color: "red", margin: "0 3px" }}
            onClick={() => {
              dialogInfo.current = {
                title: "You are about to revoke a user's tokens!",
                body: `Are you sure you want to delete the tokens for user "${u.name}" (${u.user_id})?\nThey will need to log back in to access the website!`,
                onClose: () => {
                  setDialogOpen(false);
                  dialogInfo.current.onConfirm = null;
                },
                onConfirm: () => revoke(u.user_id),
              };
              setDialogOpen(true);
            }}
          >
            <BlockIcon />
          </IconButton>
          <IconButton
            style={{ color: "red", margin: "0 3px" }}
            onClick={() => {
              dialogInfo.current = {
                title: "You are about to delete a user forever!",
                body: `Are you sure you want to delete user "${u.name}" (${u.user_id})?\nThis cannot be undone!`,
                confirmText: u.name,
                onClose: () => {
                  setDialogOpen(false);
                  dialogInfo.current.onConfirm = null;
                },
                onConfirm: () => deleteUser(u.user_id),
              };
              setDialogOpen(true);
            }}
          >
            <DeleteForeverIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  });

  return (
    <AppPage id="admin-page" location="admin">
      <T variant="h6" gutterBottom style={{ marginTop: "20px" }}>
        Users
      </T>
      <Divider style={{ margin: "10px 0 20px 0" }} />

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="right" style={{ width: "60px" }}>
                ID
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>email</TableCell>
              <TableCell>Account</TableCell>
              <TableCell align="right">Last Seen</TableCell>
              <TableCell style={{ width: "110px" }} align="right">
                Token
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>{userRows}</TableBody>
        </Table>
      </TableContainer>

      <WarningDialog open={dialogOpen} info={dialogInfo.current} />
    </AppPage>
  );
}

export default AdminPage;
