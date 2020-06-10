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
} from "@material-ui/core";
import timediff from "timediff";

import AppPage from "./AppPage.js";
import { api, localStorage } from "../utils";

function AdminPage({ ...props }) {
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
  }, []);

  function revokeCB(user_id) {
    return () => {
      api.revokeToken(user_id).finally(() => refresh());
    };
  }

  function impersonateCB(user_id) {
    return () => {
      console.log("hello");
      api
        .masquerade(user_id)
        .then(({ data }) => {
          const { accessToken, refreshToken } = data;
          localStorage.setTokens(accessToken, refreshToken);
          window.location.href = "/dashboard";
        })
        .catch((err) => console.log(err));
    };
  }

  const userRows = usersList.map((u, i) => {
    if (!u) return <TableRow />;

    let d = <span style={{ color: "#aaa" }}>never</span>;
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
      <TableRow key={i}>
        <TableCell align="right">{u.user_id}</TableCell>
        <TableCell>{u.name}</TableCell>
        <TableCell>{u.email}</TableCell>
        <TableCell align="right">{d}</TableCell>
        <TableCell align="right">{u.valid_token ? "true" : "false"}</TableCell>
        <TableCell align="right">
          <Button
            variant="contained"
            color="secondary"
            style={{ margin: "-8px 10px -8px 0" }}
            onClick={revokeCB(u.user_id)}
          >
            Revoke Tokens
          </Button>
          <Button variant="contained" color="primary" style={{ margin: "-8px 0" }} onClick={impersonateCB(u.user_id)}>
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
              <TableCell align="right">Last Seen</TableCell>
              <TableCell style={{ width: "110px" }} align="right">
                Logged In
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>{userRows}</TableBody>
        </Table>
      </TableContainer>
    </AppPage>
  );
}

export default AdminPage;
