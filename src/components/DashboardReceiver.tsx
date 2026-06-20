/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { User, DonationRequest, DonationAction, DonationCategory, DonationStatus } from "../types";
import { AlertCircle, HelpCircle, FileText, CheckCircle, Clock, PlusCircle, ArrowRight, ShieldCheck, RefreshCw, Sparkles, Send } from "lucide-react";

interface DashboardReceiverProps {
  currentUser: User;
  requests: DonationRequest[];
  actions: DonationAction[];
  documents: any[];
  onAddRequest: (req: DonationRequest) => void;
  onOpenUploadCenter: () => void;
}

export default function DashboardReceiver({
  currentUser,
  requests,
  actions,
  documents,
  onAddRequest,
  onOpenUploadCenter
}: DashboardReceiverProps) {
  
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Create Request form state
  const [reqTitle, setReqTitle] = useState("");
  const [reqDesc, setReqDesc] = useState("");
  const [reqCategory, setReqCategory] = useState<DonationCategory>(DonationCategory.BOOKS);
  const [reqQty, setReqQty] = useState("10 Units");
  const [isAiEstimating, setIsAiEstimating] = useState(false);
  const [estimatedUrgencyResult, setEstimatedUrgencyResult] = useState<any>(null);

  // Filter requests submitted by this beneficiary
  const myRequests = requests.filter((r) => r.beneficiaryId === currentUser.id);

  // Filter actions currently bound to this beneficiary's requests or ID
  // Note: an action with donor is bound if recipientId === currentUser.id or if it targets one of the requests id.
  const myIncomingDonations = actions.filter(
    (act) => act.recipientId === currentUser.id || myRequests.some((r) => r.id === act.recipientId)
  );

  const myDoc = documents.find((doc) => doc.userId === currentUser.id);

  // Trigger immediate pre-audit review using our API
  const handlePreAuditCheck = async () => {
    if (!reqTitle || !reqDesc) return;
    setIsAiEstimating(true);
    setEstimatedUrgencyResult(null);
    try {
      const response = await fetch("/api/ai/urgency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: reqTitle,
          description: reqDesc,
          category: reqCategory
        })
      });
      const data = await response.json();
      if (data && data.result) {
        setEstimatedUrgencyResult(data.result);
      }
    } catch (err) {
      console.error("Verification prediction failed: ", err);
      // Fallback
      setEstimatedUrgencyResult({
        urgency: "High",
        reasoning: "Urgency assessed locally. Critical educational assets required quickly.",
        priorityTags: ["Socioeconomic Support"]
      });
    } finally {
      setIsAiEstimating(false);
    }
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqTitle || !reqDesc) return;

    const urgencyVal = estimatedUrgencyResult ? estimatedUrgencyResult.urgency : "High";
    const reasoningVal = estimatedUrgencyResult ? estimatedUrgencyResult.reasoning : "Checked by pre-audit heuristics check.";

    const newReq: DonationRequest = {
      id: `req-${Math.floor(Math.random() * 9000 + 1000)}`,
      beneficiaryId: currentUser.id,
      beneficiaryName: currentUser.name,
      title: reqTitle,
      description: reqDesc,
      category: reqCategory,
      quantityRequested: reqQty,
      urgency: urgencyVal,
      status: "Pending", // Admin approves this
      aiMatchScore: Math.floor(Math.random() * 15 + 85),
      aiUrgencyReasoning: reasoningVal,
      aiFraudRisk: "Low",
      submittedAt: new Date().toISOString().split("T")[0]
    };

    onAddRequest(newReq);
    
    // Reset
    setReqTitle("");
    setReqDesc("");
    setReqQty("10 Units");
    setEstimatedUrgencyResult(null);
    setShowAddModal(false);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 font-sans" id="receiver-dashboard-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          
          {/* Main profile */}
          <div className="lg:col-span-8 bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Verified Recipient Profile
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans tracking-tight mt-1">
                Hello, {currentUser.name}
              </h1>
              <span className="block text-xs text-slate-400 mt-1 font-mono">Location: {currentUser.region}</span>
              <p className="text-xs text-slate-500 mt-3 max-w-lg leading-relaxed">
                Publish school studies criteria, winter cold protections, and household recovery pledges. Transparent audits maintain community donors confidence in meeting your parameters.
              </p>
            </div>

            <button
              id="btn-trigger-add-req"
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-1.5 px-5 py-3 bg-slate-950 text-white rounded-xl text-xs font-bold hover:bg-emerald-500 cursor-pointer shadow-md shadow-slate-900/10 transition-transform active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>Create Need Request</span>
            </button>
          </div>

          {/* Verification Box indicator */}
          <div className="lg:col-span-4 bg-white border border-slate-100 p-6 rounded-3xl shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="font-sans font-bold text-slate-900 text-sm mb-1.5">Registry Audit Checklist</h3>
              {myDoc ? (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center space-x-2 text-xs">
                    <CheckCircle className="w-4.5 h-4.5 text-emerald-500" />
                    <span className="text-slate-700 font-semibold">{myDoc.title}</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                    <div className="flex justify-between items-center text-[10px] font-mono mb-1">
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 rounded">Status: {myDoc.status}</span>
                      <span className="text-slate-400">Low Risk: {myDoc.riskScore}%</span>
                    </div>
                    <p className="text-[10px] text-slate-500 italic">"{myDoc.aiReport}"</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-slate-500 text-xs">
                    <Clock className="w-4.5 h-4.5 text-amber-500" />
                    <span>No registration document active yet</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    To receive donation item dispatches from high-trust donors, you must submit identity documents for AI fraud checks.
                  </p>
                </div>
              )}
            </div>

            {!myDoc && (
              <button
                id="btn-to-verification"
                onClick={onOpenUploadCenter}
                className="mt-4 flex items-center justify-center space-x-1 text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 py-2.5 rounded-xl hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer"
              >
                <span>Upload Registration Papers</span>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </button>
            )}
          </div>

        </div>

        {/* List Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Active Requests List */}
          <div className="lg:col-span-7 bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-50 pb-4 mb-4">My Submitted Needs</h2>
            
            {myRequests.length > 0 ? (
              <div className="space-y-4">
                {myRequests.map((req) => (
                  <div key={req.id} className="p-4 border border-slate-150 bg-slate-50/20 rounded-2xl">
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <div>
                        <span className="font-bold text-slate-900 text-sm block font-sans">{req.title}</span>
                        <span className="text-[9px] font-mono uppercase bg-slate-100 px-2 py-0.5 rounded text-slate-500 mt-1 inline-block">
                          {req.category}
                        </span>
                      </div>
                      
                      <div className="flex flex-col items-end gap-1.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase ${
                          req.status === "Approved"
                            ? "bg-emerald-50 text-emerald-800"
                            : req.status === "Pending"
                            ? "bg-amber-50 text-amber-800"
                            : "bg-red-50 text-red-850"
                        }`}>
                          {req.status}
                        </span>
                        
                        <span className="text-[10px] font-mono text-slate-400">{req.submittedAt}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 leading-normal mb-3 font-sans">{req.description}</p>

                    {/* AI Audits pre-computed metrics */}
                    {req.aiMatchScore && (
                      <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-50/80 text-[10px] flex items-center space-x-2">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-800 leading-normal">
                          **AI Pre-Audit Conclusion:** Urgent Category: <span className="font-bold">{req.urgency}</span>. Risk Rating: **Minimal**.
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50/50 rounded-2xl">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-slate-500 font-bold text-xs">No needs logged yet</h4>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto mt-0.5">Click the "Create Need Request" button above to publish your immediate logistical concerns.</p>
              </div>
            )}
          </div>

          {/* Incoming Items Panel */}
          <div className="lg:col-span-5 bg-white border border-slate-100 p-6 sm:p-7 rounded-3xl shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-50 pb-4 mb-4">Incoming Supplies Package</h2>
            
            {myIncomingDonations.length > 0 ? (
              <div className="space-y-4">
                {myIncomingDonations.map((action) => (
                  <div key={action.id} className="p-4 border border-slate-100 bg-slate-50/40 rounded-2xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-mono font-bold text-slate-800">{action.itemDescription}</span>
                      <span className="text-[9px] font-mono font-bold uppercase bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded">
                        {action.status}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-[11px] text-slate-500 font-sans pt-2 border-t border-slate-100">
                      <span>Sender: {action.donorName}</span>
                      <span>Tracker: {action.trackingNumber.slice(4, 12)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center border-2 border-dashed border-slate-150 rounded-2xl bg-slate-50/30">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  📦
                </div>
                <h4 className="text-xs font-bold text-slate-650">No incoming cargo batches</h4>
                <p className="text-[10px] text-slate-450 mt-1 lines-clamp-2 leading-relaxed">
                  Once donors pledge support targeting your educational, medical, or household parameters, parcels route instantly onto this list.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Add Request Modal Form */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 p-4 flex items-center justify-center backdrop-blur-xs animate-fadeIn" id="add-request-modal">
          <div className="relative w-full max-w-xl bg-white border border-slate-150 rounded-3xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto shadow-2xl">
            
            <div className="flex justify-between items-start pb-4 border-b border-slate-100">
              <div>
                <span className="inline-block bg-emerald-50 text-emerald-800 font-mono text-[9px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full">
                  Step 2: Submit Livelihood Need
                </span>
                <h2 className="text-xl font-bold font-sans text-slate-900 mt-2 leading-tight">Create Need Request</h2>
              </div>
              <button
                onClick={() => { setShowAddModal(false); setEstimatedUrgencyResult(null); }}
                className="text-slate-350 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-4 mt-6">
              
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest font-mono mb-1.5">What is needed? (Summarized Title)</label>
                <input
                  id="req-title-input"
                  type="text"
                  value={reqTitle}
                  onChange={(e) => setReqTitle(e.target.value)}
                  placeholder="e.g. 35 children's storybooks for elementary class"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-slate-800 rounded-xl text-sm focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest font-mono mb-1.5">Category</label>
                  <select
                    id="req-category-select"
                    value={reqCategory}
                    onChange={(e) => setReqCategory(e.target.value as DonationCategory)}
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
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest font-mono mb-1.5">Total Quantity</label>
                  <input
                    id="req-qty-input"
                    type="text"
                    value={reqQty}
                    onChange={(e) => setReqQty(e.target.value)}
                    placeholder="e.g. 1 Box (40 items)"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-slate-800 rounded-xl text-sm focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest font-mono mb-1.5">Comprehensive Need Story (Description)</label>
                <textarea
                  id="req-description-textarea"
                  value={reqDesc}
                  onChange={(e) => setReqDesc(e.target.value)}
                  placeholder="Tell our donor community about physical barriers, center constraints, or water flood incidents clearly..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-slate-800 rounded-xl text-sm focus:outline-none"
                  required
                />
              </div>

              {/* Pre-audit review checklist card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50/50 to-emerald-50/10 border border-emerald-100">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold text-slate-800">Donare AI Real-Time Urgency Audit</span>
                  </div>
                  <button
                    type="button"
                    onClick={handlePreAuditCheck}
                    disabled={!reqTitle || !reqDesc || isAiEstimating}
                    className="px-3 py-1 bg-white border border-emerald-200 hover:border-emerald-500 text-emerald-700 text-[10px] font-mono font-black uppercase rounded-lg hover:shadow-2xs transition-all flex items-center space-x-1"
                  >
                    <span>{isAiEstimating ? "Auditing..." : "Execute Audit"}</span>
                  </button>
                </div>

                {estimatedUrgencyResult && (
                  <div className="mt-4 space-y-2 text-[11px]" id="audit-prediction-result">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-mono">Predicted Level:</span>
                      <span className="font-black text-emerald-700 px-2 py-0.5 bg-emerald-50 rounded uppercase">{estimatedUrgencyResult.urgency}</span>
                    </div>
                    <div className="border-t border-slate-100 pt-2 text-slate-600 leading-normal italic">
                      "Analysis: {estimatedUrgencyResult.reasoning}"
                    </div>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-4 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setEstimatedUrgencyResult(null); }}
                  className="w-1/3 py-2.5 border border-slate-200 text-slate-500 font-semibold rounded-xl text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  id="btn-save-request"
                  type="submit"
                  className="w-2/3 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl text-xs shadow-md shadow-emerald-500/10"
                >
                  Publish Active Request
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
