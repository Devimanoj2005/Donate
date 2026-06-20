/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { UserRole, User } from "../types";
import { Sparkles, Heart, Shield, Users, Building, AlertCircle, ArrowRight } from "lucide-react";
import DonareLogo from "./DonareLogo";

interface AuthPageProps {
  onLoginSuccess: (user: User) => void;
  onCancel: () => void;
  initialRole?: UserRole;
}

export default function AuthPage({ onLoginSuccess, onCancel, initialRole }: AuthPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.DONOR);
  
  // Fields
  const [email, setEmail] = useState("donor@donare.org");
  const [name, setName] = useState("Dr. Sarah Jenkins");
  const [region, setRegion] = useState("San Francisco, CA");
  const [errorMsg, setErrorMsg] = useState("");

  const handlePreMockFill = (role: UserRole) => {
    setSelectedRole(UserRole.DONOR);
    setEmail("donor@donare.org");
    setName("Dr. Sarah Jenkins");
    setRegion("San Francisco, CA");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg("Please enter email address.");
      return;
    }

    const finalName = name || "Dr. Sarah Jenkins";

    const mockLoggedUser: User = {
      id: "user-donor-1",
      email,
      name: finalName,
      role: UserRole.DONOR,
      isVerified: true, // Auto-verified to streamline initial preview testing
      region,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
      username: "sarah_jenkins_impact",
      bio: "Surgical Specialist dedicated to global pediatric healthcare support and digital education parity. Sponsoring textbook routes and direct medical supplies tracking since 2024."
    };

    onLoginSuccess(mockLoggedUser);
  };

  const rolesConfig = [
    {
      role: UserRole.DONOR,
      title: "Impact Donor",
      icon: Heart,
      desc: "Provide books, clothes, dry staples, or monetary campaigns, and inspect absolute tracking proofs."
    }
  ];

  return (
    <div className="min-h-screen py-16 px-4 bg-slate-50 flex items-center justify-center font-sans" id="authtab-page">
      <div className="w-full max-w-4xl bg-white border border-slate-100 rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Side: Branding and Role selection */}
        <div className="w-full md:w-1/2 bg-slate-900 text-white p-8 flex flex-col justify-between">
          <div>
            <div className="mb-8 font-sans">
              <DonareLogo darkBackground />
            </div>

            <span className="inline-block bg-emerald-800/60 text-emerald-300 font-mono text-[9px] uppercase tracking-wider font-extrabold py-0.5 px-2.2 rounded-full mb-4">
              Step 1: Choose Your Platform Role
            </span>
            <h3 className="text-xl font-bold tracking-tight mb-4">How will you participate?</h3>

            <div className="space-y-3.5 mb-8">
              {rolesConfig.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedRole === item.role;
                return (
                  <div
                    key={item.role}
                    onClick={() => handlePreMockFill(item.role)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected 
                        ? "border-emerald-400 bg-emerald-950 text-white ring-2 ring-emerald-500/20" 
                        : "border-slate-800 bg-slate-850 hover:bg-slate-800 text-slate-350"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-1.5 rounded-lg ${isSelected ? "bg-emerald-500 text-white" : "bg-slate-750 text-slate-400"}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <span className="block font-bold text-xs">{item.title}</span>
                        <p className="text-[10px] text-slate-400 mt-1 lines-clamp-2 leading-snug">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4 flex items-center space-x-3.5">
            <span className="text-[10px] text-slate-400 leading-normal">
              💡 **AI Testing Tip:** Pre-loaded verified credentials are automatic. Simply edit details and hit the access button to preview the portal.
            </span>
          </div>
        </div>

        {/* Right Side: Credentials Input form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-between" id="authform-side">
          <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-50">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{isSignUp ? "Create a Secure Account" : "Access Your Account"}</h2>
              <span className="text-xs text-slate-400 font-sans mt-0.5 block">
                Logged role will be: <span className="text-emerald-700 capitalize font-bold">Impact Donor</span>
              </span>
            </div>
            <button 
              onClick={onCancel}
              className="text-xs text-slate-405 hover:text-slate-600 font-bold"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 font-mono">Email Address</label>
              <input
                id="input-email"
                type="text"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrorMsg(""); }}
                placeholder="donor@donare.org"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-sm focus:outline-none transition-all font-sans"
              />
            </div>

            {/* Account Owner Name */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 font-mono">Full Contact Name</label>
              <input
                id="input-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Sarah Jenkins"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-sm focus:outline-none transition-all font-sans"
              />
            </div>

            {/* Non-NGO Area: default Region */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 font-mono">Regional Location</label>
              <input
                id="input-region"
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="San Francisco, CA"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-sm focus:outline-none"
              />
            </div>

            <button
              id="btn-auth-submit"
              type="submit"
              className="w-full mt-6 py-3 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl text-sm shadow-md shadow-emerald-500/10 cursor-pointer flex items-center justify-center space-x-2 focus:outline-none transition-transform active:scale-[0.99]"
            >
              <span>{isSignUp ? "Access Platform: Donor" : "Authenticate Securely"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-6 border-t border-slate-50 text-center text-xs text-slate-450 flex flex-col space-y-1.5" id="auth-footer-notes">
            <button
              id="btn-toggle-signup"
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-emerald-700 hover:text-emerald-800 font-bold focus:outline-none"
            >
              {isSignUp ? "Already registered? Toggle Sign In" : "Need a new profile? Toggle Sign Up"}
            </button>
            <span>Donare transparent keys are stored strictly inside session cookies client side.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
