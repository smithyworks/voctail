import { DialogActions, DialogContent, DialogTitle, Grid, TextField } from "@material-ui/core";
import React, { useRef, useState } from "react";
import { toasts } from "../../common/AppPage";
import { VTButton } from "../../common";

function Suggestion({ sugg, index }) {
  return (
    <TextField
      autoFocus
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
  const vocabulary = useRef("");
  const translation = useRef("");

  //works as a placeholder for current dims of ref - syntactically neater than counter in JSX
  const [suggestions, setSuggestions] = useState(["", "", ""]);

  const refs = [useRef(""), useRef(""), useRef(""), useRef(""), useRef(""), useRef(""), useRef(""), useRef("")];

  const addSuggestion = () =>
    suggestions.length < 8
      ? setSuggestions(suggestions.concat(""))
      : toasts.toastError("The maximum of eight suggestions has been reached.");
  const removeSuggestion = () =>
    suggestions.length > 1
      ? setSuggestions(suggestions.slice(0, suggestions.length - 1))
      : toasts.toastError("At least one suggestion needed.");

  const [fieldKey, setFieldKey] = useState(0);
  const resetFields = () => {
    vocabulary.current = "";
    translation.current = "";
    //force rerender to clear fields + handle reset of suggestions
    setFieldKey(fieldKey + 1);
    refs.forEach((v) => {
      v.current = "";
    });
  };

  const toItem = () => {
    return {
      vocabulary: vocabulary.current,
      translation: translation.current,
      suggestions: suggestions.map((v, i) => refs[i].current),
    };
  };

  const validateItem = (item) =>
    item.vocabulary.length > 0 && item.translation.length > 0 && item.suggestions.every((v) => v.length > 0);

  const update = () => {
    const item = toItem();
    console.log("suggestions witihin update ", item);
    if (validateItem(item)) {
      addItem(item);
      resetFields();

      toasts.toastSuccess("Quiz item added!");
    } else {
      toasts.toastError("Please ensure all fields are filled out.");
    }
  };

  return (
    <div>
      <DialogTitle id="add-item">Add a quiz item</DialogTitle>
      <DialogContent key={fieldKey}>
        <Grid container justify="flex-start" alignItems="center" direction="column">
          <TextField
            autoFocus
            margin="dense"
            id="vocabulary"
            label="Vocabulary*"
            type="vocabulary"
            onChange={(e) => (vocabulary.current = e.target.value)}
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="translation"
            label="Translation*"
            type="translation"
            onChange={(e) => (translation.current = e.target.value)}
            fullWidth
          />
          {suggestions.map((v, i) => (
            <Suggestion sugg={refs[i]} index={i} />
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
