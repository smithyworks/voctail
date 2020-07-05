import React from "react";
import {
  Typography as T,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@material-ui/core";
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

function OkDialog({ open, title, disabled, onOk, onClose, okText, children }) {
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
        <VTButton accept onClick={onOk} disabled={disabled}>
          {okText ?? "Ok!"}
        </VTButton>
      </DialogActions>
    </Dialog>
  );
}

export default OkDialog;
