/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Heart, User as UserIcon, Shield, LayoutDashboard, Compass, Sparkles, Sprout, LogOut, CheckCircle } from "lucide-react";
import { User, UserRole } from "../types";
import DonareLogo from "./DonareLogo";

interface NavigationProps {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  onOpenAuth: () => void;
}

export default function Navigation({
  currentUser,
  activeTab,
  setActiveTab,
  onLogout,
  onOpenAuth,
}: NavigationProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => setActiveTab("landing")} 
            className="flex items-center cursor-pointer group"
            id="nav-logo"
          >
            <DonareLogo />
          </div>

          {/* Desktop Navigation Link Tabs */}
          <nav className="hidden md:flex space-x-1" id="nav-desktop-tabs">
            <button
              id="tab-btn-landing"
              onClick={() => setActiveTab("landing")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "landing"
                  ? "bg-slate-50 text-slate-900"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/50"
              }`}
            >
              Home
            </button>
            <button
              id="tab-btn-marketplace"
              onClick={() => setActiveTab("marketplace")}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "marketplace"
                  ? "bg-slate-50 text-slate-900"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/50"
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Explore Causes</span>
            </button>
            <button
              id="tab-btn-impact"
              onClick={() => setActiveTab("impact")}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "impact"
                  ? "bg-slate-50 text-slate-900"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/50"
              }`}
            >
              <Sprout className="w-4 h-4 text-emerald-500" />
              <span>Transparency Hub</span>
            </button>

            {/* Role-Based Dashboard Tabs */}
            {currentUser && (
              <>
                <button
                  id="tab-btn-dashboard"
                  onClick={() => setActiveTab("dashboard")}
                  className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === "dashboard"
                      ? "bg-emerald-50 text-emerald-700 font-bold"
                      : "text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/30"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>My Dashboard</span>
                </button>
                <button
                  id="tab-btn-profile"
                  onClick={() => setActiveTab("profile")}
                  className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === "profile"
                      ? "bg-emerald-50 text-emerald-700 font-bold"
                      : "text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/30"
                  }`}
                >
                  <UserIcon className="w-4 h-4" />
                  <span>My Profile</span>
                </button>
              </>
            )}
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center space-x-3" id="nav-actions">
            {currentUser ? (
              <div className="flex items-center space-x-3">
                <div className="hidden lg:flex flex-col text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <span className="text-xs font-semibold text-slate-800">{currentUser.name}</span>
                    {currentUser.isVerified && (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 fill-current bg-white rounded-full" />
                    )}
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 capitalize">
                    {currentUser.role}
                  </span>
                </div>
                
                <div 
                  onClick={() => setActiveTab("dashboard")}
                  className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 cursor-pointer hover:border-emerald-500 hover:ring-2 hover:ring-emerald-100 transition-all"
                  title="Go to dashboard"
                >
                  {currentUser.avatar ? (
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.name} 
                      className="w-full h-full rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <UserIcon className="w-5 h-5 text-slate-600" />
                  )}
                </div>

                <button
                  id="btn-logout"
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-150 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                id="btn-login-trigger"
                onClick={onOpenAuth}
                className="flex items-center space-x-1.5 px-4 py-2 border border-slate-250 hover:border-emerald-500 text-slate-700 hover:text-emerald-700 text-sm font-semibold rounded-xl bg-white hover:bg-emerald-50/10 transition-all font-sans cursor-pointer focus:outline-none"
              >
                <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
