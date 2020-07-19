import React from "react";
import { Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { VTButton } from "../index";

const useStyles = makeStyles({
  dialog: {
    overflow: "visible",
  },
  title: {
    display: "flex",
    alignItems: "center",
    minWidth: "400px",
  },
  icon: { marginRight: "5px", fontSize: "30px" },
  header: {
    color: "#0B6374",
    backgroundColor: "#D4E4E4",
  },
  description: {
    marginTop: "5%",
    marginBottom: "5%",
    marginLeft: "2%",
    marginRight: "2%",
    fontStyle: "italic",
    textAlign: "center",
  },
  textField: {
    marginBottom: "3%",
  },
  buttons: { margin: "1%" },
});

function CreationDialog({
  open,
  title,
  validationButtonName,
  disabled,
  onConfirm,
  onClose,
  children,
  style,
  noScroll,
}) {
  const classes = useStyles();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      style={{ overflow: noScroll ? "visible" : "auto" }}
      PaperProps={{ style: { overflow: noScroll ? "visible" : "auto" } }}
    >
      <div style={{ overflow: noScroll ? "visible" : "auto", ...style }}>
        <DialogTitle id="form-dialog-title" className={classes.header}>
          {title}
        </DialogTitle>
        <DialogContent style={{ overflow: noScroll ? "visible" : "auto" }}>{children}</DialogContent>
        <DialogActions>
          <VTButton secondary onClick={onClose}>
            Cancel
          </VTButton>
          <VTButton accept onClick={onConfirm} disabled={disabled}>
            {validationButtonName ? validationButtonName : "Create"}
          </VTButton>
        </DialogActions>
      </div>
    </Dialog>
  );
}

export default CreationDialog;
