import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography as T,
  GridList,
  GridListTile,
  ListSubheader,
  GridListTileBar,
  IconButton,
  Button,
  Dialog,
} from "@material-ui/core";
import { makeStyles, WithStyles, withStyles, createStyles, Theme } from "@material-ui/core/styles";
import LocalBarIcon from "@material-ui/icons/LocalBar";
import CloseIcon from "@material-ui/icons/Close"
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';

import AppPage from "./AppPage.js";
import { api } from "../utils";
import { Link } from "react-router-dom";

//example tile data
import exampleImage from "../images/exampleimage.png";
import textblock from "../images/textblock.png";

const useStyles = makeStyles({
  container: { height: 200, width: "100%" },
  grid: { height: 100, width: "100%" },
  userItem: { width: "150px" },

  //gridlist with documents
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.54)",
  },
  gridList: { width: "100%", height: 800, justifyContent: "space-around" },
  icon: { color: "rgba(255,255,255,0.54)" },
});

//popup
const styles = (theme: Theme) =>
    createStyles({
      root: {
        margin: 0,
        padding: theme.spacing(2),
      },
      closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
      },
    });
export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string,
  children: React.ReactNode,
  onClose: () => void,
}
const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <T variant="h6">{children}</T>
        {onClose ? (
            <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
              <CloseIcon />
            </IconButton>
        ) : null}
      </MuiDialogTitle>
  );
});
const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);
const DialogActions = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);


//popup for the document you prefer (get some information about the doc before entering viewmode)
function DocumentOverviewPopUp() {
  //todo use document overview popup


  const [popUpOpen, setPopUpOpen] =React.useState(false);

  const handlePopUpClose = () => {
    setPopUpOpen(false);
  };

  const handlePopUpOpen = () => {
    setPopUpOpen(true);
  };

  return (
      <div>
        <Dialog onClose={handlePopUpClose} aria-labelledby="document-overview-popup" open={popUpOpen}>
          <DialogTitle id="document-overview-popup" onClose={handlePopUpClose()}>
            Document: title
          </DialogTitle>
          <DialogContent dividers>
            <T gutterBottom>
              Description: description
            </T>
            <T gutterBottom>
              This document is provided to you by author
            </T>
          </DialogContent>
          <DialogActions>
            //todo onclick go to document
            <Button autoFocus component={Link} to ="/document-markup" color="primary" >
              Open the document in the markup view mode
            </Button>
            <Button autoFocus onClick={handlePopUpClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
  );

}


function DocumentPreview({...props}, location) {
  //example tile data
  const tileData = [
    {
      img: exampleImage,
      title: "ExampleImage",
      description: "this is an example for another preview",
      author: "Clara is the author",
    },
    {
      img: textblock,
      title: "Munich",
      description: "Explanation text about the capital of bavaria",
      author: "wikipedia",
    },
    {
      img: textblock,
      title: "Munich1",
      description: "Explanation text about the capital of bavaria",
      author: "wikipedia",
    },
    {
      img: textblock,
      title: "Munich2",
      description: "Explanation text about the capital of bavaria",
      author: "wikipedia",
    },
    {
      img: textblock,
      title: "Munich3",
      description: "Explanation text about the capital of bavaria",
      author: "wikipedia",
    },
    {
      img: textblock,
      title: "Munich4",
      description: "Explanation text about the capital of bavaria",
      author: "wikipedia",
    },
    {
      img: textblock,
      title: "Munich5",
      description: "Explanation text about the capital of bavaria",
      author: "wikipedia",
    },
    {
      img: textblock,
      title: "Munich6",
      description: "Explanation text about the capital of bavaria",
      author: "wikipedia",
    },
    {
      img: textblock,
      title: "Munich7",
      description: "Explanation text about the capital of bavaria",
      author: "wikipedia",
    },
  ];

  const classes = useStyles();

  return (
      <>
        {tileData.map((tile) => (
        <GridListTile key={tile.img} cols={1}>
          <img src={tile.img} alt={tile.title} />
          <GridListTileBar
              title=
                  // <Link to="/clara-dummy" className={documentMarkupLinkClass}>
                  {tile.title}
              // </Link>
              subtitle={<span>description: {tile.description}</span>}
              //onClick={<DocumentOverviewPopup>handlePopUpOpen</DocumentOverviewPopup>}
              actionIcon={
                <IconButton aria-label={`info about ${tile.title}`} className={classes.icon}>
                  <LocalBarIcon />
                </IconButton>
              }
          />
        </GridListTile>
        ))}
     </>
  );

}

//overview (browse through documents, see title, preview and some additional information)
function Documents({ ...props }, location) {
  const classes = useStyles();
  const [user, setUser] = useState();

  //todo integrate flexible link to individual documents instead of const document markup
  //const documentMarkupLinkClass = location === "document-markup" ? classes.activeLink : classes.link;

  useEffect(() => {
    api
      .user()
      .then((res) => {
        if (res) setUser(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <AppPage location="documents" id="documents-page">
      <Grid className={classes.grid} container justify="center" alignItems="center" direction="column">
        <T variant="h4">Welcome to your Document Overview, {user ? user.name : "..."}!</T>
      </Grid>

      <GridList cellHeight={200} cols={3} container justify="center" alignItems="center" className={classes.gridList}>
        <GridListTile key="Subheader" cols={3} style={{ height: "auto" }}>
          <ListSubheader component="div">Documents</ListSubheader>
        </GridListTile>
        <DocumentPreview/>  //preview
      </GridList>
    </AppPage>
  );
}
export default Documents;

