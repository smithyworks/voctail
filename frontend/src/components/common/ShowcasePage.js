import React, { useState } from "react";
import { Grid, Typography } from "@material-ui/core";

import { AppPage, toasts, VTButton } from ".";
import ConfirmDialog from "./ConfirmDialog";
import DashboardSection from "./DashboardSection";
import InviteStudentsDialog from "./InviteStudentsDialog";

function ShowcasePage() {
  const [okDialogOpen, setOkDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  return (
    <AppPage title="Common components Showcase">
      <Typography variant="h5" style={{ marginTop: "20px" }}>
        Toasts
      </Typography>
      <Grid container>
        <Grid item style={{ padding: "10px" }}>
          <VTButton neutral onClick={() => toasts.toastSuccess("Yay, you did it!")}>
            Toast Success
          </VTButton>
        </Grid>
        <Grid item style={{ padding: "10px" }}>
          <VTButton neutral onClick={() => toasts.toastError("Oh! Something went wrong!")}>
            Toast Error
          </VTButton>
        </Grid>
        <Grid item style={{ padding: "10px" }}>
          <VTButton neutral onClick={() => toasts.toastWarning("Careful now!")}>
            Toast Warning
          </VTButton>
        </Grid>
        <Grid item style={{ padding: "10px" }}>
          <VTButton neutral onClick={() => toasts.toastInfo("I have something to say!")}>
            Toast Info
          </VTButton>
        </Grid>
      </Grid>

      <Typography variant="h5" style={{ marginTop: "20px" }}>
        VTButton
      </Typography>
      <Grid container>
        <Grid item style={{ padding: "10px" }}>
          <VTButton neutral>Neutral</VTButton>
        </Grid>
        <Grid item style={{ padding: "10px" }}>
          <VTButton accept>Accept</VTButton>
        </Grid>
        <Grid item style={{ padding: "10px" }}>
          <VTButton danger>Danger</VTButton>
        </Grid>
        <Grid item style={{ padding: "10px" }}>
          <VTButton secondary>secondary</VTButton>
        </Grid>
      </Grid>

      <Typography variant="h5" style={{ marginTop: "20px" }}>
        Dialogs
      </Typography>
      <Grid container>
        <Grid item style={{ padding: "10px" }}>
          <VTButton neutral onClick={() => setConfirmDialogOpen(true)}>
            ConfirmDialog
          </VTButton>
        </Grid>
        <Grid item style={{ padding: "10px" }}>
          <VTButton neutral onClick={() => setOkDialogOpen(true)}>
            OkDialog
          </VTButton>
        </Grid>

        <ConfirmDialog
          open={confirmDialogOpen}
          title="Title Here"
          onClose={() => setConfirmDialogOpen(false)}
          onConfirm={() => toasts.toastSuccess("You clicked confirm!")}
        >
          <Typography>Some text here.</Typography>
          <Typography>Some longer text down here..</Typography>
        </ConfirmDialog>
        <ConfirmDialog
          open={okDialogOpen}
          title="Title Here"
          onClose={() => setOkDialogOpen(false)}
          onOk={() => toasts.toastSuccess("You clicked Ok!")}
        >
          <Typography>Some text here.</Typography>
          <Typography>Some longer text down here..</Typography>
        </ConfirmDialog>
      </Grid>

      <Typography variant="h5" style={{ marginTop: "20px" }} gutterBottom>
        DashboardSection
      </Typography>
      <DashboardSection title="My Documents">This is where the content goes</DashboardSection>

      <Typography variant="h5" style={{ marginTop: "20px" }} gutterBottom>
        InviteStudentsDialog
      </Typography>
      <VTButton
        neutral
        onClick={() => {
          setInviteDialogOpen(true);
        }}
      >
        Invite students
      </VTButton>
      <InviteStudentsDialog
        open={inviteDialogOpen}
        onClose={() => setInviteDialogOpen(false)}
        onInvite={(ids) => {
          toasts.toastSuccess(JSON.stringify(ids));
          setInviteDialogOpen(false);
        }}
      ></InviteStudentsDialog>
    </AppPage>
  );
}

export default ShowcasePage;
