import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Ref from "./pages/Ref";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home";
import ErrorCom from "./Components/ErrorCom";
import Tasks from "./pages/Tasks";
import Boost from "./pages/Boost";
import Stats from "./pages/Stats";
import Flipper from "./pages/Flipper";
// import DeviceCheck from "./Components/DeviceCheck";
import Plutos from "./pages/Plutos";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorCom />,
    children:[
      {
        path:"/",
        element: <Plutos />,
      },
      {
        path:"/ref",
        element: <Ref />,
      },
      {
        path:"/tasks",
        element: <Tasks />,
      },
      {
        path:"/boost",
        element: <Boost />,
      },
      {
        path:"/stats",
        element: <Stats />,
      },
      
    ]

  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(



  // <DeviceCheck>
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
// </DeviceCheck>

);
