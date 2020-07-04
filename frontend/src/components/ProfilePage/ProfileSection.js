import React from "react";
import { Paper, Typography, Divider } from "@material-ui/core";
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

function ProfileSection({ title, children }) {
  const classes = useStyles();

  return (
    <Paper className={classes.section} elevation={0}>
      <Typography variant="h5">{title}</Typography>
      <Divider />
      <div className={classes.innerContainer}>{children}</div>
    </Paper>
  );
}

export default ProfileSection;
