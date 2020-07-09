import { Paper } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import { VTButton } from "../../common";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";

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

function QuizItemSection({ items, del, disablePadding }) {
  const classes = useStyles();
  const max = (vl) => {
    let a = [0, 0];
    vl.map((vv) => vv.suggestions.length).forEach((v, i) => {
      if (v > a[0]) {
        a = [v, i];
      }
    });
    return vl[a[1]];
  };

  return (
    <div>
      {items.length === 0 ? undefined : (
        <Paper className={classes.quizItem} elevation={0}>
          <div className={classes.innerContainer} style={{ padding: disablePadding ? undefined : "20px 20px 0 20px" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="right">Vocabulary</TableCell>
                  <TableCell align="right">Translation</TableCell>
                  {items.length > 0
                    ? max(items).suggestions.map((vv, i) => (
                        <TableCell align="right">{"Suggestion " + (i + 1)}</TableCell>
                      ))
                    : undefined}
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((v, i) => (
                  <TableRow>
                    <TableCell align="right">{v.vocabulary}</TableCell>
                    <TableCell align="right">{v.translation}</TableCell>
                    {v.suggestions.map((vv) => (
                      <TableCell align="right">{vv}</TableCell>
                    ))}
                    {[...Array(max(items).suggestions.length - v.suggestions.length)].map((v) => (
                      <TableCell align="right"></TableCell>
                    ))}
                    <TableCell align="right">
                      <VTButton danger onClick={() => del(i)}>
                        delete
                      </VTButton>
                    </TableCell>
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

export default QuizItemSection;
