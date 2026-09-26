import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShieldAlert, Camera, LayoutDashboard, History, BarChart3,
  Watch, Sliders, Bell, User, Settings, Info, Menu, X, PlayCircle
} from 'lucide-react';
import { DemoDataTag } from './DemoDataTag';

interface NavbarProps {
  onLaunchDemo?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onLaunchDemo }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/scan', label: 'Scan H₂S', icon: Camera },
    { path: '/history', label: 'History', icon: History },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/wristband', label: 'Wristband', icon: Watch },
    { path: '/calibration', label: 'Calibration', icon: Sliders },
    { path: '/alerts', label: 'Alerts', icon: Bell },
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/settings', label: 'Settings', icon: Settings },
    { path: '/about', label: 'About', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md">
      {/* Top Banner Notice */}
      <div className="bg-slate-950 text-slate-300 px-4 py-1.5 text-xs border-b border-slate-800/80 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-semibold text-slate-200">H2Safe v1.0 Prototype</span>
            <span className="hidden sm:inline text-slate-400">• AI-Powered Passive H₂S Exposure Monitoring</span>
          </div>
          <div className="flex items-center gap-3">
            <DemoDataTag label="Research Demo Mode" />
            {onLaunchDemo && (
              <button
                onClick={onLaunchDemo}
                className="hidden md:flex items-center gap-1 text-xs font-bold text-brand-400 hover:text-brand-300 transition"
              >
                <PlayCircle size={14} />
                <span>Launch Demo Scan</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <ShieldAlert size={22} className="text-emerald-300" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white flex items-center gap-1">
                H2Safe <span className="text-xs px-1.5 py-0.5 rounded-md bg-brand-500/30 text-brand-300 border border-brand-500/40">AI</span>
              </span>
              <span className="block text-[10px] text-slate-400 font-medium tracking-wider uppercase">Passive Sensor Intelligence</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-sm font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon size={15} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            <Link
              to="/scan"
              className="px-4 py-2 bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-500 hover:to-blue-500 text-white text-xs font-extrabold rounded-xl shadow-md flex items-center gap-2 transition active:scale-95 border border-brand-400/30"
            >
              <Camera size={16} />
              <span>Scan Sensor</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                  isActive ? 'bg-brand-600 text-white' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <Icon size={18} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
