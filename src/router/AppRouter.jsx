import { Routes, Route } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";

import Home from "../pages/Home/Home";
import Category from "../pages/Category/Category";
import ThreadPage from "../pages/Thread/ThreadPage";
import CreateThread from "../pages/CreateThread/CreateThread";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Profile from "../pages/Profile/Profile";
import NotFound from "../pages/NotFound/NotFound";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="category/:id" element={<Category />} />
        <Route path="thread/:id" element={<ThreadPage />} />
        <Route path="create-thread" element={<CreateThread />} />
        <Route path="profile/:id" element={<Profile />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
