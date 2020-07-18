import React, { useState, useEffect } from "react";
import {
  Button,
  ButtonBase,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Grid,
  Typography,
  Tooltip,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AppPage from "../common/AppPage";

import { api } from "../../utils";
import logo_classroom from "../../assets/classroom_logo.png";
import { ClassroomSection, ConfirmDialog } from "../common";
import VTButton from "../common/Buttons/VTButton";
import { toasts } from "../common/AppPage/AppPage";
import { Link } from "react-router-dom";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import ClassroomTile from "../common/ClassroomTile";
import VTIconFlexButton from "../common/Buttons/IconButton";
import VoctailDialogTitle from "../common/Dialogs/VoctailDialogTitle";
import GoPremiumDialog from "../common/Dialogs/GoPremiumDialog";
import ClassroomCreateFormDialog from "./ClassroomCreateFormDialog";

export function deleteClassroom(classroomId, classroomDataFromDatabase, setClassroomDataFromDatabase) {
  const indexOfDeletedClassroom = indexOfClassroom(classroomId, classroomDataFromDatabase);
  api
    .deleteClassroom(classroomId)
    .then((res) => {
      setClassroomDataFromDatabase(
        classroomDataFromDatabase
          .slice(0, indexOfDeletedClassroom)
          .concat(classroomDataFromDatabase.slice(indexOfDeletedClassroom + 1))
      );
    })
    .catch((err) => console.log(err));
  toasts.toastSuccess("Classroom deleted!");
}

export function renameClassroom(classroomId, newTitle, classroomDataFromDatabase, setClassroomDataFromDatabase) {
  const indexOfRenamedClassroom = indexOfClassroom(classroomId, classroomDataFromDatabase);
  let classroomRenamed = classroomDataFromDatabase[indexOfRenamedClassroom];
  classroomRenamed.title = newTitle;
  api
    .renameClassroom(classroomId, newTitle)
    .then((res) => {
      setClassroomDataFromDatabase(
        classroomDataFromDatabase
          .slice(0, indexOfRenamedClassroom)
          .concat([classroomRenamed])
          .concat(classroomDataFromDatabase.slice(indexOfRenamedClassroom + 1))
      );
    })
    .catch((err) => console.log(err));
  toasts.toastSuccess("Classroom renamed!");
}

export function indexOfClassroom(classroomId, classrooms) {
  let output = 0;
  classrooms.forEach((classroom, index) => {
    if (classroom.classroom_id === classroomId) {
      output = index;
    }
  });
  return output;
}
