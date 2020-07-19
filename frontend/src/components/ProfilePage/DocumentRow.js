import React, { useState } from "react";
import { TableRow, TableCell } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import timediff from "timediff";
import { api } from "../../utils";

const useStyles = makeStyles({
  greyed: { color: "#aaa" },
  userRow: {
    "&:hover": {
      backgroundColor: "#efefef",
    },
  },
  header: {
    fontWeight: "bold",
    padding: "10px 0",
    display: "inline-block",
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

function Header({ children, onClick }) {
  const classes = useStyles();
  return (
    <span className={classes.header} style={{ cursor: onClick ? "pointer" : undefined }} onClick={onClick}>
      {children}
    </span>
  );
}

function DocumentRow({ id, title, author, header, publisher, user }) {
  const classes = useStyles();

  let title_val, author_val, duration_val, publisher_val;

  const [pub, setPub] = useState("");
  const [lastSeen, setLastSeen] = useState();

  function getLastSeen(documentId) {
    api
      .getLastSeen(user.userId, documentId)
      .then((res) => {
        if (res) setLastSeen(res.data[0].last_seen);
      })
      .catch((err) => console.log(err));
  }

  if (header) {
    title_val = <Header>Title</Header>;
    author_val = <Header>Author</Header>;
    publisher_val = <Header>Publisher</Header>;
    duration_val = <Header>Last Seen</Header>;
  } else {
    getLastSeen(id);
    let d = <Grey>never</Grey>;

    if (lastSeen) {
      const { days, hours, minutes } = timediff(new Date(lastSeen), new Date(), "DHm");
      d = "";
      if (days > 0 || hours > 0 || minutes > 0) {
        if (days > 0) d += `${hours} d `;
        if (hours > 0) d += `${hours} h `;
        if (minutes > 0) d += `${minutes} min `;
        d += "ago";
      } else d = "just now";
    }

    duration_val = d;
    title_val = title;
    author_val = author;

    if (publisher > 0) {
      api
        .getUser(publisher)
        .then((res) => {
          if (res) setPub(res.data[0].name);
        })
        .catch((err) => console.log(err));

      publisher_val = pub;
    } else publisher_val = "Voctail";
  }

  return (
    <TableRow className={header ? null : classes.userRow}>
      <TableCell className={classes.cell}> {title_val}</TableCell>
      <TableCell className={classes.cell}>{author_val}</TableCell>
      <TableCell className={classes.cell}>{publisher_val}</TableCell>

      <TableCell align="right" className={classes.cell}>
        {duration_val}
      </TableCell>
    </TableRow>
  );
}

export default DocumentRow;
