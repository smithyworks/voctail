import React, { useContext } from "react";
import { Grid, GridList, Typography as T } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import AppPage from "./AppPage.js";

import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { UserContext } from "../App";

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

  let quizzes = [];
  for (let i = 0; i < 11; i++) {
    quizzes.push({ key: i, day: false, title: "Quiz " + i, text: "Take this quiz", link: "/quizzes/" + i });
  }
  quizzes.push({
    key: 11,
    day: true,
    title: "Quiz of the day",
    text: "Take a randomly generated quiz.",
    link: "/quizzes/" + 11,
  });

  //this should be replaced by id or some scheme depending on db
  let day = quizzes.filter((e) => e.day === true)[0];
  let quizz = quizzes.filter((e) => e.day !== true);

  /*Alternative Element to createQButton

  function createQTile(q){
    return(
      <GridListTile key={q.id} cols={1} className={classes.questionTile}>
        <Grid container justify="space-evenly" alignItems="center" direction="column">
            <Link to={q.link} classname={classes.questionLink}>
              <T variant="h4">{q.title}</T>
              <T variant="p">{q.text}</T>
            </Link>
        </Grid>
      </GridListTile>
    )
  }
*/
  function createQButton(q) {
    return (
      <Button
        component={Link}
        to={q.link}
        variant="outlined"
        color={q.day ? "primary" : "secondary"}
        className={classes.button}
      >
        <Grid className={q.grid} container justify="flex-start" alignItems="center" direction="column">
          <T variant="h4">{q.title}</T>
          <T variant="p" align="center">
            {q.text}
          </T>
        </Grid>
      </Button>
    );
  }

  return (
    <AppPage location="quizzes" id="quizzes-page">
      <Grid className={classes.grid} container justify="space-evenly" alignItems="center" direction="row">
        <Grid className={classes.headline} container justify="space-evenly" alignItems="center" direction="row">
          <T variant="h3">Welcome to your quizzes page, {user ? user.name : "..."}!</T>
        </Grid>
        <GridList cellHeight={200} cols={3} container justify="center" alignItems="center">
          {createQButton(day)}
          {quizz.map((q) => createQButton(q))}
        </GridList>
      </Grid>
    </AppPage>
  );
}

export default QuizzesDashboard;
