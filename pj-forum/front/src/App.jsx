import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ThreadPage from './pages/Thread/ThreadPage';
import CreateThread from './pages/CreateThread/CreateThread';
import EditThread from './pages/EditThread/EditThread';
import Category from './pages/Category/Category';
import Settings from './pages/Settings/Settings';
import UserManagement from './pages/UserManagement/UserManagement';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/thread/:id" element={<ThreadPage />} />
              <Route path="/create-thread" element={<CreateThread />} />
              <Route path="/edit-thread/:id" element={<EditThread />} />
              <Route path="/category/:id" element={<Category />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/users" element={<UserManagement />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
