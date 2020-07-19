import React from "react";
import { Paper, makeStyles, Typography, Divider, Grid } from "@material-ui/core";

const useStyles = makeStyles({
  paper: {
    padding: "30px 30px 8px 30px",
    border: "1px solid lightgrey",
    marginTop: "20px",
    marginBottom: "20px",
  },
  title: { fontWeight: "lighter" },
  innerContainer: {
    padding: "20px 20px 8px 20px",
  },

  expansionIcon: {
    fontSize: "20px",
    marginBottom: "-5px",
  },

  buttonPosition: {
    position: "flexible",
    marginLeft: "initial",
    marginTop: "-5px",
  },
});

function ClassroomSectionDialog({ title, children, Button, invisible }) {
  const classes = useStyles();

  if (!invisible) {
    return (
      <Grid container className={classes.innerContainer}>
        {children}
      </Grid>
    );
  } else {
    return <span />;
  }
}

export default ClassroomSectionDialog;
