import { FC, useState } from "react";
import { IComments } from "../../pages/post";
import SouthEastIcon from "@mui/icons-material/SouthEast";

import styles from "./styles.module.scss";

interface IProps {
  comments: IComments[];
}

const Comments: FC<IProps> = ({ comments = undefined }) => {
  const [childComments, setChildComments] = useState<IComments[]>();

  console.log(
    "------------------------------------------------------",
    comments,
  );

  const onClick = (comment: IComments) => {
    if (comment?.kids) {
      Promise.all(
        comment.kids.map((kidId) => {
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
        console.log(kidsRes);
        setChildComments(kidsRes);
      });
    }
  };

  return (
    <>
      {comments &&
        comments.map((comment) => {
          return (
            <div className={styles.commentWrapper}>
              <div className={styles.comment}>
                {comment.kids ? (
                  <SouthEastIcon
                    className={styles.arrowBtn}
                    color={"info"}
                    fontSize={"small"}
                    onClick={() => onClick(comment)}
                  />
                ) : null}
                <div className={styles.commentCard}>
                  <div className={styles.author}>Author {comment.by}</div>
                  <div className={styles.text}>{comment.text}</div>
                </div>
                <div className={styles.date}>
                  {new Date(comment.time * 1000).toLocaleDateString()}
                </div>
              </div>
              {childComments && childComments[0].parent === comment.id && (
                <Comments comments={childComments} />
              )}
            </div>
          );
        })}
    </>
  );
};

export default Comments;
