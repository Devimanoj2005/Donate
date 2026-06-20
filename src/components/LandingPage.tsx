/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Heart, ShieldCheck, TrendingUp, Users, ArrowRight, Gift, Library, ShoppingBag, Landmark, Coffee, Layers, Quote, Sparkles } from "lucide-react";
import { DonationCategory } from "../types";
import { INITIAL_CAMPAIGNS, INITIAL_SUCCESS_STORIES, INITIAL_NGO_PARTNERS } from "../data";
import DonareLogo from "./DonareLogo";

interface LandingPageProps {
  onExploreCategory: (category: DonationCategory) => void;
  onNavigateToMarketplace: () => void;
  onNavigateToImpact: () => void;
  onJoinAsDonor: () => void;
}

export default function LandingPage({
  onExploreCategory,
  onNavigateToMarketplace,
  onNavigateToImpact,
  onJoinAsDonor,
}: LandingPageProps) {
  
  const stats = [
    { label: "Community Donors", value: "14,820", icon: Users, color: "text-emerald-600 bg-emerald-50" },
    { label: "Verified NGO Partners", value: "180+", icon: ShieldCheck, name: "ShieldCheck", color: "text-sky-600 bg-sky-50" },
    { label: "Delivered Items", value: "98,430", icon: Gift, color: "text-amber-600 bg-amber-50" },
    { label: "Transparency Score", value: "100%", icon: TrendingUp, color: "text-emerald-700 bg-emerald-100" }
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800" id="landing-page-component">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pb-24 lg:pt-20 bg-white border-b border-slate-100">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-50/40 via-transparent to-transparent opacity-70 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold tracking-wide mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Transparent Social Impact Platform</span>
              </div>
              
              <h1 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
                Every Donation <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-700">
                  Creates a New Beginning
                </span>
              </h1>
              
              <p className="mt-4 text-base sm:text-lg text-slate-600 font-sans leading-relaxed">
                Connect directly with certified NGOs and verified beneficiaries. Experience absolute receipt validation and track exactly where your donated funds, books, clothes, and supplies develop into real community livelihoods.
              </p>

              <div className="mt-8 sm:flex sm:justify-center lg:justify-start gap-4">
                <button
                  id="hero-cta-marketplace"
                  onClick={onNavigateToMarketplace}
                  className="flex items-center justify-center space-x-2 w-full sm:w-auto px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all cursor-pointer text-sm"
                >
                  <span>Explore Urgent Needs</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  id="hero-cta-impact"
                  onClick={onNavigateToImpact}
                  className="flex items-center justify-center space-x-2 w-full sm:w-auto mt-3 sm:mt-0 px-6 py-3.5 border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer text-sm"
                >
                  <span>Live Tracking Ledger</span>
                </button>
              </div>
              
              {/* Trust Badge */}
              <div className="mt-6 flex items-center space-x-4 justify-center lg:justify-start">
                <span className="text-xs text-slate-400 font-mono flex items-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 mr-1.5" />
                  100% Anti-Fraud Audit Verified
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  • Zero administrative overhead leak
                </span>
              </div>
            </div>

            {/* Hero Right Visuals */}
            <div className="mt-12 sm:mt-16 lg:mt-0 lg:col-span-6 relative">
              <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                {/* Visual Card Frame */}
                <div className="rounded-3xl border border-slate-100 bg-white p-4 sm:p-6 shadow-2xl shadow-slate-200/80 hover:scale-[1.01] transition-transform">
                  <div className="relative aspect-video rounded-2xl overflow-hidden mb-5">
                    <img
                      src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900&auto=format&fit=crop&q=80"
                      alt="Children learning happily with books"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex items-end p-4">
                      <div>
                        <span className="px-2 py-0.5 rounded bg-emerald-500 text-white text-[10px] font-mono uppercase font-bold">Urgent Need Solved</span>
                        <h4 className="text-white font-bold text-sm sm:text-base mt-1">Eldoret Primary Textbooks Drive</h4>
                      </div>
                    </div>
                  </div>

                  {/* Micro Timeline */}
                  <div className="space-y-3.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-700">Dynamic Progress Tracker</span>
                      <span className="text-emerald-700 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded">94% Transferred</span>
                    </div>
                    
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: "94%" }}></div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[10px] font-mono text-slate-400 border-t border-slate-50 shadow-inner rounded-xl p-2 bg-slate-50/50">
                      <div>
                        <span className="block text-slate-800 font-bold">15,000 USD</span>
                        <span>Committed</span>
                      </div>
                      <div>
                        <span className="block text-emerald-600 font-bold">Done (Receipt)</span>
                        <span>NGO Print Job</span>
                      </div>
                      <div>
                        <span className="block text-slate-800 font-bold">12 Schools</span>
                        <span>Delivered</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Aesthetic floating card */}
                <div className="hidden sm:block absolute -bottom-6 -left-8 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 max-w-[210px]">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-mono text-xs font-bold">AI</div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-none">Smart Recommender</h4>
                      <p className="text-[10px] text-slate-400 mt-1">Found 4 matches matching your surplus textbooks</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Mission Statement */}
      <section className="py-16 bg-slate-50 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-xs uppercase tracking-widest font-mono text-emerald-600 font-bold">Our Mission</span>
          <h2 className="text-2xl sm:text-3xl font-sans font-bold text-slate-900 mt-2 mb-6">
            Eliminating guesswork. Championing visual traceability.
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Every day, countless acts of kindness stay suspended in logistical ambiguity. Donare bridges this gap. By certifying humanitarian NGOs, introducing secure AI fraud audits, matching surplus resources instantly to local requests, and establishing visual delivery proofs, we build a global platform dedicated to absolute trust.
          </p>
        </div>
      </section>

      {/* 3. Impact Statistics */}
      <section className="py-12 bg-white border-b border-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="p-6 bg-slate-50/50 border border-slate-100 rounded-2xl flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${stat.color} transition-colors shadow-sm`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-2xl sm:text-3xl font-sans font-black text-slate-900 leading-none">{stat.value}</span>
                    <span className="block text-xs text-slate-500 mt-1 font-sans">{stat.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Donation Categories */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest font-mono text-emerald-600 font-bold">Donation Scope</span>
            <h3 className="text-3xl font-sans font-bold text-slate-900 mt-2">What Can You Share?</h3>
            <p className="text-slate-600 text-sm mt-3">Select a category below to explore pre-verified beneficiary requests crying out for immediate care.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { cat: DonationCategory.MONEY, label: "Money Grants", icon: Landmark, desc: "Direct cash assistance", color: "from-emerald-50 to-emerald-100/50 hover:border-emerald-300 text-emerald-800" },
              { cat: DonationCategory.CLOTHES, label: "Warm Clothes", icon: ShoppingBag, desc: "Coats, boots, diapers", color: "from-sky-50 to-sky-100/50 hover:border-sky-300 text-sky-800" },
              { cat: DonationCategory.BOOKS, label: "Books & Study", icon: Library, desc: "Novels, course notes", color: "from-violet-50 to-violet-100/50 hover:border-violet-300 text-violet-800" },
              { cat: DonationCategory.FOOD, label: "Healthy Food", icon: Coffee, desc: "Staples, nutrition kits", color: "from-amber-50 to-amber-100/50 hover:border-amber-300 text-amber-800" },
              { cat: DonationCategory.EDUCATIONAL, label: "Tech & Devices", icon: Layers, desc: "Laptops, solar lanterns", color: "from-rose-50 to-rose-100/50 hover:border-rose-300 text-rose-800" },
              { cat: DonationCategory.HOUSEHOLD, label: "Household", icon: Gift, desc: "Beds, blankets, gas stoves", color: "from-teal-50 to-teal-100/50 hover:border-teal-300 text-teal-800" }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  onClick={() => onExploreCategory(item.cat)}
                  className={`bg-gradient-to-br ${item.color} border border-slate-200/65 rounded-2xl p-5 text-center cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col justify-between items-center group`}
                >
                  <div className="p-3 bg-white rounded-xl shadow-sm mb-3 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm tracking-tight">{item.label}</h4>
                    <p className="text-[10px] text-slate-500 mt-1 lines-clamp-2 leading-tight">{item.desc}</p>
                  </div>
                  <span className="inline-flex items-center space-x-1 text-[10px] font-bold mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Explore</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. How It Works */}
      <section className="py-20 bg-white border-t border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest font-mono text-emerald-600 font-bold">Simple Workflow</span>
            <h3 className="text-3xl font-sans font-bold text-slate-900 mt-2">Connecting Compassion in 4 Steps</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            
            {[
              { step: "01", title: "Beneficiaries Request", desc: "Families list critical needs (e.g., math textbook bundles). AI verifies urgency and triggers safety audits." },
              { step: "02", title: "NGO Certifies", desc: "Local certified NGO centers audit physical conditions, ensuring absolute recipient truthfulness." },
              { step: "03", title: "Donor Dispatches", desc: "You pledge money or physical parcels. Trace every mile with barcode status logs." },
              { step: "04", title: "Visual Proof", desc: "NGO uploads stamped receipt photo on delivery. Community tracks impact live." }
            ].map((stepItem, idx) => (
              <div key={idx} className="relative p-6 bg-slate-50 border border-slate-100 rounded-2xl group hover:bg-white hover:shadow-xl hover:border-emerald-100 transition-all">
                <span className="block font-mono text-4xl font-extrabold text-emerald-300 opacity-70 group-hover:text-emerald-500 transition-colors">{stepItem.step}</span>
                <h4 className="font-bold text-lg text-slate-900 mt-3 font-sans">{stepItem.title}</h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{stepItem.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Success Stories */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest font-mono text-emerald-600 font-bold">Direct Yield</span>
              <h3 className="text-3xl font-sans font-bold text-slate-900 mt-1">A New Beginning In Action</h3>
            </div>
            <button
              id="success-cta-impact-dashboard"
              onClick={onNavigateToImpact}
              className="mt-3 md:mt-0 flex items-center space-x-1.5 text-sm text-emerald-650 hover:text-emerald-700 font-bold px-3 py-1 bg-emerald-50 rounded-lg group"
            >
              <span>View full financial ledger</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {INITIAL_SUCCESS_STORIES.map((story) => (
              <div key={story.id} className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col sm:flex-row">
                <div className="sm:w-2/5 relative h-48 sm:h-auto">
                  <img src={story.image} alt={story.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm shadow px-2.5 py-1 rounded-full text-[10px] font-mono font-bold text-emerald-800 uppercase">
                    {story.category}
                  </span>
                </div>
                <div className="p-6 sm:w-3/5 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400">{story.ngoName}</span>
                    <h4 className="font-sans font-bold text-lg text-slate-900 mt-1 mb-2 leading-snug">{story.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">{story.description}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-55 flex items-center justify-between text-xs font-mono text-emerald-700">
                    <span className="flex items-center bg-emerald-50 px-2 py-0.5 rounded font-bold">
                      <Users className="w-3.5 h-3.5 mr-1" />
                      Impacted: {story.livesImpacted} people
                    </span>
                    <span>{story.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. NGO Partners Showcase */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest font-mono text-emerald-600 font-bold">Verified Alliances</span>
            <h3 className="text-3xl font-sans font-bold text-slate-900 mt-2">Humanitarian Foundations We Back</h3>
            <p className="text-slate-500 text-sm mt-3">We partner only with registered NGOs to operate physical distribution center audits.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {INITIAL_NGO_PARTNERS.map((partner) => (
              <div key={partner.id} className="p-6 bg-slate-50/50 border border-slate-100 rounded-2xl flex flex-col justify-between hover:bg-slate-50/10 hover:shadow-md transition-all">
                <div className="flex items-center space-x-3.5 mb-4">
                  <img src={partner.avatar} alt={partner.name} className="w-12 h-12 rounded-full object-cover border-2 border-slate-200" referrerPolicy="no-referrer" />
                  <div>
                    <div className="flex items-center space-x-1">
                      <h4 className="font-sans font-bold text-sm text-slate-900">{partner.name}</h4>
                      <ShieldCheck className="w-4 h-4 text-emerald-500 fill-current bg-white rounded-full" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tight">{partner.region}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic">"{partner.bio}"</p>
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">ID: {partner.registrationNumber}</span>
                  <span className="text-emerald-700 font-bold">100% Pass Rate</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Call to Action */}
      <section className="relative py-16 sm:py-20 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-900/40 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <Heart className="w-12 h-12 text-emerald-400 fill-current mx-auto mb-6 animate-pulse" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">Ready to Create a New Beginning?</h2>
          <p className="text-slate-350 max-w-xl mx-auto text-sm sm:text-base mb-8">
            Join thousands of individuals as a verified donor. Together, we are building a seamless and honest circle of support.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              id="cta-join-donor"
              onClick={onJoinAsDonor}
              className="w-full sm:w-auto px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl text-sm tracking-wide shadow-lg shadow-emerald-500/10 cursor-pointer transition-all"
            >
              Sign Up as verified Donor
            </button>
            <button
              id="cta-join-marketplace"
              onClick={onNavigateToMarketplace}
              className="w-full sm:w-auto mt-3 sm:mt-0 px-8 py-3.5 border border-slate-750 hover:border-slate-600 hover:bg-slate-800 text-slate-200 font-semibold rounded-xl text-sm transition-all cursor-pointer"
            >
              Browse Active requests
            </button>
          </div>
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between border-b border-slate-900 pb-8">
            <DonareLogo darkBackground />
            <p className="mt-4 md:mt-0 text-xs text-slate-400">
              &copy; 2026 Donare transparent donation system. All rights reserved. Built for absolute social accountability.
            </p>
          </div>
          <div className="pt-8 flex flex-wrap justify-between text-xs">
            <div className="flex space-x-6 mb-4 sm:mb-0">
              <a href="#landing-page-component" className="hover:text-white">NGO Onboarding Guidelines</a>
              <a href="#landing-page-component" className="hover:text-white">API Integrations Ledger</a>
              <a href="#landing-page-component" className="hover:text-white">Privacy Standards</a>
              <a href="#landing-page-component" className="hover:text-white">Visual Proof Terms</a>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-600">Secure SHA-256 Transport • Escrow holds in custody</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
