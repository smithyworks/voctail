import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import VTButton from "../common/Buttons/VTButton";
import DialogContentText from "@material-ui/core/DialogContentText";
import VoctailDialogTitle from "../common/Dialogs/VoctailDialogTitle";
import { ClassroomSectionDialog } from "../common";
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

function ClassroomAddDocumentDialog({ openCreateForm, closeCreateForm, documentTitle, onAddtoClassroom }) {
  const classes = formStyles();
  const [selectSectionOpen, setSelectSectionOpen] = useState(false);

  return (
    <div>
      <Dialog open={openCreateForm} onClose={closeCreateForm} aria-labelledby="form-dialog-title">
        <VoctailDialogTitle id="form-dialog-title"> Adding {documentTitle} to a classroom </VoctailDialogTitle>
        <DialogContent>
          <DialogContentText className={classes.description}>
            {" "}
            Please choose a classroom to add your document.{" "}
          </DialogContentText>
          <ClassroomSectionDialog>
            <Grid container direction="column">
              {[0].map((tile) => (
                <React.Fragment key={tile.classroom_id}>
                  <ClassroomTileSelect
                    isOwned
                    title={tile.title}
                    teacher={tile.classroom_owner}
                    topic={tile.topic}
                    onClick={() => {
                      setSelectSectionOpen(true);
                      closeCreateForm();
                    }}
                  />
                </React.Fragment>
              ))}
            </Grid>
          </ClassroomSectionDialog>
        </DialogContent>
        <DialogActions>
          <VTButton
            secondary
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
        onAddToClassroom={onAddtoClassroom}
        openCreateForm={selectSectionOpen}
        closeCreateForm={() => setSelectSectionOpen(false)}
      />
    </div>
  );
}

export default ClassroomAddDocumentDialog;
