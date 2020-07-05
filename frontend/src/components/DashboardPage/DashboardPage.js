import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography as T,
  GridList,
  GridListTile,
  GridListTileBar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import UploadDocument from "./UploadDocument";

//icons
import LocalBarIcon from "@material-ui/icons/LocalBar";

import AppPage, { toasts } from "../common/AppPage";
import VTButton from "../common/VTButton";

import { api } from "../../utils";

//example tile images
import shortStoriesPreview from "../../assets/books.jpg";
import fairyTalesPreview from "../../assets/fairytale.jpg";
import newspaperArticlesPreview from "../../assets/newspaper.jpg";
import otherDocumentsPreview from "../../assets/others.jpg";

const useStyles = makeStyles(() => ({
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
}));

//popup for the document you click on (get some information about the doc before entering view mode)
function DocumentOverviewPopUp({
  open,
  onClose,
  documentId,
  documentTitle,
  documentDetails,
  documentAuthor,
  documentImage,
  refresh,
}) {
  function deleteThisDocument(documentId) {
    if (documentId)
      api
        .deleteDocument(documentId)
        .then(() => {
          toasts.toastSuccess("The document was successfully deleted!");
          refresh();
          onClose();
        })
        .catch((err) => {
          console.log(err);
          toasts.toastError("Error communicating with the server!");
        });
    else toasts.toastWarning("The document could not be found.");
  }

  return (
    <Dialog onClose={onClose} aria-labelledby="document-overview-popup" open={open}>
      <DialogTitle id="document-overview-popup" onClose={onClose}>
        {documentTitle}
      </DialogTitle>
      <img src={documentImage} alt={documentImage} width="100%" height="40%" />
      <DialogContent dividers>
        <T gutterBottom>
          {documentDetails} Written by {documentAuthor}
        </T>
      </DialogContent>
      <DialogActions>
        <VTButton neutral onClick={onClose}>
          Cancel
        </VTButton>
        <VTButton danger onClick={() => deleteThisDocument(documentId)}>
          Delete document
        </VTButton>
        <VTButton accept component={Link} to={"/documents/" + documentId}>
          View document
        </VTButton>
      </DialogActions>
    </Dialog>
  );
}

//overview (browse through documents, see title, preview and some additional information)
function Dashboard() {
  const classes = useStyles();
  const [user, setUser] = useState();
  const [openPopUp, setPopUpOpen] = useState(false);
  const [documentId, setDocumentId] = useState(null);
  const [documentTitle, setDocumentTitle] = useState(null);
  const [documentDetails, setDocumentDetails] = useState(null);
  const [documentImage, setDocumentImage] = useState(null);
  const [documentAuthor, setDocumentAuthor] = useState(null);

  //const [documentDataFromDatabase, setDocumentDataFromDatabase] = useState([]); // all document data fetched from the database
  const [newspaperArticles, setNewspaperArticles] = useState([]);
  const [shortStories, setShortStories] = useState([]);
  const [fairyTales, setFairyTales] = useState([]);
  const [otherDocuments, setOtherDocuments] = useState([]);

  const [countToRefresh, setCount] = useState(0);
  function refresh() {
    setCount(countToRefresh + 1);
  }

  useEffect(() => {
    api
      .user()
      .then((res) => {
        if (res) setUser(res.data);
      })
      .catch((err) => console.log(err));
  }, [countToRefresh]);

  useEffect(() => {
    api
      .fetchDocuments()
      .then((res) => {
        if (res) {
          //setDocumentDataFromDatabase(res.data.documents);    //if needed: fetch all documents to the frontend
          setNewspaperArticles(res.data.newspaperArticles);
          setFairyTales(res.data.fairyTales);
          setShortStories(res.data.shortStories);
          setOtherDocuments(res.data.others);
        }
      })
      .catch((err) => console.log(err));
  }, [countToRefresh]);

  return (
    <AppPage location="dashboard" id="dashboard-page">
      <Grid className={classes.grid} container justify="center" alignItems="center" direction="column">
        <T variant="h4">Welcome {user ? user.name : "..."}!</T>
        <T variant="h4">Improve your language skills with text documents, videos and more...</T>
      </Grid>
      <UploadDocument refresh={refresh} publisherId={user ? user.user_id : 0} />

      <Grid className={classes.grid} container justify="center" alignItems="center" direction="column">
        <T variant="h4">Short Stories</T>
      </Grid>

      <GridList cellHeight={200} cols={3} container justify="center" alignItems="center" className={classes.gridList}>
        {shortStories.map((tile) => (
          <GridListTile key={tile.document_id} cols={1}>
            <img src={shortStoriesPreview} alt={tile.title} />
            <GridListTileBar
              title={tile.title}
              subtitle={
                <span>
                  {tile.description} Written by {tile.author}
                </span>
              }
              onClick={() => {
                setPopUpOpen(true);
                setDocumentId(tile.document_id);
                setDocumentTitle(tile.title);
                setDocumentAuthor(tile.author);
                setDocumentDetails(tile.description);
                setDocumentImage(shortStoriesPreview);
              }}
              actionIcon={
                <IconButton aria-label={`info about ${tile.title}`} className={classes.icon}>
                  <LocalBarIcon />
                </IconButton>
              }
            />
          </GridListTile>
        ))}
      </GridList>

      <Grid className={classes.grid} container justify="center" alignItems="center" direction="column">
        <T variant="h4">Fairy Tales</T>
      </Grid>

      <GridList cellHeight={200} cols={3} container justify="center" alignItems="center" className={classes.gridList}>
        {fairyTales.map((tile) => (
          <GridListTile key={tile.document_id} cols={1}>
            <img src={fairyTalesPreview} alt={tile.title} />
            <GridListTileBar
              title={tile.title}
              subtitle={
                <span>
                  {tile.description} Written by {tile.author}
                </span>
              }
              onClick={() => {
                setPopUpOpen(true);
                setDocumentId(tile.document_id);
                setDocumentTitle(tile.title);
                setDocumentAuthor(tile.author);
                setDocumentDetails(tile.description);
                setDocumentImage(fairyTalesPreview);
              }}
              actionIcon={
                <IconButton aria-label={`info about ${tile.title}`} className={classes.icon}>
                  <LocalBarIcon />
                </IconButton>
              }
            />
          </GridListTile>
        ))}
      </GridList>

      <Grid className={classes.grid} container justify="center" alignItems="center" direction="column">
        <T variant="h4">Newspaper Articles</T>
      </Grid>

      <GridList cellHeight={200} cols={3} container justify="center" alignItems="center" className={classes.gridList}>
        {newspaperArticles.map((tile) => (
          <GridListTile key={tile.document_id} cols={1}>
            <img src={newspaperArticlesPreview} alt={tile.title} />
            <GridListTileBar
              title={tile.title}
              subtitle={
                <span>
                  {tile.description} Written by {tile.author}
                </span>
              }
              onClick={() => {
                setPopUpOpen(true);
                setDocumentId(tile.document_id);
                setDocumentTitle(tile.title);
                setDocumentAuthor(tile.author);
                setDocumentDetails(tile.description);
                setDocumentImage(newspaperArticlesPreview);
              }}
              actionIcon={
                <IconButton aria-label={`info about ${tile.title}`} className={classes.icon}>
                  <LocalBarIcon />
                </IconButton>
              }
            />
          </GridListTile>
        ))}
      </GridList>

      <Grid className={classes.grid} container justify="center" alignItems="center" direction="column">
        <T variant="h4">More documents</T>
      </Grid>

      <GridList cellHeight={200} cols={3} container justify="center" alignItems="center" className={classes.gridList}>
        {otherDocuments.map((tile) => (
          <GridListTile key={tile.document_id} cols={1}>
            <img src={otherDocumentsPreview} alt={tile.title} />
            <GridListTileBar
              title={tile.title}
              subtitle={
                <span>
                  {tile.description} Written by {tile.author}
                </span>
              }
              onClick={() => {
                setPopUpOpen(true);
                setDocumentId(tile.document_id);
                setDocumentTitle(tile.title);
                setDocumentAuthor(tile.author);
                setDocumentDetails(tile.description);
                setDocumentImage(otherDocumentsPreview);
              }}
              actionIcon={
                <IconButton aria-label={`info about ${tile.title}`} className={classes.icon}>
                  <LocalBarIcon />
                </IconButton>
              }
            />
          </GridListTile>
        ))}
      </GridList>

      <DocumentOverviewPopUp
        open={openPopUp}
        onClose={() => setPopUpOpen(false)}
        documentId={documentId}
        documentTitle={documentTitle}
        documentAuthor={documentAuthor}
        documentDetails={documentDetails}
        documentImage={documentImage}
        refresh={refresh}
      />
    </AppPage>
  );
}
export default Dashboard;
