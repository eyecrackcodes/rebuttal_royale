'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { UserMenu } from './UserMenu';
import { 
  Home, 
  GraduationCap, 
  Trophy, 
  Settings, 
  Menu, 
  X,
  Brain
} from 'lucide-react';

const navItems = [
  {
    path: '/',
    name: 'Home',
    icon: <Home className="w-5 h-5" />,
  },
  {
    path: '/training',
    name: 'Training',
    icon: <GraduationCap className="w-5 h-5" />,
  },
  {
    path: '/rebuttal-royale',
    name: 'Rebuttal Royale',
    icon: <Brain className="w-5 h-5" />,
  },
  {
    path: '/leaderboard',
    name: 'Leaderboard',
    icon: <Trophy className="w-5 h-5" />,
  },
  {
    path: '/settings',
    name: 'Settings',
    icon: <Settings className="w-5 h-5" />,
  },
];

export function MainNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 w-full bg-blue-950/95 backdrop-blur-sm border-b border-blue-800 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Brain className="w-8 h-8 text-blue-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
              Rebuttal Royale
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-white'
                      : 'text-blue-300 hover:text-white hover:bg-blue-900/50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {item.icon}
                    <span>{item.name}</span>
                  </div>
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"
                      layoutId="navbar-indicator"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center">
            <UserMenu />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-blue-300 hover:text-white hover:bg-blue-900/50"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-blue-950/95 backdrop-blur-sm">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? 'text-white bg-blue-900/50'
                      : 'text-blue-300 hover:text-white hover:bg-blue-900/50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    {item.icon}
                    <span>{item.name}</span>
                  </div>
                </Link>
              );
            })}
            <div className="pt-4 pb-3 border-t border-blue-800">
              <div className="px-3">
                <UserMenu />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
} 