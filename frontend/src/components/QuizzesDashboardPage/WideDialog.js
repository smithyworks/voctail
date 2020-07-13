import React from "react";
import { Dialog, makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  dialog: {
    width: "100%",
    min_width: "100px",
    max_width: "300px",
    height: "100%",
    min_height: "100px",
    max_height: "300px",
  },
});

function WideDialog({ children, open, onClose, labelledby }) {
  const classes = useStyles();
  return (
    <div>
      <Dialog className={classes.dialog} open={open} onClose={onClose} aria-labelledby={labelledby}>
        {children}
      </Dialog>
    </div>
  );
}

export default WideDialog;
