import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Grid, Typography as T } from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import { makeStyles } from "@material-ui/core/styles";

import AppPage from "../common/AppPage";
import TranslationPopup from "./TranslationPopup.js";
import Word from "./Word.js";
import { api } from "../../utils";

const useStyles = makeStyles({
  header: { padding: "15px 10px 10px 10px", borderBottom: "1px solid grey" },
  body: { padding: "20px", textAlign: "center", fontFamily: "noto-serif, serif" },
  narrowContainer: { display: "inline-block", width: "100%", maxWidth: "800px" },
  title: { fontSize: "35px", marginBottom: "10px", textAlign: "center", fontWeight: "bold" },
  subtitle: { fontSize: "20px", marginBottom: "10px", textAlign: "left", fontWeight: "bold" },
  paragraph: { fontSize: "16px", marginBottom: "10px", textAlign: "left" },
  block: { fontFamily: "noto-serif, serif" },
});

function TextDocumentPage() {
  const classes = useStyles();

  const { document_id } = useParams();

  const [document, setDocument] = useState();
  const [refreshCount, setRefreshCount] = useState(0);
  const refresh = () => setRefreshCount(refreshCount + 1);
  const [reloadCount, setReloadCount] = useState(0);
  const reload = () => setReloadCount(reloadCount + 1);
  useEffect(() => {
    api
      .document(document_id)
      .then((res) => {
        setDocument(res.data);

        if (reloadCount === 0) {
          const entries = res.data?.vocabulary?.map(({ word_id, known }) => {
            return { word_id, known: known ?? true };
          });
          if (entries) api.updateVocabulary(entries);
        }
      })
      .catch((err) => {
        console.log(1, err);
      });
  }, [document_id, reloadCount]); // eslint-disable-line

  function markUnknown(word_id) {
    if (document?.vocabulary) {
      const entry = document.vocabulary.find((v) => word_id === v.word_id);
      entry.known = false;
      document.vocabulary = [...document.vocabulary];
      refresh();
    }
    api.updateVocabulary([{ word_id, known: false }]).finally(reload);
  }
  function markKnown(word_id) {
    if (document?.vocabulary) {
      const entry = document.vocabulary.find((v) => word_id === v.word_id);
      entry.known = true;
      document.vocabulary = [...document.vocabulary];
      refresh();
    }
    api.updateVocabulary([{ word_id, known: true, certainty: 10 }]).finally(reload);
  }

  const popperProps = useRef({});
  const [wordHover, setWordHover] = useState(false);
  const [popperHover, setPopperHover] = useState(false);
  function mouseEnterWord(anchor, word_id) {
    popperProps.current = { anchor, word_id };
    setWordHover(true);
  }

  const [blocks, setBlocks] = useState();

  useEffect(() => {
    if (!document) return;

    const newBlocks = document.blocks.map((b, bi) => {
      const items = b.content.split(" ").map((t, ti) => {
        return (
          <Word
            key={ti}
            token={t}
            onMouseEnter={mouseEnterWord}
            onMouseLeave={() => setWordHover(false)}
            onClick={markUnknown}
            vocabulary={document?.vocabulary}
          />
        );
      });

      return (
        <T className={[classes[b.type], classes.block].join(" ")} key={bi}>
          {items}
        </T>
      );
    });
    setBlocks(newBlocks);
  }, [document, refreshCount]); // eslint-disable-line

  return (
    <AppPage location="documents" id="document-markup-page">
      <Grid container justify="space-between" className={classes.header}>
        <T>Published by: The Voctail Team</T>
        <Rating value={4} precision={0.5} className={classes.rating} name="Document Rating" />
      </Grid>
      <div className={classes.body}>
        <div className={classes.narrowContainer}>{blocks}</div>

        <TranslationPopup
          {...(popperProps?.current ?? {})}
          open={wordHover || popperHover}
          onMouseEnter={() => setPopperHover(true)}
          onMouseLeave={() => setPopperHover(false)}
          markAsKnown={markKnown}
          vocabulary={document?.vocabulary}
          translations={document?.translations}
        />
      </div>
    </AppPage>
  );
}

export default TextDocumentPage;
