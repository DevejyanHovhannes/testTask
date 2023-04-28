import { createBrowserRouter } from "react-router-dom";
import Posts from "./posts";
import Post from "./post";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Posts />,
  },
  {
    path: "/:id",
    element: <Post />,
  },
]);
