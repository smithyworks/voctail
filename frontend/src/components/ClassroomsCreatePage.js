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
import Container from "@material-ui/core/Container";

const useStyles = makeStyles((theme) => ({
  headUpText: {
    paddingTop: "5%",
    paddingBottom: "5%",
    margin: "auto",
    textAlign: "center",
    fontStyle: "italic",
  },
}));

function HeadUpText(props) {
  const styles = useStyles();
  return <Typography className={styles.headUpText}>{props.text}</Typography>;
}

function ClassroomsCreatePage({ ...props }) {
  return (
    <AppPage location="classrooms" id="classrooms-page">
      <HeadUpText text="This page is used for testing." />
      <Container maxWidth="sm"></Container>
    </AppPage>
  );
}

export default ClassroomsCreatePage;
