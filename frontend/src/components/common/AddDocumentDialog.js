import React, { useState, useEffect, useRef } from "react";
import CreationDialog from "./Dialogs/CreationDialog";
import {
  makeStyles,
  TextField,
  Typography,
  Chip,
  Grid,
  Paper,
  MenuItem,
  MenuList,
  ClickAwayListener,
} from "@material-ui/core";
import { api } from "../../utils";
import { toasts } from "./AppPage/AppPage";
import { Check } from "@material-ui/icons";

const useStyles = makeStyles({
  container: {
    minHeight: "0",
    minWidth: "300px",
    overflow: "visible",
  },
  searchResults: {
    height: "150px",
  },
  resultsPlaceHolder: {
    margin: "20px 0",
    color: "grey",
  },
  name: {
    paddingLeft: "10px",
    color: "grey",
  },
  inputContainer: {
    position: "relative",
  },
  menu: {
    position: "absolute",
    left: "0",
    minWidth: "400px",
    top: "50px",
    backgroundColor: "white",
    maxHeight: "200px",
    overflowY: "auto",
    zIndex: "1000",
  },
  chipsContainer: {
    marginTop: "10px",
    minHeight: "60px",
  },
});

function DocumentItem({ title, author, selected, onClick }) {
  const classes = useStyles();

  return (
    <Grid container onClick={onClick} component={MenuItem}>
      <Grid item xs>
        <Typography variant="body2">{title}</Typography>
      </Grid>
      <Grid item xs>
        <Typography variant="body2" wrap="no-wrap" className={classes.name}>
          {author}
        </Typography>
      </Grid>
      <Grid item xs={1}>
        <Typography variant="body2">{selected && <Check />}</Typography>
      </Grid>
    </Grid>
  );
}

function AddDocumentDialog({ open, onAdd, onClose, title }) {
  const classes = useStyles();

  const [menuOpen, setMenuOpen] = useState(false);
  const [focused, setFocused] = useState(false);

  const [documents, setDocuments] = useState();
  useEffect(() => {
    api
      .fetchDocuments()
      .then((res) => setDocuments(res.data.documents))
      .catch((err) => toasts.toastError("Encountered an error while communicating with the server."));
  }, []);

  const [selectedIDs, setSelectedIDs] = useState(new Set());
  function selectDocument(id) {
    selectedIDs.add(id);
    setSelectedIDs(new Set(selectedIDs));
    setMenuOpen(false);
  }
  function removeDocument(id) {
    selectedIDs.delete(id);
    setSelectedIDs(new Set(selectedIDs));
  }

  const searchTermRef = useRef();
  const [searchTerm, setSearchTerm] = useState();
  const [documentItems, setDocumentItems] = useState();
  useEffect(() => {
    if (!documents || !searchTerm || searchTerm.trim() === "") {
      setDocumentItems(null);
      return;
    }

    if (searchTerm !== searchTermRef.current) {
      const matchParam = RegExp(searchTerm);
      const filteredDocuments = documents.filter((d) => d.title.toLowerCase().match(matchParam));

      const items = filteredDocuments.map((d, i) => {
        return (
          <DocumentItem
            {...d}
            onClick={() => selectDocument(d.document_id)}
            selected={selectedIDs.has(d.document_id)}
            key={i}
          />
        );
      });

      setDocumentItems(items);
      setMenuOpen(true);
      searchTermRef.current = searchTerm;
    }
  }, [documents, searchTerm, selectedIDs]); // eslint-disable-line

  const [memberChips, setmemberChips] = useState();
  useEffect(() => {
    const chips = [...selectedIDs].map((id, i) => {
      const d = documents.find((u) => u.document_id === id);
      return <Chip key={i} variant="outlined" onDelete={() => removeDocument(id)} label={`${d.title} ${d.author}`} />;
    });

    setmemberChips(chips);
  }, [selectedIDs, documents]); // eslint-disable-line

  function _invite() {
    setSelectedIDs(new Set());
    if (typeof onAdd === "function") onAdd([...selectedIDs]);
  }

  function _onClose() {
    setSelectedIDs(new Set());
    if (typeof onClose === "function") onClose();
  }

  return (
    <>
      <CreationDialog
        title="Add Documents"
        validationButtonName="Add"
        open={!!open}
        onClose={_onClose}
        onConfirm={_invite}
        noScroll
        style={{ minWidth: "500px" }}
      >
        <Grid className={classes.container}>
          <div className={classes.inputContainer}>
            <TextField
              variant="outlined"
              placeholder="bohemian..."
              margin="dense"
              onChange={(e) => setSearchTerm(e.target.value.toLocaleLowerCase())}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />

            {!!documentItems && (menuOpen || focused) && (
              <ClickAwayListener onClickAway={() => setMenuOpen(false)}>
                <Paper className={classes.menu}>
                  <MenuList>{documentItems}</MenuList>
                </Paper>
              </ClickAwayListener>
            )}
          </div>

          <div className={classes.chipsContainer}>
            <Typography>Selected</Typography>
            {memberChips}
          </div>
        </Grid>
      </CreationDialog>
    </>
  );
}

export default AddDocumentDialog;
