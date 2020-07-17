import React, { useContext } from "react";
import { Typography, Grid, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import StarIcon from "@material-ui/icons/Star";

import { AppPage, toasts, VTButton } from "../common";
import { UserContext, refresh } from "../../App";
import Benefit from "./Benefit";
import { api } from "../../utils";

const useStyles = makeStyles({
  container: {
    padding: "50px 0",
  },
  header: { marginBottom: "40px" },
  offersContainer: {
    margin: "20px 0",
  },
  freeOffer: {
    border: "1px solid grey",
  },
  freeOfferTitle: {
    padding: "30px 0",
    backgroundColor: "grey",
    borderBotto: "1px solid grey",
    color: "white",
  },
  premiumOffer: {
    border: "1px solid green",
  },
  premiumOfferTitle: {
    padding: "30px 0",
    backgroundColor: "green",
    borderBotto: "1px solid green",
    color: "white",
  },
  benefitsContainer: {
    padding: "30px 20px",
  },
  priceContainer: {
    paddingBottom: "30px",
  },
  actionContainer: {
    paddingBottom: "30px",
    textAlign: "center",
  },
  freeButton: {
    color: "white",
    backgroundColor: "grey",
    fontWeight: "bold",
  },
  premiumButton: { fontWeight: "bold" },
  starIcon: {
    margin: "0 5px -4px 0",
  },
});

function AccountPage() {
  const classes = useStyles();
  const user = useContext(UserContext);

  function goPremium() {
    api
      .setPremium(true)
      .then((res) => {
        toasts.toastSuccess("Congratulations, you are now a Premium user!");
        refresh();
      })
      .catch((err) => toasts.toastError("Something went wrong while communicating with the server..."));
  }
  function goFree() {
    api
      .setPremium(false)
      .then((res) => {
        toasts.toastSuccess("You are now a free user.");
        refresh();
      })
      .catch((err) => toasts.toastError("Something went wrong while communicating with the server..."));
  }

  return (
    <AppPage>
      <div className={classes.container}>
        <Typography variant="h5" gutterBottom className={classes.header}>
          Welcome, {user.name ?? "user"}! You are a {user.premium ? "Premium" : "free"} VocTail user!
        </Typography>

        <Grid container justify="space-around" className={classes.offersContainer}>
          <Grid item xs={4} className={classes.freeOffer} component={Paper}>
            <Grid container direction="column">
              <Grid item className={classes.freeOfferTitle}>
                <Typography align="center" variant="h5">
                  Free Membership
                </Typography>
              </Grid>

              <Grid item className={classes.benefitsContainer}>
                <Benefit>Access All Documents</Benefit>
                <Benefit>Import Your Own Documents</Benefit>
                <Benefit>Generate Unlinited Quizzes</Benefit>
                <Benefit>See All Your Progress Information</Benefit>
                <Benefit>Create Classrooms</Benefit>
                <Benefit> 24/7 Dedicated Support</Benefit>
              </Grid>

              <Grid item className={classes.priceContainer}>
                <Typography variant="h4" align="center">
                  0,00 €
                </Typography>
                <Typography variant="subtitle1" align="center">
                  -
                </Typography>
              </Grid>

              <Grid item className={classes.actionContainer}>
                <VTButton disabled={!user.premium} className={classes.freeButton} size="large" onClick={goFree}>
                  {user.premium ? "Forego Your Benefits." : "Go Free!"}
                </VTButton>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={4} className={classes.premiumOffer} component={Paper}>
            <Grid container direction="column">
              <Grid item className={classes.premiumOfferTitle}>
                <Typography align="center" variant="h5">
                  <StarIcon className={classes.starIcon} /> Premium Membership
                </Typography>
              </Grid>

              <Grid item className={classes.benefitsContainer}>
                <Benefit included>Access All Documents</Benefit>
                <Benefit included>Import Your Own Documents</Benefit>
                <Benefit included>Generate Unlimited Quizzes</Benefit>
                <Benefit included>See All Your Progress Information</Benefit>
                <Benefit included>Create Classrooms</Benefit>
                <Benefit included>24/7 Dedicated Support</Benefit>
              </Grid>

              <Grid item className={classes.priceContainer}>
                <Typography variant="h4" align="center">
                  7,99 €
                </Typography>
                <Typography variant="subtitle1" align="center">
                  per month
                </Typography>
              </Grid>

              <Grid item className={classes.actionContainer}>
                <VTButton
                  accept
                  disabled={!!user.premium}
                  className={classes.premiumButton}
                  size="large"
                  onClick={goPremium}
                >
                  Go Premium!
                </VTButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </AppPage>
  );
}

export default AccountPage;
