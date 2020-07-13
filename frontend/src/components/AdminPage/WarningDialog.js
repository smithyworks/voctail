import React, { useState } from "react";
import {
  Typography as T,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
} from "@material-ui/core";
import WarningIcon from "@material-ui/icons/Warning";
import { makeStyles } from "@material-ui/core/styles";

import { VTButton } from "../common";

const useStyles = makeStyles({
  title: {
    display: "flex",
    alignItems: "center",
    "& *": { color: "red" },
  },
  icon: { marginRight: "5px", fontSize: "30px" },
  confirmTitle: {
    marginTop: "5px",
    marginBottom: "-5px",
  },
});

function WarningDialog({ open, info }) {
  console.log(open, info);
  const classes = useStyles();

  const [inputText, setInputText] = useState("");
  let confirmInput = null,
    disabled = false;
  if (info?.confirmText) {
    const confirmText = info?.confirmText;
    confirmInput = (
      <>
        <DialogContentText className={classes.confirmTitle}>To confirm, type "{confirmText}"</DialogContentText>
        <TextField variant="outlined" margin="dense" onChange={(e) => setInputText(e.target.value)}></TextField>
      </>
    );
    disabled = confirmText !== inputText;
  }

  function _close() {
    setInputText();
    if (typeof info?.onClose === "function") info.onClose();
  }

  return (
    <Dialog open={open} onClose={_close}>
      <DialogTitle disableTypography>
        <T variant="h6" className={classes.title}>
          <WarningIcon className={classes.icon} fontSize="inherit" />
          <span>{info?.title}</span>
        </T>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{info?.body}</DialogContentText>
        {confirmInput}
      </DialogContent>
      <DialogActions>
        <VTButton neutral onClick={_close}>
          Cancel
        </VTButton>
        <VTButton danger onClick={info?.onConfirm} disabled={disabled}>
          Confirm
        </VTButton>
      </DialogActions>
    </Dialog>
  );
}

export default WarningDialog;
