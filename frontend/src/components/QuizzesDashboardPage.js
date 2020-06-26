import React, { useContext, useEffect, useState } from "react";
import { Grid, GridList, Button, Typography as T } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

import AppPage from "./common/AppPage";

import { UserContext } from "../App";

import { api } from "../utils";

const useStyles = makeStyles({
  container: { height: "100%", width: "100%" },
  grid: { height: "100%", width: "100%" },
  headline: { height: "20%", width: "100%", color: "#555" },
  gridList: { height: "100%", width: "100%" },
  userItem: { width: "150px" },
  questionLink: {
    color: "#555",
    "&:hover": {
      color: "white",
    },
  },
  questionTile: {
    backgroundColor: "rgba(0,0,0,0.3)",
    "&:hover": {
      backgroundColor: "black",
    },
  },
  button: {
    textDecoration: "none",
    color: "#555",
    padding: "4px 20px 0 20px",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    width: "30%",
    height: "25%",
    borderWidth: "3px",
    "&:hover": {
      color: "white",
      backgroundColor: "rgba(0,0,0,0.3)",
    },
  },
});

function QuizzesDashboard({ ...props }) {
  const classes = useStyles();
  const user = useContext(UserContext);
  const base = "/quizzes";

  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    api
      .fetchQuizzes()
      .then((res) => {
        if (res) setQuizzes(res.data.quizList);
      })
      .catch((err) => console.log(err));
  }, []);

  function createQButton(q, base) {
    return (
      <Button
        key={q.quiz_id}
        component={Link}
        to={base + "/" + q.quiz_id}
        variant="outlined"
        color={q.is_day ? "primary" : "secondary"}
        className={classes.button}
      >
        <Grid className={classes.grid} container justify="flex-start" alignItems="center" direction="column">
          <T variant="h4">{q.title}</T>
          <T align="center">{q.text}</T>
        </Grid>
      </Button>
    );
  }
  function createButtons(quizzes, base) {
    const day = quizzes.filter((e) => e.is_day === true)[0];
    const quizz = quizzes.filter((e) => e.is_day === false);
    const buttons = [];
    if (quizzes.length > 0) {
      buttons.push(createQButton(day, base));
      quizz.map((q) => buttons.push(createQButton(q, base)));
    }
    return buttons;
  }

  return (
    <AppPage location="quizzes" id="quizzes-page">
      <Grid className={classes.grid} container justify="space-evenly" alignItems="center" direction="row">
        <Grid className={classes.headline} container justify="space-evenly" alignItems="center" direction="row">
          <T variant="h3">Welcome to your quizzes page, {user ? user.name : "..."}!</T>
        </Grid>
        <GridList cellHeight={200} cols={3} container justify="center" alignItems="center">
          {createButtons(quizzes, base)}
        </GridList>
      </Grid>
    </AppPage>
  );
}

export default QuizzesDashboard;
