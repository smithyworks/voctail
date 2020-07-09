import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Grid, Typography as T, CircularProgress, makeStyles } from "@material-ui/core";

import { AppPage, toasts } from "../common";
import Text from "./Text.js";
import BlockContainer from "./BlockContainer";
import AddTranslationDialog from "./AddTranslationDialog";
import { api } from "../../utils";

const useStyles = makeStyles({
  headerContainer: { textAlign: "center" },
  header: {
    display: "inline-block",
    width: "100%",
    maxWidth: "860px",
    padding: "15px 10px 10px 10px",
    backgroundColor: "skyblue",
  },
});

function DocumentPage() {
  const classes = useStyles();
  const { document_id } = useParams();

  const [document, setDocument] = useState();
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

        setDocument(res.data);
      })
      .catch((err) => {
        toasts.toastError("Encountered an error communicating with the server!");
      });
  }, [document_id, reloadCount]); // eslint-disable-line

  function lookupWordByWord(word) {
    if (lookups.current) return lookups.current.wordLookupByWord[word];
    else return {};
  }
  function lookupWord(word_id) {
    if (lookups.current) return lookups.current.wordLookup[word_id];
    else return {};
  }
  function lookupTranslations(word_id) {
    if (lookups.current) return lookups.current.translationLookup[word_id];
    else return [{}];
  }

  const [addTranslationDialogOpen, setAddTranslationDialogOpen] = useState(false);
  const wordIdRef = useRef();
  function onAddTranslationIntent(word_id) {
    wordIdRef.current = word_id;
    setAddTranslationDialogOpen(true);
  }
  function onAddTranslation(word_id, translation) {
    setAddTranslationDialogOpen(false);
    api
      .addTranslation(word_id, translation)
      .catch((err) => toasts.toastError("Encountered an error while communicating with the server..."))
      .then((res) => toasts.toastSuccess("Successfully added a translation!"))
      .finally(reload);
  }

  if (!document) {
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
      <div className={classes.headerContainer}>
        <div className={classes.header}>
          <Grid container justify="space-between">
            <T>Published by: The Voctail Team</T>

            <div />
          </Grid>
        </div>
      </div>
      <BlockContainer
        lookupWord={lookupWord}
        lookupTranslations={lookupTranslations}
        onAddTranslation={onAddTranslationIntent}
      >
        <Text document={document} lookupWordByWord={lookupWordByWord} />
      </BlockContainer>

      <AddTranslationDialog
        open={addTranslationDialogOpen}
        word_id={wordIdRef.current}
        lookupWord={lookupWord}
        lookupTranslations={lookupTranslations}
        onSubmit={onAddTranslation}
        onClose={() => setAddTranslationDialogOpen(false)}
      />
    </AppPage>
  );
}

export default DocumentPage;
