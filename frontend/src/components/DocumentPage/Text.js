import React, { useEffect, useState, useRef } from "react";
import { Typography as T, Paper, Grid, IconButton, Menu, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { api } from "../../utils";
import { toasts } from "../common/AppPage/AppPage";

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
  narrowContainer: {
    display: "inline-block",
    width: "100%",
    maxWidth: "860px",
    padding: "30px 40px",
    backgroundColor: "white",
    borderRadius: "0",
  },
  title: { fontSize: "34px", marginBottom: "10px", textAlign: "center", fontWeight: "bold" },
  subtitle: { fontSize: "20px", marginBottom: "10px", textAlign: "left", fontWeight: "bold" },
  paragraph: { fontSize: "18px", marginBottom: "10px", textAlign: "left" },
  block: { fontFamily: "crimson-text, serif" },
  header: {
    width: "100%",
    fontStyle: "italic",
    marginBottom: "20px",
  },
});

function Text({ document, lookupWordByWord }) {
  const classes = useStyles();

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

      return (
        <T className={[classes[b.type], classes.block].join(" ")} key={bi}>
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
    api
      .createQuizFromDoc(document.document_id, 20)
      .then((res) => toasts.toastSuccess("Successfully created a quiz for this document!"))
      .catch((err) => toasts.toastError("Encountered a problem while creating your quiz!"));
  }

  return (
    <Paper className={classes.narrowContainer}>
      <div className={classes.header}>
        <Grid container justify="space-between" alignItems="center">
          <T>Published by: The Voctail Team</T>

          <IconButton ref={menuAnchor} onClick={() => setMenuOpen(!menuOpen)}>
            <MoreVertIcon />
          </IconButton>
        </Grid>
        <Menu anchorEl={menuAnchor.current} open={menuOpen} onClose={() => setMenuOpen(false)}>
          <MenuItem onClick={_onCreateQuiz}>Create Quiz</MenuItem>
        </Menu>
      </div>
      {blocks}
    </Paper>
  );
}

export default Text;
