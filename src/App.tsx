/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { User, UserRole, DonationCampaign, DonationRequest, DonationAction, VerificationDocument, DonationStatus, DonationCategory } from "./types";
import { INITIAL_NGO_PARTNERS, INITIAL_CAMPAIGNS, INITIAL_BENEFICIARY_REQUESTS, INITIAL_ACTIONS } from "./data";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import AuthPage from "./components/AuthPage";
import DonationMarketplace from "./components/DonationMarketplace";
import DashboardDonor from "./components/DashboardDonor";
import DonorProfile from "./components/DonorProfile";
import ImpactDashboard from "./components/ImpactDashboard";
import AIChatBot from "./components/AIChatBot";

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(
    // Seed with a default donor to let user immediately preview the dashboard experience
    {
      id: "user-donor-1",
      email: "donor@donare.org",
      name: "Dr. Sarah Jenkins",
      role: UserRole.DONOR,
      isVerified: true,
      region: "San Francisco, CA",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
      username: "sarah_jenkins_impact",
      bio: "Surgical Specialist dedicated to global pediatric healthcare support and digital education parity. Sponsoring textbook routes and direct medical supplies tracking since 2024."
    }
  );

  // Core application database states
  const [activeTab, setActiveTab] = useState<string>("landing");
  const [campaigns, setCampaigns] = useState<DonationCampaign[]>(INITIAL_CAMPAIGNS);
  const [requests, setRequests] = useState<DonationRequest[]>(INITIAL_BENEFICIARY_REQUESTS);
  const [actions, setActions] = useState<DonationAction[]>(INITIAL_ACTIONS);
  const [documents, setDocuments] = useState<VerificationDocument[]>([
    {
      id: "doc-1",
      userId: "user-rec-1",
      title: "Aisya Rahman Identity Verification Card",
      documentType: "ID Card",
      fileUrl: "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=400",
      status: "Approved",
      riskScore: 4,
      aiFlags: ["Clear photo scan match", "Registry signature valid"],
      submittedAt: "2026-06-17",
      aiReport: "Verified with State Registry logs successfully. Risk index remains low."
    }
  ]);

  // Auth Page display trigger
  const [showAuthOverlay, setShowAuthOverlay] = useState(false);
  const [authInitialRole, setAuthInitialRole] = useState<UserRole>(UserRole.DONOR);

  // Category filters passed down into Marketplace discoverer, managed interactively
  const [marketCategoryFilter, setMarketCategoryFilter] = useState<DonationCategory | undefined>(undefined);

  // HANDLERS
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setShowAuthOverlay(false);
    setActiveTab("dashboard");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab("landing");
  };

  const handleUpdateUser = (updatedFields: Partial<User>) => {
    setCurrentUser((prev) => {
      if (!prev) return null;
      return { ...prev, ...updatedFields };
    });
  };

  const handleCommitDonationItem = (actionItem: DonationAction) => {
    // Append core donation ledger entry
    setActions((prev) => [actionItem, ...prev]);

    // If money, update campaigns funding status
    if (actionItem.amount) {
      setCampaigns((prevCamps) =>
        prevCamps.map((camp) =>
          // Since recipientId matches the NGO, also identify targeted campaign details by looking at recipientName or matching items category.
          camp.ngoId === actionItem.recipientId && camp.category === actionItem.category
            ? { ...camp, currentAmount: (camp.currentAmount || 0) + actionItem.amount! }
            : camp
        )
      );
    }
  };

  const handleUpdateActionStatus = (actionId: string, status: DonationStatus, desc: string) => {
    setActions((prevActions) =>
      prevActions.map((act) =>
        act.id === actionId
          ? {
              ...act,
              status,
              timeline: [
                ...act.timeline,
                { status, date: new Date().toISOString().split("T")[0], description: desc }
              ]
            }
          : act
      )
    );
  };

  const handleAddRequest = (newRequest: DonationRequest) => {
    setRequests((prev) => [newRequest, ...prev]);
  };

  const handleAddCampaign = (newCampaign: DonationCampaign) => {
    setCampaigns((prev) => [newCampaign, ...prev]);
  };

  const handleAddDocument = (newDoc: VerificationDocument) => {
    setDocuments((prev) => [newDoc, ...prev]);
    // Once document is registered, verify and link recipient status
    if (currentUser) {
      setCurrentUser((prevUser) => (prevUser ? { ...prevUser, isVerified: false } : null)); // Awaits admin check
    }
  };

  const handleApproveDocument = (docId: string) => {
    setDocuments((prevDocs) =>
      prevDocs.map((doc) => (doc.id === docId ? { ...doc, status: "Approved" } : doc))
    );
    // Find doc and mark associated user verified in dashboard session
    const docItem = documents.find((doc) => doc.id === docId);
    if (docItem && currentUser && currentUser.id === docItem.userId) {
      setCurrentUser((prevUser) => (prevUser ? { ...prevUser, isVerified: true } : null));
    }
  };

  const handleRejectDocument = (docId: string) => {
    setDocuments((prevDocs) =>
      prevDocs.map((doc) => (doc.id === docId ? { ...doc, status: "Rejected" } : doc))
    );
  };

  const handleOpenMarketplaceWithCategory = (cat: DonationCategory) => {
    setMarketCategoryFilter(cat);
    setActiveTab("marketplace");
  };

  const handleOpenUploadCenterFromReceiver = () => {
    setActiveTab("uploadCenter");
  };

  return (
    <div className="bg-slate-50 min-h-screen relative flex flex-col justify-between font-sans selection:bg-emerald-500 selection:text-white leading-normal tracking-normal text-slate-800">
      
      {/* 1. Global sticky header Navigation */}
      <Navigation
        currentUser={currentUser}
        activeTab={activeTab === "uploadCenter" ? "dashboard" : activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === "marketplace") {
            setMarketCategoryFilter(undefined); // reset category selector
          }
        }}
        onLogout={handleLogout}
        onOpenAuth={() => {
          setAuthInitialRole(UserRole.DONOR);
          setShowAuthOverlay(true);
        }}
      />

      {/* 2. Primary Page Router views viewport */}
      <main className="flex-grow">
        
        {/* Landing system */}
        {activeTab === "landing" && (
          <LandingPage
            onExploreCategory={handleOpenMarketplaceWithCategory}
            onNavigateToMarketplace={() => {
              setMarketCategoryFilter(undefined);
              setActiveTab("marketplace");
            }}
            onNavigateToImpact={() => setActiveTab("impact")}
            onJoinAsDonor={() => {
              setAuthInitialRole(UserRole.DONOR);
              setShowAuthOverlay(true);
            }}
          />
        )}

        {/* Discovery Marketplace section */}
        {activeTab === "marketplace" && (
          <DonationMarketplace
            campaigns={campaigns}
            requests={requests}
            currentUser={currentUser}
            selectedCategoryFilter={marketCategoryFilter}
            onCommitDonationItem={handleCommitDonationItem}
            onOpenAuth={() => setShowAuthOverlay(true)}
          />
        )}

        {/* Public Transparency Hub Ledger */}
        {activeTab === "impact" && <ImpactDashboard />}

        {/* Central Dashboard Router System (Impact Donor Portal) */}
        {activeTab === "dashboard" && currentUser && currentUser.role === UserRole.DONOR && (
          <DashboardDonor
            currentUser={currentUser}
            actions={actions}
            campaigns={campaigns}
            onOpenMarketplaceWithCategory={handleOpenMarketplaceWithCategory}
          />
        )}

        {/* Dynamic & Editable Donor Profile Tab */}
        {activeTab === "profile" && currentUser && (
          <DonorProfile
            currentUser={currentUser}
            actions={actions}
            onUpdateUser={handleUpdateUser}
          />
        )}

        {/* Fallback route if user is logged out but seeks Dashboard or Profile */}
        {((activeTab === "dashboard" || activeTab === "profile") && !currentUser) && (
          <div className="py-24 text-center max-w-sm mx-auto">
            <h3 className="font-bold text-slate-900 text-lg">Authorize Portal Access</h3>
            <p className="text-xs text-slate-500 mt-1 mb-6">Please authenticate as a verified donor to access customized profiles & portfolios.</p>
            <button
              onClick={() => setShowAuthOverlay(true)}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow rounded-xl"
            >
              Sign In / Register Profile
            </button>
          </div>
        )}

      </main>

      {/* 3. Authentication dialog overlay */}
      {showAuthOverlay && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 p-4 flex items-center justify-center backdrop-blur-xs animate-fadeIn">
          <AuthPage
            initialRole={authInitialRole}
            onLoginSuccess={handleLoginSuccess}
            onCancel={() => setShowAuthOverlay(false)}
          />
        </div>
      )}

      {/* 4. Floating AI companion assistant (advisor + plan predictor outcome forecast) */}
      <AIChatBot />

    </div>
  );
}
