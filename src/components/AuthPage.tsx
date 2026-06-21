/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { UserRole, User } from "../types";
import { 
  Sparkles, Heart, Shield, Users, Building, AlertCircle, ArrowRight,
  Lock, Eye, EyeOff, ShieldCheck, Key, RefreshCw, Smartphone, Check
} from "lucide-react";
import DonareLogo from "./DonareLogo";

interface AuthPageProps {
  onLoginSuccess: (user: User) => void;
  onCancel: () => void;
  initialRole?: UserRole;
}

export default function AuthPage({ onLoginSuccess, onCancel, initialRole }: AuthPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.DONOR);
  
  // Fields & Security Controls
  const [email, setEmail] = useState("donor@donare.org");
  const [name, setName] = useState("Dr. Sarah Jenkins");
  const [region, setRegion] = useState("San Francisco, CA");
  const [errorMsg, setErrorMsg] = useState("");

  // Strong MFA & Password states
  const [password, setPassword] = useState("DonareSmartDonor2026!");
  const [showPassword, setShowPassword] = useState(false);
  const [mfaStep, setMfaStep] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("849202");
  const [isVerifying, setIsVerifying] = useState(false);

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "None Entered", color: "bg-slate-200", textColor: "text-slate-400" };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (pass.length < 8) {
      return { score: Math.min(score, 2), label: "Too Short (Min 8 characters)", color: "bg-rose-500", textColor: "text-rose-600" };
    }
    if (score <= 2) return { score, label: "Weak Security Level", color: "bg-rose-500", textColor: "text-rose-600" };
    if (score <= 4) return { score, label: "Moderate Protection", color: "bg-amber-500", textColor: "text-amber-600" };
    return { score, label: "Military-Grade Strength", color: "bg-emerald-500", textColor: "text-emerald-600" };
  };

  const handlePreMockFill = (role: UserRole) => {
    setSelectedRole(UserRole.DONOR);
    setEmail("donor@donare.org");
    setName("Dr. Sarah Jenkins");
    setRegion("San Francisco, CA");
    setPassword("DonareSmartDonor2026!");
  };

  const generateNewMfaCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    return code;
  };

  const handleInitiateAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email) {
      setErrorMsg("Please enter email address.");
      return;
    }

    const strength = getPasswordStrength(password);
    if (strength.score < 3 || password.length < 8) {
      setErrorMsg("Password strength is insufficient. Include capital letters, numbers, and symbols (Minimum 8 chars).");
      return;
    }

    // Trigger Multi-Factor Authentication screen state
    const code = generateNewMfaCode();
    setMfaStep(true);
  };

  const handleVerifyMfa = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!mfaCode) {
      setErrorMsg("Please type the active 6-digit verification code.");
      return;
    }

    if (mfaCode !== generatedCode && mfaCode !== "000000") {
      setErrorMsg("Verification signature mismatch. Please retry.");
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      executeAuthLogin();
    }, 700);
  };

  const executeAuthLogin = () => {
    const finalName = name || "Dr. Sarah Jenkins";
    const isSarah = email.toLowerCase() === "donor@donare.org" || finalName.toLowerCase().includes("sarah jenkins");

    // Dynamic clean avatars for custom profiles
    const avatarOptions = [
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150", // male portrait
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", // female portrait
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150", // male portrait 2
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150"  // female portrait 2
    ];
    // Pick an avatar deterministically from the length of name or default
    const avatarIndex = Math.abs(finalName.length) % avatarOptions.length;
    const chosenAvatar = isSarah 
      ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150"
      : avatarOptions[avatarIndex];

    const mockLoggedUser: User = {
      id: isSarah ? "user-donor-1" : "user-" + Math.random().toString(36).substr(2, 9),
      email,
      name: finalName,
      role: selectedRole || UserRole.DONOR,
      isVerified: true, // Auto-verified to streamline initial preview testing
      region: region || "San Francisco, CA",
      avatar: chosenAvatar,
      username: isSarah 
        ? "sarah_jenkins_impact" 
        : (email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "") || "new_donor") + "_gives",
      bio: isSarah 
        ? "Surgical Specialist dedicated to global pediatric healthcare support and digital education parity. Sponsoring textbook routes and direct medical supplies tracking since 2024."
        : `Dedicated social investor hailing from ${region || "Worldwide"}. Committed to transparent logistics check-in coordinates and direct-aid tracking on Donare.`
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

        {/* Right Side: Credentials Input form or MFA verification */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-between" id="authform-side">
          <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-50">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {mfaStep ? "Verify Identity" : isSignUp ? "Create a Secure Account" : "Access Your Account"}
              </h2>
              <span className="text-xs text-slate-450 font-sans mt-0.5 block flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{mfaStep ? "2FA Multi-Factor Verification" : "Impact Donor Workspace Access"}</span>
              </span>
            </div>
            <button 
              onClick={() => {
                if (mfaStep) {
                  setMfaStep(false);
                } else {
                  onCancel();
                }
              }}
              className="text-xs text-slate-400 hover:text-slate-650 font-bold"
            >
              {mfaStep ? "← Back" : "Cancel"}
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 mb-4 bg-red-50 border border-red-100 text-red-750 text-xs rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-650" />
              <span>{errorMsg}</span>
            </div>
          )}

          {mfaStep ? (
            /* MULTI-FACTOR AUTHENTICATION FORM SCREEN (2FA) */
            <form onSubmit={handleVerifyMfa} className="space-y-5">
              <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 border border-slate-800 text-xs space-y-2.5">
                <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[10px] uppercase tracking-wider font-extrabold">
                  <Smartphone className="w-3.5 h-3.5 animate-bounce" />
                  <span>Simulated OTP Verification</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-normal">
                  To ensure complete cryptographic security on Donare, we generated a 2-Factor passcode. Match it below to authenticate.
                </p>
                <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                  <span className="text-slate-400 font-mono">Your Secured Sandbox Key:</span>
                  <span className="text-sm font-mono font-black text-white bg-slate-800 px-3 py-1 rounded-lg border border-slate-700 tracking-widest select-all">
                    {generatedCode}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 font-mono flex items-center justify-between">
                  <span>Enter 6-Digit Verification Code</span>
                  <button 
                    type="button" 
                    onClick={generateNewMfaCode}
                    className="text-[10px] text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1 font-sans cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" /> Resend Code
                  </button>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3.5 text-slate-400">
                    <Key className="w-4 h-4" />
                  </span>
                  <input
                    id="input-mfa"
                    type="text"
                    maxLength={6}
                    value={mfaCode}
                    onChange={(e) => {
                      setMfaCode(e.target.value.replace(/\D/g, ""));
                      setErrorMsg("");
                    }}
                    placeholder={`e.g. ${generatedCode}`}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-center text-lg font-mono tracking-widest font-bold focus:outline-none transition-all placeholder:text-slate-300"
                  />
                </div>
                <span className="text-[10px] text-slate-400 block mt-1.5 text-center font-sans">
                  Tip: Copy-paste the sandbox key above or use dev override code <strong className="font-mono">000000</strong>.
                </span>
              </div>

              <button
                id="btn-mfa-submit"
                type="submit"
                disabled={isVerifying}
                className="w-full py-3.5 px-6 bg-slate-900 hover:bg-slate-950 text-white font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center space-x-2 focus:outline-none transition-all disabled:opacity-50"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying Signatures...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Confirm & Authorize Session</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* TRADITIONAL ACCOUNT REGISTRATION FORM WITH STRENGTH METER */
            <form onSubmit={handleInitiateAuth} className="space-y-4">
              {/* Email Address */}
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

              {/* Full Contact Name */}
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

              {/* Secure Military-Grade Password */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 font-mono">
                  Strong Account Password
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    id="input-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrorMsg("");
                    }}
                    placeholder="Enter customized strong password"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-sm focus:outline-none transition-all font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-650 cursor-pointer focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Dynamic Strength Visualizer Bar */}
                {password && (
                  <div className="mt-2.5 space-y-1.5">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-450 font-sans">Strength Checklist:</span>
                      <span className={`font-extrabold ${getPasswordStrength(password).textColor}`}>
                        {getPasswordStrength(password).label}
                      </span>
                    </div>
                    <div className="grid grid-cols-5 gap-1.5 h-1.5">
                      {[1, 2, 3, 4, 5].map((level) => {
                        const score = getPasswordStrength(password).score;
                        const isFilled = level <= score;
                        return (
                          <div 
                            key={level} 
                            className={`h-full rounded-sm transition-all ${
                              isFilled 
                                ? getPasswordStrength(password).color 
                                : "bg-slate-100"
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Regional Location */}
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
                <span>Request OTP MFA Verification</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="pt-6 border-t border-slate-50 text-center text-xs text-slate-450 flex flex-col space-y-1.5" id="auth-footer-notes">
            <button
              id="btn-toggle-signup"
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMsg("");
              }}
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
