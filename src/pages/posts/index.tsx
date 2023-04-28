import { FC, useContext, useEffect, useState } from "react";

import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import ReplayIcon from "@mui/icons-material/Replay";

import styles from "./styles.module.scss";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../../context";
import { CircularProgress } from "@mui/material";

const Posts: FC = () => {
  const navigate = useNavigate();
  const data = useContext(DataContext);
  const [refInt, setRefInt] = useState<number | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined = undefined;

    if (data?.data)
      interval = setInterval(() => {
        setRefInt((prev) => {
          if (prev === null) return 1;
          else return prev + 1;
        });
      }, 1000);

    return () => clearInterval(interval);
  }, [data?.data]);

  useEffect(() => {
    if (refInt === 60) {
      setRefInt(1);
      data?.setIds([]);
    }
    // eslint-disable-next-line
  }, [refInt]);

  return (
    <div className={styles.pageBackground}>
      <div className={styles.timer}>{refInt}</div>
      <Button
        onClick={() => {
          setRefInt(1);
          data?.setIds([]);
        }}
        className={styles.refreshBtn}
      >
        <ReplayIcon />
      </Button>
      {data?.data ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow className={styles.tableRow}>
                <TableCell>Name</TableCell>
                <TableCell align="right">Rating</TableCell>
                <TableCell align="right">Author</TableCell>
                <TableCell align="right">Date</TableCell>
                <TableCell align="right">Comments</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.data.map(
                (row) =>
                  row && (
                    <TableRow
                      key={row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      onClick={() => {
                        navigate(`/${row.id}`);
                      }}
                      className={styles.row}
                    >
                      <TableCell scope="row">{row.title}</TableCell>
                      <TableCell align="right">{row.score}</TableCell>
                      <TableCell align="right">{row.by}</TableCell>
                      <TableCell align="right">
                        {new Date(row.time * 1000).toLocaleString()}
                      </TableCell>
                      <TableCell align="right">{row.descendants}</TableCell>
                    </TableRow>
                  ),
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div className={styles.loadingWrapper}>
          <CircularProgress />
        </div>
      )}
    </div>
  );
};

export default Posts;
