import { Paper, Divider, Typography as T } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import dateFormat from "dateformat";

const useStyles = makeStyles({
  quizItem: {
    marginTop: "10px",
    marginBottom: "10px",
    padding: "30px",
    border: "1px solid lightgrey",
  },
  innerContainer: {
    paddingTop: "20px",
  },
});

function MetricView({ questions, results, disablePadding }) {
  const classes = useStyles();

  const formatDate = (date) => {
    return dateFormat(Date.parse(date), "dd/mm/yyyy");
  };
  console.log(results);
  const resultsList = Object.keys(results).map((k) => ({ date: formatDate(k), ...results[k] }));

  const formatQ = (questions) => {
    const lb = 80;

    let strQ = "Questions:    ";
    let count = 0;
    let oldCount = -1;

    const wordPairs = questions.map((v) => v.vocabulary + " : " + v.translation);

    wordPairs.forEach((v, i) => {
      oldCount = count;
      count = count + v.length;
      if (i === 0) {
        strQ = strQ + v;
      } else if (oldCount % lb > lb / 2 && count % lb < lb / 2) {
        strQ = strQ + ",\n" + v;
      } else {
        strQ = strQ + ", " + v;
      }
    });
    return strQ;
  };

  return (
    <div>
      {results.length === 0 ? (
        <T variant={"h4"}>As of yet no metrics are available. Please take a quiz and show results.</T>
      ) : (
        <Paper className={classes.quizItem} elevation={0}>
          <T variant={"h4"}>{formatQ(questions)}</T>
          <Divider />
          <div className={classes.innerContainer} style={{ padding: disablePadding ? undefined : "20px 20px 0 20px" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="right">Date</TableCell>
                  <TableCell align="right">Wrong</TableCell>
                  <TableCell align="right">Taken</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="right">percentageTaken</TableCell>
                  <TableCell align="right">percentageTotal</TableCell>
                  <TableCell align="right">unknowns</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resultsList.map((v) => (
                  <TableRow>
                    <TableCell align="right">{v.date}</TableCell>
                    <TableCell align="right">{v.wrong}</TableCell>
                    <TableCell align="right">{v.taken}</TableCell>
                    <TableCell align="right">{v.total}</TableCell>
                    <TableCell align="right">{v.percentageTaken}</TableCell>
                    <TableCell align="right">{v.percentageTotal}</TableCell>
                    <TableCell align="right">{v.unknowns}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Paper>
      )}
    </div>
  );
}

export default MetricView;
