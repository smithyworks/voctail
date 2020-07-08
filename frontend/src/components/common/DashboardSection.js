import React from "react";
import { Paper, makeStyles, Typography, Divider, Grid } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles({
  paper: {
    padding: "30px 30px 8px 30px",
    border: "1px solid lightgrey",
    marginBottom: "20px",
  },
  title: { fontWeight: "bold" },
  innerContainer: {
    padding: "20px 20px 8px 20px",
  },

  description: {
    fontWeight: "lighter",
    margin: "auto",
    textAlign: "right",
    fontStyle: "italic",
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

function DashboardSection({ title, description, children, Button }) {
  const classes = useStyles();

  return (
    <Paper elevation={0} className={classes.paper}>
      <Grid container justify="space-between" direction="row" alignItems="center">
        <Grid item xs={10} style={{ paddingLeft: "10px" }}>
          <Typography variant="h5" className={classes.title}>
            {title}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          {Button}
        </Grid>
        <Grid item xs={8} style={{ paddingRight: "10px" }}>
          <Typography variant="h6" className={classes.description}>
            {description}
          </Typography>
        </Grid>
      </Grid>
      <Divider />
      <div className={classes.innerContainer}>{children}</div>
      <Typography align="right" variant="body2" className={classes.expansionToggle}>
        <ExpandMoreIcon className={classes.expansionIcon} fontSize="inherit" /> Show All...
      </Typography>
    </Paper>
  );
}

export default DashboardSection;
