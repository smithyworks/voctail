import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Grid, Typography } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import CrossIcon from "@material-ui/icons/Close";

const useStyles = makeStyles({
  container: {
    padding: "5px",
  },
  check: {
    color: "green",
  },
  cross: {
    color: "red",
  },
  includedText: {
    color: "green",
  },
  notIncludedText: {
    color: "red",
  },
  iconContainer: {
    display: "flex",
    alignItems: "center",
    paddingRight: "10px",
  },
});

function Benefit({ children, included }) {
  const classes = useStyles();

  const includedIcon = included ? <CheckIcon className={classes.check} /> : <CrossIcon className={classes.cross} />;
  const nameClass = included ? classes.includedText : classes.notIncludedText;

  return (
    <Grid container className={classes.container} alignItems="center">
      <Grid item className={classes.iconContainer}>
        {includedIcon}
      </Grid>
      <Grid item xs className={nameClass} component={Typography} variant="subtitle1">
        {children}
      </Grid>
    </Grid>
  );
}

export default Benefit;
