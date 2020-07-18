import React, { useState, useRef } from "react";
import { Paper, makeStyles, Grid, Typography, Tooltip } from "@material-ui/core";
import { getColor } from "./colorCycler";
import { timeElapsed } from "./QuizzesUtilities";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import withStyles from "@material-ui/core/styles/withStyles";

const useStyles = makeStyles({
  container: {
    padding: "10px",
  },
  paper: {
    width: "100%",
    height: "175px",
    position: "relative",
    cursor: "pointer",
    display: "inline-block",
    overflow: "hidden",
    color: "white",
    textDecoration: "none",
    padding: "10px 10px 10px 10px",
  },
  name: {
    color: "white",
    fontSize: "22px",
    fontWeight: "bolder",
  },

  menuIconIn: {
    right: "0",
    transition: "right 300ms",
  },
  tableContainer: {
    width: "100%",
  },
  menuIconOut: {
    right: "-30px",
    transition: "right 400ms",
  },
  progressContainer: {
    padding: "20px 0",
  },
  progress: {
    height: "7px",
    border: "1px solid white",
    borderRadius: "3px",
    backgroundColor: "transparent",
  },
  progressBar: {
    backgroundColor: "white",
  },
  infoTextContainer: { paddingTop: "10px" },
  progressText: {
    color: "white",
    fontWeight: "lighter",
  },
  tableText: { color: "white", fontWeight: "lighter", fontStyle: "italic" },
});

function QuizMetricTile({ name, onViewStatistic, lastResult, bestResult, questions }) {
  const classes = useStyles();
  const backgroundColor = useRef(getColor());

  const [hovered, setHovered] = useState(false);

  function _onViewStatistic(e) {
    if (typeof onViewStatistic === "function") {
      onViewStatistic(e);
    }
  }

  const TCell = withStyles({
    root: {
      borderBottom: "none",
    },
  })(TableCell);

  const lastSeenElapsed = useRef(timeElapsed(lastResult.date));
  const bestElapsed = useRef(timeElapsed(bestResult.date));

  /*
                  {lastResult.unknowns.join(", ").length > 15
                    ? lastResult.unknowns.join(", ").slice(0, 15) + "..."
                    : lastResult.unknowns.join(", ")}
  */
  return (
    <Grid item xs={12} sm={6} md={3} lg={3} className={classes.container}>
      <Tooltip title={name} enterDelay={1000} enterNextDelay={1000}>
        <Paper
          className={classes.paper}
          style={{ backgroundColor: backgroundColor.current }}
          elevation={hovered ? 5 : 2}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          component={"button"}
          onClick={(e) => _onViewStatistic(e)}
        >
          <Typography className={classes.name} noWrap>
            {name}
          </Typography>

          <Grid container justify="space-evenly" direction="columns">
            <Table size={"small"} className={classes.tableContainer}>
              <TableBody>
                <TableRow>
                  <TCell align="left">
                    <Typography align="left" className={classes.tableText} noWrap>
                      Best
                    </Typography>
                  </TCell>
                  <TCell align="right">
                    <Typography className={classes.progressText} noWrap>
                      {bestResult.percentageTotal}%
                    </Typography>
                  </TCell>
                  <TCell align="right">
                    <Typography align="right" className={classes.tableText} noWrap>
                      {bestElapsed.current}
                    </Typography>
                  </TCell>
                </TableRow>
                <TableRow>
                  <TCell align="left">
                    <Typography align="left" className={classes.tableText} noWrap>
                      Last
                    </Typography>
                  </TCell>
                  <TCell align="right">
                    <Typography className={classes.progressText} noWrap>
                      {lastResult.percentageTotal}%
                    </Typography>
                  </TCell>
                  <TCell align="right">
                    <Typography align="right" className={classes.tableText} noWrap>
                      {lastSeenElapsed.current}
                    </Typography>
                  </TCell>
                </TableRow>
                <TableRow>
                  <TCell align="left">
                    <Typography align="left" className={classes.tableText} noWrap>
                      Unknown
                    </Typography>
                  </TCell>
                  <TCell align="right"></TCell>
                  <TCell align="right">
                    <Typography align="right" className={classes.tableText} noWrap>
                      {"(" + lastResult.unknowns.length + " / " + questions.length + ")"}
                    </Typography>
                  </TCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
        </Paper>
      </Tooltip>
    </Grid>
  );
}

export default QuizMetricTile;
