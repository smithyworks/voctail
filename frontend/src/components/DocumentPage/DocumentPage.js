import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Grid, CircularProgress, Paper, makeStyles, Hidden, Container } from "@material-ui/core";

import { AppPage, toasts, Breadcrumbs } from "../common";
import Text from "./Text.js";
import BlockContainer from "./BlockContainer";
import AddTranslationDialog from "./AddTranslationDialog";
import { api } from "../../utils";
import { refresh } from "../../App";

const useStyles = makeStyles({
  container: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  videoContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#010101",
  },
  captionContainer: {
    height: "100%",
    overflow: "auto",
    padding: "30px",
    backgroundColor: "white",
  },
  paperContainer: {
    display: "inline-block",
    padding: "30px 60px",
    backgroundColor: "white",
    borderRadius: "0",
    width: "100%",
    marginBottom: "40px",
    minHeight: "calc(100% - 90px)",
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
        console.log("ich habe gerade hier gerendert");
        api
          .viewedDocumentNow(document_id)
          .then()
          .catch((err) => console.log(err));
      })
      .catch((err) => {
        console.log(err);
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
      .then((res) => {
        toasts.toastSuccess("Successfully added a translation!");
        refresh();
      })
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

  if (document.video) {
    return (
      <AppPage location="documents" id="document-markup-page" noPadding noBreadcrumbs>
        <Hidden smDown>
          <Grid container className={classes.container}>
            <Grid item xs className={classes.videoContainer}>
              <div style={{ height: 60, padding: "0 30px" }}>
                <Breadcrumbs invert />
              </div>
              <iframe
                title={document_id + 1}
                style={{ width: "100%", height: "30vw" }}
                src={document.embed_link}
                frameBorder="0"
                allowFullScreen
              />
              <div style={{ height: 60 }} />
            </Grid>
            <Grid item lg={5} md={6} className={classes.captionContainer}>
              <BlockContainer
                lookupWord={lookupWord}
                lookupTranslations={lookupTranslations}
                onAddTranslation={onAddTranslationIntent}
                sans
              >
                <Text document={document} lookupWordByWord={lookupWordByWord} showHeader />
              </BlockContainer>
            </Grid>
          </Grid>
        </Hidden>

        <Hidden mdUp>
          <Breadcrumbs />
          <div>
            <iframe
              title={document_id}
              style={{ width: "100%", height: "57vw" }}
              src={document.embed_link}
              frameBorder="0"
              allowFullScreen
            />
          </div>

          <Container maxWidth="md">
            <BlockContainer
              lookupWord={lookupWord}
              lookupTranslations={lookupTranslations}
              onAddTranslation={onAddTranslationIntent}
              sans
            >
              <Text document={document} lookupWordByWord={lookupWordByWord} showHeader />
            </BlockContainer>
          </Container>
        </Hidden>

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
  } else
    return (
      <AppPage location="documents" id="document-markup-page" maxWidth="md">
        <Paper className={classes.paperContainer}>
          <BlockContainer
            lookupWord={lookupWord}
            lookupTranslations={lookupTranslations}
            onAddTranslation={onAddTranslationIntent}
            sans
          >
            <Text document={document} lookupWordByWord={lookupWordByWord} showHeader />
          </BlockContainer>
        </Paper>

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
