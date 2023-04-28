import React from "react";

export interface beData {
  id: number;
  by: number;
  score: number;
  time: number;
  title: string;
  descendants: number;
  url: string;
  kids?: number[];
}

const DataContext = React.createContext<
  | {
      data: beData[] | undefined;

      setIds: React.Dispatch<React.SetStateAction<number[]>>;
    }
  | undefined
>(undefined);

export { DataContext };
