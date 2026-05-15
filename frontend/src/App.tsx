/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Navbar } from "./sections/Navbar";
import { Sidebar } from "./components/admin/Sidebar";
import { Footer } from "./sections/Footer";
import { Home } from "./pages/Home";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import AdminPortfolio from "./pages/admin/AdminPortfolio";
import ProjectForm from "./pages/admin/ProjectForm";
import { Toaster } from 'sonner';
import ScrollToTop from "./components/ScrollToTop";

import { ProtectedRoute } from "./components/ProtectedRoute";

function LayoutContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isLoginPage = location.pathname === "/admin/login";
  
  // Sidebar only for admin pages EXCEPT login
  const showSidebar = isAdminRoute && !isLoginPage;
  // Navbar only for non-admin pages OR admin login
  const showNavbar = !showSidebar;

  return (
    <div className={`bg-[var(--color-bg-base)] text-[var(--color-text-base)] font-sans flex ${
      showSidebar 
        ? 'h-screen overflow-hidden md:flex-row flex-col' 
        : 'min-h-screen flex-col border-4 md:border-[8px] border-black overflow-x-hidden'
    }`}>
      {showNavbar && <Navbar />}
      {showSidebar && <Sidebar />}

      <div className={`flex-1 flex flex-col ${showSidebar ? 'overflow-y-auto' : ''}`}>
        {showNavbar && <div className="h-[94px] md:h-[98px]" />}
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            
            {/* Public Admin Routes */}
            <Route path="/admin/login" element={<Login />} />
            
            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/portfolio" element={<AdminPortfolio />} />
              <Route path="/admin/projects/new" element={<ProjectForm />} />
              <Route path="/admin/projects/edit/:id" element={<ProjectForm />} />
            </Route>
          </Routes>
        </main>
        {showNavbar && <Footer />}
      </div>
    </div>
  );
}

export default function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Router>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: 'white',
            color: 'black',
            border: '2px solid var(--color-black)',
            borderRadius: '0px',
            boxShadow: '8px 8px 0px 0px var(--color-black)',
            padding: '16px',
            fontFamily: 'inherit',
          },
          actionButtonStyle: {
            background: 'var(--color-brand-red)',
            color: 'white',
            border: '2px solid var(--color-black)',
            borderRadius: '0px',
            fontWeight: '900',
            textTransform: 'uppercase',
            fontSize: '10px',
            padding: '8px 12px',
            boxShadow: '2px 2px 0px 0px var(--color-black)',
          },
          cancelButtonStyle: {
            background: 'white',
            color: 'black',
            border: '2px solid var(--color-black)',
            borderRadius: '0px',
            fontWeight: '900',
            textTransform: 'uppercase',
            fontSize: '10px',
            padding: '8px 12px',
            boxShadow: '2px 2px 0px 0px var(--color-black)',
          },
        }}
      />
      <ScrollToTop />
      <LayoutContent />
    </Router>
  );
}
