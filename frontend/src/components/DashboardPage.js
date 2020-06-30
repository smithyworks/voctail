import React, { useState, useEffect, useRef } from "react";
import {
  Grid,
  Typography as T,
  GridList,
  GridListTile,
  GridListTileBar,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  FormControlLabel,
  DialogContentText,
  TextField,
  Checkbox,
  Menu,
  MenuItem,
  Snackbar,
  ListSubheader,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

//icons
import LocalBarIcon from "@material-ui/icons/LocalBar";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AddIcon from "@material-ui/icons/Add";
import DescriptionIcon from "@material-ui/icons/Description";
import ImageIcon from "@material-ui/icons/Image";

import AppPage from "./common/AppPage";

import { api } from "../utils";

import { deleteDocument, document } from "../utils/api";

//example tile images
import munich from "../images/munich.jpg";

import MuiAlert from "@material-ui/lab/Alert";

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
}) {
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
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onClose} color="primary">
          Delete document
        </Button>
        <Button component={Link} to={"/document/" + documentId} color="primary">
          View document
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function AddNewDocument() {
  const titleInput = useRef("");
  const descriptionInput = useRef("");
  const authorInput = useRef("");
  const contentInput = useRef();
  //const imageInput = useRef(); todo use image
  const [open, setOpen] = useState(false);
  const [publicDocument, setPublicDocument] = useState(true);
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

  const handleUpload = () => {
    handleAddClose();
    UploadAlert();

    //todo
    {
      /*  const [successfull, setSuccessfull] =useState(false);

      const [open, setOpen] = useState(true);
      const handleClose = () => {
        setOpen(false);
      };
      const [alertText, setAlert] = useState("");
      const [state, setState] = useState("");
      const handleSuccess = () =>{
        if (successfull) {
          setAlert("The document was added to your dashboard!");
          setState("success");
        }
        else {
          setAlert("The upload was not successfull. Please try again.");
          setState("error");
        }
      }*/
    }
  };

  return (
    <div>
      <Button varian="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddOpen}>
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
          *<input accept="text/*" className={classes.input} id="upload-text" multiple type="file" />
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
          <DialogContentText>
            Your document is public and available for all users. If you want to keep your document private please
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              addThisDocument();
              handleUpload();
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

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function UploadAlert() {
  const classes = useStyles();
  const [open, setOpen] = useState(true);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return {
    //todo     <div className={classes.alert}>
    //       <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
    //         <Alert onClose={handleClose} severity="error">
    //           The Upload failed!
    //         </Alert>
    //       </Snackbar>
    //     </div>
  };
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
function Dashboard() {
  const classes = useStyles();
  const [user, setUser] = useState();
  const [openPopUp, setPopUpOpen] = useState(false);
  const [documentId, setDocumentId] = useState(null);
  const [documentTitle, setDocumentTitle] = useState(null);
  const [documentDetails, setDocumentDetails] = useState(null);
  const [documentImage, setDocumentImage] = useState(null);
  const [documentAuthor, setDocumentAuthor] = useState(null);
  const [documentDataFromDatabase, setDocumentDataFromDatabase] = useState([]); //document data fetched from the database
  const categories = ["newspaper-article", "fairy-tale", "short-story"];
  const [documentDataFromDatabaseSortedInCategory, setDocumentDataFromDatabaseSortedInCategory] = useState(() => {
    return [[], []];
  }); // document data sorted in categories
  // todo add more categories

  console.log("length", documentDataFromDatabase.length);
  console.log("documentData", documentDataFromDatabase);
  //console.log("categories", documentDataFromDatabaseSortedInCategory);
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

  function addToCategory(category, document) {
    setDocumentDataFromDatabaseSortedInCategory((prevState) => [...prevState, { category: document }]);
  }
  useEffect(() => {
    for (let i = 0; i < documentDataFromDatabase.length; i++) {
      //switch (documentDataFromDatabase[i].category) {
      switch (documentDataFromDatabase[i].document_id) {
        case 0:
          addToCategory(0, documentDataFromDatabase[i]);
          break;
        /*case 1:
          addToCategory(1, documentDataFromDatabase[i]);
        case 2:
          addToCategory(2, documentDataFromDatabase[i]); */
        default:
          addToCategory(1, documentDataFromDatabase[i]);
      }
    }
  });

  return (
    <AppPage location="dashboard" id="dashboard-page">
      <Grid className={classes.grid} container justify="center" alignItems="center" direction="column">
        <T variant="h4">Welcome {user ? user.name : "..."}!</T>
        <T variant="h4">Improve your language skills with text documents, videos and more...</T>
      </Grid>
      <AddNewDocument />

      {categories.map((category, index) => (
        <GridList cellHeight={100} cols={3} container justify="center" alignItems="center" className={classes.gridList}>
          <GridListTile key="Subheader" cols={3} style={{ height: "auto" }}>
            <ListSubheader component="div"> {category} </ListSubheader>
          </GridListTile>
        </GridList>
      ))}

      <GridList cellHeight={200} cols={3} container justify="center" alignItems="center" className={classes.gridList}>
        <GridListTile key="Subheader" cols={3} style={{ height: "auto" }}>
          {/*<ListSubheader component="div">Documents</ListSubheader> */}
        </GridListTile>

        {documentDataFromDatabase.map((tile) => (
          <GridListTile key={tile.document_id} cols={1}>
            <img src={munich} alt={tile.title} />
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
        documentId={documentId}
        documentTitle={documentTitle}
        documentAuthor={documentAuthor}
        documentDetails={documentDetails}
        documentImage={documentImage}
      />
    </AppPage>
  );
}
export default Dashboard;
