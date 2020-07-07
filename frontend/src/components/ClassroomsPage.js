import React, { useState, useEffect, useRef } from "react";
import {
  Typography as T,
  Button,
  ButtonBase,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Typography,
  Slide,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AppPage from "./common/AppPage";

import { api } from "../utils";
import logo_classroom from "../assets/classroom_logo.png";
import Header from "./common/HeaderSection";
import { dummyClassroom } from "./ClassroomViewPage";
import { DashboardSection } from "./common";
import IconButton from "@material-ui/core/IconButton";
import AddBoxIcon from "@material-ui/icons/AddBox";
import { toasts } from "./common/AppPage/AppPage";
import { Link } from "react-router-dom";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
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
    margin: "5%",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    borderWidth: "3px",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
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
}));

function ClassroomItem({
  classes,
  setPopUpOpen,
  setClassroomTitle,
  setClassroomTopic,
  setClassroomAuthor,
  setClassroomDescription,
  tile,
}) {
  return (
    <ButtonBase
      focusRipple
      className={classes.image}
      focusVisibleClassName={classes.focusVisible}
      style={{
        width: "40%",
        margin: "5%",
      }}
      onClick={() => {
        setPopUpOpen(true);
        setClassroomTitle(tile.title);
        setClassroomTopic(tile.topic);
        setClassroomAuthor(tile.classroom_owner);
        setClassroomDescription(tile.description);
      }}
    >
      <span
        className={classes.imageSrc}
        style={{
          backgroundImage: `url(${logo_classroom})`,
        }}
      />
      <span className={classes.imageBackdrop} />
      <span className={classes.imageButton}>
        <Typography component="span" variant="h4" color="inherit" className={classes.imageTitle}>
          {tile.title}
          <span className={classes.imageMarked} />
        </Typography>
      </span>
    </ButtonBase>
  );
}

function ClassroomOverviewPopUp({
  open,
  onClose,
  classroomId,
  classroomTitle,
  classroomTopic,
  classroomAuthor,
  classroomDescription,
}) {
  return (
    <Dialog
      onClose={onClose}
      aria-labelledby="classroom-overview-popup"
      open={open}
      TransitionComponent={Transition}
      keepMounted
    >
      <DialogTitle id="classroom-overview-popup" onClose={onClose}>
        {classroomTitle}
      </DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>Topic: {classroomTopic}</Typography>
        <Typography gutterBottom>Teacher: {classroomAuthor}</Typography>
        <Typography gutterBottom>Description: {classroomDescription}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onClose} color="secondary">
          Leave
        </Button>
        <Button component={Link} to={"/classrooms/view?classroom=" + classroomId} color="primary">
          Open
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function createClassroom() {
  const addThisClassroom = () => {
    api.createClassroom("MyTitle", "MyTopic", "My description", true).catch((err) => console.log(err));
  };
  addThisClassroom();
  toasts.toastSuccess("Classroom added to the database!");
}

function teacherData(user_id, setClassroomAuthorData) {
  console.log("Debugging here");
  api
    .user(user_id)
    .then((res) => {
      setClassroomAuthorData(res.data);
    })
    .catch((err) => console.log(err));
}

function Classrooms() {
  const classes = useStyles();
  const [user, setUser] = useState();
  const [classroomDataFromDatabase, setClassroomDataFromDatabase] = useState([]);
  const [openPopUp, setPopUpOpen] = useState(false);
  //Accessor to a current classroom
  const [classroomId, setClassroomId] = useState(null);
  const [classroomTitle, setClassroomTitle] = useState(null);
  const [classroomTopic, setClassroomTopic] = useState(null);
  const [classroomAuthor, setClassroomAuthor] = useState(null);
  const [classroomAuthorData, setClassroomAuthorData] = useState(null);
  const [classroomDescription, setClassroomDescription] = useState(null);

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
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <AppPage location="classrooms/saved" id="classrooms-saved-page">
      <Header mainTitle="Classrooms" description="Attend and manage your classrooms!" />

      <DashboardSection
        title="My Classrooms"
        description="You have here the classrooms you are registered to."
        Button={
          <IconButton aria-label="new-classroom" onClick={() => setPopUpOpen(true)}>
            <AddBoxIcon fontSize="large" style={{ color: "darkblue" }} />
          </IconButton>
        }
      >
        {classroomDataFromDatabase.map((tile) => (
          <React.Fragment key={tile.classroom_id}>
            <ClassroomItem
              classes={classes}
              setPopUpOpen={setPopUpOpen}
              setClassroomTitle={setClassroomTitle}
              setClassroomTopic={setClassroomTopic}
              setClassroomAuthor={setClassroomAuthor}
              setClassroomDescription={setClassroomDescription}
              tile={tile}
            />

            <ClassroomOverviewPopUp
              open={openPopUp}
              onClose={() => {
                setPopUpOpen(false);
              }}
              classroomTitle={classroomTitle}
              classroomTopic={classroomTopic}
              classroomAuthor={classroomAuthor}
              classroomDescription={classroomDescription}
            />
          </React.Fragment>
        ))}
      </DashboardSection>
    </AppPage>
  );
}

export default Classrooms;
