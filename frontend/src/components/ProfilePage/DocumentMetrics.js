import { Paper, Table, TableBody, TableHead } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import DocumentRow from "./DocumentRow";
import { api } from "../../utils";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  greyed: { color: "#aaa" },
  documentsRow: {
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

function DocumentMetrics() {
  const classes = useStyles();

  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    api
      .fetchDocuments()
      .then((res) => {
        if (res) {
          setDocuments(res.data.documents);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  /*if (last_seen) {
        const { days, hours, minutes } = timediff(new Date(last_seen), new Date(), "DHm");
        d = "";
        if (days > 0 || hours > 0 || minutes > 0) {
            if (days > 0) d += `${hours}d `;
            if (hours > 0) d += `${hours}h `;
            if (minutes > 0) d += `${minutes}min `;
            d += "ago";
        } else d = "just now";
    }; */

  return (
    <Table size="small" component={Paper} elevation={0}>
      <TableHead>
        <DocumentRow header />
      </TableHead>
      <TableBody>
        {documents.map((doc) => (
          <DocumentRow
            id={doc.document_id}
            title={doc.title}
            author={doc.author}
            publisher={doc.publisher_id}
            last_seen={0}
          />
        ))}
      </TableBody>
    </Table>
  );
}
export default DocumentMetrics;
