import React from "react";
import { Typography as T, Dialog, DialogTitle, DialogActions, DialogContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { VTButton } from "../index";

const useStyles = makeStyles({
  dialog: {},
  title: {
    display: "flex",
    alignItems: "center",
    minWidth: "400px",
  },
  icon: { marginRight: "5px", fontSize: "30px" },
  noScroll: { overflow: "visible" },
});

function OkDialog({ open, title, disabled, onOk, onClose, okText, className, noScroll, children }) {
  const classes = useStyles();

  const cName = className ? classes.dialog + " " + className : classes.dialog;
  const scrollClass = noScroll ? classes.noScroll : undefined;

  return (
    <Dialog open={open} onClose={onClose} className={cName} classes={{ paper: scrollClass }}>
      <DialogTitle disableTypography>
        <T variant="h6" className={classes.title}>
          {title}
        </T>
      </DialogTitle>
      <DialogContent className={scrollClass}>{children}</DialogContent>
      <DialogActions>
        <VTButton accept onClick={onOk} disabled={disabled}>
          {okText ?? "Ok!"}
        </VTButton>
      </DialogActions>
    </Dialog>
  );
}

export default OkDialog;
