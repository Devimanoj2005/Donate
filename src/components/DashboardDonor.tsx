/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { User, DonationAction, DonationStatus, DonationCategory, DonationCampaign } from "../types";
import { jsPDF } from "jspdf";
import { TrendingUp, Gift, Package, MapPin, Search, Clock, ArrowRight, CheckCircle, Ship, Sparkles, Building2, Map, LayoutGrid, Award, ShieldCheck, Download } from "lucide-react";
import { INITIAL_CAMPAIGNS } from "../data";

interface DashboardDonorProps {
  currentUser: User;
  actions: DonationAction[];
  campaigns: DonationCampaign[];
  onOpenMarketplaceWithCategory: (cat: DonationCategory) => void;
}

export default function DashboardDonor({
  currentUser,
  actions,
  campaigns,
  onOpenMarketplaceWithCategory
}: DashboardDonorProps) {
  
  const [selectedActionForTracking, setSelectedActionForTracking] = useState<DonationAction | null>(null);

  const handleDownloadPDF = (action: DonationAction) => {
    // Create new A4-sized PDF
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    // Color definitions
    const primaryColor = [16, 185, 129]; // Emerald (16, 185, 129)
    const darkColor = [15, 23, 42]; // Slate-900 (15, 23, 42)
    const lightGrey = [248, 250, 252]; // Slate-50 (248, 250, 252)

    // 1. Header Banner
    doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.rect(0, 0, 210, 38, "F");

    // Title Logo
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text("DONARE", 15, 16);

    doc.setFontSize(10);
    doc.setTextColor(16, 185, 129); // Emerald color
    doc.text("VERIFIED SOCIAL TRUST LEDGER", 15, 23);

    // ID and Date
    doc.setFontSize(9);
    doc.setTextColor(156, 163, 175);
    doc.text(`TICKET NO: ${action.trackingNumber}`, 130, 16);
    doc.text(`ISSUED: ${new Date(action.timestamp).toLocaleString()}`, 130, 22);

    // Accent Line
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 35, 210, 3, "F");

    // 2. Receipt Subheader
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text("OFFICIAL DONATION RECORD TICKET", 15, 52);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text("This document validates the transaction details, pickup coordination instructions", 15, 58);
    doc.text("and estimated logistics timelines for your active charitable sponsorship.", 15, 63);

    // Horizontal divider
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(15, 68, 195, 68);

    // 3. Info Boxes Left & Right Columns
    // --- COLUMN 1: SPONSOR & RECIPIENT ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text("1. TRANSACTION CO-PARTNERS", 15, 78);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(100, 116, 139);
    doc.text("SPONSOR / DONOR:", 15, 86);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text(action.donorName || "Anonymous Donor", 15, 91);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Donor Account ID: ${action.donorId}`, 15, 96);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(100, 116, 139);
    doc.text("BENEFICIARY RECIPIENT:", 15, 112);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text(action.recipientName, 15, 117);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Recipient ID: ${action.recipientId}`, 15, 122);

    // --- COLUMN 2: ITEM DESCRIPTION ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text("2. DONATED ITEM SPECIFICATIONS", 110, 78);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(100, 116, 139);
    doc.text("ITEM TYPE / CATEGORY:", 110, 86);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text(action.category, 110, 91);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(100, 116, 139);
    doc.text("PACK QUANTITY:", 110, 100);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text(action.quantity || (action.amount ? `S$ ${action.amount.toLocaleString()}` : "1 Box"), 110, 105);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(100, 116, 139);
    doc.text("MATERIAL DESCRIPTION & NOTES:", 110, 114);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    const splitNotes = doc.splitTextToSize(action.itemDescription, 85);
    doc.text(splitNotes, 110, 119);

    // Second Divider
    doc.setDrawColor(226, 232, 240);
    doc.line(15, 142, 195, 142);

    // 4. Pickup Logistics Guide (HIGHLIGHTED BLOCK)
    doc.setFillColor(lightGrey[0], lightGrey[1], lightGrey[2]);
    doc.roundedRect(15, 148, 180, 52, 3, 3, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(16, 185, 129); // Emerald
    doc.text("3. SCHEDULED COLLECTION & LOGISTIC PICKUP DETAILS", 20, 156);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text("EXPECTED TIME TO PICKUP THE ITEM (From Donor):", 20, 164);

    // Parse the timeline to extract details if possible, or print standard placeholder
    const firstTimeline = action.timeline && action.timeline[0];
    const descText = firstTimeline ? firstTimeline.description : "Scheduled Pickup";
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12.5);
    doc.setTextColor(16, 185, 129); // Accent
    doc.text(`${new Date(action.timestamp).toLocaleDateString()} (Estimated Schedule)`, 20, 172);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`Logistics Status: ${action.status} (Verified)`, 20, 180);
    
    // Note wrapping
    const splitDesc = doc.splitTextToSize(`Audit Log: ${splitNotes || descText}`, 170);
    doc.text(splitDesc, 20, 186);

    // 5. Simulated Barcode / Signoff
    doc.setDrawColor(203, 213, 225);
    doc.line(15, 212, 195, 212);

    // Draw simulated barcode lines in PDF
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text("REF LEDGER DISPATCH BLOCKCODE", 15, 220);

    const barcodeStartX = 15;
    const barcodeStartY = 224;
    const barcodeHeight = 12;
    doc.setFillColor(15, 23, 42);
    for (let i = 0; i < 48; i++) {
        const w = (i % 4 === 0) ? 1.2 : ((i % 7 === 0) ? 0.3 : 0.6);
        if (i !== 3 && i !== 14 && i !== 27 && i !== 41) {
            doc.rect(barcodeStartX + (i * 1.5), barcodeStartY, w, barcodeHeight, "F");
        }
    }

    // Code underneath barcode
    doc.setFont("courier", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`*${action.trackingNumber}*`, 45, 241);

    // Stamp visual
    doc.setDrawColor(16, 185, 129);
    doc.setLineWidth(0.8);
    doc.rect(138, 220, 48, 18);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(16, 185, 129);
    doc.text("DONARE ACCOUNT", 143, 227);
    doc.text("SECURE CERTIFIED", 144, 233);

    // Bottom Notice
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text("Thank you for your generous donation. Your transparency ledger makes administration waste strictly zero.", 15, 260);
    doc.text("Please print this ticket or bundle the barcode reference code along with your cargo layout packages.", 15, 265);

    doc.save(`donare_receipt_${action.trackingNumber}.pdf`);
  };

  // Filter donor historical records
  const myDonations = actions.filter((act) => act.donorId === currentUser.id);

  // Spend analytics
  const totalMoneyShared = myDonations
    .filter(act => act.amount)
    .reduce((sum, act) => sum + (act.amount || 0), 0);

  const totalItemsSharedCount = myDonations.filter(act => act.quantity).length;

  // Recommended causes (smart recommend matching algorithm dummy rating)
  const recommendations = INITIAL_CAMPAIGNS.slice(0, 2);

  return (
    <div className="bg-slate-50 min-h-screen py-10 font-sans" id="donor-dashboard-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-850 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-10 relative overflow-hidden" id="donor-welcome-card">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-emerald-800/20 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center space-x-2 bg-emerald-500/25 text-emerald-300 px-3 py-1 rounded-full text-[10px] uppercase font-mono tracking-wider font-extrabold w-max mb-3">
                <Award className="w-3.5 h-3.5 mr-1" />
                <span>Verified Impact Champion</span>
              </div>
              <h1 className="text-2xl sm:text-3.5xl font-black tracking-tight font-sans">
                Welcome Back, <span className="text-emerald-400">{currentUser.name}</span>
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
                Every act of generosity represents an immutable ledger block. Thank you for validating social trust and establishing new beginnings.
              </p>
            </div>

            <div className="flex space-x-3 text-center sm:text-left bg-slate-800/50 backdrop-blur-xs p-4 rounded-2xl border border-slate-750">
              <div>
                <span className="block text-[10px] font-mono text-slate-400 uppercase">Trust score</span>
                <span className="text-lg font-extrabold text-white block leading-none mt-1">99.8%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10" id="donor-analytics-row">
          
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex items-center justify-between">
            <div>
              <span className="block text-xs font-semibold text-slate-400 font-sans uppercase">Total Money Sponsored</span>
              <span className="block text-2xl sm:text-3xl font-black text-slate-900 mt-1">S$ {totalMoneyShared.toLocaleString()}</span>
              <p className="text-[10px] text-slate-400 mt-1 bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded-md w-max">
                100% directly receipted
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex items-center justify-between">
            <div>
              <span className="block text-xs font-semibold text-slate-400 font-sans uppercase">Material Bags Contributed</span>
              <span className="block text-2xl sm:text-3xl font-black text-slate-900 mt-1">{totalItemsSharedCount} Parcels</span>
              <p className="text-[10px] text-slate-400 mt-1 bg-sky-50 text-sky-800 font-semibold px-2 py-0.5 rounded-md w-max">
                Transit items auditable
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-sky-50 text-sky-600">
              <Package className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex items-center justify-between">
            <div>
              <span className="block text-xs font-semibold text-slate-400 font-sans uppercase">Geographical Outreach</span>
              <span className="block text-2xl sm:text-3xl font-black text-slate-900 mt-1">2 Countries</span>
              <p className="text-[10px] text-slate-400 mt-1 bg-amber-50 text-amber-850 font-semibold px-2 py-0.5 rounded-md w-max">
                Eldoret, Kenya • SE Asia
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 text-amber-600">
              <MapPin className="w-6 h-6" />
            </div>
          </div>

        </div>

        {/* Bottom Section Layout Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left panel: Donation History List block */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex justify-between items-center pb-4 mb-6 border-b border-slate-50">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Dynamic Cargo & Financial Log</h2>
                  <span className="text-xs text-slate-400 mt-0.5 block">Transparency Ledger of verified items sent. Click to track delivery.</span>
                </div>
                <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">
                  ({myDonations.length}) Entries
                </span>
              </div>

              {myDonations.length > 0 ? (
                <div className="space-y-4">
                  {myDonations.map((action) => (
                    <div
                      key={action.id}
                      onClick={() => setSelectedActionForTracking(action)}
                      className="p-4 rounded-2xl border border-slate-100 bg-slate-50/40 hover:bg-white hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4"
                    >
                      <div className="flex items-center space-x-3.5">
                        <div className={`p-3 rounded-xl ${
                          action.category === DonationCategory.MONEY 
                            ? "bg-emerald-50 text-emerald-600" 
                            : action.category === DonationCategory.BOOKS
                            ? "bg-violet-50 text-violet-600"
                            : "bg-amber-50 text-amber-600"
                        }`}>
                          <Package className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-900 text-sm">{action.itemDescription}</span>
                            <span className="text-[10px] font-mono text-slate-400">ID: {action.trackingNumber.slice(4, 12)}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2 mt-1 font-sans text-xs">
                            <span className="text-slate-500">To: <span className="font-semibold text-slate-700">{action.recipientName}</span></span>
                            <span className="text-slate-300">•</span>
                            <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-mono uppercase font-bold text-slate-500">{action.category}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right values */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                        <span className="font-bold text-sm tracking-tight text-slate-900 block font-mono">
                          {action.amount ? `S$ ${action.amount.toLocaleString()}` : action.quantity}
                        </span>

                        <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold uppercase mt-1 ${
                          action.status === DonationStatus.DELIVERED
                            ? "bg-emerald-100 text-emerald-800"
                            : action.status === DonationStatus.SHIPPED
                            ? "bg-sky-100 text-sky-850 animate-pulse"
                            : "bg-amber-100 text-amber-850"
                        }`}>
                          {action.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  <Package className="w-10 h-10 text-slate-350 mx-auto mb-3" />
                  <h4 className="font-bold text-slate-600 text-sm">No recorded donations found</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                    Choose an active social cause from our marketplace to make your very first transparent donation today.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right panel: AI Cause Recommendations */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gradient-to-b from-sky-950 to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-center space-x-2 mb-4">
                  <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
                  <h3 className="font-sans font-bold text-base text-white tracking-tight">AI Causes Aligned with you</h3>
                </div>
                
                <p className="text-slate-350 text-xs leading-relaxed mb-6">
                  Based on global urgency signals, meteorological charts, and educational lack assessments, our model suggests prioritizing these outlets:
                </p>

                <div className="space-y-4">
                  {recommendations.map((camp) => (
                    <div key={camp.id} className="p-4 bg-slate-800/40 border border-slate-750 rounded-2xl flex flex-col justify-between hover:bg-slate-800/80 transition-colors">
                      <div>
                        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-extrabold uppercase">
                          {camp.category}
                        </span>
                        <h4 className="font-bold text-xs font-sans mt-2 text-white lines-clamp-1">{camp.title}</h4>
                        <p className="text-[10px] text-slate-400 mt-1 lines-clamp-2 leading-relaxed">{camp.description}</p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-750 mt-4 text-[10px]">
                        <span className="text-slate-450 font-mono">NGO: {camp.ngoName}</span>
                        <button
                          onClick={() => onOpenMarketplaceWithCategory(camp.category)}
                          className="flex items-center space-x-0.5 text-xs text-emerald-400 font-bold"
                        >
                          <span>Review</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Direct category shortcuts */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-800 text-sm mb-4">Browse by Category</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { cat: DonationCategory.MONEY, label: "Cash Grants" },
                  { cat: DonationCategory.FOOD, label: "Food Staples" },
                  { cat: DonationCategory.BOOKS, label: "School Books" },
                  { cat: DonationCategory.CLOTHES, label: "Warm Wear" },
                ].map((item) => (
                  <button
                    key={item.cat}
                    onClick={() => onOpenMarketplaceWithCategory(item.cat)}
                    className="p-3 text-center border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-white hover:border-emerald-500 hover:text-emerald-700 hover:shadow-xs transition-all text-xs font-semibold text-slate-650"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Dynamic tracking timeline modal overlay */}
      {selectedActionForTracking && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 p-4 flex items-center justify-center backdrop-blur-xs animate-fadeIn" id="tracking-timeline-modal">
          <div className="relative w-full max-w-lg bg-white border border-slate-150 rounded-3xl p-6 sm:p-8 max-h-[88vh] overflow-y-auto shadow-2xl">
            
            {/* Header */}
            <div className="flex justify-between items-start pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded font-bold uppercase">
                  Cargo Ledger Status
                </span>
                <h3 className="text-lg font-bold font-sans text-slate-900 mt-1.5 flex items-center">
                  <Package className="w-5 h-5 text-slate-600 mr-2" />
                  {selectedActionForTracking.itemDescription}
                </h3>
              </div>
              <button
                onClick={() => setSelectedActionForTracking(null)}
                className="text-slate-350 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            {/* Tracking summary bar */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 my-6 grid grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <span className="block text-slate-400">Tracking Code</span>
                <span className="text-slate-900 font-bold block mt-1">{selectedActionForTracking.trackingNumber}</span>
              </div>
              <div>
                <span className="block text-slate-400">Delivery To</span>
                <span className="text-slate-900 font-bold block mt-1 overflow-hidden overflow-ellipsis whitespace-nowrap">{selectedActionForTracking.recipientName}</span>
              </div>
            </div>

            {/* Timelines list */}
            <div>
              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase mb-4 tracking-wider">Historical Audit Steps</h4>
              
              <div className="space-y-6 relative border-l-2 border-slate-100 pl-5 ml-2.5">
                {selectedActionForTracking.timeline.map((step, idx) => {
                  const isLast = idx === selectedActionForTracking.timeline.length - 1;
                  return (
                    <div key={idx} className="relative">
                      {/* Node circle */}
                      <span className={`absolute -left-[27px] top-1.5 w-3.5 h-3.5 rounded-full ring-4 ring-white ${
                        isLast 
                          ? "bg-emerald-500 animate-pulse" 
                          : "bg-slate-300"
                      }`} />
                      
                      <div>
                        <div className="flex justify-between items-center text-xs">
                          <span className={`font-bold ${isLast ? "text-emerald-700 font-sans" : "text-slate-600"}`}>
                            {step.status} Completed
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">{step.date}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed font-sans">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Delivery Receipt verification badge */}
              {selectedActionForTracking.status === DonationStatus.DELIVERED && (
                <div className="mt-8 p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex items-start space-x-3 text-xs">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-emerald-800">Visual Receipt Proof Verified</span>
                    <p className="text-slate-600 mt-1">
                      Recipient headmaster signed, stamped, and uploaded delivery photographs. S$ ledger entries legally closed and locked.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal close / actions */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleDownloadPDF(selectedActionForTracking)}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer flex items-center justify-center space-x-1.5 shadow-sm active:scale-[0.99] transition-transform"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF Receipt</span>
              </button>
              
              <button
                onClick={() => setSelectedActionForTracking(null)}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
