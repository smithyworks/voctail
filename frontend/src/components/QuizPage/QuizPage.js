import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography as T } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AppPage from "../common/AppPage";
import { api } from "../../utils";
import { toasts } from "../common/AppPage/AppPage";
import Results from "./Results";
import QuizItem from "./QuizItem";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles({
  container: { height: "100%", width: "100%" },
  layoutBody: { height: "80%", width: "100%" },
  title: {
    color: "black",
  },
  layoutHeader: {
    height: "15%",
    width: "100%",
    position: "relative",
    overflow: "hidden",
  },
  layoutHeaderBox: {
    position: "absolute",
    top: "70%",
    left: "50%",
    minHeight: "10%",
    minWidth: "20%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
  },
});

function QuizLayout({ title, children }) {
  const classes = useStyles();

  return (
    <Paper className={classes.container}>
      <div className={classes.layoutHeader}>
        <div className={classes.layoutHeaderBox}>
          <T variant={"h3"} className={classes.title}>
            {title}
          </T>
        </div>
      </div>
      <Divider />
      <div className={classes.layoutBody}>{children}</div>
    </Paper>
  );
}

function Quiz({ ...props }) {
  const base = "/quizzes";

  let { id } = useParams();
  id = parseInt(id);

  //update  db to last_seen or do before leaving together with metrics
  api.viewedNowQuiz(id).then((r) => {
    if (!r) {
      toasts.toastError("Viewing could not be read.");
    } else {
      console.log("Success");
    }
  });

  const [show, setShow] = useState(false);
  const [result, setResult] = useState([]);
  const [itemCount, setItemCount] = useState(0);
  const [quiz, setQuiz] = useState({});

  let reset = () => {
    setResult([]);
    setShow(false);
    setItemCount(0);
  };

  let nextQ = () => {
    setItemCount((itemCount) => itemCount + 1);
  };
  let addResult = (t) => {
    setResult((result) => [...result, t]);
  };
  let showResult = () => {
    setShow(true);
    //update best results if improved
    const results = getResults();

    // add results to json metrics, best_result
    api.updateMetricsQuiz(quiz.quiz_id, results).then((r) => {
      if (!r) {
        console.log("Updating metrics failed.");
      }
    });
  };

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

  //Results
  const getResults = () => {
    const perc = (correct, absolute) => (absolute > 0 ? Math.round((correct / absolute) * 100) : 0);
    let unknowns = [];
    result.forEach((v, i) => {
      if (v === false) {
        unknowns.push(quiz.questions[i].vocabulary);
      }
    });
    const [wrong, taken, total] = [unknowns.length, result.length, quiz.questions.length];
    const [percentageTaken, percentageTotal] = [perc(taken - wrong, taken), perc(taken - wrong, total)];
    return { wrong, taken, total, percentageTaken, percentageTotal, unknowns };
  };

  return (
    <AppPage location={base + "/" + id} id={"quiz-" + id + "page"}>
      {"title" in quiz ? (
        !show ? (
          <QuizLayout title={quiz.title}>
            <QuizItem
              question={quiz.questions[itemCount]}
              is_last={itemCount === quiz.questions.length - 1}
              addResult={addResult}
              nextQ={nextQ}
              showResult={showResult}
            />
          </QuizLayout>
        ) : (
          <QuizLayout title={quiz.title}>
            <Results onReport={getResults} onRetake={reset} base={base} />
          </QuizLayout>
        )
      ) : (
        []
      )}
    </AppPage>
  );
}

export default Quiz;
