/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { User, VerificationDocument } from "../types";
import { ShieldAlert, CheckCircle, XCircle, FileText, AlertTriangle, UserCheck, Search, ShieldCheck } from "lucide-react";

interface DashboardAdminProps {
  currentUser: User;
  documents: VerificationDocument[];
  onApproveDocument: (docId: string) => void;
  onRejectDocument: (docId: string) => void;
}

export default function DashboardAdmin({
  currentUser,
  documents,
  onApproveDocument,
  onRejectDocument
}: DashboardAdminProps) {
  
  const [selectedDoc, setSelectedDoc] = useState<VerificationDocument | null>(null);

  return (
    <div className="bg-slate-50 min-h-screen py-10 font-sans" id="admin-dashboard-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title bar */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-10 relative overflow-hidden" id="admin-header-card">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest font-extrabold text-red-400 bg-red-500/20 px-2.5 py-1 rounded-full mb-3 inline-block">Security Command center</span>
              <h1 className="text-2xl sm:text-3xl font-black font-sans tracking-tight">Trust & Verification Portal</h1>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                Inspect organizational charters, medical declarations, and citizen papers. Our AI pre-computation layer indicators flag potential risks instantly.
              </p>
            </div>
            <div className="p-4 bg-slate-800 border border-slate-750 rounded-2xl font-mono text-center">
              <span className="block text-[10px] text-slate-400 uppercase">Awaiting Audit</span>
              <span className="text-xl font-bold text-red-400 mt-1 block">{documents.filter(d => d.status === "Pending").length} Documents</span>
            </div>
          </div>
        </div>

        {/* Dashboard Grid split column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left panel: Documents list */}
          <div className="lg:col-span-6 bg-white border border-slate-100 p-6 sm:p-7 rounded-3xl shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-50 pb-4 mb-4">Pending Security Approvals</h2>
            
            {documents.length > 0 ? (
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex justify-between items-center ${
                      selectedDoc?.id === doc.id
                        ? "border-emerald-500 bg-emerald-50/5"
                        : "border-slate-100 bg-slate-50/40 hover:bg-slate-50/10 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-xl bg-slate-100 ${
                        doc.status === "Approved" ? "text-emerald-500" : doc.status === "Rejected" ? "text-red-500" : "text-amber-500"
                      }`}>
                        <FileText className="w-5 h-5" />
                      </div>
                      
                      <div>
                        <span className="font-bold text-xs text-slate-950 font-sans block">{doc.title}</span>
                        <div className="flex items-center space-x-2 mt-1 text-[10px] font-mono text-slate-400">
                          <span>{doc.documentType}</span>
                          <span>•</span>
                          <span>Risk: {doc.riskScore}%</span>
                        </div>
                      </div>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-mono font-bold uppercase ${
                      doc.status === "Approved"
                        ? "bg-emerald-100 text-emerald-800"
                        : doc.status === "Pending"
                        ? "bg-amber-100 text-amber-850"
                        : "bg-red-100 text-red-850"
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <h4 className="text-xs font-bold text-slate-600">All documents audited successfully!</h4>
                <p className="text-[10px] text-slate-450 mt-1 max-w-xs mx-auto">Zero registrations remain suspended in queue.</p>
              </div>
            )}
          </div>

          {/* Right panel: compliance inspector detailed evaluation parameters */}
          <div className="lg:col-span-6 bg-white border border-slate-100 p-6 sm:p-7 rounded-3xl shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-50 pb-4 mb-4">AI Audit & Ledger Inspector</h2>
            
            {selectedDoc ? (
              <div className="space-y-6" id="compliance-inspector-panel">
                
                {/* Meta details */}
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between text-xs">
                  <div>
                    <span className="block text-slate-400 font-mono">Assigned Subject ID</span>
                    <span className="font-bold text-slate-900 block mt-0.5">{selectedDoc.userId}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-slate-400 font-mono">Submitted Date</span>
                    <span className="font-bold text-slate-900 block mt-0.5">{selectedDoc.submittedAt}</span>
                  </div>
                </div>

                {/* AI Score Badge */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-red-50/10 to-red-50/50 border border-red-100/50 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <ShieldAlert className="w-5 h-5 text-red-500" />
                    <div>
                      <span className="block font-bold text-slate-900 text-xs">AI Fraud Inconsistency risk</span>
                      <p className="text-[10px] text-slate-450 mt-0.5">Scanned against past administrative patterns</p>
                    </div>
                  </div>
                  <span className={`text-base font-black font-mono px-3 py-1 rounded-xl block ${
                    selectedDoc.riskScore > 30 ? "bg-red-500 text-white" : "bg-emerald-500 text-white"
                  }`}>
                    {selectedDoc.riskScore}%
                  </span>
                </div>

                {/* Flags bullet points list */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">Registry Flag Analysis</h4>
                  <div className="space-y-2">
                    {selectedDoc.aiFlags.map((flag, i) => (
                      <div key={i} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs flex items-start space-x-2">
                        <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${selectedDoc.riskScore > 30 ? "text-amber-500" : "text-emerald-500"}`} />
                        <span className="text-slate-650 font-sans">{flag}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI detailed overview statement */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">Pre-computed AI Report conclusion</h4>
                  <p className="text-xs text-slate-600 italic bg-emerald-50/20 p-4 border border-emerald-50 rounded-2xl leading-relaxed">
                    "{selectedDoc.aiReport || "Audit complete. No severe administrative variations identified inside registration structures."}"
                  </p>
                </div>

                {/* Actions buttons */}
                {selectedDoc.status === "Pending" ? (
                  <div className="flex gap-4 pt-4 border-t border-slate-50">
                    <button
                      id="btn-admin-reject"
                      onClick={() => { onRejectDocument(selectedDoc.id); setSelectedDoc(null); }}
                      className="w-1/2 py-3 border border-red-200 hover:bg-red-50 text-red-700 text-xs font-bold rounded-xl flex items-center justify-center space-x-1 cursor-pointer transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Decline Credentials</span>
                    </button>
                    <button
                      id="btn-admin-approve"
                      onClick={() => { onApproveDocument(selectedDoc.id); setSelectedDoc(null); }}
                      className="w-1/2 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-1 cursor-pointer shadow-md shadow-emerald-500/10 transition-transform active:scale-98"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve Registry Entry</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-100/40 rounded-xl text-center text-xs text-slate-500">
                    Audit decision has been made. Entry locks permanently as <span className="font-bold uppercase text-slate-700">{selectedDoc.status}</span>.
                  </div>
                )}

              </div>
            ) : (
              <div className="text-center py-16 bg-slate-50/50 rounded-2xl border border-dashed border-slate-250 flex flex-col justify-center items-center">
                <ShieldCheck className="w-12 h-12 text-slate-350 mb-3" />
                <h4 className="text-sm font-bold text-slate-650">No subject active in viewport</h4>
                <p className="text-[11px] text-slate-400 max-w-xs mt-1 leading-normal px-4">
                  Select a candidate from the pending security approval queue program on the left panel to execute deep audits parameters inspects.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
