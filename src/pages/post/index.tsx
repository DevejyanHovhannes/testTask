import { FC, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import styles from "./styles.module.scss";
import { DataContext, beData } from "../../context";
import React from "react";
import Button from "@mui/material/Button";
import Comments from "../../components/Comments";

export interface IComments {
  by: string;
  id: number;
  kids: number[];
  parent: number;
  text: string;
  time: number;
  type: string;
}

const Page: FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [comments, setComments] = useState<IComments[]>();
  const data = useContext(DataContext)?.data?.find(
    (item) => item.id === parseInt(id || "-1"),
  );
  const [storyData, setStoryData] = useState<beData | undefined>(data);
  const date = new Date(
    (storyData ? storyData.time : 0) * 1000,
  ).toLocaleString();

  const getData = () => {
    fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        setStoryData({ ...res });
        console.log("reload", data);
      });
  };

  const getComments = (kids: number[]) => {
    if (kids)
      Promise.all(
        kids.map((kidId) => {
          return fetch(
            `https://hacker-news.firebaseio.com/v0/item/${kidId}.json?print=pretty`,
          )
            .then((kidRes) => {
              return kidRes.json();
            })
            .then((kidRes) => {
              return Promise.resolve(kidRes);
            });
        }),
      ).then((kidsRes) => {
        setComments([...kidsRes]);
      });
  };

  useEffect(() => {
    if (data === undefined) getData();
    else if (storyData?.kids) getComments(storyData?.kids);
    // eslint-disable-next-line
  }, [data]);

  return (
    <div className={styles.container}>
      <div className={styles.backBtn}>
        <Button
          variant="outlined"
          onClick={() => {
            navigate("/");
          }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            getData();
          }}
        >
          Reload
        </Button>
      </div>

      <div className={styles.cardHeader}>
        <h1>Title {storyData?.title}</h1>
        <h3>{date}</h3>
      </div>
      <div className={styles.authorContainer}>
        <div className={styles.author}>
          <h5>Author </h5>
          {storyData?.by}
        </div>
        <a href={storyData?.url}>Story Link</a>
      </div>
      <div className={styles.urlContainer}></div>
      <div className={styles.commentCount}>
        <h5>Comments {storyData?.descendants}</h5>
      </div>
      <div className={styles.commentsCountainer}>
        {comments && <Comments comments={comments} />}
      </div>
    </div>
  );
};

export default React.memo(Page);
