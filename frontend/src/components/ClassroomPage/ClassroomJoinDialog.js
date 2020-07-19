import React, { useContext, useEffect, useRef, useState } from "react";
import { toasts } from "../common/AppPage";
import { api } from "../../utils";
import VTButton from "../common/Buttons/VTButton";
import { UserContext, refresh } from "../../App";

import { Dialog, DialogActions, DialogContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import VoctailDialogTitle from "../common/Dialogs/VoctailDialogTitle";
import { useParams } from "react-router-dom";
import { user } from "../../utils/api";

const useStyles = makeStyles(() => ({
  container: { height: 200, width: "100%" },
  grid: { height: 100, width: "100%" },
  userItem: { width: "150px" },
}));

function JoinDialog({ title, open, onClose, link, classroom_id }) {
  const classes = useStyles();
  const contextUser = useContext(UserContext);

  const user_id = contextUser.user_id;

  function joinClassroom() {
    if (classroom_id && user_id) {
      console.log("user", user_id);
      console.log("classroom_id", classroom_id);

      api
        .addStudentsToClassroom(classroom_id, [user_id])
        .then((res) => {
          window.location = "/classrooms/" + classroom_id;
          toasts.toastSuccess("You are now a new member of this classroom!");
        })
        .catch((err) => toasts.toastError("Something went wrong while communicating with the server..."));
    }
  }

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="join-classroom">
      <VoctailDialogTitle id="join-classroom">Do you want to join {title}?</VoctailDialogTitle>
      <DialogContent> By joining this classroom you will become a student of it.</DialogContent>
      <DialogActions>
        <VTButton secondary onClick={onClose}>
          Cancel
        </VTButton>
        <VTButton accept onClick={joinClassroom}>
          Join Classroom now!
        </VTButton>
      </DialogActions>
    </Dialog>
  );
}
export default JoinDialog;
