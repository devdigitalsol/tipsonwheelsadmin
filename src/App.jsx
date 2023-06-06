import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProtectedRoute from "./pages/ProtectedRoute";
import Layout from "./components/Layout";
import { AppContext } from "./context";
import Test from "./pages/Test";

const App = () => {
  const { user } = useContext(AppContext);
  // console.log(user);
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route index element={<Home />} />
          <Route path="test" element={<Test />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
};

export default App;
