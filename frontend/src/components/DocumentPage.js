import React, { useContext } from "react";
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
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import LocalBarIcon from "@material-ui/icons/LocalBar";
import LocalBarIconOutlined from "@material-ui/icons/LocalBarOutlined";
import DescriptionIcon from '@material-ui/icons/Description';
import ImageIcon from '@material-ui/icons/Image';


import AppPage from "./common/AppPage";
import { UserContext } from "../App.js";
import { Link } from "react-router-dom";
import {api} from "../utils";

//example tile images
import exampleImage from "../images/exampleimage.png";
import munich from "../images/munich.jpg";

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
function DocumentOverviewPopUp({open, onClose, onView, documentTitle, documentDetails, documentAuthor, documentImage}) {

  return (
        <Dialog onClose={onClose} aria-labelledby="document-overview-popup" open={open}>
          <DialogTitle id="document-overview-popup" onClose={onClose}>
            {documentTitle}
          </DialogTitle>
          <img src={documentImage} alt={documentImage} width="100%" height="40%" />
          <DialogContent dividers>
            <T gutterBottom>
              Description: {documentDetails}
            </T>
            <T gutterBottom>
              Author: {documentAuthor}
            </T>
          </DialogContent>
          <DialogActions>
            //todo onclick go to document
            <Button onClick={onClose} color="primary">
              Cancel
            </Button>
            <Button onClick={onView} color="primary" >
              View document
            </Button>
          </DialogActions>
        </Dialog>
  );
}

//get link to view the document after you clicked on "view" in the popup
function ViewDocument () {
  //todo

}

function AddNewDocument() {
  const [open, setOpen]=React.useState(false);
  const [documentPrivate, setDocumentPrivate]=React.useState(false);
  const classes = useStyles();
  const handleAddOpen = () => {
    setOpen(true);
  }
  const handleAddClose = () => {
    setOpen(false);
  }

  const handleStatusChange = () => {
    if (documentPrivate)
      setDocumentPrivate(false);
    else
      setDocumentPrivate(true);
  }

  return (
      <div>
        <Button
            varian ="contained"
            color="primary"
            startIcon={<LocalBarIcon/>}
            onClick={handleAddOpen}
        >
          Add a new document
        </Button>

        <Dialog open={open} onClose={handleAddClose} aria-labelledby="add-new-document">
          <DialogTitle id="add-new-document">Add a document</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To add a new text document please fill in the additional data.
            </DialogContentText>
            <TextField
                autoFocus
                margin="dense"
                id="title"
                label="Title"
                type="title"
                fullWidth
            />
            <TextField
                autoFocus
                margin="dense"
                id="author"
                label="Author"
                type="author"
                fullWidth
            />
            <TextField
                autoFocus
                margin="dense"
                id="description"
                label="Description"
                type="description"
                fullWidth
            />
            <DialogContentText>
              Please upload your text document.
            </DialogContentText>
            <input accept="text/*" className={classes.input} id="upload-text" multiple type="file"/>
            <label htmlFor="upload-text">
              <Button variant="contained" color="primary" component="span" startIcon={<DescriptionIcon/>}>Upload</Button>
            </label>
            <DialogContentText>
              You can upload a preview image for your text document or choose one from our example pictures.
            </DialogContentText>
            <input accept="image/*" className={classes.input} id="upload-preview-image" multiple type="file"/>
            <label htmlFor="upload-preview-image">
              <Button variant="contained" color="primary" component="span" startIcon={<ImageIcon/>}>Upload</Button>
            </label>
            <DialogContentText>
              Your document is public and available for all users.
              If you want to keep your document private please activate the document status.
            </DialogContentText>
            <FormControlLabel
                control={<Switch checked={documentPrivate} onChange={handleStatusChange} />}
                label="Private Document"
            />
            <FormControlLabel
                control={<Checkbox icon={<LocalBarIconOutlined />} checkedIcon={<LocalBarIcon />} name="checkedH" onChange={handleStatusChange} checked={documentPrivate}/>}
                label="Private Document"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleAddClose} color="primary">
              Add as a new document
            </Button>
          </DialogActions>
        </Dialog>

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

//example data
  const documentData = [
    {
      img: exampleImage,
      title: "ExampleImage",
      description: "this is an example for another preview",
      author: "Clara",
    },
    {
      img: munich,
      title: "Munich",
      description: "Explanation text about the capital of bavaria",
      author: "wikipedia",
    },
    {
      img: munich,
      title: "Munich1",
      description: "Explanation text about the capital of bavaria",
      author: "wikipedia",
    },
    {
      img: munich,
      title: "Munich2",
      description: "Explanation text about the capital of bavaria",
      author: "wikipedia",
    },
    {
      img: munich,
      title: "Munich3",
      description: "Explanation text about the capital of bavaria",
      author: "wikipedia",
    },
    {
      img: munich,
      title: "Munich4",
      description: "Explanation text about the capital of bavaria",
      author: "wikipedia",
    },
    {
      img: munich,
      title: "Munich5",
      description: "Explanation text about the capital of bavaria",
      author: "wikipedia",
    },
    {
      img: munich,
      title: "Munich6",
      description: "Explanation text about the capital of bavaria",
      author: "wikipedia",
    },
    {
      img: munich,
      title: "Munich7",
      description: "Explanation text about the capital of bavaria",
      author: "wikipedia",
    },
  ];

  //todo integrate flexible link to individual documents instead of const document markup
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
        <T variant="h4">Welcome to your Document Dashboard, {user ? user.name : "..."}!</T>
      </Grid>

      <GridList cellHeight={200} cols={3} container justify="center" alignItems="center" className={classes.gridList}>
        <GridListTile key="Subheader" cols={3} style={{ height: "auto" }}>
          <ListSubheader component="div">Documents</ListSubheader>

          <AddNewDocument/>
        </GridListTile>

        {documentData.map((tile) => (
            <GridListTile key={tile.img} cols={1}>
              <img src={tile.img} alt={tile.title} />
              <GridListTileBar
                  title={tile.title}
                  subtitle={<span>Description: {tile.description}</span>}
                  onClick={() => {
                    setPopUpOpen(true);
                    setDocumentTitle(tile.title);
                    setDocumentAuthor(tile.author);
                    setDocumentDetails(tile.description);
                    setDocumentImage(tile.img);
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
