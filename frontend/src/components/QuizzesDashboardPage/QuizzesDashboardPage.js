import React, { useEffect, useRef, useState } from "react";
import { Grid } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

import AppPage, { toasts } from "../common/AppPage";
import { api } from "../../utils";

import QuizSection from "../common/Quiz/QuizSection";
import QuizTile from "../common/Quiz/QuizTile";
import AddRandomQuiz from "./AddRandomQuiz";
import AddCustomQuiz from "./AddCustomQuiz";
import RenameQuiz from "./RenameQuiz";
import Metrics from "./Metrics";
import WarningDialog from "../AdminPage/WarningDialog";

const useStyles = makeStyles({
  grid: { height: "100%", width: "100%" },
});

function QuizzesDashboard({ ...props }) {
  const classes = useStyles();
  const base = "quizzes";

  const [reloadCount, setReloadCount] = useState(0);
  const refresh = () => setReloadCount(reloadCount + 1);

  const [quizChallenges, setChallenges] = useState([]);
  const [quizCustom, setCustom] = useState([]);
  const [quizRandom, setRandom] = useState([]);
  const [quizDocuments, setDocuments] = useState([]);

  //Add Quiz dialogs custom and random
  const [openCustom, setOpenCustom] = useState(false);
  const handleCustomOpen = () => {
    setOpenCustom(true);
  };
  const handleCustomClose = () => {
    setOpenCustom(false);
  };

  const [openRandom, setOpenRandom] = useState(false);
  const handleRandomOpen = () => {
    setOpenRandom(true);
  };
  const handleRandomClose = () => {
    setOpenRandom(false);
  };

  const [openViewStat, setOpenViewStat] = useState(false);
  const [viewQuiz, setViewQuiz] = useState({});
  const handleViewStatOpen = (quiz) => {
    setOpenViewStat(true);
    setViewQuiz(quiz);
  };
  const handleViewStatClose = () => {
    setOpenViewStat(false);
  };

  const [openRename, setOpenRename] = useState(false);
  const [idRename, setIdRename] = useState(-1);
  const handleRenameOpen = (id) => {
    setOpenRename(true);
    setIdRename(id);
  };
  const handleRenameClose = () => {
    setOpenRename(false);
  };

  //delete dialog
  const deleteInfo = useRef();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const deleteQuiz = (id) => {
    api.deleteQuiz(id).then((r) => {
      if (r) {
        toasts.toastSuccess("Quiz deleted.");
      }
    });
    refresh();
  };

  const onDelete = (quiz) => {
    deleteInfo.current = {
      title: "You are about to delete the quiz forever!",
      body: `Are you sure you want to delete the quiz "${quiz.title}" (${quiz.quiz_id})?\nThis cannot be undone!`,
      confirmText: quiz.title,
      onClose: () => {
        setDeleteOpen(false);
        deleteInfo.current.onConfirm = null;
      },
      onConfirm: () => {
        setDeleteOpen(false);
        deleteQuiz(quiz.quiz_id);
      },
    };
    setDeleteOpen(true);
  };

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

  return (
    <AppPage location="quizzes" id="quizzes-page">
      <QuizSection title={"Challenges"}>
        <Grid className={classes.grid} container justify="flex-start" alignItems="left" direction="row">
          {quizChallenges.map((v) => (
            <QuizTile
              key={v.quiz_id}
              name={v.title}
              id={v.quiz_id}
              onDelete={() => onDelete(v)}
              onEdit={() => handleRenameOpen(v.quiz_id)}
              onViewStatistic={() => handleViewStatOpen(v)}
              isOwned={true}
              linkTo={base + "/" + v.quiz_id}
              lastSeen={v.last_seen}
            >
              {v}
            </QuizTile>
          ))}
        </Grid>
      </QuizSection>
      <QuizSection title={"Custom Quizzes"} onAdd={() => handleCustomOpen()} hasAddButton={true}>
        <Grid className={classes.grid} container justify="flex-start" alignItems="left" direction="row">
          {quizCustom.map((v) => (
            <QuizTile
              key={v.quiz_id}
              name={v.title}
              id={v.quiz_id}
              onDelete={() => onDelete(v)}
              onEdit={() => handleRenameOpen(v.quiz_id)}
              onViewStatistic={() => handleViewStatOpen(v)}
              isOwned={true}
              linkTo={base + "/" + v.quiz_id}
              lastSeen={v.last_seen}
            >
              {v}
            </QuizTile>
          ))}
        </Grid>
      </QuizSection>
      <QuizSection title={"Random Quizzes"} onAdd={() => handleRandomOpen()} hasAddButton={true}>
        <Grid className={classes.grid} container justify="flex-start" alignItems="left" direction="row">
          {quizRandom.map((v) => (
            <QuizTile
              key={v.quiz_id}
              name={v.title}
              id={v.quiz_id}
              onDelete={() => onDelete(v)}
              onEdit={() => handleRenameOpen(v.quiz_id)}
              onViewStatistic={() => handleViewStatOpen(v)}
              isOwned={true}
              linkTo={base + "/" + v.quiz_id}
              lastSeen={v.last_seen}
            >
              {v}
            </QuizTile>
          ))}
        </Grid>
      </QuizSection>
      <QuizSection title={"Document Quizzes"}>
        <Grid className={classes.grid} container justify="flex-start" alignItems="left" direction="row">
          {quizDocuments.map((v) => (
            <QuizTile
              key={v.quiz_id}
              name={v.title}
              id={v.quiz_id}
              onDelete={() => onDelete(v)}
              onEdit={() => handleRenameOpen(v.quiz_id)}
              onViewStatistic={() => handleViewStatOpen(v)}
              isOwned={true}
              linkTo={base + "/" + v.quiz_id}
              lastSeen={v.last_seen}
            >
              {v}
            </QuizTile>
          ))}
        </Grid>
      </QuizSection>

      <AddCustomQuiz onAdd={refresh} onClose={handleCustomClose} open={openCustom} />
      <AddRandomQuiz onAdd={refresh} onClose={handleRandomClose} open={openRandom} />
      <RenameQuiz onAdd={refresh} onClose={handleRenameClose} open={openRename} quiz_id={idRename} />
      <Metrics onClose={handleViewStatClose} open={openViewStat} quiz={viewQuiz} />
      <WarningDialog open={deleteOpen} info={deleteInfo.current} />
    </AppPage>
  );
}

export default QuizzesDashboard;
