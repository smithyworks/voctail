import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Grid,
  GridList,
  Box,
  Button,
  Typography as T,
  Paper,
  Typography,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  DialogActions,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import LibraryAddIcon from "@material-ui/icons/LibraryAdd";
import IconButton from "@material-ui/core/IconButton";
import { Link } from "react-router-dom";

import AppPage, { toasts } from "./common/AppPage";
import colors from "../assets/colors.json";
import shuffle from "./QuizPage";
import { UserContext } from "../App";

import { api } from "../utils";
import AddIcon from "@material-ui/icons/Add";
import DescriptionIcon from "@material-ui/icons/Description";
import ImageIcon from "@material-ui/icons/Image";
import { vocabulary } from "../utils/api";
import { VTButton } from "./common";

const useStyles = makeStyles({
  quizTile: {
    //paddingLeft:"50px",
    //paddingRight:"50px",
    paddingTop: "70px",
    paddingBottom: "70px",
    textAlign: "center",
    width: "175px",
    height: "175px",
    backgroundColor: "#555",
    margin: "50px",
    border: "2px",
    borderRadius: "5px",
  },
  quizLink: {
    display: "inline-block",
    "&:hover": {
      color: "white",
    },
  },
  container: { height: "100%", width: "100%" },
  grid: { height: "100%", width: "100%" },
  headline: { height: "20%", width: "100%", color: "#555" },
  gridList: { height: "100%", width: "100%" },
  userItem: { width: "150px" },
  questionLink: {
    color: "#555",
    "&:hover": {
      color: "white",
    },
  },
  questionTile: {
    backgroundColor: "rgba(0,0,0,0.3)",
    "&:hover": {
      backgroundColor: "black",
    },
  },
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
  section: {
    marginBottom: "20px",
    padding: "30px",
    border: "1px solid lightgrey",
  },
  innerContainer: {
    paddingTop: "20px",
  },
});

function QuizSection({ title, icon, action, component, disablePadding, children }) {
  const classes = useStyles();

  return (
    <Paper className={classes.section} elevation={0}>
      <Grid container justify="space-between" alignItems="center" direction="row">
        <Typography variant="h5">{title}</Typography>
        {icon ? <IconButton onClick={action}>{icon}</IconButton> : undefined}
        {component ? component : undefined}
      </Grid>
      <Divider />
      <div className={classes.innerContainer} style={{ padding: disablePadding ? undefined : "20px 20px 0 20px" }}>
        {children}
      </div>
    </Paper>
  );
}

function QuizTile({ ...props }) {
  const styles = useStyles();
  const base = "quizzes";
  const len = 20;
  const title = props.children.title;

  const format = (s) => {
    let res = s;
    if (s.length > len) {
      res = s.slice(0, len);
    }
    /*else{
      const pad = len - s.length;
      const halfpad = Math.floor(pad/2);
      res= "_".repeat(halfpad) + s + "_".repeat(pad - halfpad);
    }*/
    return res;
  };

  //background=props.color
  return (
    <Box component="span" className={styles.quizTile} style={{ backgroundColor: props.color }}>
      <Link to={base + "/" + props.children.quiz_id} className={styles.quizLink}>
        <T variant={"h6"}>{format(title)}</T>
      </Link>
    </Box>
  );
}

function AddCustomQuiz() {
  const [open, setOpen] = useState(false);
  const handleAddOpen = () => {
    setOpen(true);
  };
  const handleAddClose = () => {
    setOpen(false);
  };

  const title = useRef("");
  const [items, setItems] = useState([]);

  const item = {
    vocabulary: useRef(""),
    translation: useRef(""),
    suggestions: [useRef(""), useRef(""), useRef("")],
  };

  const addQuiz = () => {
    const questions = [
      {
        vocabulary: item.vocabulary.current,
        translation: item.translation.current,
        suggestions: [item.suggestions.map((v) => v.current)],
      },
    ];
    if (validate_quiz({ title: title.current, questions: questions })) {
      api.createCustomQuiz(title.current, questions);
      toasts.toastSuccess("Custom quiz added!");
      handleAddClose();
    } else {
      toasts.toastError("Not all fields are filled out. Please fill out all fields.");
    }
  };

  const validate_quiz = (quiz) => {
    if (
      quiz.title.length > 0 &&
      quiz.questions.every(
        (e) =>
          e.vocabulary.length > 0 &&
          e.translation.length > 0 &&
          e.suggestions[0].length > 0 &&
          e.suggestions[0].length > 1 &&
          e.suggestions[0].length > 2
      )
    ) {
      return true;
    } else {
      return false;
    }
  };

  /*
  const useAddItem = () => {
    setItems(v=> v.concat({
          vocabulary: useRef(""),
          translation: useRef(""),
          suggestions: [
            useRef(""),
            useRef(""),
            useRef("")
          ]
        }
    ));
  }
*/

  //useAddItem();

  /*
  * {items.map((v,i)=> (
                <Grid container justify="flex-start" alignItems="center" direction="column">
                  <DialogContentText>Quiz item {i}</DialogContentText>
                  <TextField
                      autoFocus
                      margin="dense"
                      id="vocabulary"
                      label="Vocabulary*"
                      type="vocabulary"
                      onChange={(e) => (v.vocabulary.current = e.target.value)}
                      fullWidth
                  />
                  <TextField
                      autoFocus
                      margin="dense"
                      id="trasnlation"
                      label="Translation*"
                      type="translation"
                      onChange={(e) => (v.translation.current = e.target.value)}
                      fullWidth
                  />
                  <TextField
                      autoFocus
                      margin="dense"
                      id="suggestion 1"
                      label="Suggestion 1*"
                      type="suggestion"
                      onChange={(e) => (v.suggestions[0].current = e.target.value)}
                      fullWidth
                  />
                  <TextField
                      autoFocus
                      margin="dense"
                      id="suggestion 2"
                      label="Suggestion 2*"
                      type="suggestion"
                      onChange={(e) => (items[i].suggestions[1].current = e.target.value)}
                      fullWidth
                  />
                  <TextField
                      autoFocus
                      margin="dense"
                      id="suggestion 3"
                      label="Suggestion 3*"
                      type="suggestion"
                      onChange={(e) => (v.suggestions[2].current = e.target.value)}
                      fullWidth
                  />
              </Grid>
              )
            )
            }
            * */
  return (
    <div>
      <IconButton onClick={handleAddOpen}>
        <LibraryAddIcon />
      </IconButton>
      <Dialog open={open} onClose={handleAddClose} aria-labelledby="add-custom-quiz">
        <DialogTitle id="add-custom-quiz">Add a custom quiz</DialogTitle>
        <DialogContent>
          <DialogContentText>To add a new quiz please fill out as many quiz items as you like.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title*"
            type="title"
            onChange={(e) => (title.current = e.target.value)}
            fullWidth
          />

          <Grid container justify="flex-start" alignItems="center" direction="column">
            <DialogContentText>Quiz item</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="vocabulary"
              label="Vocabulary*"
              type="vocabulary"
              onChange={(e) => (item.vocabulary.current = e.target.value)}
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              id="trasnlation"
              label="Translation*"
              type="translation"
              onChange={(e) => (item.translation.current = e.target.value)}
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              id="suggestion 1"
              label="Suggestion 1*"
              type="suggestion"
              onChange={(e) => (item.suggestions[0].current = e.target.value)}
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              id="suggestion 2"
              label="Suggestion 2*"
              type="suggestion"
              onChange={(e) => (item.suggestions[1].current = e.target.value)}
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              id="suggestion 3"
              label="Suggestion 3*"
              type="suggestion"
              onChange={(e) => (item.suggestions[2].current = e.target.value)}
              fullWidth
            />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => 1} color="primary">
            Add quiz item
          </Button>
          <Button onClick={handleAddClose} color="primary">
            Cancel
          </Button>
          <VTButton
            success
            onClick={() => {
              addQuiz();
            }}
            color="primary"
          >
            Add a custom quiz
          </VTButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function QuizzesDashboard({ ...props }) {
  const classes = useStyles();
  const user = useContext(UserContext);
  const base = "/quizzes";

  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    api
      .fetchQuizzes()
      .then((res) => {
        if (res) setQuizzes(res.data.quizList);
      })
      .catch((err) => console.log(err));
  }, []);

  function createQButton(q, base) {
    return (
      <Button
        key={q.quiz_id}
        component={Link}
        to={base + "/" + q.quiz_id}
        variant="outlined"
        color={q.is_day ? "primary" : "secondary"}
        className={classes.button}
      >
        <Grid className={classes.grid} container justify="flex-start" alignItems="center" direction="column">
          <T variant="h4">{q.title}</T>
          <T align="center">{q.text}</T>
        </Grid>
      </Button>
    );
  }

  function createButtons(quizzes, base) {
    const day = quizzes.filter((e) => e.is_day === true)[0];
    const quizz = quizzes.filter((e) => e.is_day === false);
    const buttons = [];
    if (quizzes.length > 0) {
      buttons.push(createQButton(day, base));
      quizz.map((q) => buttons.push(createQButton(q, base)));
    }
    return buttons;
  }

  const [quizChallenges, setChallenges] = useState([]);
  const [quizCustom, setCustom] = useState([]);
  const [quizRandom, setRandom] = useState([]);
  const [quizDocuments, setDocuments] = useState([]);
  useEffect(() => {
    api
      .fetchQuizzesByCategory()
      .then((res) => {
        if (res) {
          setChallenges(res.data.quizChallenges);
          setCustom(res.data.quizCustom);
          setRandom(res.data.quizRandom);
          setDocuments(res.data.quizDocuments);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  //console.log(quizChallenges, quizCustom, quizRandom, quizDocuments)
  /*
  let [count,setCount] = useState(0);

  let [colInd, setColInd] = useState(0);
  let [colTrack, setColTrack] = useState({})
  function mixer(){
    const colorPalette = shuffle(colors.statusTile.color);
    return (id)=>{console.log(id, colInd, colTrack);if(!id in colTrack){setColInd(i=>i+1); setColTrack((v)=>v.id = colorPalette[colInd]);
        return colorPalette[colInd];
    }else{
      return colTrack.id;
    }};
  }

  const palette = mixer();

  for(let i in [1,2,3,4,5]){
    //console.log("bla");
    //console.log(palette(i));
    palette(i);
  }
  */

  const palette = "#555";

  return (
    <AppPage location="quizzes" id="quizzes-page">
      <QuizSection title={"Challenges"}>
        <Grid className={classes.grid} container justify="flex-start" alignItems="left" direction="row">
          {quizChallenges.map((v) => (
            <QuizTile key={v.quiz_id} color={palette}>
              {v}
            </QuizTile>
          ))}
        </Grid>
      </QuizSection>
      <QuizSection title={"Custom Quizzes"} component={<AddCustomQuiz />}>
        <Grid className={classes.grid} container justify="flex-start" alignItems="left" direction="row">
          {quizCustom.map((v) => (
            <QuizTile key={v.quiz_id} color={palette}>
              {v}
            </QuizTile>
          ))}
        </Grid>
      </QuizSection>
      <QuizSection title={"Random Quizzes"} icon={<LibraryAddIcon />} action={() => api.createQuiz("MyQuiz", 10)}>
        <Grid className={classes.grid} container justify="flex-start" alignItems="left" direction="row">
          {quizRandom.map((v) => (
            <QuizTile key={v.quiz_id} color={palette}>
              {v}
            </QuizTile>
          ))}
        </Grid>
      </QuizSection>
      <QuizSection title={"Quizzes From Documents"}>
        <Grid className={classes.grid} container justify="flex-start" alignItems="left" direction="row">
          {quizDocuments.map((v) => (
            <QuizTile key={v.quiz_id} color={palette}>
              {v}
            </QuizTile>
          ))}
        </Grid>
      </QuizSection>

      <Grid className={classes.grid} container justify="space-evenly" alignItems="center" direction="row">
        <GridList cellHeight={200} cols={3} container justify="center" alignItems="center">
          <Button onClick={() => api.createQuiz("MyQuiz", 10)}>Generate Random</Button>
          <Button onClick={() => api.createQuizFromDoc(2, 10)}>Generate From Document (2)</Button>
          <Button onClick={() => api.fetchQuizByDocument(2)}>Fetch By Document (2)</Button>
          <Button
            onClick={() =>
              api.createCustomQuiz("Custom", [
                { vocabulary: "word", suggestions: ["a", "b", "c"], translation: "Wort" },
              ])
            }
          >
            Create Custom Document
          </Button>
        </GridList>
      </Grid>
    </AppPage>
  );
}

export default QuizzesDashboard;
