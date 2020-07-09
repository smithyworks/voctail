import React, { useState, useEffect, useRef } from "react";
import OkDialog from "./OkDialog";
import { makeStyles, TextField, Typography, Chip, Grid } from "@material-ui/core";
import { api } from "../../utils";
import { toasts } from "./AppPage/AppPage";
import { Check } from "@material-ui/icons";

const useStyles = makeStyles({
  container: {
    minHeight: "0",
    minWidth: "500px",
  },
  searchResults: {
    height: "150px",
    overflowY: "auto",
  },
  resultsPlaceHolder: {
    margin: "20px 0",
    color: "grey",
  },
  name: {
    color: "grey",
  },
});

function StudentItem({ email, name, selected, onClick }) {
  const classes = useStyles();

  return (
    <Grid container onClick={onClick}>
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
  }
  function removeStudent(id) {
    selectedIDs.delete(id);
    setSelectedIDs(new Set(selectedIDs));
  }

  const [searchTerm, setSearchTerm] = useState();
  const [userItems, setUserItems] = useState();
  useEffect(() => {
    if (!users || !searchTerm || searchTerm.trim() === "") {
      setUserItems(null);
      return;
    }

    const matchParam = RegExp(searchTerm);
    const filteredUsers = users.filter((u) => u.email.match(matchParam));

    const items = filteredUsers.map((u, i) => {
      return (
        <StudentItem {...u} onClick={() => selectStudent(u.user_id)} selected={selectedIDs.has(u.user_id)} key={i} />
      );
    });

    setUserItems(items);
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
    if (typeof onInvite === "function") onInvite([...selectedIDs]);
  }

  return (
    <>
      <OkDialog title="Invite students!" open={!!open} onClose={onClose} onOk={_invite}>
        <Grid className={classes.container}>
          <Typography>Search for Students</Typography>
          <div ref={inputRef}>
            <TextField
              variant="outlined"
              placeholder="email@example.com"
              margin="dense"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className={classes.searchResults}>
            {userItems || (
              <Typography align="center" className={classes.resultsPlaceHolder}>
                No Matching Users
              </Typography>
            )}
          </div>

          <Typography>Students</Typography>
          {studentChips}
        </Grid>
      </OkDialog>
    </>
  );
}

export default InviteStudentsDialog;
