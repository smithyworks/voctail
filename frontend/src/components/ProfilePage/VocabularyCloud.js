import React, { useEffect, useState } from "react";
import { Chip, makeStyles } from "@material-ui/core";

import { api } from "../../utils";
import { toasts } from "../common/AppPage/AppPage";

const useStyles = makeStyles({
  known: {
    margin: "5px",
    borderColor: "green",
    backgroundColor: "rgb(0,128,0,0.2)",
  },
  unknown: {
    margin: "5px",
    borderColor: "red",
    backgroundColor: "rgb(255,0,0,0.3)",
  },
});

function VocabularyCloud() {
  const classes = useStyles();

  const [vocabulary, setVocabulary] = useState();
  useEffect(() => {
    api
      .vocabulary()
      .then((res) => {
        setVocabulary(res.data);
      })
      .catch((err) => {
        toasts.toastError("Encountered an error while communicating with the server...");
      });
  }, []);

  let items;
  if (vocabulary) {
    items = vocabulary.map((v, i) => (
      <Chip
        variant="outlined"
        className={v.known ? classes.known : classes.unknown}
        data-word-id={v.word_id}
        data-known={v.known ? "true" : "false"}
        key={i}
        label={v.word}
      />
    ));
  }

  return <div>{items}</div>;
}

export default VocabularyCloud;
