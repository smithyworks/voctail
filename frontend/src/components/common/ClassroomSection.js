import React from "react";
import { Paper, makeStyles, Typography, Divider, Grid } from "@material-ui/core";

import { VTIconFlexButton } from "./Buttons/IconButton";

const useStyles = makeStyles({
  paper: {
    padding: "30px 30px 8px 30px",
    border: "1px solid lightgrey",
    marginTop: "20px",
    marginBottom: "20px",
  },
  title: { fontWeight: "lighter" },

  innerContainer: {
    paddingBottom: "20px",
    paddingTop: "10px",
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

  sectionHeader: {
    height: 60,
  },
});

function ClassroomSection({ title, children, hasAddButton, onAdd, invisible }) {
  const classes = useStyles();

  if (!invisible) {
    return (
      <Paper elevation={0} className={classes.paper}>
        <Grid container justify="space-between" direction="row" alignItems="center" className={classes.sectionHeader}>
          <Grid style={{ paddingLeft: "10px" }}>
            <Typography variant="h5" className={classes.title}>
              {title}
            </Typography>
          </Grid>
          <Grid item>
            {!!hasAddButton && <VTIconFlexButton toolTipLabel={"Create a classroom!"} onClick={onAdd} />}
          </Grid>
        </Grid>
        <Divider />
        <div className={classes.innerContainer}>
          <Grid container className={classes.innerContainer}>
            {children}
          </Grid>
        </div>
      </Paper>
    );
  } else {
    return <span />;
  }
}

export default ClassroomSection;
