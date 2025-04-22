import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import "./App.css";
import { HomePage } from "./pages/Home/HomePage";
import { LoginPage } from "./pages/Login/LoginPage";
import { SignupPage } from "./pages/Signup/SignupPage";
import { PlayGamePage } from "./pages/PlayGamePage/PlayGamePage";
import { GameSetupPage } from "./pages/GameSetupPage/GameSetupPage";
import Layout from "../src/components/Header/Layout";

// Root layout component that uses your Layout wrapper
const Root = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

// Updated router configuration with nested routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignupPage />,
      },
      {
        path: "/playgame",
        element: <PlayGamePage />,
      },
      {
        path: "/setupgame",
        element: <GameSetupPage />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
