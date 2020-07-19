import { Paper, Table, TableBody, TableHead } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import DocumentRow from "./DocumentRow";
import { api } from "../../utils";

function DocumentMetrics(userId) {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    if (userId.userId) {
      api
        .getDocumentMetrics(userId.userId)
        .then((res) => {
          if (res) {
            setDocuments(res.data.documents);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [userId]);

  return (
    <Table size="small" component={Paper} elevation={0}>
      <TableHead>
        <DocumentRow header />
      </TableHead>
      <TableBody>
        {documents
          .filter((d) => d.last_seen)
          .map((doc) => (
            <DocumentRow
              id={doc.document_id}
              title={doc.title}
              author={doc.author}
              publisher={doc.publisher_id}
              user={userId ? userId : undefined}
              last_seen={doc.last_seen}
            />
          ))}
      </TableBody>
    </Table>
  );
}
export default DocumentMetrics;
