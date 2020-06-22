import React, { useEffect, useState, useRef } from "react";
import { Grid, Typography as T, Paper, Popper, Divider } from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import { makeStyles } from "@material-ui/core/styles";

import AppPage from "./common/AppPage";
import { api } from "../utils";

const useStyles = makeStyles({
  header: { padding: "15px 10px 10px 10px", borderBottom: "1px solid grey" },
  body: { padding: "20px", textAlign: "center", "& *": { fontFamily: "noto-serif, sans" } },
  narrowContainer: { display: "inline-block", width: "100%", maxWidth: "800px" },
  title: { fontSize: "35px", marginBottom: "10px", textAlign: "center", fontWeight: "bold" },
  subtitle: { fontSize: "20px", marginBottom: "10px", textAlign: "left", fontWeight: "bold" },
  paragraph: { fontSize: "16px", marginBottom: "10px", textAlign: "left" },
  unknownItem: { backgroundColor: "#eee", "&:hover": {} },
  knownItem: { "&:hover": {} },
  popperPaper: {
    margin: "2px",
    textAlign: "left",
    border: "1px solid lightgrey",
    overflow: "hidden",
  },
  popperBody: {
    padding: "10px",
  },
  popperItem: { fontWeight: "bold" },
  popperList: { padding: "0 10px 0 15px", margin: "0" },
  popperActions: {
    padding: "5px 10px",
    textAlign: "center",
    fontFamily: "sans",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#eee",
    },
  },
});

function Item({ children, known, onMouseEnter, onMouseLeave, onClick }) {
  const classes = useStyles();

  const ref = useRef();
  const hoveredRef = useRef(false);

  useEffect(() => {
    if (!known)
      setTimeout(() => {
        try {
          if (ref?.current?.matches(":hover") && !hoveredRef.current) {
            if (typeof onMouseEnter === "function") onMouseEnter(ref.current, children);
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
        if (typeof onMouseEnter === "function") onMouseEnter(ref.current, children);
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
      onClick(children);
    }
  }

  return (
    <>
      <span
        ref={ref}
        onMouseEnter={enter}
        onMouseLeave={leave}
        onClick={click}
        className={known ? classes.knownItem : classes.unknownItem}
      >
        {children}
      </span>{" "}
    </>
  );
}

function TranslationPopup({ open, anchor, item, onMouseEnter, onMouseLeave, markAsKnown, translations }) {
  const classes = useStyles();

  const [translationData, setTranslationData] = useState();
  useEffect(() => {
    if (!translations || !item) return;
    const relevantTranslations = translations.filter((t) => t.word === item);
    const components = relevantTranslations.map((rt, i) => (
      <T variant="body2" gutterBottom component="li" key={i}>
        {rt.translation}
      </T>
    ));
    setTranslationData({ components, item });
  }, [item]); // eslint-disable-line

  function leave() {
    setTimeout(() => {
      if (typeof onMouseLeave === "function") onMouseLeave();
    }, 300);
  }

  function _markKnown() {
    if (typeof markAsKnown === "function") markAsKnown(item);
    if (typeof onMouseLeave === "function") onMouseLeave();
  }

  return (
    <Popper open={!!open && !!anchor} anchorEl={anchor} placement="bottom" disablePortal>
      <div onMouseEnter={onMouseEnter} onMouseLeave={leave}>
        <Paper className={classes.popperPaper}>
          <div className={classes.popperBody}>
            <T variant="subtitle1" className={classes.popperItem} gutterBottom>
              {item}
            </T>
            <ul className={classes.popperList}>
              {translationData?.item === item ? translationData?.components : null}
            </ul>
          </div>
          <Divider />
          <div onClick={_markKnown} className={classes.popperActions}>
            Mark as known
          </div>
        </Paper>
      </div>
    </Popper>
  );
}

function TextDocumentPage() {
  const classes = useStyles();

  const [document, setDocument] = useState();
  const [unknownItems, setUnknownItems] = useState([]);
  useEffect(() => {
    api
      .document()
      .then((res) => {
        setDocument(res.data);
        setUnknownItems(res.data.unknownItems);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []); // eslint-disable-line

  function clean(word) {
    try {
      return word.toLowerCase().replace(/([.,;:-]|'.*)/g, "");
    } catch {
      return "";
    }
  }

  const [blocks, setBlocks] = useState();
  function markAsUnknown(word) {
    word = clean(word);
    if (!unknownItems.includes(word)) setUnknownItems([...unknownItems, word]);
  }
  function markAsKnown(word) {
    word = clean(word);
    if (unknownItems.includes(word)) setUnknownItems(unknownItems.filter((i) => i !== word));
  }

  const popperProps = useRef({});
  const [itemHover, setItemHover] = useState(false);
  const [popperHover, setPopperHover] = useState(false);
  function enterItem(anchor, item) {
    popperProps.current = { anchor, item };
    setItemHover(true);
  }

  useEffect(() => {
    if (!document) return;
    const newBlocks = document.blocks.map((b, bi) => {
      const items = b.content.split(" ").map((t, ti) => {
        if (unknownItems.includes(clean(t)))
          return (
            <Item key={ti} onMouseEnter={enterItem} onMouseLeave={() => setItemHover(false)} onClick={markAsUnknown}>
              {t}
            </Item>
          );
        else
          return (
            <Item
              known
              key={ti}
              onMouseEnter={enterItem}
              onMouseLeave={() => setItemHover(false)}
              onClick={markAsUnknown}
            >
              {t}
            </Item>
          );
      });
      return (
        <T className={classes[b.type]} key={bi}>
          {items}
        </T>
      );
    });
    setBlocks(newBlocks);
  }, [unknownItems, document]); // eslint-disable-line

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
          item={popperProps?.current?.item}
          open={itemHover || popperHover}
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
