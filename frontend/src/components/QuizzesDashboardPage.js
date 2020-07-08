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

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";

import TableRow from "@material-ui/core/TableRow";

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
  quizItem: {
    marginTop: "10px",
    marginBottom: "10px",
    padding: "30px",
    border: "1px solid lightgrey",
  },
  itemContainer: {
    paddingTop: "20px",
  },
  innerContainer: {
    paddingTop: "20px",
  },
  dialog: {
    width: "300%",
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
      <div className={classes.itemContainer} style={{ padding: disablePadding ? undefined : "20px 20px 0 20px" }}>
        {children}
      </div>
    </Paper>
  );
}

function QuizItemSection({ items, del, disablePadding }) {
  const classes = useStyles();

  return (
    <div>
      {items.length === 0 ? undefined : (
        <Paper className={classes.quizItem} elevation={0}>
          <div className={classes.innerContainer} style={{ padding: disablePadding ? undefined : "20px 20px 0 20px" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="right">Vocabulary</TableCell>
                  <TableCell align="right">Translation</TableCell>
                  <TableCell align="right">Suggestion 1</TableCell>
                  <TableCell align="right">Suggestion 2</TableCell>
                  <TableCell align="right">Suggestion 3</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((v, i) => (
                  <TableRow key={i}>
                    <TableCell align="right">{v.vocabulary}</TableCell>
                    <TableCell align="right">{v.translation}</TableCell>
                    {v.suggestions.map((vv) => (
                      <TableCell align="right">{vv}</TableCell>
                    ))}
                    <TableCell align="right">
                      <VTButton danger onClick={() => del(i)}>
                        delete
                      </VTButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Paper>
      )}
    </div>
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
  const styles = makeStyles();

  const [count, setCount] = useState(0);
  refreshCallback.current = () => setCount(count + 1);

  const [open, setOpen] = useState(false);
  const handleAddOpen = () => {
    setOpen(true);
  };
  const handleAddClose = () => {
    setOpen(false);
  };

  const title = useRef("");
  const [items, setItems] = useState([]);

  const test = () => {
    console.log(items);
  };

  /*
  const item = {
    vocabulary: useState(""),
    translation: useState(""),
    suggestions: [useState(""), useState(""), useState("")],
  };
*/

  const item = {
    vocabulary: useRef(""),
    translation: useRef(""),
    suggestions: [useRef(""), useRef(""), useRef("")],
  };

  const toItem = () => {
    return {
      vocabulary: item.vocabulary.current,
      translation: item.translation.current,
      suggestions: item.suggestions.map((vv) => vv.current),
    };
  };

  const addQuiz = () => {
    if (title.current.length > 0 && items.length > 0) {
      api.createCustomQuiz(title.current, items);
      toasts.toastSuccess("Custom quiz added with " + items.length + " questions!");
      handleAddClose();
      refreshCallback.current();
    } else {
      toasts.toastError(
        "You cannot add a quiz without title or quiz items. Please add title and at least one" + " quiz item first."
      );
    }
  };

  const [fieldKey, setFieldKey] = useState(0);
  const addItem = () => {
    if (validate_item()) {
      setItems((il) => [...il, toItem()]);
      //reset new fields
      item.vocabulary.current = "";
      item.translation.current = "";
      item.suggestions.forEach((v) => (v.current = ""));

      toasts.toastSuccess("Quiz item added!");
      setFieldKey(fieldKey + 1);
    } else {
      toasts.toastError("Please ensure all fields are filled out.");
    }
  };

  const deleteItem = (i) => {
    setItems((il) => il.slice(0, i).concat(il.slice(i + 1)));
  };

  const validate_item = () => {
    console.log(
      item.vocabulary.current.length > 0,
      item.translation.current.length > 0,
      item.suggestions[0].current.length > 0,
      item.suggestions[1].current.length > 0,
      item.suggestions[2].current.length > 0
    );
    if (
      item.vocabulary.current.length > 0 &&
      item.translation.current.length > 0 &&
      item.suggestions[0].current.length > 0 &&
      item.suggestions[1].current.length > 0 &&
      item.suggestions[2].current.length > 0
    ) {
      return true;
    } else {
      return false;
    }
  };

  /*
  *         <Grid container justify="flex-start" alignItems="center" direction="column">
          {items.map((v, i)=> (
              <Grid container justify="flex-start" alignItems="center" direction="column">
                <T variant={"h3"}>Quiz Item {i}</T>
                <T variant={"h6"}>Question:    {v.vocabulary}</T>
                <T variant={"h6"}>Translation: {v.translation}</T>
                <T variant={"h6"}>Suggestions:</T>
                <T variant={"h6"}>             {v.suggestions[0]}</T>
                <T variant={"h6"}>             {v.suggestions[1]}</T>
                <T variant={"h6"}>             {v.suggestions[2]}</T>
              </Grid>

          ))
          }
        </Grid>*/

  //const [str,setStr] = useState("");
  //(i)=>{i.vocabulary=e.target.value; return i;})
  /*  const [item_, setItem_] = useState({vocabulary:{current:""}, translation:{current:""},
    suggestions:[{current:""},{current:""},{current:""}]})
  */

  useEffect(() => {}, [count]);

  return (
    <div>
      <IconButton onClick={handleAddOpen}>
        <LibraryAddIcon />
      </IconButton>
      <Dialog open={open} onClose={handleAddClose} aria-labelledby="add-custom-quiz" fullScreen key={fieldKey}>
        <DialogTitle id="add-custom-quiz">
          To add a new quiz please fill out as many quiz items as you like.
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title*"
            type="title"
            onChange={(e) => (title.current = e.target.value)}
            fullWidth
          />
          <QuizItemSection items={items} del={deleteItem} />
        </DialogContent>
        <DialogTitle id="add-item">Add a quiz item</DialogTitle>
        <DialogContent>
          <Grid container justify="flex-start" alignItems="center" direction="column">
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
              id="translation"
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
          <VTButton success onClick={() => addItem()} color="primary">
            Add quiz item
          </VTButton>
          <VTButton success onClick={() => test()} color="primary">
            Test
          </VTButton>
        </DialogActions>
        <DialogContent>
          <DialogContentText align={"right"}>
            Once you have filled out the title and at least one question item feel free to add the Quiz.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
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

function AddRandomQuiz() {
  const [open, setOpen] = useState(false);
  const handleAddOpen = () => {
    setOpen(true);
  };
  const handleAddClose = () => {
    setOpen(false);
  };

  const title = useRef("");
  const length = useRef("");

  const addQuiz = () => {
    const len = parseInt(length.current);
    //console.log(title.current.length > 0, length.current.length > 0, len!==NaN, len>0);
    if (title.current.length > 0 && length.current.length > 0 && len !== NaN && len > 0) {
      api.createQuiz(title.current, len);
      toasts.toastSuccess("Random quiz added with " + len + " questions!");
      handleAddClose();
      refreshCallback.current();
    } else {
      toasts.toastError("You cannot add a quiz without title or length.");
    }
  };

  return (
    <div>
      <IconButton onClick={handleAddOpen}>
        <LibraryAddIcon />
      </IconButton>
      <Dialog open={open} onClose={handleAddClose} aria-labelledby="add-custom-quiz">
        <DialogTitle id="add-custom-quiz">Please provide the title and length of your quiz.</DialogTitle>
        <DialogContent>
          <Grid container justify="flex-start" alignItems="center" direction="column">
            <TextField
              autoFocus
              margin="dense"
              id="title"
              label="Title*"
              type="title"
              onChange={(e) => (title.current = e.target.value)}
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              id="length"
              label="Length*"
              type="length"
              onChange={(e) => (length.current = e.target.value)}
              fullWidth
            />
          </Grid>
        </DialogContent>
        <DialogActions>
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
            Add quiz
          </VTButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const refreshCallback = {};
export function refresh() {
  const cb = refreshCallback.current;
  if (typeof cb === "function") cb();
}

function QuizzesDashboard({ ...props }) {
  const classes = useStyles();

  const [count, setCount] = useState(0);
  refreshCallback.current = () => setCount(count + 1);

  const user = useContext(UserContext);
  const base = "/quizzes";

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
  }, [count]);

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

  /*
  const createRandomQuiz = () => {
    api.createQuiz("MyQuiz", 10);
    refreshCallback.current();
  }
*/

  const palette = "#555";

  //action={() => createRandomQuiz()}
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
      <QuizSection title={"Random Quizzes"} component={<AddRandomQuiz />}>
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
