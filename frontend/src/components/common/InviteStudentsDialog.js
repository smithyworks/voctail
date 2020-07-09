import React, { useState, useEffect, useRef } from "react";
import OkDialog from "./OkDialog";
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
    minWidth: "500px",
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
    color: "grey",
  },
  inputContainer: {
    position: "relative",
  },
  menu: {
    position: "absolute",
    left: "0",
    minWidth: "300px",
    top: "50px",
    backgroundColor: "white",
    maxHeight: "200px",
    overflowY: "auto",
  },
  chipsContainer: {
    marginTop: "10px",
    minHeight: "60px",
  },
});

function StudentItem({ email, name, selected, onClick }) {
  const classes = useStyles();

  return (
    <Grid container onClick={onClick} component={MenuItem}>
      <Grid item xs>
        <Typography>{email}</Typography>
      </Grid>
      <Grid item xs>
        <Typography className={classes.name}>{name}</Typography>
      </Grid>
      <Grid item xs={1}>
        <Typography>{selected && <Check />}</Typography>
      </Grid>
    </Grid>
  );
}

function InviteStudentsDialog({ open, onInvite, onClose }) {
  const classes = useStyles();

  const [menuOpen, setMenuOpen] = useState(false);

  const inputRef = useRef();
  const [users, setUsers] = useState();
  useEffect(() => {
    api
      .getAllUsers()
      .then((res) => setUsers(res.data))
      .catch((err) => toasts.toastError("Encountered an error while communicating with the server."));
  }, []);
  console.log(users);

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
          <StudentItem {...u} onClick={() => selectStudent(u.user_id)} selected={selectedIDs.has(u.user_id)} key={i} />
        );
      });

      setUserItems(items);
      setMenuOpen(true);
      searchTermRef.current = searchTerm;
    }
  }, [users, searchTerm, selectedIDs]); // eslint-disable-line

  const [studentChips, setStudentChips] = useState();
  useEffect(() => {
    const chips = [...selectedIDs].map((id) => {
      const u = users.find((u) => u.user_id === id);
      return <Chip variant="outlined" onDelete={() => removeStudent(id)} label={`${u.email} ${u.name}`} />;
    });

    setStudentChips(chips);
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
      <OkDialog title="Invite students!" open={!!open} onClose={_onClose} onOk={_invite} noScroll>
        <Grid className={classes.container}>
          <Typography>Search for Students</Typography>
          <div className={classes.inputContainer}>
            <TextField
              variant="outlined"
              placeholder="email@example.com"
              margin="dense"
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {!!userItems && menuOpen && (
              <ClickAwayListener onClickAway={() => setMenuOpen(false)}>
                <Paper className={classes.menu}>
                  <MenuList>{userItems}</MenuList>
                </Paper>
              </ClickAwayListener>
            )}
          </div>

          <div className={classes.chipsContainer}>
            <Typography>Selected Students</Typography>
            {studentChips}
          </div>
        </Grid>
      </OkDialog>
    </>
  );
}

export default InviteStudentsDialog;
