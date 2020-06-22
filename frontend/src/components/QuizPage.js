import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Grid, Typography as T } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import LocalBarIcon from "@material-ui/icons/LocalBar";
import AppPage from "./AppPage.js";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
  container: { height: "100%", width: "100%" },
  gridHeader: { height: "20%", width: "100%", backgroundColor: "rgba(0,0,0,0.3)" },
  gridQuizItem: { height: "80%", width: "100%" },
  gridWord: { height: "30%", width: "100%" },
  gridTranslations: { height: "40%", width: "100%" },
  gridActions: { height: "30%", width: "30%" },
  grid: { height: "100%", width: "100%" },
  userItem: { width: "150px" },
  button: {
    textDecoration: "none",
    color: "#555",
    padding: "4px 20px 0 20px",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    //width:"20%",
    //height:"5%",
    textTransform: "none",
    borderWidth: "3px",
    "&:hover": {
      color: "white",
      backgroundColor: "rgba(0,0,0,0.3)",
    },
  },
});

function Header(props) {
  const classes = useStyles();
  //add state cacllback to
  //Your results  | Select the right translation for the word.
  return (
    <Grid className={classes.gridHeader} container justify="center" alignItems="center" direction="column">
      <T variant="h4">{props.title}</T>
      <T variant="p">{props.children}</T>
    </Grid>
  );
}

//continue here add other parts
function Results(props) {
  const classes = useStyles();
  let unknowns = [];
  let num_taken = props.result.length;
  for (let i in props.result) {
    if (props.result[i] === false) {
      unknowns.push(props.questions[i].vocabulary); //Object.keys(props.questions[i])[0])
    }
  }

  //<T>{unknowns.length.toLocaleString() + props.qstate.result.length.toLocaleString()}</T>
  return (
    <Grid
      className={classes.gridQuizItem}
      container
      justify="center"
      spacing={0}
      alignItems="center"
      direction="column"
    >
      <T variant="h4">
        Your Score:{" "}
        {num_taken > 0
          ? num_taken -
            unknowns.length +
            "/" +
            num_taken +
            "  ( " +
            Math.round(((num_taken - unknowns.length) / num_taken) * 100) +
            "% )"
          : "Answer at least one question"}
      </T>
      <T variant="h4">Recap: {unknowns.length > 0 ? unknowns.join(", ") : "Good job. Nothing to recap."}</T>
    </Grid>
  );
}

function Translations(props) {
  //props.qstate={state, states, set}, props.question, props.addResult
  const classes = useStyles();

  function generateButtons(state) {
    let lines = [];
    for (let i in props.question.suggestions) {
      //if diff state change icon - red or green - color="primary"| "secondary"
      lines.push(
        props.question.suggestions[i] === props.question.translation ? (
          <Button
            key={i}
            variant="outlined"
            onClick={() => {
              if (state === props.qstate.states.untaken) {
                props.addResult(true);
              }
              props.qstate.set(props.qstate.states.correct);
            }}
            startIcon={<LocalBarIcon />}
            className={classes.button}
          >
            {props.question.suggestions[i]}
          </Button>
        ) : (
          <Button
            key={i}
            variant="outlined"
            onClick={() => {
              if (state === props.qstate.states.untaken) {
                props.addResult(false);
              }
              props.qstate.set(props.qstate.states.wrong);
            }}
            startIcon={<LocalBarIcon />}
            className={classes.button}
          >
            {props.question.suggestions[i]}
          </Button>
        )
      );
    }
    return lines;
  }

  function updateButtons(color) {
    let lines = [];
    for (let i in props.question.suggestions) {
      lines.push(
        props.question.suggestions[i] === props.question.translation ? (
          //change icon instead of color
          <Button key={i} variant="outlined" color={color} startIcon={<LocalBarIcon />} className={classes.button}>
            {props.question.suggestions[i]}
          </Button>
        ) : (
          <Button key={i} variant="outlined" startIcon={<LocalBarIcon />} className={classes.button}>
            {props.question.suggestions[i]}
          </Button>
        )
      );
    }
    return lines;
  }

  function chooseButtons(state) {
    //console.log(qstate)
    switch (state) {
      case props.qstate.states.untaken:
      case props.qstate.states.wrong:
        return generateButtons(state);
      case props.qstate.states.shown:
        //qst.shown -> translation in secondary color (eg red)
        return updateButtons("secondary");
      default:
        //qst.correct -> translation in primary color
        return updateButtons("primary");
    }
  }

  //Your results  | Select the right translation for the word.

  //Button onClick
  return (
    <Grid className={classes.gridTranslations} container justify="space-evenly" alignItems="center" direction="row">
      {chooseButtons(props.qstate.state)}
    </Grid>
  );
}

function Actions(props) {
  //props.qstate={state, states, set}, props.showResult, props.nextQ
  const classes = useStyles();
  function actionButton(action, key) {
    switch (action) {
      case "Done":
        return (
          <Button
            key={key}
            variant="outlined"
            onClick={() => {
              props.showResult();
            }}
            className={classes.button}
          >
            Done
          </Button>
        );
      case "Show":
        return (
          <Button
            key={key}
            variant="outlined"
            onClick={() => {
              props.qstate.set(props.qstate.states.shown);
            }}
            className={classes.button}
          >
            Show
          </Button>
        );
      default:
        //Next
        return (
          <Button
            key={key}
            variant="outlined"
            onClick={() => {
              props.nextQ();
            }}
            className={classes.button}
          >
            Next
          </Button>
        );
    }
  }

  function choose_buttons(state) {
    let buttons = [];
    switch (state) {
      //correct
      case props.qstate.states.correct:
      case props.qstate.states.shown:
        buttons.push(actionButton("Next", 1));
        buttons.push(actionButton("Done", 2));
        break;
      //wrong
      case props.qstate.states.wrong:
        buttons.push(actionButton("Show", 1));
        buttons.push(actionButton("Done", 2));
        break;
      //untaken
      default:
        buttons.push(actionButton("Done", 1));
    }

    return buttons;
  }

  //Your results  | Select the right translation for the word.
  return (
    <Grid className={classes.gridActions} container justify="space-evenly" alignItems="center" direction="row">
      {choose_buttons(props.qstate.state)}
    </Grid>
  );
}

function QuizItem(props) {
  //props.question= {vocabulary,suggestions, translation}
  //props.nextQ, props.addResult, props.showResult
  const classes = useStyles();
  //add state cacllback to
  //Your results  | Select the right translation for the word.
  const qst = { untaken: 0, correct: 1, wrong: 2, shown: 3 };
  const [qstate, setQState] = useState(qst.untaken);

  let nextQ = () => {
    setQState(qst.untaken);
    props.nextQ();
  };
  return (
    <Grid className={classes.gridQuizItem} container justify="center" alignItems="center" direction="column">
      <Grid className={classes.gridWord} container justify="space-evenly" alignItems="flex-end" direction="row">
        <T variant="h3">{props.question.vocabulary}</T>
      </Grid>
      <Translations
        question={props.question}
        qstate={{ state: qstate, states: qst, set: setQState }}
        addResult={props.addResult}
      />
      <Actions qstate={{ state: qstate, states: qst, set: setQState }} nextQ={nextQ} showResult={props.showResult} />
    </Grid>
  );
}

function Quiz({ ...props }) {
  const classes = useStyles();

  //later questions=
  let { id } = useParams();
  //quiz= db.query("SELECT * from Quizzes where id=$1 AND userid=$2",id,user) or sth like that;
  //questions = quiz.questions
  let words = ["word", "car", "train", "banana", "orange", "bagel", "coffee", "German", "English", "French"];
  let translations = [
    "Wort",
    "Auto",
    "Zug",
    "Banana",
    "Orange",
    "Bagel",
    "Kaffee",
    "deutsch",
    "english",
    "französisch",
  ];
  let questions = [];
  for (let i = 0; i < 10; i++) {
    //for the translations: i=0 correct, eg "Wort"
    questions.push({
      vocabulary: words[i],
      suggestions: [translations[i], "Phrase", "Satz", "Silbe"],
      translation: translations[i],
    });
  }
  //assumption id 11 = day - later day column in db
  let quiz = { id: id, questions: questions, title: id === 11 ? "Quiz of the Day" : "Quiz " + id };

  //const [user, setUser] = useState()
  const [show, setShow] = useState(false);
  const [result, setResult] = useState([]);
  const [itemCount, setItemCount] = useState(0);

  let nextQ = () => {
    setItemCount((itemCount) => itemCount + 1);
  };
  let addResult = (t) => {
    setResult((result) => [...result, t]);
  };
  let showResult = () => {
    setShow(true);
  };

  return (
    <AppPage location={"quizzes/" + quiz.id} id="quizzes-day-page">
      {!show ? (
        <Grid className={classes.grid} container justify="space-evenly" spacing={0} alignItems="center" direction="row">
          <Header title={quiz.title}>Select the right translation for the word.</Header>
          <QuizItem question={questions[itemCount]} addResult={addResult} nextQ={nextQ} showResult={showResult} />
        </Grid>
      ) : (
        <Grid className={classes.grid} container justify="space-evenly" spacing={0} alignItems="center" direction="row">
          <Header title={quiz.title}>Your results.</Header>
          <Results questions={quiz.questions} result={result} />
        </Grid>
      )}
    </AppPage>
  );
}

export default Quiz;
