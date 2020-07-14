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
    //textAlign:"center",
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
          <VTButton success color="primary" onClick={() => onRetake()}>
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
  const results = onReport();
  console.log("Results", onReport());
  console.log(className);
  return (
    <div className={className}>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell align="right">
              <T variant={"h5"}>Your score:</T>
            </TableCell>
            <TableCell align="right">
              <T variant={"h5"}>(taken)</T>
            </TableCell>
            <TableCell align="right">
              <T variant={"h5"}>
                {results.taken > 0
                  ? results.taken - results.wrong + "/" + results.taken + "  ( " + results.percentageTaken + "% )"
                  : "  Answer at least one question."}
              </T>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell />
            <TableCell align="right">
              <T variant={"h5"}>(total)</T>
            </TableCell>
            <TableCell align="right">
              <T variant={"h5"}>
                {results.taken > 0
                  ? results.taken - results.wrong + "/" + results.total + "  ( " + results.percentageTotal + "% )"
                  : "  Answer at least one question."}
              </T>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="right">
              <T variant={"h5"}>Words to recap:</T>
            </TableCell>
            <TableCell />
            <TableCell align="right">
              <T variant={"h5"}>
                {results.unknowns.length > 0 ? results.unknowns.join(", ") : "Good job. Nothing to recap."}
              </T>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export default Results;
