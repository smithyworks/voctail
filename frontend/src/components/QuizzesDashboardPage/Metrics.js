import React, { useEffect, useState } from "react";
import { api } from "../../utils";
import { Button, Dialog, DialogActions, DialogTitle } from "@material-ui/core";
import MetricView from "./MetricView";

function Metrics({ onClose, open, quiz }) {
  const handleClose = () => {
    onClose();
  };

  const [results, setResults] = useState({});
  useEffect(() => {
    if (quiz.quiz_id !== undefined) {
      api
        .fetchQuizMetrics(quiz.quiz_id)
        .then((res) => {
          if (res) {
            setResults(res.data.metrics);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [quiz.quiz_id]);

  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="stats" fullWidth={true} maxWidth={"xl"}>
        <DialogTitle id="stats">Quiz statistics for quiz {quiz.title}.</DialogTitle>
        <MetricView questions={quiz.questions} results={results} />
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Metrics;
