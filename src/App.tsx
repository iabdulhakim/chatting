import { CssBaseline } from "@mui/material";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Chats from "./pages/Chats";

import Login from "./pages/Login";
import Protected from "./pages/Protected";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Protected>
        <Chats />
      </Protected>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  // {
  //   path: "/chat-room/:id",
  //   element: <ChatRoom />,
  // },
]);

function App() {
  return (
    <>
      <CssBaseline />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
