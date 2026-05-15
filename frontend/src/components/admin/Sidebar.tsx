import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  PlusCircle, 
  ArrowLeft, 
  LogOut,
  FolderKanban,
  Settings,
  User,
  Menu,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { useAuth } from "../../lib/auth";

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const adminUser = user || 'Admin';

  // Close sidebar when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
  };

  const navLinks = [
    { href: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { href: "/admin/projects/new", label: "Add Project", icon: <PlusCircle size={20} /> },
    { href: "/admin/portfolio", label: "View Portfolio", icon: <FolderKanban size={20} /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 right-4 z-[100] w-12 h-12 bg-brand-yellow border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_var(--color-brand-red)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 z-[70] md:hidden backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-brand-yellow border-r-4 border-black z-[80] flex flex-col md:hidden"
            >
              <SidebarContent adminUser={adminUser} navLinks={navLinks} isActive={isActive} handleLogout={handleLogout} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-[280px] bg-brand-yellow border-r-4 border-black h-screen sticky top-0 left-0 flex-col z-50 overflow-hidden">
        <div className="flex flex-col h-full">
          <SidebarContent adminUser={adminUser} navLinks={navLinks} isActive={isActive} handleLogout={handleLogout} />
        </div>
      </aside>
    </>
  );
};

interface SidebarContentProps {
  adminUser: string;
  navLinks: any[];
  isActive: (path: string) => boolean;
  handleLogout: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ adminUser, navLinks, isActive, handleLogout }) => (
  <>
    {/* Brand/Logo */}
    <div className="p-8 border-b-4 border-black shrink-0">
      <Link to="/" className="text-2xl font-black uppercase tracking-tighter">
        Goki<span className="text-brand-red">is</span>here
        <div className="text-[10px] bg-brand-yellow inline-block px-1 ml-1 border border-black">ADMIN</div>
      </Link>
    </div>

    {/* Navigation */}
    <nav className="flex-1 p-6 space-y-2 overflow-y-auto custom-scrollbar">
      <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4">Main Menu</p>
      {navLinks.map((link) => (
        <Link
          key={link.label}
          to={link.href}
          className={`flex items-center gap-3 p-4 font-bold uppercase text-sm border-2 transition-all ${
            isActive(link.href)
              ? "bg-black text-white border-black translate-x-[4px] -translate-y-[4px] shadow-[-4px_4px_0px_0px_var(--color-brand-red)]"
              : "border-transparent hover:border-black hover:bg-brand-red/5"
          }`}
        >
          {link.icon}
          {link.label}
        </Link>
      ))}
    </nav>

    {/* User & Logout */}
    <div className="p-6 border-t-4 border-black bg-brand-red/5 shrink-0">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 border-2 border-black bg-brand-yellow flex items-center justify-center">
          <User size={20} />
        </div>
        <div className="overflow-hidden">
          <p className="text-xs font-black uppercase truncate">{adminUser}</p>
          <p className="text-[10px] font-bold opacity-50 uppercase">Superuser</p>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 p-3 border-2 border-black bg-brand-yellow font-black uppercase text-xs hover:bg-brand-red hover:text-brand-yellow transition-all shadow-[4px_4px_0px_0px_var(--color-brand-red)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
      >
        <LogOut size={16} /> Logout
      </button>
    </div>
  </>
);

