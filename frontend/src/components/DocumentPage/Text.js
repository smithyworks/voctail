import React, { useEffect, useState } from "react";
import { Typography as T } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

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
  },
  title: { fontSize: "34px", marginBottom: "10px", textAlign: "center", fontWeight: "bold" },
  subtitle: { fontSize: "20px", marginBottom: "10px", textAlign: "left", fontWeight: "bold" },
  paragraph: { fontSize: "18px", marginBottom: "10px", textAlign: "left" },
  block: { fontFamily: "crimson-text, serif" },
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
  }, [document]); // eslint-disable-line

  return <div className={classes.narrowContainer}>{blocks}</div>;
}

export default Text;
