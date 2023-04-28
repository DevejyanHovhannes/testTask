import React, { useEffect, useState } from "react";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./pages/routes";

import { DataContext, beData } from "./context/index";

function App() {
  const [ids, setIds] = useState<number[]>([]);
  const [data, setData] = useState<beData[]>();

  useEffect(() => {
    if (ids.length === 0) {
      fetch(
        "https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty",
      )
        .then((res) => {
          return res.json();
        })
        .then((ids: number[]) => {
          setIds(ids.splice(0, 100));
        });
    } else {
      Promise.all(
        ids.map((id) => {
          return fetch(
            `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`,
          )
            .then((res) => {
              return res.json();
            })
            .then((res) => {
              return Promise.resolve(res);
            });
        }),
      ).then((res: beData[]) => {
        console.log(
          res.sort((a, b) => {
            return b.time - a.time;
          }),
        );
        setData(res);
      });
    }
  }, [ids]);

  return (
    <DataContext.Provider value={{ data, setIds }}>
      <RouterProvider router={router} />
    </DataContext.Provider>
  );
}

export default App;
