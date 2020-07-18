import React, { useEffect, useState } from "react";
import { makeStyles, Paper, Table, TableHead, TableBody, TableCell, TableRow } from "@material-ui/core";
import { api } from "../../utils";
import { toasts } from "../common/AppPage/AppPage";
import CheckIcon from "@material-ui/icons/Check";
import CrossIcon from "@material-ui/icons/Clear";
import { VTButton } from "../common";
import { refresh } from "../../App";

const useStyles = makeStyles({
  paper: {
    marginTop: "20px",
    padding: "40px 20px",
  },
});

function TranslationRow({ translation, onApprove, onReject }) {
  return (
    <TableRow>
      <TableCell>{translation.translation_id}</TableCell>
      <TableCell>{translation.contributor_id}</TableCell>
      <TableCell>{translation.word}</TableCell>
      <TableCell>{translation.translation}</TableCell>
      <TableCell>{translation.approved ? <CheckIcon /> : " "}</TableCell>
      <TableCell>
        {translation.approved ? (
          <VTButton warning startIcon={<CrossIcon />} onClick={() => onReject(translation.translation_id)}>
            Reject
          </VTButton>
        ) : (
          <VTButton danger startIcon={<CheckIcon />} onClick={() => onApprove(translation.translation_id)}>
            Approve
          </VTButton>
        )}
      </TableCell>
    </TableRow>
  );
}

function TranslationsTabPanel() {
  const classes = useStyles();

  const [count, setCount] = useState(0);
  function approve(translation_id) {
    api
      .updateTranslation(translation_id, true)
      .then(() => {
        setCount(count + 1);
        refresh();
      })
      .catch((err) => toasts.toastError("Encountered an issue while communicating with the server."));
  }
  function reject(translation_id) {
    api
      .updateTranslation(translation_id, false)
      .then(() => {
        setCount(count + 1);
        refresh();
      })
      .catch((err) => toasts.toastError("Encountered an issue while communicating with the server."));
  }

  const [rows, setRows] = useState();
  useEffect(() => {
    api
      .contributedTranslations()
      .then((res) => {
        setRows(
          res.data.map((t, i) => <TranslationRow translation={t} onApprove={approve} onReject={reject} key={i} />)
        );
      })
      .catch((err) => {
        console.log(err);
        toasts.toastError("Encountered an issue communicating with the server.");
      });
  }, [count]);

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
