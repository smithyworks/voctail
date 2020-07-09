import React, { useEffect, useState } from "react";
import { Grid, GridList, Button } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

import AppPage from "../../common/AppPage";
import { api } from "../../../utils";

import QuizSection from "./QuizSection";
import QuizTile from "./QuizTile";
import AddRandomQuiz from "./AddRandomQuiz";
import AddCustomQuiz from "./AddCustomQuiz";
import { generatePalette } from "../../common/QuizzesUtilities";
import colors from "../../../assets/colors.json";

const useStyles = makeStyles({
  grid: { height: "100%", width: "100%" },
});

function QuizzesDashboard({ ...props }) {
  const classes = useStyles();

  const [reloadCount, setReloadCount] = useState(0);
  const refresh = () => setReloadCount(reloadCount + 1);

  const [quizChallenges, setChallenges] = useState([]);
  const [quizCustom, setCustom] = useState([]);
  const [quizRandom, setRandom] = useState([]);
  const [quizDocuments, setDocuments] = useState([]);

  useEffect(() => {
    api
      .fetchQuizzesByCategory()
      .then((res) => {
        if (res) {
          setChallenges(res.data.quizChallenges);
          setCustom(res.data.quizCustom);
          setRandom(res.data.quizRandom);
          setDocuments(res.data.quizDocuments);
        }
      })
      .catch((err) => console.log(err));
  }, [reloadCount]);

  const palette = generatePalette(colors.statusTile.color);

  return (
    <AppPage location="quizzes" id="quizzes-page">
      <QuizSection title={"Challenges"}>
        <Grid className={classes.grid} container justify="flex-start" alignItems="left" direction="row">
          {quizChallenges.map((v) => (
            <QuizTile key={v.quiz_id} color={palette(v.quiz_id)}>
              {v}
            </QuizTile>
          ))}
        </Grid>
      </QuizSection>
      <QuizSection title={"Custom Quizzes"} component={<AddCustomQuiz onAdd={refresh} />}>
        <Grid className={classes.grid} container justify="flex-start" alignItems="left" direction="row">
          {quizCustom.map((v) => (
            <QuizTile key={v.quiz_id} color={palette(v.quiz_id)}>
              {v}
            </QuizTile>
          ))}
        </Grid>
      </QuizSection>
      <QuizSection title={"Random Quizzes"} component={<AddRandomQuiz onAdd={refresh} />}>
        <Grid className={classes.grid} container justify="flex-start" alignItems="left" direction="row">
          {quizRandom.map((v) => (
            <QuizTile key={v.quiz_id} color={palette(v.quiz_id)}>
              {v}
            </QuizTile>
          ))}
        </Grid>
      </QuizSection>
      <QuizSection title={"Quizzes From Documents"}>
        <Grid className={classes.grid} container justify="flex-start" alignItems="left" direction="row">
          {quizDocuments.map((v) => (
            <QuizTile key={v.quiz_id} color={palette(v.quiz_id)}>
              {v}
            </QuizTile>
          ))}
        </Grid>
      </QuizSection>

      <Grid className={classes.grid} container justify="space-evenly" alignItems="center" direction="row">
        <GridList cellHeight={200} cols={3} container justify="center" alignItems="center">
          <Button onClick={() => api.createQuizFromDoc(2, 10)}>Generate From Document (2)</Button>
          <Button onClick={() => api.fetchQuizByDocument(2)}>Fetch By Document (2)</Button>
        </GridList>
      </Grid>
    </AppPage>
  );
}

export default QuizzesDashboard;
