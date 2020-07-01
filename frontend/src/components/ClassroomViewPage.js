import React, { useState, useEffect, useRef } from "react";
import {
  Grid,
  Typography as T,
  GridList,
  GridListTile,
  ListSubheader,
  GridListTileBar,
  IconButton,
  Button,
  ButtonBase,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Switch,
  DialogContentText,
  TextField,
  Checkbox,
  Menu,
  MenuItem,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import LocalBarIcon from "@material-ui/icons/LocalBar";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import LocalBarIconOutlined from "@material-ui/icons/LocalBarOutlined";
import DescriptionIcon from "@material-ui/icons/Description";
import ImageIcon from "@material-ui/icons/Image";

import AppPage from "./common/AppPage";

import { api } from "../utils";
import munich from "../images/munich.jpg";
import { Link } from "react-router-dom";
import { Theme as theme } from "@material-ui/core/styles/createMuiTheme";

export const dummyClassroom = {
  title: "Class of 2020",
  topic: "British History",
  description: "In this classroom I will provide material for my students to discover the ancient british history.",
  students: ["Alice", "Bob", "Clara"],
};

const useStyles = makeStyles({
  text: {
    paddingTop: "5%",
    paddingBottom: "5%",
    margin: "auto",
    textAlign: "center",
    textShadow: "1px 1px",
  },
});

function ClassroomViewPage() {
  return <AppPage location="classrooms/view" id="classrooms-view-page"></AppPage>;
}

export default ClassroomViewPage;
