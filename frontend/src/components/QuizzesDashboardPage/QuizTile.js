import { Box, Typography as T } from "@material-ui/core";
import { Link } from "react-router-dom";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";

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
});

function QuizTile({ ...props }) {
  const classes = useStyles();
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
    <Box component="span" className={classes.quizTile} style={{ backgroundColor: props.color }}>
      <Link to={base + "/" + props.children.quiz_id} className={classes.quizLink}>
        <T variant={"h6"}>{format(title)}</T>
      </Link>
    </Box>
  );
}

export default QuizTile;
