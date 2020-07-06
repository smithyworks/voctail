import React from "react";
import { Paper, makeStyles, Typography, Divider } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles({
  paper: {
    padding: "30px 30px 8px 30px",
    border: "1px solid lightgrey",
    marginBottom: "20px",
    boxShadow: "1px 1px 12px #555",
  },
  title: { fontWeight: "bold" },
  innerContainer: {
    padding: "20px 20px 8px 20px",
  },
  expansionIcon: {
    fontSize: "20px",
    marginBottom: "-5px",
  },
});

function DashboardSection({ title, children }) {
  const classes = useStyles();

  return (
    <Paper elevation={0} className={classes.paper}>
      <Typography variant="h5" className={classes.title}>
        {title}
      </Typography>
      <Divider />
      <div className={classes.innerContainer}>{children}</div>
      <Typography align="right" variant="body2" className={classes.expansionToggle}>
        <ExpandMoreIcon className={classes.expansionIcon} fontSize="inherit" /> Show All...
      </Typography>
    </Paper>
  );
}

export default DashboardSection;
