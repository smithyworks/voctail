import React, { useRef, useState, useContext } from "react";
import { makeStyles } from "@material-ui/styles";
import { Typography, Menu, MenuItem, ListItemIcon, ListItemText } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import DeleteIcon from "@material-ui/icons/Delete";
import { api } from "../../utils";
import { UserContext, refresh } from "../../App";
import { toasts } from "../common";
import { getColor } from "../common/Quiz/colorCycler";

const useStyles = makeStyles({
  container: {
    display: "inline-block",
    position: "relative",
    overflow: "hidden",
  },
  picture: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: "25%",
    overflow: "hidden",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  },
  initials: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    fontSize: "70px",
  },

  menuIconContainer: {
    display: "inline-block",
    position: "absolute",
    top: "0",
    padding: "5px 2px 1px 2px",
    color: "white",
    backgroundColor: "rgba(0,0,0,0.4)",
    cursor: "pointer",
    borderBottomLeftRadius: 4,
    "&:hover": {
      backgroundColor: "black",
    },
  },
  menuIconIn: {
    right: "0",
    transition: "right 300ms",
  },
  menuIconOut: {
    right: "-30px",
    transition: "right 400ms",
  },
  listItemIcon: {
    minWidth: 40,
  },
});

function ProfilePicture({ dimension, name, editable }) {
  const classes = useStyles();
  const user = useContext(UserContext);
  const backgroundColor = useRef(getColor());

  const anchor = useRef();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  function _upload(e) {
    const files = e.target.files;
    if (files && files.length > 0) {
      console.log(files);
      api
        .uploadProfilePicture(files)
        .then((res) => {
          refresh();
          toasts.toastSuccess("Your profile picture has been uploaded!");
        })
        .catch((err) => toasts.toastError("Encountered an error while communicating with the server."))
        .finally(() => setMenuOpen(false));
    }
  }

  function _delete() {
    api
      .deleteProfilePicture()
      .then((res) => {
        refresh();
        toasts.toastSuccess("Your profile picture has been deleted!");
      })
      .catch((err) => toasts.toastError("Encountered an error while communicating with the server."));
  }

  const url = user?.profile_pic_url;
  const initials = user.name?.split(" ").map((n) => n[0].toUpperCase());

  return (
    <div
      className={classes.container}
      style={{ height: dimension ?? "100px", width: dimension ?? "100px" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={classes.picture} style={{ backgroundColor: backgroundColor.current }}>
        <Typography variant="h1" className={classes.initials}>
          {initials}
        </Typography>
      </div>
      <div className={classes.picture} style={{ backgroundImage: `url(/${url})` }} />

      <div
        className={`${classes.menuIconContainer} ${hovered ? classes.menuIconIn : classes.menuIconOut}`}
        onClick={() => setMenuOpen(true)}
        ref={anchor}
      >
        <MoreVertIcon />
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
        <MenuItem disabled={!url} dense onClick={_delete}>
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
