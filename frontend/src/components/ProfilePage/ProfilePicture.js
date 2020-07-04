import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Typography, Grid } from "@material-ui/core";
import UploadIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Close";

const useStyles = makeStyles({
  container: {
    display: "inline-block",
    textAlign: "center",
    position: "relative",
    "& .actions": {
      display: "none",
    },
    "&:hover .actions": {
      display: "inline-block",
    },
  },
  picture: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    overflow: "hidden",
  },
  placeholderContainer: {
    height: "100%",
    backgroundColor: "grey",
  },
  placeholder: {
    color: "white",
  },
  actions: {
    position: "absolute",
    top: 0,
    right: 0,
    height: "35px",
    color: "white",
    backgroundColor: "black",
  },
  actionIcon: {
    padding: "5px",
    cursor: "pointer",
    "&:hover": { backgroundColor: "darkgrey" },
  },
});

function ProfilePicture({ url, dimension }) {
  const classes = useStyles();

  const placeholder = url ? null : (
    <Grid container alignItems="center" justify="center" className={classes.placeholderContainer}>
      <Typography align="center" className={classes.placeholder} variant="subtitle1">
        No pic.. <br />
        :(
      </Typography>
    </Grid>
  );

  return (
    <div className={classes.container} style={{ height: dimension ?? "100px", width: dimension ?? "100px" }}>
      <div className={classes.actions + " actions"}>
        <UploadIcon className={classes.actionIcon} fontSize="large" />
        <DeleteIcon className={classes.actionIcon} fontSize="large" />
      </div>
      <div className={classes.picture}>{placeholder}</div>
    </div>
  );
}

export default ProfilePicture;
