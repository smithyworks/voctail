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

const images = [
  {
    url: "/frontend/src/images/logo_green.png",
    title: "Breakfast",
    width: "40%",
  },
  {
    url: "/frontend/src/images/logo_green.png",
    title: "Burgers",
    width: "30%",
  },
  {
    url: "/frontend/src/images/logo_green.png",
    title: "Camera",
    width: "30%",
  },
];

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
