import React, { useRef, useEffect, useState } from "react";
import { Paper, makeStyles, Typography, Divider, Grid } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

const useStyles = makeStyles({
  paper: {
    padding: "20px 30px 8px 30px",
    border: "1px solid lightgrey",
    marginTop: "20px",
    marginBottom: "20px",
  },
  title: { fontWeight: "lighter" },
  innerContainer: {
    paddingTop: "10px",
  },

  expandContainer: {
    height: "200px",
    overflow: "hidden",
    transition: "height 300ms",
  },
  expansionToggleContainer: {
    marginTop: "5px",
    minHeight: "20px",
  },
  expansionToggle: {
    cursor: "pointer",
    color: "grey",
    "&:hover": { textDecoration: "underline", color: "black" },
  },
  expansionIcon: {
    fontSize: "20px",
    marginBottom: "-5px",
    marginRight: "5px",
  },
  formControl: {
    minWidth: 120,
  },
});

function DashboardSection({ title, children, Button, expandable }) {
  const classes = useStyles();

  const innerContainerRef = useRef();
  const [expanded, setExpanded] = useState(false);
  const [height, setHeight] = useState();
  useEffect(() => {
    if (expanded) {
      try {
        const { height: h } = innerContainerRef.current.getBoundingClientRect();
        setHeight(`${h}px`);
      } catch {
        setHeight();
      }
    } else setHeight();
  }, [expanded]);

  return (
    <Paper elevation={0} className={classes.paper}>
      <Grid container justify="space-between" direction="row" alignItems="center">
        <Grid item xs style={{ paddingLeft: "10px" }}>
          <Typography variant="h5" className={classes.title}>
            {title}
          </Typography>
        </Grid>
        <Grid item>{Button}</Grid>
      </Grid>
      <Divider />

      <div className={expandable ? classes.expandContainer : null} style={{ height }}>
        <Grid container className={classes.innerContainer} ref={innerContainerRef}>
          {children}
        </Grid>
      </div>

      <Typography align="right" variant="body2" className={classes.expansionToggleContainer}>
        {expandable && (
          <span className={classes.expansionToggle} onClick={() => setExpanded(!expanded)}>
            {expanded ? (
              <ExpandLessIcon className={classes.expansionIcon} fontSize="inherit" />
            ) : (
              <ExpandMoreIcon className={classes.expansionIcon} fontSize="inherit" />
            )}
            Show All
          </span>
        )}
      </Typography>
    </Paper>
  );
}

export default DashboardSection;
