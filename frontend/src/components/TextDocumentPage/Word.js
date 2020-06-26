import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  unknown: { fontFamily: "inherit", backgroundColor: "blue", "&:hover": {} },
  known: { fontFamily: "inherit" },
});

function clean(word) {
  try {
    word = word.replace(/[ \t\r\n]/g, "");
    return word
      .toLowerCase()
      .replace(/[.,;:"()?!><’‘`]/g, "")
      .replace(/[^a-z]s$/g, "")
      .replace(/(^'|'$)/g, "");
  } catch (err) {
    console.log(err);
    return "";
  }
}

function referenceVocabulary(token, vocabulary) {
  return new Promise((resolve, reject) => {
    try {
      const entry = vocabulary.find((v) => v.word === clean(token));
      resolve(entry);
    } catch {
      resolve(null);
    }
  });
}

function Word({ token, onMouseEnter, onMouseLeave, onClick, vocabulary }) {
  const classes = useStyles();

  const [entry, setEntry] = useState();
  const known = entry?.known ?? true;
  useEffect(() => {
    referenceVocabulary(token, vocabulary).then((entry) => setEntry(entry));
  }, [token, vocabulary]);

  const ref = useRef();
  const hoveredRef = useRef(false);
  useEffect(() => {
    if (!known)
      setTimeout(() => {
        try {
          if (ref?.current?.matches(":hover") && !hoveredRef.current) {
            if (typeof onMouseEnter === "function") onMouseEnter(ref.current, entry?.word_id);
            hoveredRef.current = true;
          }
        } catch (err) {
          console.log(err);
        }
      }, 300);
  }, [known]); // eslint-disable-line

  const [t, setT] = useState();
  function enter() {
    if (known) return;
    setT(
      setTimeout(() => {
        hoveredRef.current = true;
        if (typeof onMouseEnter === "function") onMouseEnter(ref.current, entry?.word_id);
      }, 300)
    );
  }
  function leave() {
    if (known) return;
    if (t) clearTimeout(t);
    if (hoveredRef.current)
      setTimeout(() => {
        setT();
        if (typeof onMouseLeave === "function") onMouseLeave();
      }, 300);
    hoveredRef.current = true;
  }

  function click() {
    if (!known) return;
    if (typeof onClick === "function") {
      onClick(entry?.word_id);
    }
  }

  return (
    <>
      <span
        ref={ref}
        onMouseEnter={enter}
        onMouseLeave={leave}
        onClick={click}
        className={known ? classes.known : classes.unknown}
      >
        {token}
      </span>{" "}
    </>
  );
}

export default Word;
