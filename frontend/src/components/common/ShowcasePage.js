import React from "react";
import { Grid, Typography } from "@material-ui/core";

import { AppPage, toasts, VTButton } from ".";

function ShowcasePage() {
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
    </AppPage>
  );
}

export default ShowcasePage;
