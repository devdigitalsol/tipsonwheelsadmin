import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Verifier from "./pages/Verifier";
import ProtectedRoute from "./pages/ProtectedRoute";
import Layout from "./components/Layout";
import { AppContext } from "./context";
import Master from "./pages/Master";
import Unauthorized from "./pages/Unauthorized";
import Home from "./pages/Home";
import AddTM from "./pages/AddTM";
import BulkDownload from "./pages/BulkDownload";

const App = () => {
  const { user } = useContext(AppContext);
  // console.log(user);
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="login" element={<Login />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route
          element={<ProtectedRoute alloweRoles={["master", "verifier"]} />}
        >
          <Route index element={<Home />} />
        </Route>
        <Route element={<ProtectedRoute alloweRoles={["master"]} />}>
          <Route path="master" element={<Master />} />
          <Route path="add-tm" element={<AddTM />} />
          <Route path="bulk-download" element={<BulkDownload />} />
        </Route>
        <Route element={<ProtectedRoute alloweRoles={["verifier"]} />}>
          <Route path="verify-doctors" element={<Verifier />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
};

export default App;
