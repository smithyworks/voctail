import React from "react";
import { Link } from "react-router-dom";
import { Grid, Typography as T } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import { VTButton } from "../common";

const useStyles = makeStyles({
  gridQuizItem: { height: "80%", width: "100%" },
  container: { height: "100%", width: "100%" },
  resultsContainer: {
    height: "85%",
    width: "100%",
    position: "relative",
    overflow: "hidden",
  },
  tableBox: {
    position: "absolute",
    top: "50%",
    left: "50%",
    minHeight: "40%",
    minWidth: "70%",
    transform: "translate(-50%, -50%)",
  },
  nav: {
    height: "15%",
    width: "100%",
  },
  text: {
    fontSize: "22px",
    fontWeight: "lighter",
  },
  noResult: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
});

export function Results({ onReport, onRetake, base }) {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.resultsContainer}>
        <ResultsTable onReport={onReport} className={classes.tableBox} />
      </div>
      <div className={classes.nav}>
        <Grid container justify="space-evenly" alignItems="center" direction="row">
          <VTButton secondary color="primary" onClick={() => onRetake()}>
            Retake Quiz
          </VTButton>
          <VTButton success color="primary" component={Link} to={base}>
            Quizzes Dashboard
          </VTButton>
        </Grid>
      </div>
    </div>
  );
}

export function ResultsTable({ onReport, className }) {
  const classes = useStyles();
  const results = onReport();

  return (
    <div className={className}>
      {results.taken > 0 ? (
        <Table>
          <colgroup>
            <col style={{ width: "25%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "60%" }} />
          </colgroup>
          <TableBody>
            <TableRow>
              <TableCell align="left">
                <T className={classes.text}>Your score:</T>
              </TableCell>
              <TableCell align="left">
                <T className={classes.text}>(taken)</T>
              </TableCell>
              <TableCell align="right">
                <T className={classes.text}>
                  {results.taken - results.wrong + "/" + results.taken + "  ( " + results.percentageTaken + "% )"}
                </T>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell align="left">
                <T className={classes.text}>(total)</T>
              </TableCell>
              <TableCell align="right">
                <T className={classes.text}>
                  {results.taken - results.wrong + "/" + results.total + "  ( " + results.percentageTotal + "% )"}
                </T>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left">
                <T className={classes.text}>{results.unknowns.length > 0 ? "Words to recap:" : undefined}</T>
              </TableCell>
              <TableCell />
              <TableCell align="right">
                <T className={classes.text}>
                  {results.unknowns.length > 0 ? results.unknowns.join(", ") : "Good job. Nothing to recap."}
                </T>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ) : (
        <div className={classes.noResult}>
          <T className={classes.text} align={"center"}>
            Answer at least one question.
          </T>
        </div>
      )}
    </div>
  );
}

export default Results;
