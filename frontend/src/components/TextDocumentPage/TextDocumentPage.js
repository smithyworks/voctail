import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Grid, Typography as T, CircularProgress } from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import { makeStyles } from "@material-ui/core/styles";

import AppPage, { toasts } from "../common/AppPage";
import TranslationPopup from "./TranslationPopup.js";
import AddTranslationDialog from "./AddTranslationDialog";
import { api } from "../../utils";

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

const useStyles = makeStyles({
  header: { padding: "15px 10px 10px 10px", borderBottom: "1px solid grey" },
  body: { padding: "20px", textAlign: "center", fontFamily: "noto-serif, serif" },
  narrowContainer: { display: "inline-block", width: "100%", maxWidth: "800px" },
  title: { fontSize: "35px", marginBottom: "10px", textAlign: "center", fontWeight: "bold" },
  subtitle: { fontSize: "20px", marginBottom: "10px", textAlign: "left", fontWeight: "bold" },
  paragraph: { fontSize: "16px", marginBottom: "10px", textAlign: "left" },
  block: { fontFamily: "noto-serif, serif" },
  unknown: { fontFamily: "inherit", backgroundColor: "blue" },
});

function TextDocumentPage() {
  const classes = useStyles();

  const { document_id } = useParams();

  const [doc, setDoc] = useState();
  const lookups = useRef();
  const [reloadCount, setReloadCount] = useState(0);
  const reload = () => setReloadCount(reloadCount + 1);
  useEffect(() => {
    api
      .document(document_id)
      .then((res) => {
        const wordLookupByWord = {};
        const wordLookup = {};
        res.data.vocabulary.forEach((v) => {
          wordLookupByWord[v.word] = v;
          wordLookup[v.word_id] = v;
        });

        const translationLookup = {};
        res.data.translations.forEach((t) => {
          if (t.translation_id) {
            if (translationLookup[t.word_id]) translationLookup[t.word_id].push(t);
            else translationLookup[t.word_id] = [t];
          }
        });

        lookups.current = { wordLookupByWord, wordLookup, translationLookup };

        if (reloadCount === 0) {
          const entries = res.data?.vocabulary?.map(({ word_id, known }) => {
            return { word_id, known: known ?? true };
          });
          if (entries) api.updateVocabulary(entries).catch((err) => console.log(err));
        }

        setDoc(res.data);
      })
      .catch((err) => {
        toasts.toastError("Encountered an error communicating with the server!");
      });
  }, [document_id, reloadCount]); // eslint-disable-line

  function markUnknown(word_id) {
    const elements = document.querySelectorAll(`[data-word-id='${word_id}']`);
    elements.forEach((el) => {
      el.className = classes.unknown;
      el.setAttribute("data-known", "false");
    });
    api.updateVocabulary([{ word_id, known: false }]).catch((err) => console.log(err));
  }
  function markKnown(word_id) {
    const elements = document.querySelectorAll(`[data-word-id='${word_id}']`);
    elements.forEach((el) => {
      el.className = "classes.unknown";
      el.setAttribute("data-known", "true");
    });
    api.updateVocabulary([{ word_id, known: true, certainty: 10 }]).catch((err) => console.log(err));
  }

  const [blocks, setBlocks] = useState();
  useEffect(() => {
    if (!doc) return;

    const newBlocks = doc.blocks.map((b, bi) => {
      const items = b.content.split(" ").map((t, ti) => {
        const word = clean(t);
        const wordEntry = lookups.current.wordLookupByWord[word];
        if (word !== "" && wordEntry) {
          const { word_id, known } = wordEntry;
          return (
            <React.Fragment key={ti}>
              <span
                data-word={word}
                data-word-id={word_id}
                data-known={known ?? true}
                className={known ?? true ? null : classes.unknown}
              >
                {t}
              </span>{" "}
            </React.Fragment>
          );
        } else {
          return <span>{t} </span>;
        }
      });

      return (
        <T className={[classes[b.type], classes.block].join(" ")} key={bi}>
          {items}
        </T>
      );
    });

    setBlocks(newBlocks);
  }, [doc]); // eslint-disable-line

  const [AddTranslationDialogOpen, setAddTranslationDialogOpen] = useState(false);
  const wordIdRef = useRef();
  function onAddTranslationIntent(word_id) {
    wordIdRef.current = word_id;
    setAddTranslationDialogOpen(true);
  }
  function onAddTranslation(word_id, translation) {
    setAddTranslationDialogOpen(false);
    api.addTranslation(word_id, translation).finally(reload);
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

  const targetRef = useRef();
  const [wordHover, setWordHover] = useState(false);
  const wordTimeoutRef = useRef();
  function mouseOverWord({ target }) {
    if (target.attributes["data-word-id"]) {
      const known = target.attributes["data-known"].value === "true" ? true : false;
      if (!known) {
        const word_id = parseInt(target.attributes["data-word-id"].value);
        targetRef.current = { target, word_id, known };

        if (wordTimeoutRef.current) clearTimeout(wordTimeoutRef.current);
        setWordHover(target);
      }
    }
  }
  function mouseOutWord() {
    if (targetRef.current) {
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

        targetRef.current = { target, word_id, known };
        setWordHover(target);
      }
    }
  }

  if (!doc || !blocks) {
    return (
      <AppPage location="documents" id="document-markup-page">
        <Grid container style={{ height: "100%" }} justify="center" alignItems="center">
          <CircularProgress />
        </Grid>
      </AppPage>
    );
  }

  return (
    <AppPage location="documents" id="document-markup-page">
      <Grid container justify="space-between" className={classes.header}>
        <T>Published by: The Voctail Team</T>
        <Rating value={4} precision={0.5} className={classes.rating} name="Document Rating" />
      </Grid>
      <div className={classes.body} onMouseOver={mouseOverWord} onMouseOut={mouseOutWord} onClick={clickWord}>
        <div className={classes.narrowContainer}>{blocks}</div>

        <TranslationPopup
          open={!!wordHover || popperHover}
          anchor={targetRef.current?.target}
          word_id={targetRef.current?.word_id}
          wordLookup={lookups.current?.wordLookup}
          translationLookup={lookups.current?.translationLookup}
          onMouseEnter={mouseOverPopper}
          onMouseLeave={mouseOutPopper}
          onMarkKnown={markKnown}
          onAddTranslationIntent={onAddTranslationIntent}
        />

        <AddTranslationDialog
          open={AddTranslationDialogOpen}
          word_id={wordIdRef.current}
          vocabulary={doc?.vocabulary}
          translations={doc?.translations}
          onSubmit={onAddTranslation}
          onClose={() => setAddTranslationDialogOpen(false)}
        />
      </div>
    </AppPage>
  );
}

export default TextDocumentPage;
