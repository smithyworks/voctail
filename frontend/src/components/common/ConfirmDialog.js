import React from "react";
import { Typography as T, Dialog, DialogTitle, DialogActions, DialogContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { VTButton } from "../common";

const useStyles = makeStyles({
  title: {
    display: "flex",
    alignItems: "center",
    minWidth: "400px",
  },
  icon: { marginRight: "5px", fontSize: "30px" },
});

function ConfirmDialog({ open, title, variant, disabled, onConfirm, onClose, children }) {
  const classes = useStyles();

  return (
    <Dialog open={open} onClose={onClose} className={classes.dialog}>
      <DialogTitle disableTypography>
        <T variant="h6" className={classes.title}>
          {title}
        </T>
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <VTButton secondary onClick={onClose}>
          Cancel
        </VTButton>
        <VTButton danger onClick={onConfirm} disabled={disabled}>
          Confirm
        </VTButton>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;
