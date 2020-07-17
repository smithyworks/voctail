import { DialogActions, DialogContent, DialogTitle, Grid } from "@material-ui/core";
import React, { useRef, useState } from "react";
import { toasts } from "../common/AppPage";
import { VTButton } from "../common";
import ErrorDialogField from "./ErrorDialogField";

function Suggestion({ sugg, index, error, setError }) {
  return (
    <ErrorDialogField
      error={error}
      setError={setError}
      warning={"Please provide a suggestion for suggestion field #" + (index + 1) + "."}
      margin="dense"
      id={"suggestion " + (index + 1)}
      label={"Suggestion " + (index + 1) + "*"}
      type="suggestion"
      onChange={(e) => (sugg.current = e.target.value)}
      fullWidth
    />
  );
}

function QuizItem({ addItem }) {
  const max_suggestions = 5;

  const vocabulary = useRef("");
  const translation = useRef("");

  const refs = [useRef(""), useRef(""), useRef(""), useRef(""), useRef("")];

  //errors
  const [errorVoc, setErrorVoc] = useState(false);
  const [errorTranslation, setErrorTranslation] = useState(false);

  // additionally works as a placeholder for current dims of ref - syntactically neater than counter in JSX
  const [error, setError] = useState([false, false, false]);
  const setErrorIndex = (ind, v) => {
    //console.log(error.slice(0, ind),[true],error.slice(ind + 1, error.length),error.slice(0, ind).concat([v]).concat(error.slice(ind + 1, error.length)) )
    setError(
      error
        .slice(0, ind)
        .concat([v])
        .concat(error.slice(ind + 1, error.length))
    );
  };

  const addSuggestion = () => {
    if (error.length < max_suggestions) {
      setError(error.concat(false));
    } else {
      toasts.toastWarning("The maximum of eight suggestions has been reached.");
    }
  };
  const removeSuggestion = () => {
    if (error.length > 1) {
      setError(error.slice(0, error.length - 1));
    } else {
      toasts.toastWarning("At least one suggestion needed.");
    }
  };

  const [fieldKey, setFieldKey] = useState(0);
  const resetFields = () => {
    vocabulary.current = "";
    translation.current = "";
    //force rerender to clear fields + handle reset of suggestions
    setFieldKey(fieldKey + 1);
    refs.forEach((v) => {
      v.current = "";
    });

    //reset errors
    setErrorVoc(false);
    setErrorTranslation(false);
    setError(error.map((v) => false));
  };

  const toItem = () => {
    return {
      vocabulary: vocabulary.current,
      translation: translation.current,
      suggestions: error.map((v, i) => refs[i].current),
    };
  };

  const validateItem = (item) => {
    console.log(item, item.vocabulary.length === 0);
    console.log(errorVoc);
    if (item.vocabulary.length === 0) {
      console.log("voc length", item.vocabulary.length);
      setErrorVoc(true);
      return false;
    }
    if (item.translation.length === 0) {
      setErrorTranslation(true);
      return false;
    }

    let sugError = false;

    for (let i = 0; i < item.suggestions.length; i++) {
      if (item.suggestions[i].length === 0) {
        setErrorIndex(i, true);
        sugError = true;
        break;
      }
    }
    return !sugError;
  };

  const update = () => {
    const item = toItem();
    //console.log("suggestions witihin update ", item);
    if (validateItem(item)) {
      addItem(item);
      resetFields();

      toasts.toastSuccess("Quiz item added!");
    }
  };

  //autoFocus only if fieldkey != 0  - when opening for the first time title from another component should be in focus
  return (
    <div>
      <DialogTitle id="add-item">Add a quiz item</DialogTitle>
      <DialogContent key={fieldKey}>
        <Grid container justify="flex-start" alignItems="center" direction="column">
          {fieldKey === 0 ? (
            <ErrorDialogField
              error={errorVoc}
              setError={setErrorVoc}
              warning={"Please provide a vocabulary word."}
              margin="dense"
              id="vocabulary"
              label="Vocabulary*"
              type="vocabulary"
              onChange={(e) => (vocabulary.current = e.target.value)}
              fullWidth
            />
          ) : (
            <ErrorDialogField
              error={errorVoc}
              setError={setErrorVoc}
              warning={"Please provide a vocabulary word."}
              autoFocus
              margin="dense"
              id="vocabulary"
              label="Vocabulary*"
              type="vocabulary"
              onChange={(e) => (vocabulary.current = e.target.value)}
              fullWidth
            />
          )}
          <ErrorDialogField
            error={errorTranslation}
            setError={setErrorTranslation}
            warning={"Please provide a translation."}
            margin="dense"
            id="translation"
            label="Translation*"
            type="translation"
            onChange={(e) => (translation.current = e.target.value)}
            fullWidth
          />
          {error.map((v, i) => (
            <Suggestion key={i} sugg={refs[i]} index={i} error={error[i]} setError={(v) => setErrorIndex(i, v)} />
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <VTButton onClick={() => addSuggestion()} color="primary">
          Add Suggestion
        </VTButton>
        <VTButton onClick={() => removeSuggestion()} color="primary">
          Remove Suggestion
        </VTButton>
        <VTButton success onClick={() => update()} color="primary">
          Add quiz item
        </VTButton>
      </DialogActions>
    </div>
  );
}

export default QuizItem;
