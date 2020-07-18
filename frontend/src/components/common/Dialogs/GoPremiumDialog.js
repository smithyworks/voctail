import React from "react";
import { Typography as T, Dialog, DialogTitle, DialogActions, DialogContent, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { VTButton } from "../index";

const useStyles = makeStyles({
  title: {
    display: "flex",
    alignItems: "center",
    minWidth: "400px",
  },
  icon: { marginRight: "5px", fontSize: "30px" },
  noScroll: { overflow: "visible" },
});

function GoPremiumDialog({ open, onClose, className }) {
  const classes = useStyles();

  const cName = className;

  return (
    <Dialog open={open} onClose={onClose} className={cName}>
      <DialogTitle disableTypography>
        <T variant="h6" className={classes.title}>
          This is a premium feature!
        </T>
      </DialogTitle>
      <DialogContent>
        <Typography>We are sorry, this feature is not available for free users!</Typography>
      </DialogContent>
      <DialogActions>
        <VTButton secondary onClick={onClose}>
          Close
        </VTButton>
        <VTButton accept href="/account">
          Go premium!
        </VTButton>
      </DialogActions>
    </Dialog>
  );
}

export default GoPremiumDialog;
