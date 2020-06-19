import React, { useState, useEffect } from "react";
import {
  Typography as T,
  Divider,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import timediff from "timediff";

import AppPage from "./common/AppPage";
import { api, localStorage } from "../utils";

const useStyles = makeStyles({
  greyed: { color: "#aaa" },
  userRow: {
    "&:hover": {
      backgroundColor: "#efefef",
    },
  },
});

function MasqueradeConfirmDialog({ open, onClose, onConfirm, id }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Are you sure you want to masquerade under user ID {id}?</DialogTitle>
      <DialogActions>
        <Button onClick={onClose}>No</Button>
        <Button onClick={onConfirm}>Yes</Button>
      </DialogActions>
    </Dialog>
  );
}

function RevokeConfirmDialog({ open, onClose, onConfirm, id }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Are you sure you want to revoke tokens for user ID {id}?</DialogTitle>
      <DialogActions>
        <Button onClick={onClose}>No</Button>
        <Button onClick={onConfirm}>Yes</Button>
      </DialogActions>
    </Dialog>
  );
}

function Grey({ children }) {
  const classes = useStyles();
  return <span className={classes.greyed}>{children}</span>;
}

function AdminPage({ ...props }) {
  const classes = useStyles();

  const [count, setCount] = useState(0);
  const refresh = () => setCount(count + 1);
  const [usersList, setUsersList] = useState([]);

  const [id, setId] = useState();
  const [confirmMasquerade, setConfirmMasquerade] = useState(false);
  const [confirmRevoke, setConfirmRevoke] = useState(false);

  useEffect(() => {
    api
      .users()
      .then((res) => {
        if (res) setUsersList(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  function revoke() {
    if (id)
      api
        .revokeToken(id)
        .catch((err) => console.log(err))
        .finally(() => {
          setConfirmRevoke(false);
          refresh();
        });
  }

  function impersonate() {
    if (id)
      api
        .masquerade(id)
        .then(({ data }) => {
          const { accessToken, refreshToken } = data;
          localStorage.setTokens(accessToken, refreshToken);
          setConfirmMasquerade(false);
          window.location.href = "/dashboard";
        })
        .catch((err) => console.log(err));
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
        <TableCell align="right">{u.user_id}</TableCell>
        <TableCell>{u.name}</TableCell>
        <TableCell>{u.email}</TableCell>
        <TableCell>{u.premium ? "premium" : <Grey>free</Grey>}</TableCell>
        <TableCell align="right">{d}</TableCell>
        <TableCell align="right">{u.valid_token ? "valid" : <Grey>invalid</Grey>}</TableCell>
        <TableCell align="right">
          <Button
            variant="contained"
            color="secondary"
            style={{ margin: "-8px 10px -8px 0" }}
            onClick={() => {
              setId(u.user_id);
              setConfirmRevoke(true);
            }}
          >
            Revoke Tokens
          </Button>
          <Button
            variant="contained"
            color="primary"
            style={{ margin: "-8px 0" }}
            onClick={() => {
              setId(u.user_id);
              setConfirmMasquerade(true);
            }}
          >
            Impersonate
          </Button>
        </TableCell>
      </TableRow>
    );
  });

  return (
    <AppPage id="admin-page" location="admin">
      <T variant="h4" gutterBottom>
        Admin Page
      </T>
      <Divider style={{ margin: "10px 0 20px 0" }} />

      <TableContainer>
        <Table>
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
      <MasqueradeConfirmDialog
        open={confirmMasquerade}
        onClose={() => setConfirmMasquerade(false)}
        onConfirm={impersonate}
        id={id}
      />
      <RevokeConfirmDialog open={confirmRevoke} onClose={() => setConfirmRevoke(false)} onConfirm={revoke} id={id} />
    </AppPage>
  );
}

export default AdminPage;
