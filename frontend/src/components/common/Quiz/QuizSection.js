import React from "react";
import { Paper, makeStyles, Typography, Divider, Grid, IconButton } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AddBoxIcon from "@material-ui/icons/AddBox";

const useStyles = makeStyles({
  paper: {
    padding: "20px 30px 8px 30px",
    border: "1px solid lightgrey",
    marginBottom: "20px",
  },
  title: { fontWeight: "lighter" },
  innerContainer: {},

  expansionIcon: {
    fontSize: "20px",
    marginBottom: "-5px",
  },
});

function QuizSection({ title, children, onAdd, hasAddButton }) {
  const classes = useStyles();

  function _onAdd(e) {
    if (typeof onAdd === "function") onAdd(e);
  }

  return (
    <Paper elevation={0} className={classes.paper}>
      <Grid container justify="space-between" direction="row" alignItems="center">
        <Grid item xs style={{ paddingLeft: "10px" }}>
          <Typography variant="h5" className={classes.title}>
            {title}
          </Typography>
        </Grid>
        <Grid item>
          {!!hasAddButton && (
            <IconButton onClick={_onAdd}>
              <AddBoxIcon />
            </IconButton>
          )}
        </Grid>
      </Grid>
      <Divider />

      <Grid container className={classes.innerContainer}>
        {children}
      </Grid>

      <Typography align="right" variant="body2" className={classes.expansionToggle}>
        <ExpandMoreIcon className={classes.expansionIcon} fontSize="inherit" /> Show All...
      </Typography>
    </Paper>
  );
}

export default QuizSection;
