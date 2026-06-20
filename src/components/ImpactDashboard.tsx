/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Landmark, ShoppingBag, Library, Coffee, Layers, Gift, ShieldAlert, CheckCircle, RefreshCw, Sparkles, TrendingUp, Search, Calendar, ChevronRight } from "lucide-react";
import { INITIAL_SUCCESS_STORIES, INITIAL_ACTIONS } from "../data";
import { DonationCategory } from "../types";

export default function ImpactDashboard() {
  const [searchLedger, setSearchLedger] = useState("");

  const mainStats = [
    { label: "Community capital raised", value: "S$ 148,250", suffix: "USD equivalents", icon: Landmark, color: "text-emerald-700 bg-emerald-50 border-emerald-100" },
    { label: "Lives directly Impacted", value: "3,450 children", suffix: "Eldoret & SE Asia", icon: TrendingUp, color: "text-sky-700 bg-sky-50 border-sky-100" },
    { label: "On-Ledger verification", value: "100.0%", suffix: "Zero overhead margin", icon: CheckCircle, color: "text-amber-700 bg-amber-50 border-amber-100" }
  ];

  // Category allotment for beautiful visual progress (Money, Books, clothes etc)
  const categoriesSpread = [
    { cat: DonationCategory.MONEY, label: "Cash Grants", amount: 65000, color: "bg-emerald-500", pct: 45 },
    { cat: DonationCategory.BOOKS, label: "School textbooks", amount: 35000, color: "bg-violet-500", pct: 24 },
    { cat: DonationCategory.EDUCATIONAL, label: "Laptops & tech", amount: 25000, color: "bg-rose-500", pct: 17 },
    { cat: DonationCategory.FOOD, label: "Nutrition stables", amount: 12000, color: "bg-amber-500", pct: 8 },
    { cat: DonationCategory.CLOTHES, label: "Warm blankets", amount: 8430, color: "bg-sky-500", pct: 6 }
  ];

  // Search through public validation ledger logs
  const filteredLedger = INITIAL_ACTIONS.filter((act) => {
    return (
      act.donorName.toLowerCase().includes(searchLedger.toLowerCase()) ||
      act.recipientName.toLowerCase().includes(searchLedger.toLowerCase()) ||
      act.category.toLowerCase().includes(searchLedger.toLowerCase()) ||
      act.itemDescription.toLowerCase().includes(searchLedger.toLowerCase())
    );
  });

  return (
    <div className="bg-slate-50 min-h-screen py-10 font-sans" id="impact-dashboard-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Transparent Banner title */}
        <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-sm mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6" id="impact-banner">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full mb-2.5 inline-block">Public Ledger Directory</span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Financial & Cargo Transparency Hub</h1>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Inspect corporate audit files, success story disbursements, and real-time transit barcodes. Absolute traceability bridges the heart directly to the hand.
            </p>
          </div>
          <span className="flex items-center text-xs font-mono text-slate-400 bg-slate-50 px-3.5 py-1.5 rounded-lg">
            <RefreshCw className="w-3.5 h-3.5 text-slate-400 animate-spin mr-2" />
            Vetted Real-time
          </span>
        </div>

        {/* Metric counts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10" id="impact-metrics-columns">
          {mainStats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className={`p-6 rounded-3xl border bg-white shadow-xs ${stat.color} hover:scale-[1.01] transition-transform flex items-center justify-between`}>
                <div>
                  <span className="block text-[10px] font-mono uppercase text-slate-400 tracking-wider font-bold mb-1.5">{stat.label}</span>
                  <span className="text-2xl sm:text-3.5xl font-black block tracking-tight leading-none text-slate-900">{stat.value}</span>
                  <span className="block text-xs text-slate-500 mt-1.5 font-sans font-medium">{stat.suffix}</span>
                </div>
                <div className="p-3.5 bg-white rounded-2xl shadow-sm flex-shrink-0">
                  <Icon className="w-6 h-6 text-slate-800" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Financial Category spread bar system */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm mb-10" id="impact-allocation-chart">
          <div className="pb-4 border-b border-slate-50 mb-6">
            <h3 className="font-sans font-black text-slate-900 text-lg">Category Allocation Ledger</h3>
            <span className="text-slate-450 text-xs font-sans mt-0.5 block">Relative percentage breakdown of capital and material values dispatched globally.</span>
          </div>

          <div className="space-y-5">
            {/* Visual combined bar */}
            <div className="w-full h-4 rounded-full bg-slate-150 flex overflow-hidden shadow-inner">
              {categoriesSpread.map((spread, i) => (
                <div
                  key={i}
                  className={`h-full ${spread.color}`}
                  style={{ width: `${spread.pct}%` }}
                  title={`${spread.label}: ${spread.pct}%`}
                />
              ))}
            </div>

            {/* List breakdown column */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4">
              {categoriesSpread.map((spread, i) => (
                <div key={i} className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl flex flex-col justify-between">
                  <div className="flex items-center space-x-1.5 mb-2">
                    <span className={`w-3 h-3 rounded-full ${spread.color}`} />
                    <span className="text-xs font-semibold text-slate-700 font-sans tracking-tight leading-none">{spread.label}</span>
                  </div>
                  <div>
                    <span className="text-base font-black text-slate-900 font-sans tracking-tight">S$ {spread.amount.toLocaleString()}</span>
                    <span className="block text-[10px] text-slate-400 font-mono mt-0.5 uppercase">({spread.pct}% of total)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Success Stories Spotlights */}
        <div className="mb-10 text-slate-900" id="transparency-success-stories">
          <div className="pb-4 mb-6">
            <h3 className="font-sans font-black text-lg">Spotlight Success Ledger</h3>
            <p className="text-slate-500 text-xs">Vetted, real-life outcomes reporting on-the-ground developments directly.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {INITIAL_SUCCESS_STORIES.slice(0, 2).map((story) => (
              <div key={story.id} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row gap-5">
                <div className="sm:w-1/3 relative h-40 sm:h-auto rounded-2xl overflow-hidden shadow-inner flex-shrink-0">
                  <img src={story.image} alt={story.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="sm:w-2/3 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5 font-bold">
                      <span>NGO: {story.ngoName}</span>
                    </div>
                    <h4 className="font-sans font-bold text-slate-950 text-base leading-snug">{story.title}</h4>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">{story.description}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-4 mt-3 border-t border-slate-50 text-[10px] font-mono text-emerald-800">
                    <span className="bg-emerald-50 px-2 py-0.5 rounded font-bold">
                      Impacted: {story.livesImpacted} children
                    </span>
                    <span>•</span>
                    <span>Published: {story.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction log verification directory list */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm mb-12" id="impact-transaction-ledger">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-50 mb-6">
            <div>
              <h3 className="font-sans font-black text-slate-900 text-lg">Public Validation Ledger Log</h3>
              <span className="text-slate-450 text-xs font-sans mt-0.5 block">Immutable receipt logs and dispatch tracks corresponding to active parcels.</span>
            </div>

            {/* Keyword Search Input */}
            <div className="relative w-full sm:w-64 flex-shrink-0">
              <input
                type="text"
                value={searchLedger}
                onChange={(e) => setSearchLedger(e.target.value)}
                placeholder="Search ledger entries..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans focus:outline-none placeholder:text-slate-400"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="space-y-4">
            {filteredLedger.length > 0 ? (
              filteredLedger.map((act) => (
                <div key={act.id} className="p-4 rounded-2xl bg-slate-50/40 border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                  <div className="flex items-start space-x-3">
                    <div className="p-2.5 bg-white border border-slate-100 rounded-xl flex-shrink-0 mt-0.5 text-slate-600">
                      📦
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-sm">{act.itemDescription}</span>
                        <span className="text-[10px] font-mono text-slate-400">Ledger Block: {act.trackingNumber.slice(4, 12)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2.5 text-[11px] text-slate-500 mt-1 font-sans">
                        <span>Pledge Owner: <span className="font-semibold text-slate-700">{act.donorName}</span></span>
                        <span>•</span>
                        <span>Recipient Target: <span className="font-semibold text-slate-750">{act.recipientName}</span></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-150 w-full sm:w-auto gap-1">
                    <span className="font-bold font-mono text-slate-900 block bg-white px-2 py-0.5 border border-slate-100 rounded">
                      {act.amount ? `S$ ${act.amount}` : act.quantity}
                    </span>
                    <span className="text-[9px] font-mono font-bold uppercase text-emerald-800 bg-emerald-100/50 px-2.2 py-0.5 rounded-lg flex items-center mt-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                      {act.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-slate-50/20 text-slate-400">
                No verified logs match keywords.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
