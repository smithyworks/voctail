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

function MemberItem({ email, name, selected, onClick }) {
  const classes = useStyles();

  return (
    <Grid container onClick={onClick} component={MenuItem}>
      <Grid item xs>
        <Typography variant="body2">{email}</Typography>
      </Grid>
      <Grid item xs>
        <Typography variant="body2" wrap="no-wrap" className={classes.name}>
          {name}
        </Typography>
      </Grid>
      <Grid item xs={1}>
        <Typography variant="body2">{selected && <Check />}</Typography>
      </Grid>
    </Grid>
  );
}

function InviteMembersDialog({ open, onInvite, onClose, title }) {
  const classes = useStyles();

  const [menuOpen, setMenuOpen] = useState(false);
  const [focused, setFocused] = useState(false);

  const [users, setUsers] = useState();
  useEffect(() => {
    api
      .getAllUsers()
      .then((res) => setUsers(res.data))
      .catch((err) => toasts.toastError("Encountered an error while communicating with the server."));
  }, []);

  const [selectedIDs, setSelectedIDs] = useState(new Set());
  function selectStudent(id) {
    selectedIDs.add(id);
    setSelectedIDs(new Set(selectedIDs));
    setMenuOpen(false);
  }
  function removeStudent(id) {
    selectedIDs.delete(id);
    setSelectedIDs(new Set(selectedIDs));
  }

  const searchTermRef = useRef();
  const [searchTerm, setSearchTerm] = useState();
  const [userItems, setUserItems] = useState();
  useEffect(() => {
    if (!users || !searchTerm || searchTerm.trim() === "") {
      setUserItems(null);
      return;
    }

    if (searchTerm !== searchTermRef.current) {
      const matchParam = RegExp(searchTerm);
      const filteredUsers = users.filter((u) => u.email.match(matchParam));

      const items = filteredUsers.map((u, i) => {
        return (
          <MemberItem {...u} onClick={() => selectStudent(u.user_id)} selected={selectedIDs.has(u.user_id)} key={i} />
        );
      });

      setUserItems(items);
      setMenuOpen(true);
      searchTermRef.current = searchTerm;
    }
  }, [users, searchTerm, selectedIDs]); // eslint-disable-line

  const [memberChips, setmemberChips] = useState();
  useEffect(() => {
    const chips = [...selectedIDs].map((id, i) => {
      const u = users.find((u) => u.user_id === id);
      return <Chip key={i} variant="outlined" onDelete={() => removeStudent(id)} label={`${u.email} ${u.name}`} />;
    });

    setmemberChips(chips);
  }, [selectedIDs, users]); // eslint-disable-line

  function _invite() {
    setSelectedIDs(new Set());
    if (typeof onInvite === "function") onInvite([...selectedIDs]);
  }

  function _onClose() {
    setSelectedIDs(new Set());
    if (typeof onClose === "function") onClose();
  }

  return (
    <>
      <CreationDialog
        title={title}
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
              placeholder="email@example.com"
              margin="dense"
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />

            {!!userItems && (menuOpen || focused) && (
              <ClickAwayListener onClickAway={() => setMenuOpen(false)}>
                <Paper className={classes.menu}>
                  <MenuList>{userItems}</MenuList>
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

export default InviteMembersDialog;
