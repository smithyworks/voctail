import React, { useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";

import TranslationPopup from "./TranslationPopup.js";
import { api } from "../../utils";

const useStyles = makeStyles({
  container: { textAlign: "center", fontFamily: "crimson-text, serif", "& .word-unknown": { backgroundColor: "blue" } },
});

function BlockContainer({ children, lookupWord, onAddTranslation, lookupTranslations }) {
  const classes = useStyles();

  function markUnknown(word_id) {
    const elements = document.querySelectorAll(`[data-word-id='${word_id}']`);
    elements.forEach((el) => {
      el.className = "word-unknown";
      el.setAttribute("data-known", "false");
    });
    api.updateVocabulary([{ word_id, known: false }]).catch((err) => console.log(err));
  }
  function markKnown(word_id) {
    const elements = document.querySelectorAll(`[data-word-id='${word_id}']`);
    elements.forEach((el) => {
      el.className = "";
      el.setAttribute("data-known", "true");
    });
    api.updateVocabulary([{ word_id, known: true, certainty: 10 }]).catch((err) => console.log(err));
  }

  const [popperHover, setPopperHover] = useState(false);
  const popperTimeoutRef = useRef();
  function mouseOverPopper() {
    if (popperTimeoutRef.current) clearTimeout(popperTimeoutRef.current);
    setPopperHover(true);
  }
  function mouseOutPopper() {
    if (popperTimeoutRef.current) clearTimeout(popperTimeoutRef.current);
    popperTimeoutRef.current = setTimeout(() => setPopperHover(false), 50);
  }

  const [targetState, setTargetState] = useState({});
  const [wordHover, setWordHover] = useState(false);
  const wordTimeoutRef = useRef();
  function mouseOverWord({ target }) {
    if (target.attributes["data-word-id"]) {
      const known = target.attributes["data-known"].value === "true" ? true : false;
      if (!known) {
        const word_id = parseInt(target.attributes["data-word-id"].value);
        setTargetState({ target, word_id, known });

        if (wordTimeoutRef.current) clearTimeout(wordTimeoutRef.current);
        wordTimeoutRef.current = setTimeout(() => setWordHover(target), 400);
      }
    }
  }
  function mouseOutWord() {
    if (targetState.word_id) {
      if (wordTimeoutRef.current) clearTimeout(wordTimeoutRef.current);
      wordTimeoutRef.current = setTimeout(() => setWordHover(false), 50);
    }
  }
  function clickWord({ target }) {
    if (target.attributes["data-word-id"]) {
      const known = target.attributes["data-known"].value === "true" ? true : false;
      if (known) {
        const word_id = parseInt(target.attributes["data-word-id"].value);
        markUnknown(word_id);

        setTargetState({ target, word_id, known });
        setWordHover(target);
      }
    }
  }

  return (
    <div className={classes.container} onMouseOver={mouseOverWord} onMouseOut={mouseOutWord} onClick={clickWord}>
      {children}
      <TranslationPopup
        open={!!wordHover || popperHover}
        anchor={targetState.target}
        word_id={targetState.word_id}
        lookupWord={lookupWord}
        lookupTranslations={lookupTranslations}
        onMouseEnter={mouseOverPopper}
        onMouseLeave={mouseOutPopper}
        onMarkKnown={markKnown}
        onAddTranslationIntent={onAddTranslation}
      />
    </div>
  );
}

export default BlockContainer;
