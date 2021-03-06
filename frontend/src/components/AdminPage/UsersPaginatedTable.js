import React, { useState, useEffect } from "react";
import { Table, TableHead, TableBody, TableRow, TableContainer, CircularProgress, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Pagination } from "@material-ui/lab";

import UserRow from "./UserRow.js";

const PAGE_LENGTH = 20;

const useStyles = makeStyles({
  pagination: {
    display: "flex",
    justifyContent: "center",
    margin: "15px 0",
  },
});

function UsersPaginatedTable({ users, onMasquerade, onRevoke, onDelete, searchString, onSortPremium }) {
  const classes = useStyles();

  const listLength = users?.length ?? 0;
  const pageCount = listLength > PAGE_LENGTH ? Math.ceil(listLength / PAGE_LENGTH) : 1;

  const [page, setPage] = useState(1);
  const start = (page - 1) * PAGE_LENGTH < listLength ? (page - 1) * PAGE_LENGTH : listLength;
  const end = listLength < start + PAGE_LENGTH ? listLength : start + PAGE_LENGTH;

  const [userRows, setUserRows] = useState();
  useEffect(() => {
    const pattern = searchString ? new RegExp(searchString, "i") : null;
    const rows = [];
    for (let i = start; i < end; i++) {
      const u = users[i];
      rows.push(
        u ? (
          <UserRow
            key={u.user_id}
            {...u}
            onMasquerade={onMasquerade}
            onRevoke={onRevoke}
            onDelete={onDelete}
            searchPattern={pattern}
          />
        ) : (
          <TableRow />
        )
      );
    }
    setUserRows(rows);
    setPage(1);
  }, [users]); // eslint-disable-line

  if (!userRows)
    return (
      <Grid container style={{ height: 600 }} justify="center" alignItems="center">
        <CircularProgress />
      </Grid>
    );

  return (
    <TableContainer>
      <Pagination
        page={page < pageCount ? page : 1}
        count={pageCount}
        siblingCount={5}
        shape="rounded"
        variant="outlined"
        showFirstButton
        showLastButton
        onChange={(_, p) => setPage(p)}
        className={classes.pagination}
      />
      <Table size="small">
        <TableHead>
          <UserRow header onSortPremium={onSortPremium} />
        </TableHead>
        <TableBody>{userRows}</TableBody>
      </Table>
      <Pagination
        page={page < pageCount ? page : 1}
        count={pageCount}
        siblingCount={5}
        shape="rounded"
        variant="outlined"
        showFirstButton
        showLastButton
        onChange={(_, p) => setPage(p)}
        className={classes.pagination}
      />
    </TableContainer>
  );
}

export default UsersPaginatedTable;
