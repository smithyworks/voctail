import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

import { api } from "../../utils";

import Metrics from "../QuizzesDashboardPage/Metrics";
import QuizMetricTile from "../common/Quiz/QuizMetricTile";

const useStyles = makeStyles({
  grid: { height: "100%", width: "100%" },
});

function QuizMetrics({ ...props }) {
  const classes = useStyles();

  //
  const [quizList, setQuizList] = useState([]);

  //show statistics
  const [openViewStat, setOpenViewStat] = useState(false);
  const [viewQuiz, setViewQuiz] = useState({});
  const handleViewStatOpen = (quiz) => {
    setOpenViewStat(true);
    setViewQuiz(quiz);
  };
  const handleViewStatClose = () => {
    setOpenViewStat(false);
  };

  useEffect(() => {
    api
      .fetchQuizzesMetrics()
      .then((res) => {
        if (res) {
          setQuizList(res.data);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <Grid className={classes.grid} container justify="flex-start" alignItems="left" direction="row">
        {quizList.map((v) => (
          <QuizMetricTile
            key={v.quiz_id}
            name={v.title}
            onViewStatistic={() => handleViewStatOpen(v)}
            lastResult={v.lastResult}
            bestResult={v.bestResult}
          />
        ))}
      </Grid>
      <Metrics onClose={handleViewStatClose} open={openViewStat} quiz={viewQuiz} />
    </div>
  );
}

export default QuizMetrics;
