import { Divider, Grid, Paper, Typography } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles({
  section: {
    marginBottom: "20px",
    padding: "30px",
    border: "1px solid lightgrey",
  },
  container: { height: "100%", width: "100%" },
});

function QuizSection({ title, icon, action, component, disablePadding, children }) {
  const classes = useStyles();

  return (
    <Paper className={classes.section} elevation={0}>
      <Grid container justify="space-between" alignItems="center" direction="row">
        <Typography variant="h5">{title}</Typography>
        {icon ? <IconButton onClick={action}>{icon}</IconButton> : undefined}
        {component ? component : undefined}
      </Grid>
      <Divider />
      <div className={classes.itemContainer} style={{ padding: disablePadding ? undefined : "20px 20px 0 20px" }}>
        {children}
      </div>
    </Paper>
  );
}

export default QuizSection;
