import React, { useState } from "react";
import { Grid, Typography, TextField } from "@material-ui/core";

import { AppPage, toasts, VTButton } from ".";
import ConfirmDialog from "./Dialogs/ConfirmDialog";
import CreationDialog from "./Dialogs/CreationDialog";
import DashboardSection from "./DashboardSection";
import Header from "./HeaderSection";
import UserCard from "./UserCard";
import IconButton from "@material-ui/core/IconButton";
import AddBoxIcon from "@material-ui/icons/AddBox";
import InviteMembersDialog from "./InviteMembersDialog";
import DashboardTile from "./DashboardTile";
import pic from "../../assets/fairytale.jpg";
import QuizSection from "./Quiz/QuizSection";
import QuizTile from "./Quiz/QuizTile";
import VTIconButton from "./Buttons/IconButton";
import ClassroomSection from "./ClassroomSection";
import ClassroomTile from "./ClassroomTile";
import PlaceholderTile from "./PlaceholderTile";

function ShowcasePage() {
  const [okDialogOpen, setOkDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [creationDialogOpen, setCreationDialogOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  return (
    <AppPage title="Common components Showcase">
      <Typography variant="h5" style={{ marginTop: "20px" }}>
        Header
      </Typography>
      <Header mainTitle="Main Title" subtitle="Subtitle" description="Description" />
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
        + Button with Hover
      </Typography>
      <Grid container>
        <Grid item style={{ padding: "10px" }}>
          <VTIconButton />
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
        <Grid item style={{ padding: "10px" }}>
          <VTButton accept onClick={() => setCreationDialogOpen(true)}>
            CreationDialog
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
        <CreationDialog
          open={creationDialogOpen}
          description="Description of what you're creating."
          title="Title Here"
          onClose={() => setCreationDialogOpen(false)}
          onOk={() => toasts.toastSuccess("You clicked Ok!")}
        >
          <TextField required autoFocus margin="dense" id="name" label="A field to fill" type="text" fullWidth />
        </CreationDialog>
      </Grid>

      <Typography variant="h5" style={{ marginTop: "20px" }}>
        UserCard
      </Typography>
      <Grid container>
        <Grid item style={{ padding: "10px" }}>
          <UserCard name="Name" email="email@voctail.com" initials={false} tip="This is a detail about the user." />
        </Grid>
        <Grid item style={{ padding: "10px" }}>
          <UserCard name="Name" email="email@voctail.com" tip="This is a detail about the user." />
        </Grid>
        <Grid item style={{ padding: "10px" }}>
          <UserCard name="Name" email="email@voctail.com" tip="This is a detail about the user." />
        </Grid>
      </Grid>

      <Typography variant="h5" style={{ marginTop: "20px" }} gutterBottom>
        DashboardSection
      </Typography>
      <DashboardSection
        title="My Documents"
        Button={
          <IconButton aria-label="test">
            <AddBoxIcon fontSize="large" style={{ color: "darkblue" }} />
          </IconButton>
        }
      >
        <PlaceholderTile
          onClick={() => toasts.toastSuccess("Clicked placeholder tile.")}
          tooltipTitle="Upload a file!"
        />
        <DashboardTile
          thumbnail={pic}
          title="Chechnya"
          author="Anthony Marra"
          isOwned
          onOpen={() => toasts.toastSuccess("Clicked open.")}
          onDelete={() => toasts.toastSuccess("Clicked delete.")}
          onEdit={() => toasts.toastSuccess("Clicked edit.")}
        />
        <DashboardTile
          thumbnail={pic}
          title="Chechnya"
          author="Anthony Marra"
          onOpen={() => toasts.toastSuccess("Clicked open.")}
        />
        <DashboardTile
          thumbnail={pic}
          title="Chechnya"
          author="Anthony Marra"
          onOpen={() => toasts.toastSuccess("Clicked open.")}
        />
        <DashboardTile
          thumbnail={pic}
          title="Chechnya"
          author="Anthony Marra"
          onOpen={() => toasts.toastSuccess("Clicked open.")}
        />
        <DashboardTile
          thumbnail={pic}
          title="Chechnya"
          author="Anthony Marra"
          onOpen={() => toasts.toastSuccess("Clicked open.")}
        />
        <DashboardTile
          thumbnail={pic}
          title="Chechnya"
          author="Anthony Marra"
          onOpen={() => toasts.toastSuccess("Clicked open.")}
        />
      </DashboardSection>

      <Typography variant="h5" style={{ marginTop: "20px" }} gutterBottom>
        DashboardSection (expandable)
      </Typography>
      <DashboardSection
        title="My Documents"
        Button={
          <IconButton aria-label="test">
            <AddBoxIcon fontSize="large" style={{ color: "darkblue" }} />
          </IconButton>
        }
        expandable
      >
        <DashboardTile
          thumbnail={pic}
          title="Chechnya"
          author="Anthony Marra"
          isOwned
          onOpen={() => toasts.toastSuccess("Clicked open.")}
          onDelete={() => toasts.toastSuccess("Clicked delete.")}
          onEdit={() => toasts.toastSuccess("Clicked edit.")}
        />
        <DashboardTile
          thumbnail={pic}
          title="Chechnya"
          author="Anthony Marra"
          onOpen={() => toasts.toastSuccess("Clicked open.")}
        />
        <DashboardTile
          thumbnail={pic}
          title="Chechnya"
          author="Anthony Marra"
          onOpen={() => toasts.toastSuccess("Clicked open.")}
        />
        <DashboardTile
          thumbnail={pic}
          title="Chechnya"
          author="Anthony Marra"
          onOpen={() => toasts.toastSuccess("Clicked open.")}
        />
        <DashboardTile
          thumbnail={pic}
          title="Chechnya"
          author="Anthony Marra"
          onOpen={() => toasts.toastSuccess("Clicked open.")}
        />
        <DashboardTile
          thumbnail={pic}
          title="Chechnya"
          author="Anthony Marra"
          onOpen={() => toasts.toastSuccess("Clicked open.")}
        />
      </DashboardSection>

      <Typography variant="h5" style={{ marginTop: "20px" }} gutterBottom>
        QuizSection
      </Typography>
      <QuizSection title="My Quizzes" hasAddButton onAdd={() => toasts.toastSuccess("Clicked add.")}>
        <QuizTile
          name="Custom Quiz 1"
          isOwned
          onDelete={() => toasts.toastSuccess("Clicked delete.")}
          onEdit={() => toasts.toastSuccess("Clicked edit.")}
          progress={75}
          linkTo="/quizzes/2"
        />
        <QuizTile
          name="Custom Quiz 2"
          isOwned
          onDelete={() => toasts.toastSuccess("Clicked delete.")}
          onEdit={() => toasts.toastSuccess("Clicked edit.")}
          progress={50}
          linkTo="/quizzes/2"
        />
        <QuizTile
          name="Yet Another Quiz"
          isOwned
          onDelete={() => toasts.toastSuccess("Clicked delete.")}
          onEdit={() => toasts.toastSuccess("Clicked edit.")}
          progress={0}
          linkTo="/quizzes/2"
        />
        <QuizTile
          name="Custom Quiz 3"
          isOwned
          onDelete={() => toasts.toastSuccess("Clicked delete.")}
          onEdit={() => toasts.toastSuccess("Clicked edit.")}
          progress={90}
          linkTo="/quizzes/2"
        />
        <QuizTile
          name="Custom Quiz 4"
          isOwned
          onDelete={() => toasts.toastSuccess("Clicked delete.")}
          onEdit={() => toasts.toastSuccess("Clicked edit.")}
          progress={10}
          linkTo="/quizzes/2"
        />
      </QuizSection>

      <ClassroomSection
        title="Classroom Section"
        Button={() => {
          return toasts.toastSuccess("You clicked on add");
        }}
      >
        <ClassroomTile
          name="Classroom 1"
          isOwned
          onDelete={() => toasts.toastSuccess("Clicked delete.")}
          onEdit={() => toasts.toastSuccess("Clicked edit.")}
          progress={75}
          linkTo="/quizzes/2"
        />
        <ClassroomTile
          name="Classroom 2"
          isOwned
          onDelete={() => toasts.toastSuccess("Clicked delete.")}
          onEdit={() => toasts.toastSuccess("Clicked edit.")}
          progress={75}
          linkTo="/quizzes/2"
        />
        <ClassroomTile
          name="Classroom 3"
          isOwned
          onDelete={() => toasts.toastSuccess("Clicked delete.")}
          onEdit={() => toasts.toastSuccess("Clicked edit.")}
          progress={75}
          linkTo="/quizzes/2"
        />
        <ClassroomTile
          name="Classroom 4"
          isOwned
          onDelete={() => toasts.toastSuccess("Clicked delete.")}
          onEdit={() => toasts.toastSuccess("Clicked edit.")}
          progress={75}
          linkTo="/quizzes/2"
        />
      </ClassroomSection>

      <Typography variant="h5" style={{ marginTop: "20px" }} gutterBottom>
        InviteMembersDialog
      </Typography>
      <VTButton
        neutral
        onClick={() => {
          setInviteDialogOpen(true);
        }}
      >
        Invite students
      </VTButton>
      <InviteMembersDialog
        memberType="Student"
        open={inviteDialogOpen}
        onClose={() => setInviteDialogOpen(false)}
        onInvite={(ids) => {
          toasts.toastSuccess(JSON.stringify(ids));
          setInviteDialogOpen(false);
        }}
      />
    </AppPage>
  );
}

export default ShowcasePage;
