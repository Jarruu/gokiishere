import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
} from "motion/react";
import { Menu, X, LogOut, LayoutDashboard, PlusCircle, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { useAuth } from "../lib/auth";
import { cn } from "../lib/utils";

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout } = useAuth();
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isLoginPage = location.pathname === "/admin/login";

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const getNavLinks = () => {
    if (isLoginPage) {
      return [{ href: "/", label: "Back to Site", icon: <ArrowLeft size={18} /> }];
    }

    if (isAdminRoute) {
      return [
        { href: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
        { href: "/admin/projects/new", label: "Add Project", icon: <PlusCircle size={18} /> },
        { href: "/", label: "View Site", icon: <ArrowLeft size={18} /> },
      ];
    }

    // Public routes
    return [
      { href: "/", label: "Home", hash: "#home" },
      { href: "/#services", label: "Services", hash: "#services" },
      { href: "/#portfolio", label: "Projects", hash: "#portfolio" },
      { href: "/#faq", label: "FAQ", hash: "#faq" },
    ];
  };

  const navLinks = getNavLinks();

  const isHashActive = (hash?: string) => {
    if (!hash) return false;
    return location.hash === hash || (hash === "#home" && location.pathname === "/" && !location.hash);
  };

  const Brand = () => (
    <Link 
      to={isAdminRoute ? "/" : "/admin/login"} 
      className="text-3xl md:text-4xl font-black tracking-tighter uppercase"
    >
      Goki<span className="text-brand-red">is</span>here
    </Link>
  );

  const NavItem = ({ link, mobile = false }: { link: any, mobile?: boolean }) => {
    const active = link.hash ? isHashActive(link.hash) : location.pathname === link.href;
    
    const baseStyles = mobile 
      ? "text-2xl font-black uppercase tracking-tighter hover:text-brand-red border-b-2 border-black/5 pb-2 flex items-center gap-3"
      : "hover:text-brand-red transition-colors flex items-center gap-2 relative group";

    const content = (
      <>
        {link.icon} {link.label}
        {!mobile && active && !isAdminRoute && (
          <motion.div 
            layoutId="activeNav"
            className="absolute -bottom-1 left-0 right-0 h-1 bg-brand-red"
          />
        )}
      </>
    );

    if (link.href.startsWith("/#") || link.hash) {
      return (
        <Link
          to={link.href}
          onClick={() => mobile && setIsMobileMenuOpen(false)}
          className={cn(baseStyles, active && !isAdminRoute && "text-brand-red")}
        >
          {content}
        </Link>
      );
    }

    return (
      <Link
        to={link.href}
        onClick={() => mobile && setIsMobileMenuOpen(false)}
        className={cn(baseStyles, active && !isAdminRoute && "text-brand-red")}
      >
        {content}
      </Link>
    );
  };

  return (
    <>
      <motion.header
        className="h-[90px] flex justify-between items-center px-6 md:px-8 border-b-2 border-black bg-white fixed top-[4px] md:top-[8px] left-[4px] md:left-[8px] right-[4px] md:right-[8px] z-50"
      >
        <Brand />

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 font-bold text-sm uppercase tracking-widest">
          {navLinks.map((link) => (
            <NavItem key={link.label} link={link} />
          ))}

          {isAdminRoute && !isLoginPage && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-brand-red hover:opacity-80 transition-colors"
            >
              <LogOut size={18} /> Logout
            </button>
          )}

          {!isAdminRoute && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/#contact"
                className="bg-black text-white px-6 py-2 font-black uppercase block"
              >
                Hire Us
              </Link>
            </motion.div>
          )}
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 border-2 border-black bg-white shadow-[2px_2px_0px_0px_var(--color-brand-red)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </motion.header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[94px] md:top-[98px] left-[4px] md:left-[8px] right-[4px] md:right-[8px] bg-white border-2 border-black z-40 p-6 shadow-[8px_8px_0px_0px_var(--color-brand-red)] md:hidden"
          >
            <nav className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <NavItem key={link.label} link={link} mobile />
              ))}

              {!isAdminRoute && (
                <Link
                  to="/#contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-brand-red text-white p-4 font-black uppercase text-center border-2 border-black shadow-[4px_4px_0px_0px_var(--color-brand-red)] block"
                >
                  Hire Us Now
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
