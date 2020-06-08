import React from "react";
import { Grid, Typography as T } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import AppPage from "./AppPage.js";

import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
  container: { height: "100%", width: "100%" },
  grid: { height: "100%", width: "100%" },
  userItem: { width: "150px" },
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

function QuizButton(props) {
  const classes = useStyles();
  return (
    <Button component={Link} to={props.to} variant="outlined" className={classes.button}>
      <Grid className={classes.grid} container justify="flex-start" alignItems="center" direction="column">
        <T variant="h4">{props.title}</T>
        <T variant="p" align="center">
          {props.children}
        </T>
      </Grid>
    </Button>
  );
}

function QuizzesPage({ ...props }) {
  const classes = useStyles();

  return (
    <AppPage location="quizzes" id="quizzes-page">
      <Grid className={classes.grid} container justify="space-evenly" alignItems="center" direction="row">
        <QuizButton title="Quiz of the Day" to="/quizzes/day">
          Test your knowledge with as many questions as you want!
        </QuizButton>
        <QuizButton title="Saved Quiz" to="/quizzes/saved">
          Retake saved quizzes!
        </QuizButton>
      </Grid>
    </AppPage>
  );
}

export default QuizzesPage;