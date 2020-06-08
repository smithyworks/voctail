import React, { useState, useEffect } from "react";
import { Grid, Typography as T } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import LocalBarIcon from "@material-ui/icons/LocalBar";

import AppPage from "./AppPage.js";
import { api } from "../utils";

import { Link } from "react-router-dom"
import Button  from '@material-ui/core/Button';

const useStyles = makeStyles({
  container: { height: "100%", width: "100%" },
  gridHeader: { height: "20%", width: "100%", backgroundColor:"rgba(0,0,0,0.3)"},
  gridWord: { height: "20%", width: "100%" },
  gridTranslations: { height: "10%", width: "100%" },
  gridActions: { height: "20%", width: "30%" },
  grid: { height: "100%", width: "100%" },
  userItem: { width: "150px" },
  button:{
    textDecoration: "none",
    color: "#555",
    padding: "4px 20px 0 20px",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    //width:"20%",
    //height:"5%",
    textTransform: 'none',
    borderWidth:"3px",
    "&:hover": {
      color: "white",
      backgroundColor: "rgba(0,0,0,0.3)",
    },
  },
});


function Header(props) {
  const classes = useStyles();
  //add state cacllback to
  //Your results  | Select the right translation for the word.
  return (
      <Grid className={classes.gridHeader} container justify="center" alignItems="center" direction="column">
        <T variant="h4">Quiz of the day</T>
        <T variant="p">{props.children}</T>
      </Grid>
  )
}

function Translations(props){
  const classes = useStyles();

  function generate_buttons(values){
    let lines =[]
    for (let t of values) {
      lines.push(
          //if diff state change icon - red or green - color="primary"| "secondary"
          <Button variant="outlined" startIcon={<LocalBarIcon/>} className={classes.button}>{t}</Button>
    )
    }
    return lines
  }

  //Your results  | Select the right translation for the word.

  //Button onClick
  return(
      <Grid className={classes.gridTranslations} container justify="space-evenly" alignItems="center" direction="row">
        {generate_buttons(props.values)}
      </Grid>
  )
}

function Actions(props) {
  const classes = useStyles();
  //for now b replace by handed down state
  const state = {"untaken":0,"correct":1,"wrong":2, "shown":3}
  function choose_buttons(){
    let buttons=[];
    switch (state.shown) {
        //correct
      case state.correct: case state.shown:
        buttons.push(<Button variant="outlined" className={classes.button}>Next</Button>);
        buttons.push(<Button variant="outlined" className={classes.button}>Done</Button>);
        break;
        //wrong
      case state.wrong:
        buttons.push(<Button variant="outlined" className={classes.button}>Show</Button>);
        buttons.push(<Button variant="outlined" className={classes.button}>Done</Button>);
        break;
        //untaken
      default:
        buttons.push(<Button variant="outlined" className={classes.button}>Done</Button>);
    }

    return buttons
  }

  //add state cacllback to
  //Your results  | Select the right translation for the word.
  return (
      <Grid className={classes.gridActions} container justify="space-evenly"  alignItems="center" direction="row">
        {choose_buttons()}
      </Grid>
  )
}

function Actions2(props) {
  const classes = useStyles();
  function choose_buttons(){
    var buttons=[];
    if (true){
      buttons.push(<Button variant="outlined" className={classes.button}>Validate</Button>);
    }else{
      buttons.push(<Button variant="outlined" className={classes.button}>Next</Button>);
      buttons.push(<Button variant="outlined" className={classes.button}>Done</Button>);
    }
    return buttons
  }

  //add state cacllback to
  //Your results  | Select the right translation for the word.
  return (
      <Grid className={classes.gridActions} container justify="space-evenly" alignItems="center" direction="row">
        {choose_buttons()}
      </Grid>
  )
}


function QuizzesDayPage({ ...props }) {
  const classes = useStyles();
  const [user, setUser] = useState();

  useEffect(() => {
    api
      .user()
      .then(res => {
        if (res) setUser(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <AppPage location="quizzes/day" id="quizzes-day-page">
      <Grid className={classes.grid} container justify="space-evenly" spacing={0} alignItems="center" direction="row">
        <Header>Select the right translation for the word.</Header>
        <Grid className={classes.gridWord} container justify="space-evenly" alignItems="flex-end" direction="row">
          <T variant="h3">word</T>
        </Grid>
        <Translations values={["Wort","Phrase","Satz","Silbe"]}/>
        <Actions/>
      </Grid>
    </AppPage>
  );
}

export default QuizzesDayPage;
