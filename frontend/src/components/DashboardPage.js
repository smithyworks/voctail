import React, { useState, useEffect, useRef } from "react";
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
  FormControlLabel,
  DialogContentText,
  TextField,
  Checkbox,
  MenuItem,
  InputLabel,
  FormHelperText,
  FormControl,
  Select,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

//icons
import LocalBarIcon from "@material-ui/icons/LocalBar";
import AddIcon from "@material-ui/icons/Add";
import DescriptionIcon from "@material-ui/icons/Description";
import ImageIcon from "@material-ui/icons/Image";

import AppPage, { toasts } from "./common/AppPage";
import VTButton from "./common/VTButton";

import { api } from "../utils";

//example tile images
import shortStoriesPreview from "../assets/books.jpg";
import fairyTalesPreview from "../assets/fairytale.jpg";
import newspaperArticlesPreview from "../assets/newspaper.jpg";
import otherDocumentsPreview from "../assets/others.jpg";

const useStyles = makeStyles((theme) => ({
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
  //alert for document upload
  alert: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
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

function AddNewDocument({ refresh, publisherId }) {
  const titleInput = useRef("");
  const authorInput = useRef("");
  const descriptionInput = useRef("");
  const [publicDocument, setPublicDocument] = useState(true);

  const contentInput = useRef("");
  //const imageInput = useRef(); todo use image
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("");
  const classes = useStyles();

  const handleAddOpen = () => {
    setOpen(true);
  };
  const handleAddClose = () => {
    setOpen(false);
  };
  const handleStatusChange = (event) => {
    setPublicDocument(event.target.checked);
  };
  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  function readFile() {
    const uploadedFile = document.getElementById("upload-file").files[0];

    let reader = new FileReader();
    reader.readAsText(uploadedFile);

    const blocks = [];
    let currentType;
    let currentContent;

    reader.onloadend = function () {
      console.log("onload", reader.result);
      const lines = reader.result.split(/\r?\n/);
      console.log("lines in onload", lines);

      lines.forEach((line, i) => {
        // Encountered newline, current block set empty
        if (line.trim() === "") {
          // If not empty block, type will be set to something.
          // Therefore, we push it to blocks
          if (currentType) {
            switch (currentType) {
              case "title":
                blocks.push({ type: currentType, content: currentContent });
                break;
              case "subtitle":
                blocks.push({ type: currentType, content: currentContent });
                break;
              case "paragraph":
                blocks.push({ type: currentType, content: currentContent });
                break;
              default:
                throw new Error(`There is no case taking type "${currentType}" into account (line ${i + 1}').`);
            }
          }

          // Reset block
          currentType = null;
          currentContent = null;

          return; // no need to check for other block types
        }

        // Test for marked up line
        const matchData = line.match(/^(?<key>>\w+|#+) (?<content>.*$)/);
        if (matchData) {
          switch (matchData.groups.key) {
            case "#":
              currentType = "title";
              break;
            case "##":
              currentType = "subtitle";
              break;
            default:
              throw new Error(
                `Encountered malformed line with markup key: "${matchData.groups.key}"\n  line ${i + 1}: "${line}"`
              );
          }

          // Set current content, since this is the first line of this block, no need to add a space.
          currentContent = matchData.groups.content.trim();
        } else if (!currentType) {
          // If currentType is unset, this means we are on the first line of a paragraph.
          currentType = "paragraph";
          currentContent = line.trim();
        } else {
          // If we reach here, we are adding a line to the current block.
          // We want to make sure to add a space.
          currentContent += " " + line.trim();
        }
      });

      // Escape the escapes (this is the content)
      const blocksJson = JSON.stringify(blocks).replace(/\\/g, "\\\\");

      contentInput.current = blocksJson;

      return;
    };
  }

  function verify() {
    toasts.toastInfo("Verified.");
    return true;
  }

  const addThisDocument = () => {
    readFile();
    console.log("contentInput in add this document", contentInput.current);

    api
      .addDocument(
        publisherId,
        titleInput.current,
        authorInput.current,
        descriptionInput.current,
        category,
        publicDocument,
        contentInput.current
      )
      .then(() => {
        toasts.toastSuccess("The document was successfully added!");
        refresh();
        handleAddClose();
      })
      .catch((err) => {
        console.log(err);
        toasts.toastError("Error uploading the document!");
      });
  };

  return (
    <div>
      <VTButton neutral startIcon={<AddIcon />} onClick={handleAddOpen}>
        Add a new document
      </VTButton>

      <Dialog open={open} onClose={handleAddClose} aria-labelledby="add-new-document">
        <DialogTitle id="add-new-document">Add a document</DialogTitle>
        <DialogContent>
          <DialogContentText>To add a new text document please fill in the additional data.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title*"
            type="title"
            onChange={(e) => (titleInput.current = e.target.value)}
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="author"
            label="Author*"
            type="author"
            onChange={(e) => (authorInput.current = e.target.value)}
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="description"
            label="Description"
            type="description"
            onChange={(e) => (descriptionInput.current = e.target.value)}
            fullWidth
          />
          <DialogContentText>Please upload your text document.</DialogContentText>
          <input accept="txt/*" className={classes.input} id="upload-file" multiple type="file" />
          <label htmlFor="upload-text">
            <VTButton neutral component="span" startIcon={<DescriptionIcon />}>
              Upload
            </VTButton>
          </label>
          <DialogContentText>
            You can upload a preview image for your text document or choose one from our example pictures.
          </DialogContentText>
          <input accept="image/*" className={classes.input} id="upload-preview-image" multiple type="file" />
          <label htmlFor="upload-preview-image">
            <VTButton secondary component="span" startIcon={<ImageIcon />}>
              Upload
            </VTButton>
          </label>
          <DialogContentText>
            Your document is public and available to all users. If you want to keep your document private please
            deactivate the document status.
          </DialogContentText>
          <FormControlLabel
            control={
              <Checkbox
                name="checkedH"
                onChange={handleStatusChange}
                checked={publicDocument}
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            }
            label="Public Document"
          />

          <FormControl className={classes.formControl}>
            <InputLabel shrink id="choose-category">
              Category
            </InputLabel>
            <Select
              labelId="demo-simple-select-placeholder-label-label"
              id="choose-category"
              value={category}
              onChange={handleCategoryChange}
              displayEmpty
              className={classes.selectEmpty}
            >
              <MenuItem value={"Others"}>
                <em>Others</em>
              </MenuItem>
              <MenuItem value={"Fairy Tale"}>Fairy Tale</MenuItem>
              <MenuItem value={"(Short) Story"}>Short Story</MenuItem>
              <MenuItem value={"Newspaper Article"}>Newspaper Article</MenuItem>
            </Select>
            <FormHelperText>Please choose a category for your document</FormHelperText>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <VTButton neutral onClick={handleAddClose}>
            Cancel
          </VTButton>
          <VTButton
            accept
            onClick={() => {
              if (verify()) addThisDocument();
              else toasts.toastWarning("Please review your entries.");
            }}
          >
            Add new document
          </VTButton>
        </DialogActions>
      </Dialog>
    </div>
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
      <AddNewDocument refresh={refresh} publisherId={user ? user.user_id : 10} />

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
