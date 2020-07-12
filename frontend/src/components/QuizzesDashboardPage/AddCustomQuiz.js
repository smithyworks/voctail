import React, { useRef, useState } from "react";
import { toasts } from "../common/AppPage";
import { api } from "../../utils";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@material-ui/core";

import { VTButton } from "../common";
import QuizItemSection from "./QuizItemSection";
import QuizItem from "./QuizItem";

function AddCustomQuiz({ onAdd, onClose, open }) {
  const handleClose = () => {
    onClose();
    setItems([]);
    resetFields();
  };

  const title = useRef("");
  const [items, setItems] = useState([]);

  const addItem = (item) => {
    setItems((il) => [...il, item]);
  };

  const deleteItem = (i) => {
    setItems((il) => il.slice(0, i).concat(il.slice(i + 1)));
    toasts.toastSuccess("Quiz item deleted!");
  };
  const resetFields = () => {
    title.current = "";
  };

  const addQuiz = () => {
    if (title.current.length > 0 && items.length > 0) {
      api.createCustomQuiz(title.current, items).then((res) => {
        toasts.toastSuccess("Custom quiz added with " + items.length + " questions!");
        handleClose();
        onAdd();
      });
    } else {
      toasts.toastError(
        "You cannot add a quiz without title or quiz items. Please add title and at least one quiz item first."
      );
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="add-custom-quiz" fullScreen>
        <DialogTitle id="add-custom-quiz">
          To add a new quiz please fill out as many quiz items as you like.
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title*"
            type="title"
            onChange={(e) => (title.current = e.target.value)}
            fullWidth
          />
        </DialogContent>

        <QuizItemSection items={items} del={deleteItem} />

        <QuizItem items={items} setItems={setItems} addItem={addItem} />

        <DialogContent>
          <DialogContentText align={"right"}>
            Once you have filled out the title and at least one question item feel free to add the Quiz.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <VTButton
            success
            onClick={() => {
              addQuiz();
            }}
            color="primary"
          >
            Add a custom quiz
          </VTButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AddCustomQuiz;
