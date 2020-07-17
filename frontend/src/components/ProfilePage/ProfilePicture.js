import React, { useRef, useState, useContext } from "react";
import { makeStyles } from "@material-ui/styles";
import { Typography, Grid, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import DeleteIcon from "@material-ui/icons/Delete";
import { api } from "../../utils";
import { UserContext } from "../../App";

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
    position: "relative",
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
  menuIconContainer: {
    display: "inline-block",
    position: "absolute",
    top: -10,
    right: -10,
  },
  listItemIcon: {
    minWidth: 40,
  },
  pictureCanvas: {
    height: "100%",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  },
});

function ProfilePicture({ dimension, name, editable }) {
  const classes = useStyles();
  const user = useContext(UserContext);

  const anchor = useRef();
  const [menuOpen, setMenuOpen] = useState(false);

  function _upload(e) {
    const files = e.target.files;
    if (files && files.length > 0) {
      console.log(files);
      api
        .uploadProfilePicture(files)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    }
  }

  const url = user.profile_pic_url;
  const picture = url ? (
    <div className={classes.pictureCanvas} style={{ background: `url(/${url})` }} />
  ) : (
    <Grid container alignItems="center" justify="center" className={classes.placeholderContainer}>
      <Typography align="center" className={classes.placeholder} variant="subtitle1">
        No pic.. <br />
        :(
      </Typography>
    </Grid>
  );

  return (
    <div className={classes.container} style={{ height: dimension ?? "100px", width: dimension ?? "100px" }}>
      <div className={classes.picture}>{picture}</div>

      <div className={classes.menuIconContainer} onClick={() => setMenuOpen(true)} ref={anchor}>
        <IconButton>
          <MoreVertIcon ref={anchor} />
        </IconButton>
      </div>

      <Menu anchorEl={anchor.current} open={menuOpen} onClose={() => setMenuOpen(false)}>
        <input style={{ display: "none" }} id="upload-file" type="file" onChange={_upload} />
        <label htmlFor="upload-file">
          <MenuItem dense>
            <ListItemIcon className={classes.listItemIcon}>
              <CloudUploadIcon />
            </ListItemIcon>
            <ListItemText>Upload</ListItemText>
          </MenuItem>
        </label>
        <MenuItem disabled={!url} dense>
          <ListItemIcon className={classes.listItemIcon}>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
}

export default ProfilePicture;
