/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { DonationCategory, DonationCampaign, DonationRequest, User, DonationStatus, DonationAction } from "../types";
import { Landmark, ShoppingBag, Library, Coffee, Layers, Gift, Search, ArrowRight, ShieldCheck, CheckCircle, Clock, Heart, Sparkles, AlertTriangle } from "lucide-react";
import SponsorshipForm from "./SponsorshipForm";

interface DonationMarketplaceProps {
  campaigns: DonationCampaign[];
  requests: DonationRequest[];
  currentUser: User | null;
  selectedCategoryFilter?: DonationCategory;
  onCommitDonationItem: (action: DonationAction) => void;
  onOpenAuth: () => void;
}

export default function DonationMarketplace({
  campaigns,
  requests,
  currentUser,
  selectedCategoryFilter,
  onCommitDonationItem,
  onOpenAuth
}: DonationMarketplaceProps) {
  
  const [activeTab, setActiveTab] = useState<"campaigns" | "requests">("campaigns");
  const [selectedCategory, setSelectedCategory] = useState<DonationCategory | "all">(selectedCategoryFilter || "all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Selected Detail Modal state
  const [selectedCampaign, setSelectedCampaign] = useState<DonationCampaign | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<DonationRequest | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Form for active donation
  const [donationAmount, setDonationAmount] = useState<number>(50);
  const [donationQuantity, setDonationQuantity] = useState("1 Box");
  const [donationItemDesc, setDonationItemDesc] = useState("");
  const [isSubmitRunning, setIsSubmitRunning] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // AI matched state loaded dynamically inside modal
  const [aiAnalysisContent, setAiAnalysisContent] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    if (selectedCategoryFilter) {
      setSelectedCategory(selectedCategoryFilter);
    }
  }, [selectedCategoryFilter]);

  // Load AI details inside modal when request is selected
  const fetchRequestAIDetails = async (reqItem: DonationRequest) => {
    setIsAiLoading(true);
    setAiAnalysisContent(null);
    try {
      const response = await fetch("/api/ai/urgency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: reqItem.title,
          description: reqItem.description,
          category: reqItem.category
        })
      });
      const data = await response.json();
      if (data && data.result) {
        setAiAnalysisContent(data.result);
      }
    } catch (err) {
      console.error("Failed to load request AI advice:", err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleOpenRequestDetail = (reqItem: DonationRequest) => {
    setSelectedRequest(reqItem);
    setSelectedCampaign(null);
    setShowModal(true);
    setDonationItemDesc(`Surplus ${reqItem.category} for ${reqItem.beneficiaryName}`);
    fetchRequestAIDetails(reqItem);
  };

  const handleOpenCampaignDetail = (campItem: DonationCampaign) => {
    setSelectedCampaign(campItem);
    setSelectedRequest(null);
    setShowModal(true);
    setDonationAmount(100);
    setDonationItemDesc(`Pledge for ${campItem.title}`);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedCampaign(null);
    setSelectedRequest(null);
    setSubmitSuccess(false);
    setAiAnalysisContent(null);
  };

  const handleDonationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    setIsSubmitRunning(true);
    setTimeout(() => {
      const trackingNumber = `TRK-DONARE-${Math.floor(Math.random() * 900000 + 100000)}`;
      const recipientName = selectedCampaign ? selectedCampaign.ngoName : selectedRequest!.beneficiaryName;
      const recipientId = selectedCampaign ? selectedCampaign.ngoId : selectedRequest!.id;
      const category = selectedCampaign ? selectedCampaign.category : selectedRequest!.category;

      const newAction: DonationAction = {
        id: `act-${Math.floor(Math.random() * 9000 + 1000)}`,
        donorId: currentUser.id,
        donorName: currentUser.name,
        recipientId,
        recipientName,
        category,
        itemDescription: donationItemDesc || (selectedCampaign ? `Financial Support for ${selectedCampaign.title}` : `Gift package of ${category}`),
        amount: selectedCampaign ? Number(donationAmount) : undefined,
        quantity: selectedRequest ? donationQuantity : undefined,
        status: DonationStatus.PENDING,
        trackingNumber,
        timestamp: new Date().toISOString(),
        timeline: [
          { status: DonationStatus.PENDING, date: new Date().toISOString().split("T")[0], description: "Donation pledge verified on-ledger. Secure dispatch route created." }
        ]
      };

      onCommitDonationItem(newAction);
      setIsSubmitRunning(false);
      setSubmitSuccess(true);
      
      // Keep open shortly then auto close
      setTimeout(() => {
        handleModalClose();
      }, 2000);
    }, 1200);
  };

  // Filtering
  const filteredCampaigns = campaigns.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.ngoName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredRequests = requests.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.beneficiaryName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categoryCards = [
    { cat: "all", label: "All Items", icon: Layers, color: "bg-slate-100 text-slate-700" },
    { cat: DonationCategory.MONEY, label: "Money", icon: Landmark, color: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100/50" },
    { cat: DonationCategory.CLOTHES, label: "Clothes", icon: ShoppingBag, color: "bg-sky-50 text-sky-700 hover:bg-sky-100/50" },
    { cat: DonationCategory.BOOKS, label: "Books", icon: Library, color: "bg-violet-50 text-violet-700 hover:bg-violet-100/50" },
    { cat: DonationCategory.FOOD, label: "Food", icon: Coffee, color: "bg-amber-50 text-amber-700 hover:bg-amber-100/50" },
    { cat: DonationCategory.EDUCATIONAL, label: "Tech", icon: Layers, color: "bg-rose-50 text-rose-700 hover:bg-rose-100/50" },
    { cat: DonationCategory.HOUSEHOLD, label: "Household", icon: Gift, color: "bg-teal-50 text-teal-700 hover:bg-teal-100/50" },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-10 font-sans" id="marketplace-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fadeIn">
        
        {/* Page Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4" id="marketplace-title">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full mb-2.5 inline-block">Transparent Ledger Marketplace</span>
            <h1 className="text-3xl sm:text-4xl font-sans font-black text-slate-900 tracking-tight">Active Social Causes</h1>
            <p className="text-slate-500 text-sm mt-1 leading-relaxed max-w-xl">
              Scroll through pre-certified capital campaigns or individual family requests. Direct shipping keeps administrative waste at integer absolute zero.
            </p>
          </div>
          
          {/* Toggle buttons tab */}
          <div className="flex p-1 bg-white border border-slate-150 rounded-xl shadow-xs" id="marketplace-toggle">
            <button
              onClick={() => setActiveTab("campaigns")}
              className={`px-4.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "campaigns"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              NGO Campaigns ({filteredCampaigns.length})
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`px-4.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "requests"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Direct Beneficiaries ({filteredRequests.length})
            </button>
          </div>
        </div>

        {/* Search and Categories bar */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 mb-10 shadow-sm" id="marketsearch-container">
          <div className="flex flex-col lg:flex-row gap-5 justify-between items-stretch lg:items-center">
            
            {/* Horizontal Categories */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none flex-1" id="m-category-scroller">
              {categoryCards.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedCategory === item.cat;
                return (
                  <button
                    key={item.cat}
                    onClick={() => setSelectedCategory(item.cat as any)}
                    className={`flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer shadow-2xs whitespace-nowrap ${
                      isSelected
                        ? "bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600 scale-102"
                        : "bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:border-slate-350"
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Keyword Search Input */}
            <div className="relative w-full lg:w-80 flex-shrink-0">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search campaigns, tags, keyword..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-slate-850 rounded-xl text-xs font-sans focus:outline-none transition-all placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>

          </div>
        </div>

        {/* Grid List View */}
        {activeTab === "campaigns" ? (
          filteredCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="campaigns-grid-list">
              {filteredCampaigns.map((camp) => {
                const pct = Math.floor(((camp.currentAmount || 0) / (camp.targetAmount || 1)) * 100);
                return (
                  <div key={camp.id} className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between" id={`camp-card-${camp.id}`}>
                    <div>
                      {/* Image header */}
                      <div className="relative aspect-video">
                        <img src={camp.image} alt={camp.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs shadow px-2.5 py-1 rounded-lg text-[9px] font-mono tracking-wider font-extrabold text-emerald-800 uppercase flex items-center">
                          <CheckCircle className="w-3 h-3 text-emerald-500 mr-1" />
                          {camp.category}
                        </span>
                        {camp.isUrgent && (
                          <span className="absolute top-3 right-3 bg-red-500 text-white shadow px-2.5 py-1 rounded-lg text-[9px] font-mono tracking-wider font-bold uppercase animate-pulse">
                            High Priority
                          </span>
                        )}
                      </div>

                      {/* Content panel */}
                      <div className="p-6">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold block">{camp.ngoName}</span>
                        <h3 className="font-sans font-bold text-lg text-slate-900 mt-1 lines-clamp-2 leading-snug">{camp.title}</h3>
                        <p className="text-xs text-slate-500 mt-2.5 font-sans leading-relaxed lines-clamp-3">{camp.description}</p>
                      </div>
                    </div>

                    {/* Progress details */}
                    <div className="p-6 pt-0 border-t border-slate-50 mt-4">
                      {camp.targetAmount && (
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-slate-500">Capital Progress</span>
                            <span className="font-bold text-emerald-700">{pct}% reached</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${pct}%` }}></div>
                          </div>
                          <div className="flex justify-between text-[11px] font-semibold text-slate-700">
                            <span>S$ {camp.currentAmount?.toLocaleString()}</span>
                            <span>Target: S$ {camp.targetAmount?.toLocaleString()}</span>
                          </div>
                        </div>
                      )}

                      {/* Action trigger footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                        <span className="text-[10px] font-mono text-slate-400 flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1" />
                          Ends {camp.deadline?.split("-").reverse().join("/") || "soon"}
                        </span>
                        
                        <button
                          id={`btn-open-camp-${camp.id}`}
                          onClick={() => handleOpenCampaignDetail(camp)}
                          className="flex items-center space-x-1 px-3.5 py-1.5 rounded-lg bg-slate-950 text-white text-xs font-semibold hover:bg-emerald-600 hover:scale-103 transition-all cursor-pointer"
                        >
                          <span>Sponsor</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white border border-slate-100 rounded-2xl p-8" id="empty-campaigns">
              <AlertTriangle className="w-12 h-12 text-slate-350 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-700">No campaigns matching filters</h3>
              <p className="text-xs text-slate-450 mt-1">Try resetting the selected categories or search terms to browse other verified options.</p>
            </div>
          )
        ) : (
          filteredRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="requests-grid-list">
              {filteredRequests.map((req) => {
                const isUrgent = req.urgency === "Instant Relief" || req.urgency === "High";
                return (
                  <div key={req.id} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between" id={`req-card-${req.id}`}>
                    <div>
                      {/* Flex categories */}
                      <div className="flex justify-between items-start mb-4 gap-2">
                        <span className="px-2.5 py-1 bg-slate-50 rounded-lg text-[9px] font-mono tracking-wider font-extrabold text-slate-600 uppercase">
                          {req.category}
                        </span>
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-mono tracking-wider font-extrabold uppercase ${
                          req.urgency === "Instant Relief" 
                            ? "bg-red-50 text-red-700" 
                            : req.urgency === "High"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}>
                          {req.urgency}
                        </span>
                      </div>

                      <h3 className="font-sans font-bold text-base text-slate-900 lines-clamp-2 leading-snug">{req.title}</h3>
                      <p className="text-xs text-slate-500 mt-2.5 font-sans leading-relaxed lines-clamp-3">{req.description}</p>
                      
                      {/* AI Matching quick banner */}
                      {req.aiMatchScore && (
                        <div className="mt-4 p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-50 text-[11px] flex items-center justify-between">
                          <span className="text-emerald-800 font-sans flex items-center font-semibold">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-500 mr-1.5 animate-pulse" />
                            AI Direct Match Preference
                          </span>
                          <span className="font-mono text-xs font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            {req.aiMatchScore}% Score
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-50">
                      <div className="flex justify-between items-center text-xs mb-3.5">
                        <span className="text-slate-400 font-mono">By: {req.beneficiaryName}</span>
                        <span className="font-bold text-slate-800 font-mono block bg-slate-50 px-2 py-0.5 rounded">
                          Goal: {req.quantityRequested}
                        </span>
                      </div>

                      <button
                        id={`btn-open-req-${req.id}`}
                        onClick={() => handleOpenRequestDetail(req)}
                        className="w-full flex items-center justify-center space-x-1.5 px-4 py-2 bg-slate-950 text-white rounded-xl text-xs font-semibold hover:bg-emerald-500 hover:scale-[1.01] transition-all cursor-pointer"
                      >
                        <span>Dispatch Supplies</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white border border-slate-100 rounded-2xl p-8" id="empty-requests">
              <AlertTriangle className="w-12 h-12 text-slate-350 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-700">No beneficiary requests found</h3>
              <p className="text-xs text-slate-450 mt-1">Try selecting a different material category filter or refining search phrases.</p>
            </div>
          )
        )}

      </div>

      {/* Modal Detail & Pledge form overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn" id="market-detail-modal">
          <div className="relative w-full max-w-4xl bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto shadow-2xl">
            
            {/* Header */}
            <div className="flex justify-between items-start pb-4 border-b border-slate-100 mb-6">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  {selectedCampaign ? "NGO Active Cause Campaign" : "Verified Direct Recipient Dispatch Route"}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-sans text-slate-900 leading-tight mt-2.5">
                  {selectedCampaign ? selectedCampaign.title : selectedRequest!.title}
                </h2>
              </div>
              <button 
                id="btn-close-modal"
                onClick={handleModalClose}
                className="p-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                ✕ Close Window
              </button>
            </div>

            <SponsorshipForm
              campaign={selectedCampaign}
              request={selectedRequest}
              currentUser={currentUser}
              onClose={handleModalClose}
              onCommitDonationItem={onCommitDonationItem}
              onOpenAuth={onOpenAuth}
            />

          </div>
        </div>
      )}

    </div>
  );
}
