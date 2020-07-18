import React, { useEffect, useState, useRef, useContext } from "react";
import { Typography as T, Grid, IconButton, Menu, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { api } from "../../utils";
import { toasts } from "../common/AppPage/AppPage";
import { UserContext } from "../../App";

function clean(word) {
  try {
    word = word.replace(/[ \t\r\n]/g, "");
    return word
      .toLowerCase()
      .replace(/[.,;:"()?!><’‘”“`]/g, "")
      .replace(/[^a-z]s$/g, "")
      .replace(/(^'|'$)/g, "");
  } catch (err) {
    console.log(err);
    return "";
  }
}

const useStyles = makeStyles({
  title: { fontSize: "34px", marginBottom: "10px", textAlign: "center", fontWeight: "bold" },
  subtitle: { fontSize: "20px", marginBottom: "10px", textAlign: "left", fontWeight: "bold" },
  paragraph: { fontSize: "18px", marginBottom: "10px", textAlign: "left" },
  caption: { fontSize: "18px", marginBottom: "10px", textAlign: "left", lineHeight: "1.4em" },
  timestamp: {
    lineHeight: "1.4em",
    fontSize: "18px",
    textAlign: "left",
    color: "darkgrey",
    marginRight: "20px",
  },
  block: { fontFamily: "crimson-text, serif" },
  sansBlock: {
    fontFamily: "fira-sans, sans",
  },
  header: {
    width: "100%",
    fontStyle: "italic",
    marginBottom: "20px",
  },
});

function Text({ document, lookupWordByWord }) {
  const classes = useStyles();

  const user = useContext(UserContext);
  console.log(document);

  const [blocks, setBlocks] = useState();
  useEffect(() => {
    if (!document) return;

    const newBlocks = document.blocks.map((b, bi) => {
      const items = b.content.split(" ").map((t, ti) => {
        const word = clean(t);
        const wordEntry = lookupWordByWord(word);
        if (word !== "" && wordEntry) {
          const { word_id, known } = wordEntry;
          return (
            <React.Fragment key={ti}>
              <span
                data-word={word}
                data-word-id={word_id}
                data-known={known ?? true}
                className={known ?? true ? null : "word-unknown"}
              >
                {t}
              </span>{" "}
            </React.Fragment>
          );
        } else {
          return <span key={ti}>{t} </span>;
        }
      });

      if (document.video && b.type === "caption") {
        return (
          <Grid container wrap="nowrap" key={bi}>
            <Grid item>
              <T className={[classes.timestamp, document.video ? classes.sansBlock : classes.block].join(" ")}>
                {b.timestamp}
              </T>
            </Grid>
            <Grid item>
              <T className={[classes.caption, document.video ? classes.sansBlock : classes.block].join(" ")}>{items}</T>
            </Grid>
          </Grid>
        );
      } else
        return (
          <T className={[classes[b.type], document.video ? classes.sansBlock : classes.block].join(" ")} key={bi}>
            {items}
          </T>
        );
    });

    setBlocks(newBlocks);
  }, [document]); // eslint-disable-line

  const menuAnchor = useRef();
  const [menuOpen, setMenuOpen] = useState(false);
  function _onCreateQuiz() {
    setMenuOpen(false);
    if (user.premium)
      api
        .createQuizFromDoc(document.document_id, 20)
        .then((res) => toasts.toastSuccess("Successfully created a quiz for this document!"))
        .catch((err) => toasts.toastError("Encountered a problem while creating your quiz!"));
    else toasts.goPremium();
  }

  return (
    <>
      <div className={classes.header}>
        <Grid container justify="space-between" alignItems="center">
          <div style={{ textAlign: "left" }}>
            <T>Author: {document.author}</T>
            <T>Publisher: {document.publisher || "The Voctail Team"}</T>
          </div>

          <IconButton ref={menuAnchor} onClick={() => setMenuOpen(!menuOpen)}>
            <MoreVertIcon />
          </IconButton>
        </Grid>
        <Menu anchorEl={menuAnchor.current} open={menuOpen} onClose={() => setMenuOpen(false)}>
          <MenuItem onClick={_onCreateQuiz}>Create Quiz</MenuItem>
        </Menu>
      </div>
      {blocks}
    </>
  );
}

export default Text;
