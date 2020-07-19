import React from "react";
import { Dialog, DialogActions, DialogContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { VTButton } from "../index";
import VoctailDialogTitle from "./VoctailDialogTitle";
import voctailColors from "../../../assets/colors.json";

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
    dialog: { ...voctailColors.dialog },
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
        <VoctailDialogTitle id="form-dialog-title" className={classes.header.dialog}>
          {title}
        </VoctailDialogTitle>
        <DialogContent style={{ overflow: noScroll ? "visible" : "auto" }}>{children}</DialogContent>
        <DialogActions>
          <VTButton secondary onClick={onClose}>
            Cancel
          </VTButton>
          <VTButton neutral onClick={onConfirm} disabled={disabled}>
            {validationButtonName ? validationButtonName : "Create"}
          </VTButton>
        </DialogActions>
      </div>
    </Dialog>
  );
}

export default CreationDialog;
