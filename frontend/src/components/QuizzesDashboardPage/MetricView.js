import { Typography as T } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import { timeElapsed } from "../common/Quiz/QuizzesUtilities";

const useStyles = makeStyles({
  quizItem: {
    margin: "10px",
    padding: "20px",
  },
  innerContainer: {
    paddingTop: "20px",
  },
});

function MetricView({ questions, results, disablePadding }) {
  const classes = useStyles();

  const resultsList = results.map((r) => ({ ...r, date: timeElapsed(r.date) }));

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

  const questionList =
    questions === undefined ? undefined : (
      <div>
        <T variant={"h4"}>{formatQ(questions)}</T>
        <Divider />
      </div>
    );

  return (
    <div className={classes.quizItem}>
      {questionList}
      {Object.keys(results).length === 0 ? (
        <T variant={"h7"}>As of yet no metrics are available. Please take a quiz and show results.</T>
      ) : (
        <div className={classes.innerContainer} style={{ padding: disablePadding ? undefined : "20px 20px 0 20px" }}>
          <Table>
            <colgroup>
              <col style={{ width: "10%" }} />
              <col style={{ width: "7%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "7%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "43%" }} />
            </colgroup>
            <TableHead>
              <TableRow>
                <TableCell align="right">Last Taken</TableCell>
                <TableCell align="right">Wrong</TableCell>
                <TableCell align="right">Attempted</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="right">Attempted (%)</TableCell>
                <TableCell align="right">Total (%)</TableCell>
                <TableCell align="right">unknowns</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {resultsList.map((v, i) => (
                <TableRow key={i}>
                  <TableCell align="right">{v.date}</TableCell>
                  <TableCell align="right">{v.wrong}</TableCell>
                  <TableCell align="right">{v.taken}</TableCell>
                  <TableCell align="right">{v.total}</TableCell>
                  <TableCell align="right">{v.percentageTaken}</TableCell>
                  <TableCell align="right">{v.percentageTotal}</TableCell>
                  <TableCell align="right">{v.unknowns.join(", ")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default MetricView;
