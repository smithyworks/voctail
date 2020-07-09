import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Grid, Typography as T, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import LocalBarIcon from "@material-ui/icons/LocalBar";
import AppPage from "./common/AppPage";
import { api } from "../utils";

import { shuffle } from "./common/QuizzesUtilities";

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
      <T>{props.children}</T>
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
    for (let i in props.suggestions) {
      //if diff state change icon - red or green - color="primary"| "secondary"
      lines.push(
        props.suggestions[i] === props.translation ? (
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
            {props.suggestions[i]}
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
            {props.suggestions[i]}
          </Button>
        )
      );
    }
    return lines;
  }

  function updateButtons(color) {
    let lines = [];
    for (let i in props.suggestions) {
      lines.push(
        props.suggestions[i] === props.translation ? (
          //change icon instead of color
          <Button key={i} variant="outlined" color={color} startIcon={<LocalBarIcon />} className={classes.button}>
            {props.suggestions[i]}
          </Button>
        ) : (
          <Button key={i} variant="outlined" startIcon={<LocalBarIcon />} className={classes.button}>
            {props.suggestions[i]}
          </Button>
        )
      );
    }
    return lines;
  }

  function chooseButtons(state) {
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
        if (!props.is_last) {
          buttons.push(actionButton("Next", 1));
        }
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
  const [suggestions, setSuggestions] = useState([]);

  let nextQ = () => {
    setQState(qst.untaken);
    props.nextQ();
  };

  function suggestionsFromQ(q) {
    var suggs = [q.translation];
    for (let sg of q.suggestions) {
      suggs.push(sg);
    }
    suggs = shuffle(suggs);
    return suggs;
  }

  useEffect(() => {
    setSuggestions(suggestionsFromQ(props.question));
  }, [props.question]);

  return (
    <Grid className={classes.gridQuizItem} container justify="center" alignItems="center" direction="column">
      <Grid className={classes.gridWord} container justify="space-evenly" alignItems="flex-end" direction="row">
        <T variant="h3">{props.question.vocabulary}</T>
      </Grid>
      <Translations
        suggestions={suggestions}
        translation={props.question.translation}
        qstate={{ state: qstate, states: qst, set: setQState }}
        addResult={props.addResult}
      />
      <Actions
        qstate={{ state: qstate, states: qst, set: setQState }}
        nextQ={nextQ}
        is_last={props.is_last}
        showResult={props.showResult}
      />
    </Grid>
  );
}

function Quiz({ ...props }) {
  const classes = useStyles();
  let { id } = useParams();
  id = parseInt(id);

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

  const [quiz, setQuiz] = useState({});
  useEffect(() => {
    api
      .fetchQuiz(id)
      .then((res) => {
        if (res) {
          setQuiz(res.data);
        }
      })
      .catch((err) => console.log(err));
  }, [id]);

  return (
    <AppPage location={"quizzes/" + id} id={"quiz-" + id + "page"}>
      {"title" in quiz ? (
        !show ? (
          <Grid
            className={classes.grid}
            container
            justify="space-evenly"
            spacing={0}
            alignItems="center"
            direction="row"
          >
            <Header title={quiz.title}>Select the right translation for the word.</Header>
            <QuizItem
              question={quiz.questions[itemCount]}
              is_last={itemCount === quiz.questions.length - 1}
              addResult={addResult}
              nextQ={nextQ}
              showResult={showResult}
            />
          </Grid>
        ) : (
          <Grid
            className={classes.grid}
            container
            justify="space-evenly"
            spacing={0}
            alignItems="center"
            direction="row"
          >
            <Header title={quiz.title}>Your results.</Header>
            <Results questions={quiz.questions} result={result} />
          </Grid>
        )
      ) : (
        []
      )}
    </AppPage>
  );
}

export default Quiz;
