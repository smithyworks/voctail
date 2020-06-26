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

function clean(word) {
  try {
    return word.toLowerCase().replace(/([.,;:"\(\)\?\!><’‘`]|'s$|^'|'$|)/g, "");
  } catch {
    return "";
  }
}

function TextDocumentPage() {
  const classes = useStyles();

  const { document_id } = useParams();

  const [document, setDocument] = useState();
  const [unknownWords, setUnknownWords] = useState([]);
  useEffect(() => {
    api
      .document()
      .then((res) => {
        setDocument(res.data);
        setUnknownWords(res.data.unknownWords);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []); // eslint-disable-line

  const [blocks, setBlocks] = useState();
  function markAsUnknown(word) {
    word = clean(word);
    if (!unknownWords.includes(word)) setUnknownWords([...unknownWords, word]);
  }
  function markAsKnown(word) {
    word = clean(word);
    if (unknownWords.includes(word)) setUnknownWords(unknownWords.filter((i) => i !== word));
  }

  const popperProps = useRef({});
  const [wordHover, setWordHover] = useState(false);
  const [popperHover, setPopperHover] = useState(false);
  function enterItem(anchor, item) {
    popperProps.current = { anchor, item };
    setWordHover(true);
  }

  useEffect(() => {
    if (!document) return;

    const newBlocks = document.blocks.map((b, bi) => {
      const items = b.content.split(" ").map((t, ti) => {
        if (unknownWords.includes(clean(t)))
          return (
            <Word key={ti} onMouseEnter={enterItem} onMouseLeave={() => setWordHover(false)} onClick={markAsUnknown}>
              {t}
            </Word>
          );
        else
          return (
            <Word
              known
              key={ti}
              onMouseEnter={enterItem}
              onMouseLeave={() => setWordHover(false)}
              onClick={markAsUnknown}
            >
              {t}
            </Word>
          );
      });
      return (
        <T className={[classes[b.type], classes.block]} key={bi}>
          {items}
        </T>
      );
    });
    setBlocks(newBlocks);
  }, [unknownWords, document]); // eslint-disable-line

  return (
    <AppPage location="documents" id="document-markup-page">
      <Grid container justify="space-between" className={classes.header}>
        <T>Published by: The Voctail Team</T>
        <Rating value={4} precision={0.5} className={classes.rating} name="Document Rating" />
      </Grid>
      <div className={classes.body}>
        <div className={classes.narrowContainer}>{blocks}</div>

        <TranslationPopup
          anchor={popperProps?.current?.anchor}
          word={clean(popperProps?.current?.item)}
          open={wordHover || popperHover}
          onMouseEnter={() => setPopperHover(true)}
          onMouseLeave={() => setPopperHover(false)}
          markAsKnown={markAsKnown}
          translations={document?.translations}
        />
      </div>
    </AppPage>
  );
}

export default TextDocumentPage;
