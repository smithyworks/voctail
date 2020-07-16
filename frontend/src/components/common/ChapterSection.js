import React from "react";
import { Paper, makeStyles, Typography, Divider, Grid } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles({
  paper: {
    paddingBottom: "3%",
  },

  innerContainer: {
    padding: "3px 20px 8px 20px",
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

function ChapterSection({ title, children, Button }) {
  const classes = useStyles();

  return (
    <Paper elevation={0} className={classes.paper}>
      <Grid container justify="space-between" direction="row" alignItems="center">
        <Grid style={{ paddingLeft: "10px" }}>
          <Typography variant="h5" className={classes.title}>
            {title}
          </Typography>
        </Grid>
        <Grid item>{Button}</Grid>
      </Grid>
      <Divider />
      <div className={classes.innerContainer}>{children}</div>
    </Paper>
  );
}

export default ChapterSection;
