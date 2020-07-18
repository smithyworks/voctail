import React, { useEffect, useState } from "react";
import { Chip, makeStyles } from "@material-ui/core";

import { api } from "../../utils";
import { toasts } from "../common/AppPage/AppPage";
import VocabularyPopup from "./VocabularyPopup";

const useStyles = makeStyles({
  known: {
    cursor: "pointer",
    margin: "5px",
    borderColor: "green",
    backgroundColor: "rgb(0,128,0,0.2)",
  },
  unknown: {
    cursor: "pointer",
    margin: "5px",
    borderColor: "red",
    backgroundColor: "rgb(255,0,0,0.3)",
  },
});

function VocabularyCloud({ userId, filter, showKnowns }) {
  const classes = useStyles();

  const [count, setCount] = useState(0);
  const [popperState, setPopperState] = useState();
  const [vocabulary, setVocabulary] = useState();
  const [lookup, setLookup] = useState();
  useEffect(() => {
    if (userId)
      api
        .vocabulary(userId)
        .then((res) => {
          const tempLookup = {};
          res.data.forEach((v) => {
            tempLookup[v.word_id] = v;
          });
          setLookup(tempLookup);
          setVocabulary(res.data);
        })
        .catch((err) => {
          toasts.toastError("Encountered an error while communicating with the server...");
        });
  }, [userId, count]);

  const [matchedVocabulary, setMatchedVocabulary] = useState(vocabulary);
  useEffect(() => {
    (async () => {
      if (vocabulary) {
        const pattern = new RegExp(filter);
        setMatchedVocabulary(vocabulary.filter((v) => v.word.match(pattern)));
      }
    })();
  }, [filter, vocabulary]);

  const [filteredVocabulary, setFilteredVocabulary] = useState(vocabulary);
  useEffect(() => {
    (async () => {
      if (matchedVocabulary) {
        if (!showKnowns) setFilteredVocabulary(matchedVocabulary.filter((v) => !v.known));
        else setFilteredVocabulary(matchedVocabulary);
      }
    })();
  }, [showKnowns, matchedVocabulary]);

  let items;
  if (filteredVocabulary) {
    items = filteredVocabulary.map((v, i) => (
      <Chip
        variant="outlined"
        className={v.known ? classes.known : classes.unknown}
        data-word-id={v.word_id}
        key={i}
        label={<span data-word-id={v.word_id}>{v.word}</span>}
      />
    ));
  }

  function clickWord({ target }) {
    if (target.attributes["data-word-id"]) {
      const word_id = parseInt(target.attributes["data-word-id"].value);
      const entry = lookup[word_id];

      setPopperState({ target, entry });
    }
  }
  function markKnown(word_id) {
    console.log(word_id);
    if (word_id)
      api
        .updateVocabulary([{ word_id, known: true, certainty: 10 }])
        .then(() => setCount(count + 1))
        .catch((err) => toasts.toastError("Encountered an error while communicating with the server."))
        .finally(() => setPopperState());
  }

  function markUnknown(word_id) {
    console.log(word_id);
    if (word_id)
      api
        .updateVocabulary([{ word_id, known: false }])
        .then(() => setCount(count + 1))
        .catch((err) => toasts.toastError("Encountered an error while communicating with the server."))
        .finally(() => setPopperState());
  }

  return (
    <div onClick={clickWord}>
      {items}
      <VocabularyPopup
        entry={popperState?.entry}
        anchor={popperState?.target}
        open={!!popperState?.target}
        onClose={() => setPopperState()}
        onMarkKnown={markKnown}
        onMarkUnknown={markUnknown}
      />
    </div>
  );
}

export default VocabularyCloud;
