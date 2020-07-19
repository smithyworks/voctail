import React, { useContext } from "react";
import { toasts } from "../common/AppPage";
import { api } from "../../utils";
import VTButton from "../common/Buttons/VTButton";
import { UserContext } from "../../App";

import { Dialog, DialogActions, DialogContent } from "@material-ui/core";
import VoctailDialogTitle from "../common/Dialogs/VoctailDialogTitle";

function JoinDialog({ title, open, onClose, link, classroom_id }) {
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
