import React, { useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import { Grid, Typography as T } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import LocalBarIcon from "@material-ui/icons/LocalBar";
import AppPage from "./AppPage.js";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
  container: { height: "100%", width: "100%" },
  gridHeader: { height: "20%", width: "100%", backgroundColor: "rgba(0,0,0,0.3)" },
  gridWord: { height: "20%", width: "100%" },
  gridTranslations: { height: "10%", width: "100%" },
  gridActions: { height: "20%", width: "30%" },
  grid: { height: "100%", width: "100%" },
  userItem: { width: "150px" },
  button: {
    textDecoration: "none",
    color: "#555",
    padding: "4px 20px 0 20px",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    //width:"20%",
    //height:"5%",
    textTransform: "none",
    borderWidth: "3px",
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
        <T variant="h4">{props.title}</T>
        <T variant="p">{props.children}</T>
      </Grid>
  )
}

function Translations(props) {
  const classes = useStyles();

  function generateButtons(q, setQstate, qstate, qst, setResult, result){
    //2 states possible qstate.qstate == 'untaken' | 'wrong'
    let lines = [];
    for (let t of q.suggestions) {
      //if diff state change icon - red or green - color="primary"| "secondary"
      lines.push(t===q.translation
          ? <Button variant="outlined" onClick={()=>{setQstate(qst.correct);
            if(qstate===qst.untaken){setResult(result + [true]);}
            }}startIcon={<LocalBarIcon/>} className={classes.button}>{t}</Button>
          : <Button variant="outlined" onClick={() =>{setQstate(qst.wrong);
            if (qstate === qst.untaken){setResult(result + [false]);}
            }} startIcon={<LocalBarIcon/>} className={classes.button}>{t}</Button>
      );
    }
    return lines;
  }

  function updateButtons(suggestions, mark, color){
    let lines = [];
    for (let t of suggestions) {
      lines.push(t===mark
          //cahnge icon instead of color
          ? <Button variant="outlined"  color={color} startIcon={<LocalBarIcon/>} className={classes.button}>
            {t}</Button>
          : <Button variant="outlined" startIcon={<LocalBarIcon/>} className={classes.button}>
            {t}</Button>
      )
    }
    return lines;
  }

  function chooseButtons(q, setQstate, qstate, qst, setResult, result){
    console.log(qstate)
    switch(qstate){
      case qst.untaken: case qst.wrong:
        return generateButtons(q, setQstate,qstate,qst, setResult, result);
      case qst.shown:
        return updateButtons(q.suggestions, q.translation, "secondary");
      default: //qst.correct
        return updateButtons(q.suggestions, q.translation, "primary");
    }
  }

  //Your results  | Select the right translation for the word.

  //Button onClick
  return(
      <Grid className={classes.gridTranslations} container justify="space-evenly" alignItems="center" direction="row">
        {chooseButtons(props.question, props.setQstate, props.qstate, props.qst, props.setResult, props.result)}
      </Grid>
  )
}
//continue here add other parts
function Results(props) {
  let unknowns = []
  let num_taken = props.result.length
  for (let i in props.questions){
    if (props.result[i] === false){
      unknowns.push(Object.keys(props.questions[i])[0])
    }
  }
  //<T>{unknowns.length.toLocaleString() + props.qstate.result.length.toLocaleString()}</T>
  return(
      <Grid>
        <T variant="h4">Your Score: {num_taken > 0
            ? Math.round((num_taken - unknowns.length)/num_taken*100) + "%"
            : "Answer at least one question"
        }</T>
        <T variant="h4">Recap: {unknowns.length>0?unknowns:"Good job. Nothing to recap."}</T>
      </Grid>
  )
}


function Actions(props) {
  const classes = useStyles();
  function actionButton(update,qst,action){
    switch (action) {
      case "Done":
        return <Button variant="outlined" onClick={()=>update({'qstate':qst.result})} className={classes.button}>Done</Button>
      case "Show":
        return <Button variant="outlined" onClick={()=>update({'qstate':qst.shown})} className={classes.button}>Show</Button>
      default: //Next
        return <Button variant="outlined" onClick={()=>update({'qstate':qst.untaken})} className={classes.button}>Next</Button>
    }

  }

  function choose_buttons(update,qst){
    let buttons=[];
    switch (qst.shown) {
        //correct
      case qst.correct: case qst.shown:
        buttons.push(actionButton(update,qst,"Next"));
        buttons.push(actionButton(update,qst, "Done"));
        break;
        //wrong
      case qst.wrong:
        buttons.push(actionButton(update,qst,"Show"));
        buttons.push(actionButton(update,qst, "Done"));
        break;
      //untaken
      default:
        buttons.push(actionButton(update,qst, "Done"));
    }

    return buttons;
  }

  //Your results  | Select the right translation for the word.
  return (
      <Grid className={classes.gridActions} container justify="space-evenly"  alignItems="center" direction="row">
        {choose_buttons(props.update, props.qst)}
      </Grid>
  )
}

function Actions2(props) {
  const classes = useStyles();
  function choose_buttons(){
    let buttons=[];
    if (true){
      buttons.push(<Button variant="outlined" className={classes.button}>Validate</Button>);
    }else{
      buttons.push(<Button variant="outlined" className={classes.button}>Next</Button>);
      buttons.push(<Button variant="outlined" className={classes.button}>Done</Button>);
    }
    return buttons;
  }

  //Your results  | Select the right translation for the word.
  return (
    <Grid className={classes.gridActions} container justify="space-evenly" alignItems="center" direction="row">
      {choose_buttons()}
    </Grid>
  );
}

function QuizzesDayPage({ ...props }) {
  const classes = useStyles();

  //later questions=
  let { id } = useParams();
  //quiz= db.query("SELECT * from Quizzes where id=$1 AND userid=$2",id,user) or sth like that;
  //questions = quiz.questions
  let questions = [];
  for (let i=0;i<10;i++) {
    //for the translations: i=0 correct, eg "Wort"
    questions.push({"vocabulary":"word","suggestions":["Wort","Phrase","Satz","Silbe"], "translation":"Wort"})
  }
  //assumption id 11 = day - later day column in db
  let quiz = {'id':id, 'questions':questions, "title":id===11?"Quiz of the Day":"Quiz "+id};

  //const [user, setUser] = useState();
  const qst = {"untaken":0,"correct":1,"wrong":2, "shown":3, "result":4}
  const [qstate, setQstate] = useState(qst.untaken)
  const [result, setResult] = useState([])

  //const getQ = function (questions, qstate) {
  // return qstate.qstate === qst.untaken ? questions[qstate.result.length] : questions[qstate.result.length-1]
  //}


  //<T variant="h3">{qstate === qst.untaken ? quiz.questions[result.length].vocabulary
  //    : quiz.questions[result.length-1].vocabulary}</T>

  //const f = ()=>{setQstate(qst.correct);
  //if(qstate===qst.untaken) {setResult(result + [true]);}}
  //f();
  console.log("Bla")
  console.log(qstate +" "+result)
  return (
    <AppPage location={"quizzes/"+quiz.id} id="quizzes-day-page">
        {qstate !== qst.result
            ?<Grid className={classes.grid} container justify="space-evenly" spacing={0} alignItems="center" direction="row">
                <Header title={quiz.title}>Select the right translation for the word.</Header>
                <Grid className={classes.gridWord} container justify="space-evenly" alignItems="flex-end" direction="row">
                  <T variant="h3">{qstate === qst.untaken ? quiz.questions[result.length].vocabulary
                          : quiz.questions[result.length-1].vocabulary}</T>
                </Grid>
                <Translations question={qstate === qst.untaken ? quiz.questions[result.length]
                    : quiz.questions[result.length-1]} setQstate={setQstate} qstate={qstate} qst={qst}
                              setResult={setResult} result={result}/>
                <Actions update={setQstate} qst={qst}/>
              </Grid>
            :<Grid className={classes.grid} container justify="space-evenly" spacing={0} alignItems="center" direction="row">
              <Header title={quiz.title}>Your results.</Header>
              <Results questions={quiz.questions} result={result}/>
             </Grid>
        }
    </AppPage>
  );
}

export default QuizzesDayPage;
