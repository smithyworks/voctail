//This page will be used to test components

import React, { useState, useEffect, useRef } from "react";
import {
  Grid,
  Typography,
  ButtonBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import AppPage from "./common/AppPage";

import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import AccountCircle from "@material-ui/icons/AccountCircle";
import TextField from "@material-ui/core/TextField";
import munich from "../images/munich.jpg";
import logo_green from "../images/logo_green.png";

const images = [
  {
    url: munich,
    title: "Breakfast",
    width: "40%",
  },
  {
    url: logo_green,
    title: "Burgers",
    width: "30%",
  },
  {
    url: munich,
    title: "Camera",
    width: "30%",
  },
  {
    url: munich,
    title: "LastOne",
    width: "30%",
  },
];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  headuptext: {
    paddingTop: "5%",
    paddingBottom: "5%",
    margin: "auto",
    textAlign: "center",
    fontStyle: "italic",
  },

  root: {
    display: "flex",
    flexWrap: "wrap",
    minWidth: 300,
    width: "100%",
  },
  image: {
    position: "relative",
    height: 200,
    [theme.breakpoints.down("xs")]: {
      width: "100% !important", // Overrides inline-style
      height: 100,
    },
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
    color: theme.palette.common.white,
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
    backgroundColor: theme.palette.common.black,
    opacity: 0.4,
    transition: theme.transitions.create("opacity"),
  },
  imageTitle: {
    position: "relative",
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px ${theme.spacing(1) + 6}px`,
  },
  imageMarked: {
    height: 3,
    width: 18,
    backgroundColor: theme.palette.common.white,
    position: "absolute",
    bottom: -2,
    left: "calc(50% - 9px)",
    transition: theme.transitions.create("opacity"),
  },
}));

function HeadUpText(props) {
  const styles = useStyles();
  return <Typography className={styles.headuptext}>{props.text}</Typography>;
}

function ClassroomOverviewPopUp({ open, onClose, onView, classroomTitle, classroomDescription, classroomTeacher }) {
  return (
    <Dialog onClose={onClose} aria-labelledby="classroom-overview-popup" open={open}>
      <DialogTitle id="classroom-overview-popup" onClose={onClose}>
        {classroomTitle}
      </DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>Description: {classroomDescription}</Typography>
        <Typography gutterBottom>Teacher: {classroomTeacher}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onClose} color="primary">
          Leave
        </Button>
        <Button onClick={onView} color="primary">
          Open
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function ClassroomsCreatePage({ ...props }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [openPopUp, setPopUpOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <AppPage location="classrooms" id="classrooms-page">
      <HeadUpText text="This page is used for testing." />

      <div className={classes.root}>
        {images.map((image) => (
          <React.Fragment key={image.title}>
            <ButtonBase
              focusRipple
              className={classes.image}
              focusVisibleClassName={classes.focusVisible}
              style={{
                width: image.width,
              }}
              onClick={() => setPopUpOpen(true)}
            >
              <span
                className={classes.imageSrc}
                style={{
                  backgroundImage: `url(${image.url})`,
                }}
              />
              <span className={classes.imageBackdrop} />
              <span className={classes.imageButton}>
                <Typography component="span" variant="subtitle1" color="inherit" className={classes.imageTitle}>
                  {image.title}
                  <span className={classes.imageMarked} />
                </Typography>
              </span>
            </ButtonBase>
            <ClassroomOverviewPopUp
              open={openPopUp}
              onClose={() => {
                setPopUpOpen(false);
              }}
              //Here is impossible to display images
              classroomTitle={image.title}
              classroomDescription={image.title}
              classroomTeacher="Teacher"
            ></ClassroomOverviewPopUp>
          </React.Fragment>
        ))}
      </div>
    </AppPage>
  );
}

export default ClassroomsCreatePage;
