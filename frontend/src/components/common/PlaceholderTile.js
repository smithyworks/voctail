import React, { useState } from "react";
import { Paper, makeStyles, Grid, Tooltip } from "@material-ui/core";
import AddBoxIcon from "@material-ui/icons/AddBox";

const useStyles = makeStyles({
  container: {
    padding: "10px",
    height: "190px",
  },
  paper: {
    height: "100%",
    border: "2px dashed lightgrey",
    fontSize: "50px",
    cursor: "pointer",
    "& .add-icon": {
      color: "lightgrey",
    },
    "&:hover": { borderColor: "grey" },
    "&:hover .add-icon": {
      color: "grey",
    },
  },
  title: {
    color: "white",
    fontSize: "18px",
  },
  innerGrid: {
    height: "100%",
  },
});

function PlaceholderTile({ tooltipTitle, onClick }) {
  const classes = useStyles();

  return (
    <Grid item xs={12} sm={6} md={3} lg={3} className={classes.container}>
      <Tooltip title={tooltipTitle}>
        <Paper className={classes.paper} elevation={0} onClick={onClick}>
          <Grid container justify="center" alignItems="center" className={classes.innerGrid}>
            <AddBoxIcon fontSize="inherit" className="add-icon" />
          </Grid>
        </Paper>
      </Tooltip>
    </Grid>
  );
}

export default PlaceholderTile;
