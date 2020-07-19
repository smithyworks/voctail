import React, { useRef, useState } from "react";
import { Typography, Grid, IconButton, MenuItem, Menu } from "@material-ui/core";
import { DashboardTile } from "../common";
import MoreVertIcon from "@material-ui/icons/MoreVert";

function Chapter({ name, documents, classroom_id, isTeacher, onRemove, onDelete, onRename, onAdd }) {
  const anchor = useRef();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <Grid item xs={12}>
      {name && (
        <Grid container justify="space-between">
          <Typography style={{ fontWeight: "bold", margin: "15px 0 10px 0", paddingLeft: "10px", fontSize: "1.1em" }}>
            {name}
          </Typography>
          {isTeacher && (
            <>
              <span ref={anchor}>
                <IconButton onClick={() => setMenuOpen(true)}>
                  <MoreVertIcon />
                </IconButton>
              </span>
              <Menu anchorEl={anchor.current} open={menuOpen} onClose={() => setMenuOpen(false)}>
                <MenuItem
                  onClick={() => {
                    setMenuOpen(false);
                    onAdd(name);
                  }}
                >
                  Add Document
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setMenuOpen(false);
                    onRename(name);
                  }}
                >
                  Rename
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(name);
                  }}
                >
                  Delete
                </MenuItem>
              </Menu>
            </>
          )}
        </Grid>
      )}
      <Grid container>
        {documents
          .filter((d) => d.chapter === name && d.document_id)
          .map((d, i) => (
            <DashboardTile
              key={i}
              title={d.title}
              author={d.author}
              category={d.category}
              linkTo={`/classrooms/${classroom_id}/documents/${d.document_id}`}
              inClassroom
              isTeacher={isTeacher}
              onRemove={() => onRemove(d.document_id)}
            />
          ))}
      </Grid>
    </Grid>
  );
}

export default Chapter;
