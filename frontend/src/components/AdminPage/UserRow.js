import React from "react";
import { TableRow, TableCell, IconButton, Tooltip } from "@material-ui/core";
import {
  Block as BlockIcon,
  DeleteForever as DeleteForeverIcon,
  SupervisedUserCircle as SupervisedUserCircleIcon,
  VpnKey as KeyIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import timediff from "timediff";

const useStyles = makeStyles({
  greyed: { color: "#aaa" },
  userRow: {
    "&:hover": {
      backgroundColor: "#efefef",
    },
  },
  header: {
    fontWeight: "bold",
  },
  cell: {
    padding: "0 10px",
  },
  tooltip: {
    position: "relative",
    top: "-10px",
  },
  match: {
    backgroundColor: "#55FF9f",
  },
});

function Grey({ children }) {
  const classes = useStyles();
  return <span className={classes.greyed}>{children}</span>;
}

function Header({ children }) {
  const classes = useStyles();
  return <span className={classes.header}>{children}</span>;
}

function Match({ children }) {
  const classes = useStyles();
  return <span className={classes.match}>{children}</span>;
}

function UserRow({
  user_id,
  name,
  email,
  last_seen,
  premium,
  valid_token,
  onMasquerade,
  onRevoke,
  onDelete,
  header,
  searchPattern,
  admin,
}) {
  const classes = useStyles();

  let id_val, name_val, email_val, premium_val, duration_val, token_val;
  if (header) {
    id_val = <Header>ID</Header>;
    name_val = <Header>Name</Header>;
    email_val = <Header>Email</Header>;
    premium_val = <Header>Account</Header>;
    duration_val = <Header>Last Seen</Header>;
    token_val = <Header>Tokens</Header>;
  } else {
    let d = <Grey>never</Grey>;
    if (last_seen) {
      const { days, hours, minutes } = timediff(new Date(last_seen), new Date(), "DHm");
      d = "";
      if (days > 0 || hours > 0 || minutes > 0) {
        if (days > 0) d += `${hours}d `;
        if (hours > 0) d += `${hours}h `;
        if (minutes > 0) d += `${minutes}min `;
        d += "ago";
      } else d = "just now";
    }

    id_val = user_id;
    name_val = name;
    email_val = email;
    premium_val = premium ? "premium" : <Grey>free</Grey>;
    duration_val = d;
    token_val = valid_token ? "valid" : <Grey>invalid</Grey>;

    if (searchPattern) {
      const nameMatch = name.match(searchPattern);
      if (nameMatch && nameMatch[0]) {
        const splitter = nameMatch[0];
        const nameTokens = name.split(splitter);
        name_val = [];
        nameTokens.forEach((t, i) => {
          name_val.push(t);
          if (i < nameTokens.length - 1) name_val.push(<Match key={i}>{splitter}</Match>);
        });
      }

      const emailMatch = email.match(searchPattern);
      if (emailMatch && emailMatch[0]) {
        const splitter = emailMatch[0];
        const emailTokens = email.split(splitter);
        email_val = [];
        emailTokens.forEach((t, i) => {
          email_val.push(t);
          if (i < emailTokens.length - 1) email_val.push(<Match key={i}>{splitter}</Match>);
        });
      }
    }
  }

  function _masquerade() {
    if (typeof onMasquerade === "function") onMasquerade(user_id, name);
  }
  function _revoke() {
    if (typeof onRevoke === "function") onRevoke(user_id, name);
  }
  function _delete() {
    if (typeof onDelete === "function") onDelete(user_id, name);
  }

  const buttons = header ? null : (
    <>
      <Tooltip
        arrow
        title="Masquerade as user."
        enterDelay={1000}
        enterNextDelay={500}
        classes={{ tooltip: classes.tooltip }}
      >
        <IconButton style={{ color: "darkblue", margin: "0 3px" }} onClick={_masquerade}>
          <SupervisedUserCircleIcon />
        </IconButton>
      </Tooltip>
      <Tooltip
        arrow
        title="Revoke user's tokens."
        enterDelay={1000}
        enterNextDelay={500}
        classes={{ tooltip: classes.tooltip }}
      >
        <IconButton style={{ color: "red", margin: "0 3px" }} onClick={_revoke}>
          <BlockIcon />
        </IconButton>
      </Tooltip>
      <Tooltip
        arrow
        title="Permanently delete user."
        enterDelay={1000}
        enterNextDelay={500}
        classes={{ tooltip: classes.tooltip }}
      >
        <IconButton style={{ color: "red", margin: "0 3px" }} onClick={_delete}>
          <DeleteForeverIcon />
        </IconButton>
      </Tooltip>
    </>
  );

  return (
    <TableRow className={header ? null : classes.userRow}>
      <TableCell align="right" className={classes.cell}>
        {id_val}
      </TableCell>
      <TableCell className={classes.cell}>
        {name_val} {admin && <KeyIcon fontSize="inherit" />}
      </TableCell>
      <TableCell className={classes.cell}>{email_val}</TableCell>
      <TableCell className={classes.cell}>{premium_val}</TableCell>
      <TableCell align="right" className={classes.cell}>
        {duration_val}
      </TableCell>
      <TableCell align="right" className={classes.cell}>
        {token_val}
      </TableCell>
      <TableCell align="right" className={classes.cell}>
        {buttons}
      </TableCell>
    </TableRow>
  );
}

export default UserRow;
