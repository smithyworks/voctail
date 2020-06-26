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

function TranslationPopup({ open, anchor, word, onMouseEnter, onMouseLeave, markAsKnown, translations }) {
  const classes = useStyles();

  const [translationData, setTranslationData] = useState();
  useEffect(() => {
    if (!translations || !word) return;

    const relevantTranslations = translations.filter((t) => t.word === word);
    const components = relevantTranslations.map((rt, i) => (
      <T variant="body2" gutterBottom component="li" className={classes.listItem} key={i}>
        {rt.translation}
      </T>
    ));
    setTranslationData({ components, word });
  }, [word, translations]); // eslint-disable-line

  function leave() {
    setTimeout(() => {
      if (typeof onMouseLeave === "function") onMouseLeave();
    }, 300);
  }

  function _markKnown() {
    if (typeof markAsKnown === "function") markAsKnown(word);
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
              {translationData?.word === word ? translationData?.components : null}
              <li className={classes.addWordListItem}>
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
