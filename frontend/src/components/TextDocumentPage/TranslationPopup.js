import React, { useEffect, useState } from "react";
import { Typography as T, Paper, Popper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  paper: {
    margin: "2px",
    textAlign: "left",
    border: "1px solid lightgrey",
    overflow: "hidden",
    minHeight: "150px",
    maxHeight: "350px",
    minWidth: "250px",
  },
  header: { fontWeight: "bold" },
  body: {
    padding: "10px",
  },
  list: { padding: "0 10px 0 15px", margin: "0" },
  actions: {
    padding: "5px 10px",
    textAlign: "center",
    fontFamily: "sans",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#eee",
    },
  },
});

function TranslationPopup({ open, anchor, word, onMouseEnter, onMouseLeave, markAsKnown, translations }) {
  const classes = useStyles();

  const [translationData, setTranslationData] = useState();
  useEffect(() => {
    if (!translations || !word) return;

    const relevantTranslations = translations.filter((t) => t.word === word);
    const components = relevantTranslations.map((rt, i) => (
      <T variant="body2" gutterBottom component="li" key={i}>
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
        <Paper className={classes.paper}>
          <T variant="subtitle1" className={classes.header} gutterBottom>
            {word}
          </T>

          <div className={classes.body}>
            <ul className={classes.list}>{translationData?.word === word ? translationData?.components : null}</ul>
          </div>

          <div onClick={_markKnown} className={classes.actions}>
            Mark as known
          </div>
        </Paper>
      </div>
    </Popper>
  );
}

export default TranslationPopup;
