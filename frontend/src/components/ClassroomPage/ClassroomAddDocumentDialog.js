import React, { useState, useContext } from "react";
import { Dialog, DialogActions, DialogContent, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { api } from "../../utils";
import VTButton from "../common/Buttons/VTButton";
import DialogContentText from "@material-ui/core/DialogContentText";
import VoctailDialogTitle from "../common/Dialogs/VoctailDialogTitle";
import { ClassroomSectionDialog } from "../common";
import { UserContext } from "../../App";
import ClassroomTileSelect from "../common/ClassroomTileSelect";
import ClassroomFormSelectSection from "../ClassroomPage/ClassroomFormSelectSection";

const formStyles = makeStyles(() => ({
  header: {
    color: "#0B6374",
    backgroundColor: "#D4E4E4",
  },
  description: {
    marginTop: "5%",
    marginBottom: "5%",
    fontStyle: "italic",
    textAlign: "center",
  },
  textField: {
    marginBottom: "3%",
  },
  buttons: { margin: "1%" },
}));

function ClassroomAddDocumentDialog({ openCreateForm, closeCreateForm, documentTitle }) {
  const classes = formStyles();
  const user = useContext(UserContext);
  const [classroomAsTeacherDataFromDatabase, setClassroomAsTeacherDataFromDatabase] = useState([]);
  const [selectSectionOpen, setSelectSectionOpen] = useState(false);

  api
    .fetchClassroomsAsTeacher(user.user_id)
    .then((resForTeacher) => {
      if (resForTeacher) {
        setClassroomAsTeacherDataFromDatabase(resForTeacher.data.rows);
      }
    })
    .catch((err) => console.log(err));

  return (
    <div>
      <Dialog open={openCreateForm} onClose={closeCreateForm} aria-labelledby="form-dialog-title">
        <VoctailDialogTitle id="form-dialog-title"> Adding {documentTitle} to a classroom... </VoctailDialogTitle>
        <DialogContent>
          <DialogContentText className={classes.description}>
            {" "}
            Please choose a classroom to add your document.{" "}
          </DialogContentText>
          <ClassroomSectionDialog>
            <Grid container direction="column">
              {classroomAsTeacherDataFromDatabase.map((tile) => (
                <React.Fragment key={tile.classroom_id}>
                  <ClassroomTileSelect isOwned title={tile.title} teacher={tile.classroom_owner} topic={tile.topic} />
                </React.Fragment>
              ))}
            </Grid>
          </ClassroomSectionDialog>
        </DialogContent>
        <DialogActions>
          <VTButton
            danger
            style={{ margin: "1%" }}
            onClick={() => {
              closeCreateForm();
            }}
          >
            Cancel
          </VTButton>
        </DialogActions>
      </Dialog>
      <ClassroomFormSelectSection
        openCreateForm={selectSectionOpen}
        closeCreateForm={() => setSelectSectionOpen(false)}
      />
    </div>
  );
}

export default ClassroomAddDocumentDialog;
