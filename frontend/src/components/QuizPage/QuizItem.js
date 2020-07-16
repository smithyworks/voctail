import React, { useEffect, useState } from "react";
import { Grid, Typography as T } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { shuffle } from "../common/QuizzesUtilities";
import VTButton from "../common/Buttons/VTButton";
import ChoiceButton from "./ChoiceButton";

const useStyles = makeStyles({
  gridHeader: { height: "20%", width: "100%", backgroundColor: "rgba(0,0,0,0.3)" },
  gridQuizItem: { height: "80%", width: "100%" },

  container: { height: "100%", width: "100%" },
  vocabularyContainer: {
    height: "50%",
    width: "100%",
    //textAlign:"center",
    position: "relative",
    overflow: "hidden",
  },
  vocabularyBox: {
    position: "absolute",
    top: "50%",
    left: "50%",
    minHeight: "10%",
    minWidth: "10%",
    transform: "translate(-50%, -50%)",
  },
  choicesContainer: { height: "30%", width: "100%" },
  actionsContainer: { height: "20%", width: "100%", padding: "0% 35% 0% 35%" },

  vocabulary: { color: "black" },
});

function QuizItemLayout({ vocabulary, choices, actions }) {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.vocabularyContainer}>
        <div className={classes.vocabularyBox}>
          <T variant={"h4"} className={classes.vocabulary}>
            {vocabulary}
          </T>
        </div>
      </div>
      <div className={classes.choicesContainer}>
        <Grid container justify="space-evenly" alignItems="center" direction="row">
          {choices}
        </Grid>
      </div>
      <div className={classes.actionsContainer}>
        <Grid container justify="space-evenly" alignItems="center" direction="row">
          {actions}
        </Grid>
      </div>
    </div>
  );
}

function Translations(suggestions, translation, rejects, qstate, addResult) {
  function generateButtons(state, states) {
    let lines = [];

    // accept or show -> q over and no button is clickable

    if (state === states.correct || state === states.shown) {
      suggestions.forEach((v, i) => {
        if (v === translation) {
          lines.push(
            state === states.correct ? (
              <ChoiceButton id={i} accept>
                {" "}
                {suggestions[i]}{" "}
              </ChoiceButton>
            ) : (
              <ChoiceButton id={i} show>
                {" "}
                {suggestions[i]}{" "}
              </ChoiceButton>
            )
          );
        } else {
          lines.push(
            rejects.state.includes(i) ? (
              <ChoiceButton id={i} reject>
                {" "}
                {suggestions[i]}{" "}
              </ChoiceButton>
            ) : (
              <ChoiceButton id={i}> {suggestions[i]} </ChoiceButton>
            )
          );
        }
      });
    } else {
      // not in a final state - correct or show
      suggestions.forEach((v, i) => {
        if (v === translation) {
          lines.push(
            <ChoiceButton
              id={i}
              onClick={() => {
                if (state === qstate.states.untaken) {
                  addResult(true);
                }
                qstate.set(qstate.states.correct);
              }}
            >
              {suggestions[i]}
            </ChoiceButton>
          );
        } else {
          lines.push(
            rejects.state.includes(i) ? (
              <ChoiceButton id={i} reject>
                {suggestions[i]}
              </ChoiceButton>
            ) : (
              <ChoiceButton
                id={i}
                onClick={() => {
                  if (state === qstate.states.untaken) {
                    addResult(false);
                  }
                  qstate.set(qstate.states.wrong);
                  rejects.add(i);
                }}
              >
                {suggestions[i]}
              </ChoiceButton>
            )
          );
        }
      });
    }
    return lines;
  }
  return generateButtons(qstate.state, qstate.states);
}

function Actions(qstate, nextQ, is_last, showResult) {
  //props.qstate={state, states, set}, props.showResult, props.nextQ

  function actionButton(action, key) {
    switch (action) {
      case "Done":
        return (
          <VTButton
            danger
            key={key}
            variant="outlined"
            onClick={() => {
              showResult();
            }}
          >
            Done
          </VTButton>
        );
      case "Show":
        return (
          <VTButton
            neutral
            key={key}
            variant="outlined"
            onClick={() => {
              qstate.set(qstate.states.shown);
            }}
          >
            Show
          </VTButton>
        );
      default:
        //Next
        return (
          <VTButton
            accept
            key={key}
            variant="outlined"
            onClick={() => {
              nextQ();
            }}
          >
            Next
          </VTButton>
        );
    }
  }

  function choose_buttons(state) {
    let buttons = [];
    switch (state) {
      //correct
      case qstate.states.correct:
      case qstate.states.shown:
        if (!is_last) {
          buttons.push(actionButton("Next", 1));
        }
        buttons.push(actionButton("Done", 2));
        break;
      //wrong
      case qstate.states.wrong:
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
  return choose_buttons(qstate.state);
}

function QuizItem(props) {
  //props.question= {vocabulary,suggestions, translation}
  //props.nextQ, props.addResult, props.showResult
  //add state callback to
  //Your results  | Select the right translation for the word.
  const qst = { untaken: 0, correct: 1, wrong: 2, shown: 3 };
  const [qstate, setQState] = useState(qst.untaken);
  const [suggestions, setSuggestions] = useState([]);
  const [rejects, setRejects] = useState([]);

  let nextQ = () => {
    setQState(qst.untaken);
    setRejects([]);
    props.nextQ();
  };

  const addRejects = (id) => {
    setRejects([...rejects, id]);
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

  //<Grid className={classes.gridQuizItem} container justify="center" alignItems="center" direction="column">
  //       <Grid className={classes.gridWord} container justify="space-evenly" alignItems="flex-end" direction="row">

  return (
    <QuizItemLayout
      vocabulary={props.question.vocabulary}
      choices={Translations(
        suggestions,
        props.question.translation,
        { state: rejects, add: addRejects },
        { state: qstate, states: qst, set: setQState },
        props.addResult
      )}
      actions={Actions({ state: qstate, states: qst, set: setQState }, nextQ, props.is_last, props.showResult)}
    />
  );
}

export default QuizItem;
