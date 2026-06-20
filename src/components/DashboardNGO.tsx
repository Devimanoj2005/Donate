/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { User, DonationCampaign, DonationAction, DonationStatus, DonationCategory } from "../types";
import { PlusCircle, Building2, ShieldCheck, CheckCircle, Ship, Package, Landmark, Layers, ToggleLeft, ArrowRight, TrendingUp } from "lucide-react";

interface DashboardNGOProps {
  currentUser: User;
  campaigns: DonationCampaign[];
  actions: DonationAction[];
  onAddCampaign: (camp: DonationCampaign) => void;
  onUpdateActionStatus: (actionId: string, status: DonationStatus, stepDesc: string) => void;
}

export default function DashboardNGO({
  currentUser,
  campaigns,
  actions,
  onAddCampaign,
  onUpdateActionStatus
}: DashboardNGOProps) {
  
  const [showAddCampModal, setShowAddCampModal] = useState(false);
  const [campaignTitle, setCampaignTitle] = useState("");
  const [campaignDesc, setCampaignDesc] = useState("");
  const [campaignCategory, setCampaignCategory] = useState<DonationCategory>(DonationCategory.FOOD);
  const [campaignTarget, setCampaignTarget] = useState<number>(5000);
  const [campaignItems, setCampaignItems] = useState("Staple Rice, Cooking Oils, Lentils");

  // Filter campaigns belonging to this NGO
  const myCampaigns = campaigns.filter((c) => c.ngoId === currentUser.id);

  // Filter actions currently shipping to this NGO
  const incomingDonations = actions.filter((act) => act.recipientId === currentUser.id);

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignTitle || !campaignDesc) return;

    const newCamp: DonationCampaign = {
      id: `camp-${Math.floor(Math.random() * 9000 + 1000)}`,
      title: campaignTitle,
      description: campaignDesc,
      category: campaignCategory,
      targetAmount: campaignTarget || undefined,
      currentAmount: 0,
      ngoId: currentUser.id,
      ngoName: currentUser.name,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      itemsNeeded: campaignItems.split(",").map(i => i.trim()),
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400",
      isUrgent: false
    };

    onAddCampaign(newCamp);

    // Reset Form
    setCampaignTitle("");
    setCampaignDesc("");
    setCampaignTarget(5000);
    setCampaignItems("");
    setShowAddCampModal(false);
  };

  const handleUpdateStatus = (actionId: string, currentStatus: DonationStatus) => {
    let nextStatus = DonationStatus.PENDING;
    let desc = "";

    if (currentStatus === DonationStatus.PENDING) {
      nextStatus = DonationStatus.VERIFIED;
      desc = "Donation cargo scanned and vetted at secure distribution terminal. Registered into ledger.";
    } else if (currentStatus === DonationStatus.VERIFIED) {
      nextStatus = DonationStatus.SHIPPED;
      desc = "Donation packaged loaded into dispatch truck. Handed over to regional rural courier.";
    } else if (currentStatus === DonationStatus.SHIPPED) {
      nextStatus = DonationStatus.DELIVERED;
      desc = "Carrier successfully completed delivery of shipment. Recipient stamped receipt photographic proof.";
    }

    onUpdateActionStatus(actionId, nextStatus, desc);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 font-sans" id="ngo-dashboard-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* NGO Profile Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          
          {/* Main welcome card */}
          <div className="lg:col-span-8 bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border-2 border-emerald-100 flex-shrink-0">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                    {currentUser.name}
                  </h1>
                  <ShieldCheck className="w-5 h-5 text-emerald-500 fill-current bg-white rounded-full" />
                </div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mt-1">
                  Charter Registry: {currentUser.registrationNumber || "NGO-REG-DEFAULT"} • Verified
                </p>
                <p className="text-xs text-slate-650 mt-3 max-w-lg leading-relaxed italic">
                  "{currentUser.bio || "Dedicated to advancing local communities through transparent accountability structures."}"
                </p>
              </div>
            </div>

            <button
              id="btn-trigger-add-camp"
              onClick={() => setShowAddCampModal(true)}
              className="flex items-center space-x-1.5 px-5 py-3 bg-slate-950 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-all focus:outline-none"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>Launch Campaign</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="lg:col-span-4 bg-white border border-slate-100 p-6 rounded-3xl shadow-xs flex flex-col justify-between">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono">Outreach Scorecard</h3>
            <div className="grid grid-cols-2 gap-4 my-3">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <span className="block text-[10px] font-mono text-slate-400 uppercase">My Campaigns</span>
                <span className="text-lg font-black text-slate-800 tracking-tight leading-none mt-1 block">{myCampaigns.length} Active</span>
              </div>
              <div className="p-3 bg-emerald-50/50 border border-emerald-50 rounded-xl">
                <span className="block text-[10px] font-mono text-emerald-700 uppercase">Incoming Audit</span>
                <span className="text-lg font-black text-emerald-800 tracking-tight leading-none mt-1 block">{incomingDonations.length} items</span>
              </div>
            </div>
            <span className="text-[10px] text-slate-400 leading-normal block">
              💡 **Admin Guide:** Mark incoming items below to advance delivery barcode trackers in donors dashboards.
            </span>
          </div>

        </div>

        {/* Dashboard Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Active Campaigns list */}
          <div className="lg:col-span-6 bg-white border border-slate-100 p-6 sm:p-7 rounded-3xl shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-50 pb-4 mb-4">My Launched Campaigns</h2>
            
            {myCampaigns.length > 0 ? (
              <div className="space-y-4">
                {myCampaigns.map((camp) => {
                  const percent = Math.floor(((camp.currentAmount || 0) / (camp.targetAmount || 1)) * 100);
                  return (
                    <div key={camp.id} className="p-4 border border-slate-150 bg-slate-50/10 rounded-2xl">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className="font-bold text-slate-900 text-sm block leading-tight">{camp.title}</span>
                          <span className="text-[9px] uppercase font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-500 mt-1.5 inline-block">
                            {camp.category}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {percent}%
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 mt-2 lines-clamp-2 leading-relaxed">{camp.description}</p>

                      <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
                        <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${percent}%` }}></div>
                      </div>
                      
                      <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-2">
                        <span>Funded: S$ {camp.currentAmount}</span>
                        <span>Goal: S$ {camp.targetAmount}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <Package className="w-10 h-10 text-slate-350 mx-auto mb-2" />
                <h4 className="text-xs font-bold text-slate-600">No campaigns launched yet</h4>
                <p className="text-[10px] text-slate-450 mt-1 max-w-xs mx-auto">Create a unified campaign drive to pull funding resources for rural clinics, textbook prints, or meal ingredients.</p>
              </div>
            )}
          </div>

          {/* Incoming verification ledger tracking panel */}
          <div className="lg:col-span-6 bg-white border border-slate-100 p-6 sm:p-7 rounded-3xl shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-50 pb-4 mb-4">Validate Shipment Deliveries</h2>
            
            {incomingDonations.length > 0 ? (
              <div className="space-y-4">
                {incomingDonations.map((action) => (
                  <div key={action.id} className="p-4 border border-slate-100 rounded-2xl bg-slate-50/40">
                    <div className="flex justify-between items-center mb-2.5">
                      <div>
                        <span className="font-bold text-slate-900 text-xs block leading-tight">{action.itemDescription}</span>
                        <span className="text-[10px] font-mono text-slate-400 mt-0.5 block">From donor: {action.donorName}</span>
                      </div>
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-mono font-bold uppercase text-slate-600">
                        {action.status}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
                      <span className="text-[10px] font-mono text-slate-400">Barcode: {action.trackingNumber.slice(4, 12)}</span>
                      
                      {action.status !== DonationStatus.DELIVERED ? (
                        <button
                          onClick={() => handleUpdateStatus(action.id, action.status)}
                          className="px-3.5 py-1.5 rounded-lg bg-slate-950 text-white hover:bg-emerald-500 text-[10px] font-bold font-mono uppercase tracking-wide cursor-pointer flex items-center"
                        >
                          <span>Advance: {action.status === DonationStatus.PENDING ? "Verify" : action.status === DonationStatus.VERIFIED ? "Ship" : "Deliver"}</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded flex items-center">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mr-1" />
                          Validated Proof Complete
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <ShieldCheck className="w-10 h-10 text-slate-350 mx-auto mb-2" />
                <h4 className="text-xs font-bold text-slate-650">No incoming parcel shipments listed</h4>
                <p className="text-[10px] text-slate-450 mt-1 max-w-xs mx-auto">Once donors select your campaigns or beneficiary parameters in our platform, cargo manifests automatically list here.</p>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Launch Campaign Modal */}
      {showAddCampModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 p-4 flex items-center justify-center backdrop-blur-xs animate-fadeIn animate-duration-150" id="add-campaign-modal">
          <div className="relative w-full max-w-xl bg-white border border-slate-150 rounded-3xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto shadow-2xl">
            
            <div className="flex justify-between items-start pb-4 border-b border-slate-100">
              <div>
                <span className="inline-block bg-emerald-50 text-emerald-800 font-mono text-[9px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full">
                  Step 2: Build Unified Drive
                </span>
                <h2 className="text-xl font-bold font-sans text-slate-900 mt-2 leading-tight">Launch Campaign Drive</h2>
              </div>
              <button
                onClick={() => setShowAddCampModal(false)}
                className="text-slate-350 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-4 mt-6">
              
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest font-mono mb-1.5">Campaign Name / Goal Title</label>
                <input
                  id="camp-title-input"
                  type="text"
                  value={campaignTitle}
                  onChange={(e) => setCampaignTitle(e.target.value)}
                  placeholder="e.g. 100 Solar Lights and Desk Stands Drive"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-slate-800 rounded-xl text-sm focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest font-mono mb-1.5">Category</label>
                  <select
                    id="camp-category-select"
                    value={campaignCategory}
                    onChange={(e) => setCampaignCategory(e.target.value as DonationCategory)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-slate-800 rounded-xl text-sm focus:outline-none capitalize"
                  >
                    {Object.values(DonationCategory).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest font-mono mb-1.5">Target Budget (S$)</label>
                  <input
                    id="camp-target-input"
                    type="number"
                    value={campaignTarget}
                    onChange={(e) => setCampaignTarget(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-slate-800 rounded-xl text-sm focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest font-mono mb-1.5">Desired Items (Comma-Separated)</label>
                <input
                  id="camp-items-input"
                  type="text"
                  value={campaignItems}
                  onChange={(e) => setCampaignItems(e.target.value)}
                  placeholder="e.g. Solar panels, Reading Lamps, textbooks"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-slate-800 rounded-xl text-sm focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest font-mono mb-1.5">Vulnerability Narrative (Campaign story)</label>
                <textarea
                  id="camp-desc-textarea"
                  value={campaignDesc}
                  onChange={(e) => setCampaignDesc(e.target.value)}
                  placeholder="Tell our donor community why this project creates a dynamic social outcome..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-slate-800 rounded-xl text-sm focus:outline-none"
                  required
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-4 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddCampModal(false)}
                  className="w-1/3 py-2.5 border border-slate-200 text-slate-500 font-semibold rounded-xl text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  id="btn-save-campaign"
                  type="submit"
                  className="w-2/3 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl text-xs shadow-md shadow-emerald-500/10"
                >
                  Launch Live Campaign
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
