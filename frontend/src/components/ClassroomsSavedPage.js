import React, { useState, useEffect, useRef } from "react";
import {
  Grid,
  Typography as T,
  GridList,
  GridListTile,
  ListSubheader,
  GridListTileBar,
  IconButton,
  Button,
  ButtonBase,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Switch,
  DialogContentText,
  TextField,
  Checkbox,
  Menu,
  MenuItem,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import LocalBarIcon from "@material-ui/icons/LocalBar";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import LocalBarIconOutlined from "@material-ui/icons/LocalBarOutlined";
import DescriptionIcon from "@material-ui/icons/Description";
import ImageIcon from "@material-ui/icons/Image";

import AppPage from "./common/AppPage";

import { api } from "../utils";
import munich from "../images/munich.jpg";
import { Link } from "react-router-dom";
import { Theme as theme } from "@material-ui/core/styles/createMuiTheme";

const images = [
  {
    url: "/frontend/src/images/logo_green.png",
    title: "Breakfast",
    width: "40%",
  },
  {
    url: "/frontend/src/images/logo_green.png",
    title: "Burgers",
    width: "30%",
  },
  {
    url: "/frontend/src/images/logo_green.png",
    title: "Camera",
    width: "30%",
  },
];

const useStyles = makeStyles({
  text: {
    paddingTop: "5%",
    paddingBottom: "5%",
    margin: "auto",
    textAlign: "center",
    textShadow: "1px 1px",
  },
  container: { height: "100%", width: "100%" },
  grid: { height: "100%", width: "100%" },
  userItem: { width: "150px" },
  button: {
    textDecoration: "none",
    color: "#555",
    padding: "4px 20px 0 20px",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    width: "30%",
    height: "25%",
    borderWidth: "3px",
    "&:hover": {
      color: "white",
      backgroundColor: "rgba(0,0,0,0.3)",
    },
  },
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
  },
  gridList: {
    width: 500,
    height: 450,
  },
  image: {
    position: "relative",
    height: 200,
    "&:hover, &$focusVisible": {
      zIndex: 1,
      "& $imageBackdrop": {
        opacity: 0.15,
      },
      "& $imageMarked": {
        opacity: 0,
      },
      "& $imageTitle": {
        border: "4px solid currentColor",
      },
    },
  },
  focusVisible: {},
  imageButton: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  },
  imageSrc: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: "cover",
    backgroundPosition: "center 40%",
  },
  imageBackdrop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "black",
    opacity: 0.4,
  },
  imageTitle: {
    position: "relative",
  },
  imageMarked: {
    height: 3,
    width: 18,
    backgroundColor: "white",
    position: "absolute",
    bottom: -2,
    left: "calc(50% - 9px)",
  },
});

function SavedClassroomsButton(props) {
  const classes = useStyles();
  return (
    <Button component={Link} to={props.to} variant="outlined" className={classes.button}>
      <Grid className={classes.grid} container justify="center" alignItems="center" direction="column">
        <T variant="h4">{props.title}</T>
        <T variant="p" align="center">
          {props.children}
        </T>
      </Grid>
    </Button>
  );
}

function ClassroomsSavedPage() {
  const classes = useStyles();
  const [user, setUser] = useState();
  const [classroomDataFromDatabase, setClassroomDataFromDatabase] = useState([]);

  useEffect(() => {
    api
      .user()
      .then((res) => {
        if (res) setUser(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    api
      .getClassrooms()
      .then((res) => {
        if (res) {
          setClassroomDataFromDatabase(res.data.rows);
          console.log(res.data.rows);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  //Sample to test display
  /*
  let sampleDoc = {
    document_id: "001",
    title: "myTitle",
    description: "myDescription",
    author: "my author",
  };
  let documentDataFromDatabase = [sampleDoc];
  */

  return (
    <AppPage location="classrooms/saved" id="classrooms-saved-page">
      <T className={classes.text} variant="h4">
        Here, you find the classes you are registered to.
      </T>

      <div className={classes.root}>
        {classroomDataFromDatabase.map((tile) => (
          <ButtonBase
            focusRipple
            className={classes.image}
            focusVisibleClassName={classes.focusVisible}
            style={{
              width: "40%",
            }}
          >
            <span className={classes.imageSrc} />
            <span className={classes.imageBackdrop} />
            <span className={classes.imageButton}>
              <Typography component="span" variant="subtitle1" color="inherit" className={classes.imageTitle}>
                {tile.title}
                {"\n"}~ {"\n"}
                {tile.description}
                <span className={classes.imageMarked} />
              </Typography>
            </span>
          </ButtonBase>
        ))}
      </div>
    </AppPage>
  );
}

export default ClassroomsSavedPage;
