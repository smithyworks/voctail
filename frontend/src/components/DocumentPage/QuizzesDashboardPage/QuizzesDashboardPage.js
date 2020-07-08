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

import AppPage, { toasts } from "../../common/AppPage";
import colors from "../../../assets/colors.json";
import shuffle from "../../QuizPage";
import { UserContext } from "../../../App";

import { api } from "../../../utils";
import AddIcon from "@material-ui/icons/Add";
import DescriptionIcon from "@material-ui/icons/Description";
import ImageIcon from "@material-ui/icons/Image";
import { vocabulary } from "../../../utils/api";
import { VTButton } from "../../common";

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
  const max = (vl) => {
    let a = [0, 0];
    vl.map((vv) => vv.suggestions.length).forEach((v, i) => {
      if (v > a[0]) {
        a = [v, i];
      }
    });
    return vl[a[1]];
  };
  /*
  <TableCell align="right">Suggestion 1</TableCell>
  <TableCell align="right">Suggestion 2</TableCell>
  <TableCell align="right">Suggestion 3</TableCell>
  */
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
                  {items.length > 0
                    ? max(items).suggestions.map((vv, i) => (
                        <TableCell align="right">{"Suggestion " + (i + 1)}</TableCell>
                      ))
                    : undefined}
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((v, i) => (
                  <TableRow>
                    <TableCell align="right">{v.vocabulary}</TableCell>
                    <TableCell align="right">{v.translation}</TableCell>
                    {v.suggestions.map((vv) => (
                      <TableCell align="right">{vv}</TableCell>
                    ))}
                    {[...Array(max(items).suggestions.length - v.suggestions.length)].map((v) => (
                      <TableCell align="right"></TableCell>
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

function Suggestion({ onRefresh, update, index }) {
  const sugg = useRef("");
  if (update) {
    onRefresh(sugg.current, index);
  }
  return (
    <TextField
      autoFocus
      margin="dense"
      id={"suggestion " + index}
      label={"Suggestion " + index + "*"}
      type="suggestion"
      onChange={(e) => (sugg.current = e.target.value)}
      fullWidth
    />
  );
}

function QuizItem({ addItem }) {
  const vocabulary = useRef("");
  const translation = useRef("");

  const [suggestions, setSuggestions] = useState(["", "", ""]);
  const [updateSuggs, setUpdateSuggs] = useState(suggestions.map((v) => false));
  //const [flatSuggs, setFlatSuggs] = useState(false);

  const addSuggestion = () => setSuggestions(suggestions.concat(""));
  const removeSuggestion = () =>
    suggestions.length > 1
      ? setSuggestions(suggestions.slice(0, suggestions.length - 1))
      : toasts.toastError("At least one suggestion needed.");

  const refreshSuggestions = (v, i) => {
    //const last = suggestions.filter((v)=>v!=="").length === 1;
    //const last = updateSuggs.filter((v)=>v===true).length === 1;
    setSuggestions(
      suggestions
        .slice(0, i)
        .concat([v])
        .concat(suggestions.slice(i + 1))
    );
    setUpdateSuggs(
      updateSuggs
        .slice(0, i)
        .concat([false])
        .concat(updateSuggs.slice(i + 1))
    );
    //rerender occurs on true->false (setFlagSuggs)
    //setFlatSuggs(!(last && updateSuggs.every((v)=>!v)));
  };

  const updateSuggestions = () => {
    setUpdateSuggs(updateSuggs.map((v) => true));
    //effort
    //setFlatSuggs(true);
  };

  const [fieldKey, setFieldKey] = useState(0);
  const resetFields = () => {
    vocabulary.current = "";
    translation.current = "";
    //force rerender to clear fields + handle reset of suggestions
    setFieldKey(fieldKey + 1);
    setSuggestions(suggestions.map((v) => ""));
  };

  const toItem = () => {
    return {
      vocabulary: vocabulary.current,
      translation: translation.current,
      suggestions: suggestions,
    };
  };

  const validateItem = () =>
    vocabulary.current.length > 0 && translation.current.length > 0 && suggestions.map((v) => v.length > 0);

  const update = () => {
    const item = toItem();
    console.log("suggestions witihin update ", suggestions);
    if (validateItem(item)) {
      addItem(item);
      resetFields();

      //toasts.toastSuccess("Quiz item added!");
    } else if (suggestions.filter((v) => v !== "").length > 0) {
      //toasts.toastError("Please ensure all fields are filled out.");
    }
  };

  useEffect(() => {
    //only rerenders once all have returned
    update();
    console.log("render", suggestions);
  }, [suggestions]);

  return (
    <div>
      <DialogTitle id="add-item">Add a quiz item</DialogTitle>
      <DialogContent key={fieldKey}>
        <Grid container justify="flex-start" alignItems="center" direction="column">
          <TextField
            autoFocus
            margin="dense"
            id="vocabulary"
            label="Vocabulary*"
            type="vocabulary"
            onChange={(e) => (vocabulary.current = e.target.value)}
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="translation"
            label="Translation*"
            type="translation"
            onChange={(e) => (translation.current = e.target.value)}
            fullWidth
          />
          {suggestions.map((v, i) => (
            <Suggestion index={i} onRefresh={refreshSuggestions} update={updateSuggs[i]} />
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <VTButton success onClick={() => addSuggestion()} color="primary">
          Add Suggestion
        </VTButton>
        <VTButton success onClick={() => removeSuggestion()} color="primary">
          Remove Suggestion
        </VTButton>
        <VTButton success onClick={() => updateSuggestions()} color="primary">
          Add quiz item
        </VTButton>
      </DialogActions>
    </div>
  );
}

function AddCustomQuiz({ onAdd }) {
  const styles = makeStyles();

  const [open, setOpen] = useState(false);
  const handleAddOpen = () => {
    setOpen(true);
  };
  const handleAddClose = () => {
    setOpen(false);
    setItems([]);
    resetFields();
  };

  const title = useRef("");
  const [items, setItems] = useState([]);

  const addItem = (item) => {
    setItems((il) => [...il, item]);
    //reset new fields
    resetFields();
  };

  const deleteItem = (i) => {
    setItems((il) => il.slice(0, i).concat(il.slice(i + 1)));
    toasts.toastSuccess("Quiz item deleted!");
  };
  const resetFields = () => {
    title.current = "";
  };

  const addQuiz = () => {
    if (title.current.length > 0 && items.length > 0) {
      api.createCustomQuiz(title.current, items).then((res) => {
        toasts.toastSuccess("Custom quiz added with " + items.length + " questions!");
        handleAddClose();
        onAdd();
      });
    } else {
      toasts.toastError(
        "You cannot add a quiz without title or quiz items. Please add title and at least one" + " quiz item first."
      );
    }
  };

  return (
    <div>
      <IconButton onClick={handleAddOpen}>
        <LibraryAddIcon />
      </IconButton>
      <Dialog open={open} onClose={handleAddClose} aria-labelledby="add-custom-quiz" fullScreen>
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
        </DialogContent>

        <QuizItemSection items={items} del={deleteItem} />

        <QuizItem items={items} setItems={setItems} addItem={addItem} />

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

function AddRandomQuiz({ onAdd }) {
  const [open, setOpen] = useState(false);
  const handleAddOpen = () => {
    setOpen(true);
  };
  const handleAddClose = () => {
    setOpen(false);
    resetFields();
  };

  const title = useRef("");
  const length = useRef("");

  const resetFields = () => {
    title.current = "";
    length.current = "";
  };

  const addQuiz = () => {
    const len = parseInt(length.current);
    //console.log(title.current.length > 0, length.current.length > 0, len!==NaN, len>0);
    if (title.current.length > 0 && length.current.length > 0 && len !== NaN && len > 0) {
      api.createQuiz(title.current, len).then(() => {
        toasts.toastSuccess("Random quiz added with " + len + " questions!");
        handleAddClose();
        onAdd();
      });
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

function QuizzesDashboard({ ...props }) {
  const classes = useStyles();

  const [reloadCount, setReloadCount] = useState(0);
  const refresh = () => setReloadCount(reloadCount + 1);

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
  }, [reloadCount]);

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
      <QuizSection title={"Custom Quizzes"} component={<AddCustomQuiz onAdd={refresh} />}>
        <Grid className={classes.grid} container justify="flex-start" alignItems="left" direction="row">
          {quizCustom.map((v) => (
            <QuizTile key={v.quiz_id} color={palette}>
              {v}
            </QuizTile>
          ))}
        </Grid>
      </QuizSection>
      <QuizSection title={"Random Quizzes"} component={<AddRandomQuiz onAdd={refresh} />}>
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
          <Button onClick={() => api.createQuizFromDoc(2, 10)}>Generate From Document (2)</Button>
          <Button onClick={() => api.fetchQuizByDocument(2)}>Fetch By Document (2)</Button>
        </GridList>
      </Grid>
    </AppPage>
  );
}

export default QuizzesDashboard;
