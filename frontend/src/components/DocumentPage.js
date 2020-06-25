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
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import LocalBarIcon from "@material-ui/icons/LocalBar";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import LocalBarIconOutlined from "@material-ui/icons/LocalBarOutlined";
import DescriptionIcon from "@material-ui/icons/Description";
import ImageIcon from "@material-ui/icons/Image";

import AppPage from "./common/AppPage";

import { api } from "../utils";

//example tile images
import exampleImage from "../images/exampleimage.png";
import munich from "../images/munich.jpg";
import UserMenuButton from "./common/AppPage/UserMenuButton";
import { deleteDocument } from "../utils/api";

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

//popup for the document you click on (get some information about the doc before entering view mode)
function DocumentOverviewPopUp({
  open,
  onClose,
  onView,
  documentTitle,
  documentDetails,
  documentAuthor,
  documentImage,
}) {
  return (
    <Dialog onClose={onClose} aria-labelledby="document-overview-popup" open={open}>
      <DialogTitle id="document-overview-popup" onClose={onClose}>
        {documentTitle}
      </DialogTitle>
      <img src={documentImage} alt={documentImage} width="100%" height="40%" />
      <DialogContent dividers>
        <T gutterBottom>Description: {documentDetails}</T>
        <T gutterBottom>Author: {documentAuthor}</T>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onClose} color="primary">
          Delete document
        </Button>
        <Button onClick={onView} color="primary">
          View document
        </Button>
      </DialogActions>
    </Dialog>
  );
}

//get link to view the document after you clicked on "view" in the popup
function ViewDocument() {
  //todo
}

function AddNewDocument() {
  const titleInput = useRef();
  const descriptionInput = useRef();
  const authorInput = useRef();
  const contentInput = useRef();
  const imageInput = useRef();
  const [open, setOpen] = React.useState(false);
  const [publicDocument, setPublicDocument] = React.useState(true);
  const classes = useStyles();
  const handleAddOpen = () => {
    setOpen(true);
  };
  const handleAddClose = () => {
    setOpen(false);
  };
  const handleStatusChange = () => {
    if (publicDocument) setPublicDocument(false);
    else setPublicDocument(true);
  };

  const addThisDocument = () => {
    api
      .addDocument(
        titleInput.current,
        descriptionInput.current,
        publicDocument,
        contentInput.current,
        authorInput.current
      )
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <Button varian="contained" color="primary" startIcon={<LocalBarIcon />} onClick={handleAddOpen}>
        Add a new document
      </Button>

      <Dialog open={open} onClose={handleAddClose} aria-labelledby="add-new-document">
        <DialogTitle id="add-new-document">Add a document</DialogTitle>
        <DialogContent>
          <DialogContentText>To add a new text document please fill in the additional data.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            type="title"
            onChange={(e) => (titleInput.current = e.target.value)}
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="author"
            label="Author"
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
          {/*<input accept="text/*" className={classes.input} id="upload-text" multiple type="file" />
          <label htmlFor="upload-text">
            <Button variant="contained" color="primary" component="span" startIcon={<DescriptionIcon />}>
              Upload
            </Button>
          </label>
          <DialogContentText>
            You can upload a preview image for your text document or choose one from our example pictures.
          </DialogContentText>
          <input accept="image/*" className={classes.input} id="upload-preview-image" multiple type="file" />
          <label htmlFor="upload-preview-image">
            <Button variant="contained" color="primary" component="span" startIcon={<ImageIcon />}>
              Upload
            </Button>
          </label>
          */}
          <DialogContentText>
            Your document is public and available for all users. If you want to keep your document private please
            deactivate the document status.
          </DialogContentText>
          <FormControlLabel
            control={<Switch checked={publicDocument} onChange={handleStatusChange} />}
            label="Public Document"
          />
          <FormControlLabel
            control={
              <Checkbox
                icon={<LocalBarIconOutlined />}
                checkedIcon={<LocalBarIcon />}
                name="checkedH"
                onChange={handleStatusChange}
                checked={publicDocument}
              />
            }
            label="Private Document"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleAddClose();
              addThisDocument();
            }}
            color="primary"
          >
            Add as a new document
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function ManageDocuments() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const classes = useStyles();
  const handleManageClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleManageClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      <IconButton aria-label="more" color="primary" onClick={handleManageClick}>
        <MoreVertIcon />
      </IconButton>

      <Menu id="manage-document" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleManageClose}>
        <MenuItem onClick={deleteDocument}> Delete document</MenuItem>
      </Menu>
    </div>
  );
}

//overview (browse through documents, see title, preview and some additional information)
function Documents() {
  const classes = useStyles();
  const [user, setUser] = useState();
  const [openPopUp, setPopUpOpen] = useState(false);
  const [documentTitle, setDocumentTitle] = useState(null);
  const [documentDetails, setDocumentDetails] = useState(null);
  const [documentImage, setDocumentImage] = useState(null);
  const [documentAuthor, setDocumentAuthor] = useState(null);
  const [documentDataFromDatabase, setDocumentDataFromDatabase] = useState([]); //document data fetched from the database

  useEffect(() => {
    api
      .user()
      .then((res) => {
        if (res) setUser(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    api
      .fetchDocuments()
      .then((res) => {
        if (res) {
          setDocumentDataFromDatabase(res.data.rows);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <AppPage location="documents" id="documents-page">
      <Grid className={classes.grid} container justify="center" alignItems="center" direction="column">
        <T variant="h4">Welcome to your Document Dashboard, {user ? user.name : "..."} !</T>
      </Grid>

      <AddNewDocument />

      <GridList cellHeight={200} cols={3} container justify="center" alignItems="center" className={classes.gridList}>
        <GridListTile key="Subheader" cols={3} style={{ height: "auto" }}>
          {/*<ListSubheader component="div">Documents</ListSubheader> */}
        </GridListTile>

        {documentDataFromDatabase.map((tile) => (
          <GridListTile key={tile.document_id} cols={1}>
            <img src={munich} alt={tile.title} />
            <GridListTileBar
              title={tile.title}
              subtitle={<span>Description: {tile.description}</span>}
              onClick={() => {
                setPopUpOpen(true);
                setDocumentTitle(tile.title);
                setDocumentAuthor(tile.author);
                setDocumentDetails(tile.description);
                setDocumentImage(munich);
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
        onClose={() => {
          setPopUpOpen(false);
        }}
        onView={ViewDocument}
        documentTitle={documentTitle}
        documentAuthor={documentAuthor}
        documentDetails={documentDetails}
        documentImage={documentImage}
      />
    </AppPage>
  );
}
export default Documents;
