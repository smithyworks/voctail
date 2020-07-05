import React, { useContext } from "react";
import { Typography, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import { AppPage, toasts } from "../common";
import ProfilePicture from "./ProfilePicture";
import ProfileSection from "./ProfileSection";
import EditableItem from "./EditableItem";
import VocabularyCloud from "./VocabularyCloud";
import { UserContext, refresh } from "../../App";
import { api } from "../../utils";

const useStyles = makeStyles({
  container: {
    padding: "20px 0",
  },
  pic: { padding: "0 20px" },
  info: { padding: "0 20px", display: "flex", alignItems: "center" },
  infoInnerContainer: { width: "100%" },
  infoItem: { display: "inline-block", width: "49%", margin: "10px 0" },
  infoItemTitle: {
    fontWeight: 300,
  },
  infoItemValue: {
    fontSize: "1.5em",
  },
  subSectionTitle: {
    fontWeight: 300,
  },
});

function ProfilePage() {
  const classes = useStyles();
  const user = useContext(UserContext);

  return (
    <AppPage>
      <div className={classes.container}>
        <ProfileSection title="Personal Information" disablePadding>
          <Grid container>
            <Grid item className={classes.pic}>
              <ProfilePicture dimension="250px" />
            </Grid>
            <Grid item xs className={classes.info}>
              <div className={classes.infoInnerContainer}>
                <EditableItem
                  title="Name"
                  value={user.name ?? "..."}
                  onEdit={(v) =>
                    api
                      .setName(v)
                      .then((res) => {
                        toasts.toastSuccess("Successfully updated your name!");
                        refresh();
                      })
                      .catch((err) => {
                        toasts.toastError("Encountered an error communicating with the server!");
                      })
                  }
                />
                <EditableItem
                  title="Email"
                  value={user.email ?? "..."}
                  isEmail
                  onEdit={(v) =>
                    api
                      .setEmail(v)
                      .then((res) => {
                        toasts.toastSuccess("Successfully updated your email!");
                        refresh();
                      })
                      .catch((err) => {
                        toasts.toastError("Encountered an error communicating with the server!");
                      })
                  }
                />
                <EditableItem
                  title="Password"
                  value="**********"
                  onEdit={(v) =>
                    api
                      .setName(v)
                      .then((res) => {
                        toasts.toastSuccess("Successfully updated your password!");
                        refresh();
                      })
                      .catch((err) => {
                        toasts.toastError("Encountered an error communicating with the server!");
                      })
                  }
                />
              </div>
            </Grid>
          </Grid>
        </ProfileSection>

        <ProfileSection title="Payment Details">
          <EditableItem title="Card Number" value="**** **** **** **12" disabled />
          <EditableItem title="Code" value="***" disabled />
          <div />
          <EditableItem title="Full Name" value="John Doe" disabled />
          <div />
          <EditableItem title="Address Line 1" value="VocTail GmbH" isEmail disabled />
          <EditableItem title="Address Line 2" value="Rotkreuzplatz Str." disabled />
          <EditableItem title="Street and House Number" value="1" disabled />
          <EditableItem title="City" value="Munich" disabled />
          <EditableItem title="Country" value="Germany" disabled />

          <div />
          <EditableItem title="Telephone" value="+49 123 4567890" disabled />
        </ProfileSection>

        <ProfileSection title="Metrics">
          <Typography variant="h6" className={classes.subSectionTitle}>
            Vocabulary
          </Typography>
          <VocabularyCloud />
        </ProfileSection>
      </div>
    </AppPage>
  );
}

export default ProfilePage;
