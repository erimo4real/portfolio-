import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { navItem } from '../../lib/animations.js';

const Navbar = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const [menuOpen, setMenuOpen] = useState(false);

  if (isAdmin) return null;

  const navLinks = [
    { name: 'Projects', path: '/projects' },
    { name: 'Blog', path: '/blog' },
    { name: 'Skills', path: '/skills' },
    { name: 'Resume', path: '/resume' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <motion.div custom={0} variants={navItem} initial="hidden" animate="visible" className="flex items-center">
            <Link to="/" className="flex-shrink-0 font-bold text-xl text-blue-600 group relative">
              DevPortfolio
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full" />
            </Link>
          </motion.div>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center space-x-8">
            {navLinks.map((link, i) => (
              <motion.div key={link.path} custom={i} variants={navItem} initial="hidden" animate="visible" className="relative">
                <Link
                  to={link.path}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'text-gray-900'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-px left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
            <motion.div custom={navLinks.length} variants={navItem} initial="hidden" animate="visible">
              <Link
                to="/admin/login"
                className="text-gray-500 hover:text-gray-700 text-sm font-medium"
              >
                Admin
              </Link>
            </motion.div>
          </div>

          {/* Mobile hamburger */}
          <div className="sm:hidden flex items-center gap-3">
            <Link to="/admin/login" className="text-gray-500 hover:text-gray-700 text-sm font-medium">
              Admin
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <motion.svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                animate={menuOpen ? 'open' : 'closed'}
                variants={{
                  closed: { rotate: 0 },
                  open: { rotate: 180 }
                }}
                transition={{ duration: 0.25 }}
              >
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </motion.svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="sm:hidden border-t border-gray-100 bg-white shadow-lg overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ x: -24, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.06 * i, duration: 0.3 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className={`${
                      isActive(link.path)
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:bg-gray-50'
                    } block px-4 py-3 rounded-xl text-base font-medium transition-colors`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;