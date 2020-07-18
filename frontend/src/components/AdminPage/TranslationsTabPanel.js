import React, { useEffect, useState } from "react";
import { makeStyles, Paper, Table, TableHead, TableBody, TableCell, TableRow } from "@material-ui/core";
import { api } from "../../utils";
import { toasts } from "../common/AppPage/AppPage";

const useStyles = makeStyles({
  paper: {
    marginTop: "20px",
    padding: "40px 20px",
  },
});

function TranslationRow({ translation }) {
  return (
    <TableRow>
      <TableCell>{translation.translation_id}</TableCell>
      <TableCell>{translation.contributor_id}</TableCell>
      <TableCell>{translation.word}</TableCell>
      <TableCell>{translation.translation}</TableCell>
      <TableCell>{translation.approved}</TableCell>
      <TableCell>{translation.approved}</TableCell>
    </TableRow>
  );
}

function TranslationsTabPanel() {
  const classes = useStyles();

  const [rows, setRows] = useState();
  useEffect(() => {
    api
      .contributedTranslations()
      .then((res) => {
        setRows(res.data.map((t, i) => <TranslationRow translation={t} key={i} />));
      })
      .catch((err) => {
        console.log(err);
        toasts.toastError("Encountered an issue communicating with the server.");
      });
  }, []);

  return (
    <Paper className={classes.paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Translation ID</TableCell>
            <TableCell>Contributor ID</TableCell>
            <TableCell>Word</TableCell>
            <TableCell>Translation</TableCell>
            <TableCell>Approved</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{rows}</TableBody>
      </Table>
    </Paper>
  );
}

export default TranslationsTabPanel;
