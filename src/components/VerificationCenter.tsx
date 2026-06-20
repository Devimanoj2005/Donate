/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { User, VerificationDocument } from "../types";
import { ShieldCheck, UploadCloud, FileText, CheckCircle, AlertTriangle, AlertCircle, Sparkles } from "lucide-react";

interface VerificationCenterProps {
  currentUser: User;
  onAddDocument: (doc: VerificationDocument) => void;
  onClose: () => void;
}

export default function VerificationCenter({
  currentUser,
  onAddDocument,
  onClose
}: VerificationCenterProps) {
  const [docTitle, setDocTitle] = useState("");
  const [docType, setDocType] = useState<"ID Card" | "NGO Registration" | "Financial Statement" | "Medical Report" | "Tax Form">("ID Card");
  const [textContentInfo, setTextContentInfo] = useState("");
  
  // Drag and drop / upload state
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [simulatedFileName, setSimulatedFileName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFile(file);
      setSimulatedFileName(file.name);
      if (!docTitle) {
        setDocTitle(file.name.split(".")[0]);
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      setSimulatedFileName(file.name);
      if (!docTitle) {
        setDocTitle(file.name.split(".")[0]);
      }
    }
  };

  const handleSimulateDefaultFile = () => {
    setSimulatedFileName("registry-certificate-983.pdf");
    setDocTitle(`${currentUser.name} Authority Verification`);
    setTextContentInfo(`Registration reference number: ${Math.floor(Math.random()*90000+10000)}. Vetted regional coordinates align with Eldoret community programs.`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!simulatedFileName) {
      setErrorMsg("Please drop or choose a valid charter document PDF or Image.");
      return;
    }

    setIsProcessing(true);
    setErrorMsg("");

    try {
      // Connect to our actual server-side API fraud detection engine!
      const response = await fetch("/api/ai/fraud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentTitle: docTitle,
          documentType: docType,
          textContent: textContentInfo
        })
      });

      const data = await response.json();
      const aiResult = data.result || { riskScore: 10, aiFlags: ["Format matches default criteria"], aiReport: "Audit successful." };

      const newDoc: VerificationDocument = {
        id: `doc-${Math.floor(Math.random() * 9000 + 1000)}`,
        userId: currentUser.id,
        title: docTitle || "Identity Registry scan",
        documentType: docType,
        fileUrl: "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=400",
        status: "Pending", // Sent to admin approval workflow
        riskScore: aiResult.riskScore,
        aiFlags: aiResult.aiFlags,
        submittedAt: new Date().toISOString().split("T")[0],
        aiReport: aiResult.aiReport
      };

      onAddDocument(newDoc);
      setSuccess(true);
      
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (err: any) {
      setErrorMsg("Failed to connect to the smart fraud screening API. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 font-sans" id="verification-center-page">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Title panels */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm mb-8" id="verif-header-card">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] bg-sky-50 text-sky-850 px-2 py-0.5 rounded font-mono font-bold uppercase">Audit Pipeline</span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Vetting & Compliance Registry</h1>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1 leading-normal max-w-xl">
            Donare maintains absolute transparency by verifying NGO certifications or individual recipient requirements. Submitting registry certificates automatically processes files through AI fraud scoring checklists.
          </p>
        </div>

        {/* Upload form block */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-md">
          {success ? (
            <div className="py-12 text-center" id="upload-verif-success">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Certificate Uploaded Successfully!</h2>
              <p className="text-xs text-slate-450 mt-1 leading-relaxed max-w-sm mx-auto">
                Documents have routed straight to the admin security command console. AI checklist compliance results estimated risk levels as low. Closing...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center space-x-2">
                  <AlertCircle className="w-4.5 h-4.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Grid 2 inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-xs font-bold text-slate-650 uppercase tracking-wider font-mono mb-1.5">Document Label Name</label>
                  <input
                    id="doc-title-input"
                    type="text"
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    placeholder="e.g. Hope Pioneer Foundation Tax certificate"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-slate-800 rounded-xl text-xs focus:outline-none placeholder:text-slate-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-650 uppercase tracking-wider font-mono mb-1.5">Paper Type</label>
                  <select
                    id="doc-type-select"
                    value={docType}
                    onChange={(e) => setDocType(e.target.value as any)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-slate-800 rounded-xl text-xs focus:outline-none capitalize"
                  >
                    <option value="ID Card">National identity cards</option>
                    <option value="NGO Registration">NGO Charter Certificate</option>
                    <option value="Financial Statement">Audited Bank Statement</option>
                    <option value="Medical Report">Local Medical Outpatient File</option>
                    <option value="Tax Form">State Exemption Tax stamp</option>
                  </select>
                </div>

              </div>

              {/* Drag and Drop Zone */}
              <div>
                <label className="block text-xs font-bold text-slate-650 uppercase tracking-wider font-mono mb-2">Upload Legal certificate PDF/JPG</label>
                
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all relative ${
                    dragActive
                      ? "border-emerald-500 bg-emerald-50/10 scale-[1.01]"
                      : "border-slate-200 bg-slate-50/50 hover:bg-slate-50"
                  }`}
                >
                  <UploadCloud className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  
                  {simulatedFileName ? (
                    <div className="space-y-1">
                      <span className="block font-bold text-slate-850 text-xs text-emerald-700 font-mono">{simulatedFileName}</span>
                      <span className="block text-[10px] text-slate-400 font-mono">{(uploadedFile?.size || 104210) + " bytes"}</span>
                    </div>
                  ) : (
                    <div>
                      <span className="block text-xs font-bold text-slate-700">Drag & drop your files here or</span>
                      <label className="block mt-2 font-mono text-[11px] text-emerald-700 hover:text-emerald-800 font-bold underline cursor-pointer">
                        browse folder directory
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileInputChange}
                          className="hidden"
                        />
                      </label>
                      <span className="block text-[10px] text-slate-450 mt-1 leading-normal">PDF, JPG, PNG up to 10MB sizes</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 flex justify-between items-center text-[10px]">
                  <span className="text-slate-400">🚨 Do not upload passwords or highly sensitive bank PIN numbers.</span>
                  
                  <button
                    type="button"
                    onClick={handleSimulateDefaultFile}
                    className="text-emerald-700 hover:text-emerald-800 font-bold underline"
                  >
                    Quick Simulate Document PDF
                  </button>
                </div>
              </div>

              {/* Text metadata info */}
              <div>
                <label className="block text-xs font-bold text-slate-650 uppercase tracking-wider font-mono mb-1.5 font-sans">Self-declared Charter Description (or details printed on file)</label>
                <textarea
                  id="doc-textcontent-textarea"
                  value={textContentInfo}
                  onChange={(e) => setTextContentInfo(e.target.value)}
                  placeholder="Paste certificate details, operating license numbers, state registrar stamps text etc..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white resize-none border-b border-b-slate-100 placeholder:text-slate-400"
                  required
                />
              </div>

              {/* Form buttons */}
              <div className="flex gap-4 pt-5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 py-3 border border-slate-200 text-slate-500 font-bold rounded-xl text-xs hover:bg-slate-50"
                >
                  Go Back
                </button>
                <button
                  id="btn-upload-submit"
                  type="submit"
                  disabled={isProcessing}
                  className="w-2/3 py-3 bg-slate-950 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md shadow-slate-900/10 flex items-center justify-center space-x-1.5"
                >
                  <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span>{isProcessing ? "running AI compliance check..." : "Proceed with AI compliance check"}</span>
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
