import React from "react";
import { Paper, Typography, Divider, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  section: {
    marginBottom: "20px",
    padding: "30px",
    border: "1px solid lightgrey",
  },
  innerContainer: {
    paddingTop: "20px",
  },
});

function ProfileSection({ title, disablePadding, children, Filter }) {
  const classes = useStyles();

  return (
    <Paper className={classes.section} elevation={0}>
      <Grid container justify="space-between" direction="row">
        <Grid item>
          <Typography variant="h5">{title}</Typography>
        </Grid>
        <Grid item>{Filter}</Grid>
      </Grid>

      <Divider />
      <div className={classes.innerContainer}>{children}</div>
    </Paper>
  );
}

export default ProfileSection;
