import React from "react";
import { Typography, Grid } from "@material-ui/core";
import { DashboardTile } from "../common";

function Chapter({ name, documents, classroom_id, isTeacher, onRemove }) {
  console.log(name, documents, classroom_id);
  return (
    <Grid item xs={12}>
      {name && (
        <Typography style={{ fontWeight: "bold", margin: "15px 0 10px 0", paddingLeft: "10px", fontSize: "1.1em" }}>
          {name}
        </Typography>
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
