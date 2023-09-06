import React, { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./pages/ProtectedRoute";
import Layout from "./components/Layout";
const Login = lazy(() => import("./pages/Login"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));
const Home = lazy(() => import("./pages/Home"));
const AddTM = lazy(() => import("./pages/AddTM"));

const App = () => {
  return (
    <Suspense fallback={<div>Please wait, loading ...</div>}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="login" element={<Login />} />
          <Route path="unauthorized" element={<Unauthorized />} />
          <Route
            element={
              <ProtectedRoute
                alloweRoles={["master", "verifier", "admin", "scientimed"]}
              />
            }
          >
            <Route index element={<Home />} />
          </Route>
          <Route element={<ProtectedRoute alloweRoles={["admin"]} />}>
            <Route path="add-tm" element={<AddTM />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;
