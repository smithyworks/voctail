import { Paper, Table, TableBody, TableHead } from "@material-ui/core";
import React, { useState } from "react";
import DocumentRow from "./DocumentRow";
import { api } from "../../utils";

function DocumentMetrics(userId) {
  const [documents, setDocuments] = useState([]);

  api
    .fetchDocuments()
    .then((res) => {
      if (res) {
        setDocuments(res.data.documents);
      }
    })
    .catch((err) => console.log(err));

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
            user={userId ? userId : undefined}
          />
        ))}
      </TableBody>
    </Table>
  );
}
export default DocumentMetrics;
