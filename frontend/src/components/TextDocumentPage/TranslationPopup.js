import React, { useEffect, useState } from "react";
import { Typography as T, Paper, Popper, Grid, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import CheckIcon from "@material-ui/icons/Check";

const useStyles = makeStyles({
  paper: {
    margin: "2px",
    textAlign: "left",
    border: "1px solid lightgrey",
    overflow: "hidden",
    minHeight: "150px",
    minWidth: "250px",
  },
  header: { fontWeight: "bold", fontSize: "1.3em", padding: "5px 10px 0 10px", fontFamily: "noto-serif, serif" },
  body: { maxHeight: "200px" },
  list: { padding: "0 10px 0 15px", margin: "0", maxHeight: "100%", overflow: "auto" },
  listItem: { fontFamily: "noto-serif, serif", listStyle: "inside" },
  actions: {
    padding: "8px",
    textAlign: "right",
  },
  addWordListItem: {
    listStyle: "none",
    color: "darkblue",
    display: "flex",
    alignItems: "center",
    marginTop: "10px",
    marginLeft: "-5px",
    cursor: "pointer",
    "&:hover": { textDecoration: "underline" },
    fontFamily: "noto-sans, sans",
  },
  addIcon: { fontSize: "1.2em", marginRight: "2px" },
  knownButton: { color: "white", backgroundColor: "green", fontWeight: "bold" },
});

function TranslationPopup({
  open,
  anchor,
  word_id,
  onMouseEnter,
  onMouseLeave,
  onMarkKnown,
  translationLookup,
  wordLookup,
  onAddTranslationIntent,
}) {
  const classes = useStyles();

  const word = wordLookup[word_id]?.word;
  const [translationData, setTranslationData] = useState();
  useEffect(() => {
    if (!translationLookup || !word_id) return;
    const components = translationLookup[word_id]?.map((t, i) => (
      <T variant="body2" gutterBottom component="li" className={classes.listItem} key={i}>
        {t.translation}
      </T>
    ));
    setTranslationData({ components, word_id });
  }, [word_id, translationLookup]); // eslint-disable-line

  function leave() {
    if (typeof onMouseLeave === "function") onMouseLeave();
  }

  function _markKnown() {
    if (typeof onMarkKnown === "function") onMarkKnown(word_id);
    if (typeof onMouseLeave === "function") onMouseLeave();
  }

  function _addTranslationIntent() {
    if (typeof onAddTranslationIntent === "function") onAddTranslationIntent(word_id);
    if (typeof onMouseLeave === "function") onMouseLeave();
  }

  return (
    <Popper open={!!open && !!anchor} anchorEl={anchor} placement="bottom" disablePortal>
      <div onMouseEnter={onMouseEnter} onMouseLeave={leave}>
        <Paper className={classes.paper} component={Grid} container direction="column" wrap="nowrap">
          <T variant="subtitle1" className={classes.header}>
            {word}
          </T>

          <Grid item xs className={classes.body}>
            <ul className={classes.list}>
              {translationData?.word_id === word_id ? translationData?.components : null}
              <li className={classes.addWordListItem} onClick={_addTranslationIntent}>
                <AddIcon fontSize="inherit" className={classes.addIcon} /> Add A Translation
              </li>
            </ul>
          </Grid>

          <div className={classes.actions}>
            <Button
              variant="contained"
              size="small"
              startIcon={<CheckIcon />}
              className={classes.knownButton}
              onClick={_markKnown}
            >
              Mark Known
            </Button>
          </div>
        </Paper>
      </div>
    </Popper>
  );
}

export default TranslationPopup;