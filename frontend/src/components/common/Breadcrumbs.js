import React, { useState, useEffect } from "react";
import { useRouteMatch, Link } from "react-router-dom";
import { api } from "../../utils";
import { Typography, makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  breadcrumbs: {
    padding: "10px 0",
  },
});

function Breadcrumbs() {
  const classes = useStyles();

  const { path, params } = useRouteMatch();
  const [breadcrumbs, setBreadcrumbs] = useState(null);
  useEffect(() => {
    if (path === "/documents/:document_id") {
      api.breadCrumbs({ document: params.document_id }).then((res) => {
        setBreadcrumbs(
          <Typography className={classes.breadcrumbs}>
            <Link to="/dashboard">Dashboard</Link> {">"} {res.data.document}
          </Typography>
        );
      });
    } else if (path === "/quizzes/:id") {
      api.breadCrumbs({ quiz: params.id }).then((res) => {
        setBreadcrumbs(
          <Typography className={classes.breadcrumbs}>
            <Link to="/quizzes">Quizzes</Link> {">"} {res.data.quiz}
          </Typography>
        );
      });
    } else if (path === "/classrooms/:classroom_id") {
      api.breadcrumbs({ classroom_id: params.classroom_id }).then((res) => {
        setBreadcrumbs(
          <Typography className={classes.breadcrumbs}>
            <Link to="/classrooms">Classrooms</Link> {">"} {res.data.classroom}
          </Typography>
        );
      });
    } else if (path === "/classrooms/:classroom_id/documents/:document_id") {
      api.breadcrumbs({ classroom_id: params.classroom_id, document_id: params.document_id }).then((res) => {
        setBreadcrumbs(
          <Typography className={classes.breadcrumbs}>
            <Link to="/classrooms">Classrooms</Link> {">"}{" "}
            <Link to={`/classrooms/${params.classroom_id}`}>{res.data.classroom}</Link> {">"} {res.data.document}
          </Typography>
        );
      });
    }
  }, [path, params]); // eslint-disable-line

  return breadcrumbs;
}

export default Breadcrumbs;
