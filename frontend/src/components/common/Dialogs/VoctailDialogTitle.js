import React from "react";
import { makeStyles } from "@material-ui/styles";
import { DialogTitle } from "@material-ui/core";
import clsx from "clsx";
import voctailColors from "../../../assets/colors.json";

const useStyles = makeStyles(() => ({
  dialog: { ...voctailColors.dialog },
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
