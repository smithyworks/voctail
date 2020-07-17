import React from "react";
import { makeStyles } from "@material-ui/styles";
import { DialogTitle } from "@material-ui/core";
import clsx from "clsx";

const useStyles = makeStyles(() => ({
  dialog: {
    color: "#0B6374",
    backgroundColor: "#D4E4E4",
  },
}));

function VoctailDialogTitle({ className, children, ...props }) {
  const classes = useStyles();

  const cName = clsx(classes.dialog, className);

  return (
    <DialogTitle className={cName} {...props}>
      {children}
    </DialogTitle>
  );
}

export default VoctailDialogTitle;
