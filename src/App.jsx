import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import DashboardPage from "@/components/pages/DashboardPage";
import React from "react";
import Layout from "@/components/organisms/Layout";
import UsersPage from "@/components/pages/UsersPage";
import AppsPage from "@/components/pages/AppsPage";
import AILogsPage from "@/components/pages/AILogsPage";

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="apps" element={<AppsPage />} />
            <Route path="logs" element={<AILogsPage />} />
          </Route>
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="z-[9999]"
/>
      </div>
    </BrowserRouter>
  );
};

export default App;