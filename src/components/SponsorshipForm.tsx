/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { DonationCampaign, DonationRequest, User, DonationAction, DonationCategory, DonationStatus } from "../types";
import { jsPDF } from "jspdf";
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  Truck, 
  Layers, 
  Hash, 
  ShieldCheck, 
  CheckCircle, 
  Check,
  AlertCircle, 
  Compass, 
  Sparkles, 
  PhoneCall, 
  Building2, 
  Map as MapIcon, 
  Navigation,
  FileSpreadsheet,
  Download,
  ArrowRight,
  Heart
} from "lucide-react";

interface SponsorshipFormProps {
  campaign: DonationCampaign | null;
  request: DonationRequest | null;
  currentUser: User | null;
  onClose: () => void;
  onCommitDonationItem: (action: DonationAction) => void;
  onOpenAuth: () => void;
}

// Preset nearby collection points that the donor can click to auto-fill
const NEARBY_COLLECTION_POINTS = [
  {
    name: "Donare Central Logistics Hub",
    address: "24 Raffles Place, #08-01",
    district: "Downtown Core",
    state: "Central Region",
    pincode: "048621",
    mapPin: { x: 45, y: 65 },
    distanceBase: 1.8
  },
  {
    name: "Ang Mo Kio Community Center",
    address: "225 Ang Mo Kio Avenue 1",
    district: "Ang Mo Kio",
    state: "North-East Region",
    pincode: "569973",
    mapPin: { x: 50, y: 35 },
    distanceBase: 7.2
  },
  {
    name: "Tampines Regional Food Depot",
    address: "1 Tampines Walk, #02-12",
    district: "Tampines",
    state: "East Region",
    pincode: "528523",
    mapPin: { x: 80, y: 50 },
    distanceBase: 12.4
  },
  {
    name: "Clementi Family Welfare Depot",
    address: "15 Clementi Loop, Block B",
    district: "Clementi",
    state: "West Region",
    pincode: "129813",
    mapPin: { x: 20, y: 45 },
    distanceBase: 9.6
  }
];

// Mock Address Auto-complete Suggestions
const ADDR_SUGGESTIONS = [
  { address: "12 Marina Boulevard", district: "Downtown Core", state: "Central Region", pincode: "018982", x: 48, y: 70 },
  { address: "73 Orchard Road", district: "Orchard", state: "Central Region", pincode: "238818", x: 38, y: 56 },
  { address: "350 Bedok Road", district: "Bedok", state: "East Region", pincode: "469519", x: 74, y: 58 },
  { address: "55 Jurong Gateway Road", district: "Jurong East", state: "West Region", pincode: "608550", x: 15, y: 40 },
  { address: "10 Woodland Square", district: "Woodlands", state: "North Region", pincode: "737715", x: 40, y: 15 }
];

export default function SponsorshipForm({
  campaign,
  request,
  currentUser,
  onClose,
  onCommitDonationItem,
  onOpenAuth
}: SponsorshipFormProps) {
  
  // States of Form
  const [fullName, setFullName] = useState(currentUser?.name || "Dr. Sarah Jenkins");
  const [email, setEmail] = useState(currentUser?.email || "donor@donare.org");
  const [phone, setPhone] = useState("+65 9123 4567");
  const [pickupLocation, setPickupLocation] = useState("82 Science Park Drive, Block C-3");
  const [district, setDistrict] = useState("Queenstown");
  const [state, setState] = useState("South-West Region");
  const [pincode, setPincode] = useState("118256");
  
  // Custom upcoming day YYYY-MM-DD
  const getTomorrowString = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };
  const [preferredPickupDate, setPreferredPickupDate] = useState(getTomorrowString());
  const [preferredPickupTime, setPreferredPickupTime] = useState("Morning (9am - 12pm)");
  const [deliveryMethod, setDeliveryMethod] = useState<"Self Pickup" | "Volunteer Pickup" | "Courier Delivery">("Volunteer Pickup");
  
  // Donation Info
  const [itemType, setItemType] = useState<DonationCategory>(
    campaign ? campaign.category : (request ? request.category : DonationCategory.BOOKS)
  );
  const [quantity, setQuantity] = useState(request ? request.quantityRequested : "1.0 Box Units");
  const [itemCondition, setItemCondition] = useState<"New" | "Like New" | "Good" | "Fair">("Good");
  const [notes, setNotes] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringPeriod, setRecurringPeriod] = useState<"weekly" | "monthly" | "yearly">("monthly");

  // Map Interactive States
  const [userPin, setUserPin] = useState<{ x: number; y: number }>({ x: 40, y: 50 });
  const [gpsDetecting, setGpsDetecting] = useState(false);
  const [addressSearch, setAddressSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [calculatedDistance, setCalculatedDistance] = useState(4.3);

  // Status timeline flow values for Confirmation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<DonationAction | null>(null);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  // Fixed Recipient Location on Mock-Map
  const receiverPin = { x: 55, y: 40 };

  // Calculate simulated distance whenever userPin changes
  useEffect(() => {
    // Distance formula relative to receiver coordinates
    const dx = userPin.x - receiverPin.x;
    const dy = userPin.y - receiverPin.y;
    const euclidean = Math.sqrt(dx * dx + dy * dy);
    // scale to typical Singapore / city KM (e.g. 1 to 15km)
    const km = Math.max(0.6, Math.round(euclidean * 0.25 * 10) / 10);
    setCalculatedDistance(km);
  }, [userPin]);

  // Handle GPS Auto detection simulation
  const handleGPSDetect = () => {
    setGpsDetecting(true);
    setTimeout(() => {
      // Choose random coordinates around center
      const mockX = Math.floor(Math.random() * 30 + 35);
      const mockY = Math.floor(Math.random() * 25 + 40);
      setUserPin({ x: mockX, y: mockY });
      
      // Seed some realistic data
      setPickupLocation("82 Science Park Drive, Block C-3");
      setDistrict("Queenstown");
      setState("South-West Region");
      setPincode("118256");
      setGpsDetecting(false);
      setAddressSearch("82 Science Park Drive");
    }, 1500);
  };

  // Click on map to place pin
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setUserPin({ x, y });

    // Pick a mock close-matching address name based on coordinates
    const names = ["Thomson Plaza Mall", "Grt Serangoon Rd", "Bishan Central Dr", "Rochor Canal Road", "Newton Circus Blvd"];
    const randomAddr = `${Math.floor(Math.random() * 150 + 10)} ${names[Math.floor(Math.random() * names.length)]}`;
    setPickupLocation(randomAddr);
    setDistrict("Central Outpost");
    setState("Central S$ Area");
    setPincode(`57${Math.floor(Math.random() * 9000 + 1000)}`);
  };

  // Helper when clicking nearby collection point
  const selectCollectionPoint = (pt: typeof NEARBY_COLLECTION_POINTS[0]) => {
    setPickupLocation(pt.name + " (" + pt.address + ")");
    setDistrict(pt.district);
    setState(pt.state);
    setPincode(pt.pincode);
    setUserPin(pt.mapPin);
  };

  // Submit trigger
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors([]);

    // Client Authentication Guard
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    // Basic Validation
    const errors: string[] = [];
    if (!fullName.trim()) errors.push("Donor Full Name is required");
    if (!email.trim() || !email.includes("@")) errors.push("A valid Email Address is required");
    if (!phone.trim()) errors.push("Contact Phone Number is required");
    if (!pickupLocation.trim()) errors.push("Pickup Location address is required");
    if (!pincode.trim()) errors.push("Pickup Location Pin Code is required");
    if (!quantity.trim()) errors.push("Donation quantity description is required");

    if (errors.length > 0) {
      setFormErrors(errors);
      // scroll back to top of modal (since the form wizard is the scroll container)
      const modalElement = document.getElementById("sponsorship-form-wizard") || document.getElementById("sponsorship-form-root");
      if (modalElement) modalElement.scrollTop = 0;
      return;
    }

    setIsSubmitting(true);

    // Simulate blockchain ledger dispatch + database entry creation
    setTimeout(() => {
      const trackingNumber = `TRK-DONARE-${Math.floor(Math.random() * 900000 + 100000)}`;
      const recipientId = campaign ? campaign.id : request!.id;
      const recipientName = campaign ? campaign.ngoName : request!.beneficiaryName;

      const newAction: DonationAction = {
        id: `act-${Math.floor(Math.random() * 9000 + 1000)}`,
        donorId: currentUser.id,
        donorName: fullName,
        recipientId,
        recipientName,
        category: itemType,
        itemDescription: campaign && isRecurring
          ? `[${itemCondition}] ${quantity} of ${itemType} (Recurring ${recurringPeriod}) - ${notes.slice(0, 30) || "Dispatched supplies"}`
          : `[${itemCondition}] ${quantity} of ${itemType} - ${notes.slice(0, 45) || "Dispatched supplies"}`,
        quantity,
        status: DonationStatus.PENDING,
        trackingNumber,
        timestamp: new Date().toISOString(),
        timeline: [
          { 
            status: DonationStatus.PENDING, 
            date: new Date().toISOString().split("T")[0], 
            description: campaign && isRecurring
              ? `Trans-logistic ledger established. Configured as ${recurringPeriod} recurring donation. Selected pickup via ${deliveryMethod} for ${preferredPickupDate}.`
              : `Trans-logistic ledger established. Selected pickup via ${deliveryMethod} for ${preferredPickupDate}.` 
          }
        ],
        isRecurring: campaign ? isRecurring : undefined,
        recurringPeriod: campaign && isRecurring ? recurringPeriod : undefined
      };

      // Push state up to parent database
      onCommitDonationItem(newAction);
      
      setIsSubmitting(false);
      setSubmitResult(newAction);
    }, 1200);
  };

  // Receiver detailed displays derived
  const receiverInfo = {
    name: campaign ? campaign.ngoName : (request ? request.beneficiaryName : "Direct Recipient"),
    verification: campaign ? "Verified NGO Partner" : "Approved Family Identity Checked",
    required: campaign ? campaign.itemsNeeded.join(", ") : (request ? request.quantityRequested : "Supplies"),
    location: campaign ? "Central Office Depot, Branch B" : "Tampines Regional Block Area",
    org: campaign ? campaign.ngoName : "Direct Emergency Social Relief",
    contact: campaign ? "Logistics Coordinator: Sarah Cheng" : `Beneficiary Contact: ${request?.beneficiaryName}`
  };

  const handleDownloadPDF = () => {
    if (!submitResult) return;
    
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
    doc.text(`TICKET NO: ${submitResult.trackingNumber}`, 130, 16);
    doc.text(`ISSUED: ${new Date(submitResult.timestamp).toLocaleString()}`, 130, 22);

    // Accent Line
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 35, 210, 3, "F");

    // 2. Receipt Subheader
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text("OFFICIAL DONATION DISPATCH RECEIPT", 15, 52);

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
    doc.text(fullName || "Anonymous Donor", 15, 91);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Email: ${email || "Not Provided"}`, 15, 96);
    doc.text(`Phone: ${phone || "Not Provided"}`, 15, 101);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(100, 116, 139);
    doc.text("BENEFICIARY RECIPIENT:", 15, 112);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text(receiverInfo.name, 15, 117);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Organization: ${receiverInfo.org}`, 15, 122);
    doc.text(`Route Branch: ${receiverInfo.location}`, 15, 127);

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
    doc.text(itemType, 110, 91);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(100, 116, 139);
    doc.text("PACK QUANTITY:", 110, 100);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text(quantity || "1 Box/Pack", 110, 105);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(100, 116, 139);
    doc.text("MATERIAL CONDITION:", 110, 114);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text(itemCondition + " Condition", 110, 119);

    if (notes) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(100, 116, 139);
      doc.text("SPECIAL NOTES:", 110, 128);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      const splitNotes = doc.splitTextToSize(notes, 85);
      doc.text(splitNotes, 110, 133);
    }

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

    // Large highlighted text of Expected Pickup Time
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12.5);
    doc.setTextColor(16, 185, 129); // Accent
    doc.text(`${preferredPickupDate}  •  ${preferredPickupTime}`, 20, 172);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`Logistics Method: ${deliveryMethod}`, 20, 180);
    
    // Pickup address
    doc.text(`Collection Address: ${pickupLocation} (District: ${district || "N/A"}, ZIP: ${pincode || "N/A"})`, 20, 186);

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
    doc.text(`*${submitResult.trackingNumber}*`, 45, 241);

    // Stamp visual
    doc.setDrawColor(16, 185, 129);
    doc.setLineWidth(0.8);
    doc.rect(138, 220, 48, 18);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(16, 185, 129);
    doc.text("DONARE LOGISTICS", 143, 227);
    doc.text("SECURE APPROVED", 144, 233);

    // Bottom Notice
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text("Thank you for your generous donation. Your transparency ledger makes administration waste strictly zero.", 15, 260);
    doc.text("Please print this ticket or bundle the barcode reference code along with your cargo layout packages.", 15, 265);

    doc.save(`donare_dispatch_ticket_${submitResult.trackingNumber}.pdf`);
  };

  return (
    <div className="relative font-sans text-slate-800" id="sponsorship-form-root">
      
      {/* If completed, show summary checkout step */}
      {submitResult ? (
        <div className="p-1 sm:p-4 text-center animate-fadeIn" id="success-summary-view">
          
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-xs border border-emerald-100">
            <CheckCircle className="w-12 h-12" />
          </div>

          <span className="text-[10px] font-mono tracking-widest font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md uppercase">
            COMMITTED ON LEDGER
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-3 tracking-tight">Donation Request Summary</h2>
          <p className="text-slate-500 text-xs mt-1.5 max-w-md mx-auto">
            Your generous sponsorship has successfully configured a live transparent logistics pipeline. All milestones are audited and logged in real-time.
          </p>

          {/* Barcode Receipt Style layout */}
          <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 my-8 text-left max-w-md mx-auto relative overflow-hidden" id="receipt-box">
            
            {/* Holographic accent */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-bl-full pointer-events-none" />
            
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[9px] font-mono text-slate-400 block uppercase">Logistics Token</span>
                <span className="text-xs font-mono font-bold text-slate-800 select-all">{submitResult.trackingNumber}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-mono text-slate-400 block uppercase">Timestamp</span>
                <span className="text-xs font-mono font-bold text-slate-800">
                  {new Date(submitResult.timestamp).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Simulated QR/Barcode barcode */}
            <div className="bg-white border border-slate-200 p-3 rounded-lg flex flex-col items-center justify-center mb-5" id="receipt-barcode">
              <div className="h-10 w-full flex items-center space-x-[2px]" title="Simulation QR Ledger Code">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="bg-slate-900 h-full flex-grow rounded-sm" 
                    style={{ 
                      opacity: (i % 3 === 0 || i % 7 === 0 || i === 2 || i === 19 || i === 31 || i === 44) ? 0.2 : 0.95,
                      width: i % 5 === 0 ? "3px" : "1px"
                    }}
                  />
                ))}
              </div>
              <span className="text-[8px] font-mono text-slate-400 uppercase mt-1.5 tracking-[0.25em]">DONARE SECURE TRACKING POINT</span>
            </div>

            {/* Information Grid Summary */}
            <div className="grid grid-cols-2 gap-y-3.5 gap-x-2.5 text-xs text-slate-600 border-t border-slate-200 pt-4 font-sans">
              <div>
                <span className="block text-[10px] text-slate-400 font-mono text-xs">SPONSOR</span>
                <span className="font-semibold text-slate-800 lines-clamp-1">{fullName}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 font-mono text-xs">BENEFICIARY</span>
                <span className="font-semibold text-slate-800 lines-clamp-1">{receiverInfo.name}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 font-mono text-xs">SPONSOR CONTENT</span>
                <span className="font-semibold text-slate-800 block lines-clamp-1 truncate">{quantity} {itemType}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 font-mono text-xs">DELIVERY SYSTEM</span>
                <span className="font-semibold text-slate-800">{deliveryMethod}</span>
              </div>
              {submitResult.isRecurring && (
                <div className="col-span-2 bg-emerald-50/70 border border-emerald-100 p-2.5 rounded-xl mt-1.5 flex items-center space-x-1.5 text-emerald-800">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span className="font-bold text-[10px] font-sans uppercase tracking-wider">Active {submitResult.recurringPeriod} recurring commitment</span>
                </div>
              )}
            </div>

            {/* Pickup details instructions */}
            <div className="mt-5 p-3.5 bg-white border border-slate-200/80 rounded-xl">
              <span className="block text-[10px] text-emerald-700 font-bold font-mono tracking-wide uppercase flex items-center mb-1">
                <Check className="w-3.5 h-3.5 mr-1" />
                Pickup & Logistics Guide
              </span>
              <p className="text-slate-600 text-xs leading-relaxed">
                {deliveryMethod === "Volunteer Pickup" && (
                  `Our pre-screened outreach volunteers will arrive at ${pickupLocation} on ${preferredPickupDate} during the ${preferredPickupTime} block. Please bundle your cargo in a secure cardboard layout labelled with code: ${submitResult.trackingNumber.slice(11)}.`
                )}
                {deliveryMethod === "Courier Delivery" && (
                  `A third-party courier partner has been triggered to fetch items on ${preferredPickupDate}. Courier transit notification and label copy will reach your email at ${email} shortly.`
                )}
                {deliveryMethod === "Self Pickup" && (
                  `Donation set for self drop-off. Please complete parcel delivery at nearby organization hub during active weekday working hours (08:00 AM to 06:00 PM).`
                )}
              </p>
            </div>

          </div>

          {/* Receiver instant notifications simulation */}
          <div className="bg-emerald-500/8 text-emerald-900 border border-emerald-100 p-4 rounded-2xl text-left max-w-md mx-auto mb-8 flex items-start space-x-3 text-xs leading-relaxed shadow-2xs">
            <Sparkles className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-900 block">Real-time notification routed instantly:</span>
              <p className="text-emerald-800/90 mt-0.5">
                Recipient <span className="font-bold">{receiverInfo.name}</span> of {receiverInfo.org} has been alerted via emergency SMS / email regarding dispatch authorization.
              </p>
            </div>
          </div>

          {/* Flow Tracking Panel */}
          <div className="border border-slate-100 rounded-3xl p-5 mb-8 max-w-md mx-auto bg-white shadow-3xs text-left" id="summary-tracking">
            <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider mb-4">Live Logistics Tracker Status</h4>
            
            <div className="relative pl-5.5 space-y-5 border-l border-slate-150">
              
              {/* Bullet 1 - Pledge Registered */}
              <div className="relative">
                <div className="absolute -left-[28.5px] top-0.5 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                  <Check className="w-2.5 h-2.5" />
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-slate-800">Donation Pledged</span>
                  <span className="block text-[10px] text-slate-400 font-mono">Completed • Just now</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">Secure ledger record established. Reference hash validated.</p>
                </div>
              </div>

              {/* Bullet 2 - Pickup Pending */}
              <div className="relative">
                <div className="absolute -left-[28.5px] top-0.5 w-4 h-4 rounded-full bg-amber-400 ring-4 ring-amber-50 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-slate-800">Logistic Collection Scheduled ({deliveryMethod})</span>
                  <span className="block text-[10px] text-amber-600 font-mono font-bold">Active Station • Next Step</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">Preferred slot: {preferredPickupDate} ({preferredPickupTime})</p>
                </div>
              </div>

              {/* Bullet 3 - Transit & Audited Delivery */}
              <div className="relative">
                <div className="absolute -left-[28.5px] top-0.5 w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center" />
                <div className="opacity-60">
                  <span className="block text-[11px] font-bold text-slate-800">NGO Verification & Outreach Center Transit</span>
                  <span className="block text-[10px] text-slate-400 font-mono">Awaiting current phase completion</span>
                </div>
              </div>

            </div>
          </div>

          {/* Back Action buttons */}
          <div className="flex flex-col gap-3.5 max-w-md mx-auto pt-2" id="completion-actions-container">
            <button
              type="button"
              id="btn-download-pdf-invoice"
              onClick={handleDownloadPDF}
              className="w-full py-3.5 px-5 bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.01] active:scale-[0.99] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/10 cursor-pointer flex items-center justify-center space-x-2 animate-pulse"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Dispatch Ticket & Details</span>
            </button>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  onClose();
                }}
                className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Close & Return
              </button>
              
              <button
                onClick={() => {
                  onClose();
                }}
                className="w-full py-3 px-4 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1"
              >
                <span>Track in Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 px-1 pr-2" id="sponsorship-form-wizard">
          
          {/* Display general instructions banner */}
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-start space-x-3 text-xs text-slate-500 leading-normal mb-2">
            <Compass className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <p>
                You are initiating a dispatch to support <span className="font-bold text-slate-800">{receiverInfo.name}</span>. 
                Please provide accurate spatial coordinates and contact details. This coordinates database allows NGO automated dispatch drivers and volunteer dispatchers to fetch items seamlessly.
              </p>
            </div>
          </div>

          {formErrors.length > 0 && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-xs text-red-700 space-y-1 text-left" id="errors-banner">
              <span className="font-bold flex items-center mb-1">
                <AlertCircle className="w-4 h-4 mr-1.5 text-red-500 flex-shrink-0" />
                Please correct the following fields before dispatching:
              </span>
              <ul className="list-disc list-inside space-y-0.5 pl-1.5">
                {formErrors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Section 1: Display Receiver Info */}
          <div className="bg-emerald-50/20 border border-emerald-100/50 p-5 rounded-3xl" id="receiver-details-box">
            <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-widest font-mono mb-3 flex items-center">
              <ShieldCheck className="w-4 h-4 mr-1.5 text-emerald-600" />
              Verified Receiver Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-450 block font-mono uppercase text-[9px]">Recipient Entity / Name</span>
                <span className="font-bold text-slate-900 block text-[13px]">{receiverInfo.name}</span>
                <span className="text-emerald-700 bg-emerald-55/60 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase inline-block">
                  ✓ {receiverInfo.verification}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-450 block font-mono uppercase text-[9px]">NGO / Sub-Organization</span>
                <span className="font-semibold text-slate-800 block flex items-center">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 mr-1 flex-shrink-0" />
                  {receiverInfo.org}
                </span>
              </div>

              <div className="space-y-1 border-t border-emerald-100/30 pt-2.5">
                <span className="text-slate-450 block font-mono uppercase text-[9px]">Requested Items Target</span>
                <span className="font-semibold text-slate-800 block lines-clamp-1">{receiverInfo.required}</span>
              </div>

              <div className="space-y-1 border-t border-emerald-100/30 pt-2.5">
                <span className="text-slate-450 block font-mono uppercase text-[9px]">Recipient Coordinates Location</span>
                <span className="font-semibold text-slate-800 block lines-clamp-1 flex items-center">
                  <MapPin className="w-3.5 h-3.5 text-slate-450 mr-1 flex-shrink-0" />
                  {receiverInfo.location}
                </span>
              </div>
            </div>

            {/* Direct contact link info if verified */}
            <div className="mt-4 pt-3.5 border-t border-emerald-100/30 text-slate-500 text-[11px] leading-normal flex items-start space-x-2">
              <PhoneCall className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.2" />
              <p>
                <span className="font-bold text-slate-700">{receiverInfo.contact}</span> is available to assist our direct couriers. Live contact is disclosed once secure ledger routing approves.
              </p>
            </div>
          </div>

          {/* Section 2: Donor Details */}
          <div>
            <h3 className="text-xs font-bold text-slate-450 uppercase tracking-wider font-mono mb-3">1. Sponsor Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div className="relative">
                <label className="block text-[11px] text-slate-500 font-semibold mb-1">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Dr. Jenkins"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-slate-800 rounded-xl text-xs focus:outline-none transition-colors"
                  />
                  <UserIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div className="relative">
                <label className="block text-[11px] text-slate-500 font-semibold mb-1">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. jenkins@mail.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-slate-800 rounded-xl text-xs focus:outline-none transition-colors"
                  />
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div className="relative">
                <label className="block text-[11px] text-slate-500 font-semibold mb-1">Contact Phone Number</label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +65 9123 4567"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-slate-800 rounded-xl text-xs focus:outline-none transition-colors"
                  />
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

            </div>
          </div>

          {/* Section 3: Donation Content Details */}
          <div>
            <h3 className="text-xs font-bold text-slate-450 uppercase tracking-wider font-mono mb-3">2. Sponsorship Items Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              
              <div className="sm:col-span-2">
                <label className="block text-[11px] text-slate-500 font-semibold mb-1">Item Category / Type</label>
                <div className="relative">
                  <select
                    value={itemType}
                    onChange={(e) => setItemType(e.target.value as DonationCategory)}
                    className="w-full px-3 py-2 bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-slate-800 rounded-xl text-xs focus:outline-none cursor-pointer transition-colors"
                  >
                    {Object.values(DonationCategory).map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 font-semibold mb-1">Quantity</label>
                <input
                  type="text"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g. 2 Big Boxes"
                  className="w-full px-3 py-2 bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-slate-800 rounded-xl text-xs focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 font-semibold mb-1">Material Condition</label>
                <select
                  value={itemCondition}
                  onChange={(e) => setItemCondition(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-slate-800 rounded-xl text-xs focus:outline-none cursor-pointer transition-colors"
                >
                  <option value="New">Brand New</option>
                  <option value="Like New">Like New / Mint</option>
                  <option value="Good">Good / Working</option>
                  <option value="Fair">Fair / Usable</option>
                </select>
              </div>

            </div>

            <div className="mt-3.5">
              <label className="block text-[11px] text-slate-500 font-semibold mb-1">Additional Notes / Descriptions</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="List special packing guidelines, sensitive goods, or fragile handling warnings here..."
                rows={2}
                className="w-full px-3.5 py-2.5 bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-slate-800 rounded-xl text-xs focus:outline-none resize-none transition-colors"
              />
            </div>

            {campaign && (
              <div className="mt-4 p-4 bg-emerald-50/20 border border-emerald-100/50 rounded-2xl space-y-3" id="recurring-donation-block">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="block text-xs font-bold text-slate-800 font-sans flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                      Make this a Recurring Commitment
                    </span>
                    <span className="block text-[11px] text-slate-500 font-sans leading-normal">
                      Regularly automate this cargo shipment or financial dispatch to support this campaign's target.
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={isRecurring}
                      onChange={(e) => setIsRecurring(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                {isRecurring && (
                  <div className="pt-2 border-t border-emerald-100/30 flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between animate-fadeIn">
                    <span className="text-[11px] font-semibold text-slate-600 font-sans">Sponsorship Recurrence Interval:</span>
                    <div className="flex gap-1 bg-white border border-slate-250 p-1 rounded-xl">
                      {(["weekly", "monthly", "yearly"] as const).map((period) => (
                        <button
                          key={period}
                          type="button"
                          onClick={() => setRecurringPeriod(period)}
                          className={`px-3 py-1 text-[10px] font-extrabold uppercase font-mono rounded-lg transition-all cursor-pointer ${
                            recurringPeriod === period
                              ? "bg-emerald-500 text-white shadow-3xs"
                              : "text-slate-500 hover:bg-slate-50"
                          }`}
                        >
                          {period}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 4: Collection Location & Dynamic Map selection */}
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
              <h3 className="text-xs font-bold text-slate-450 uppercase tracking-wider font-mono">
                3. Pickup Coordinates & Spatial Location Location Picker
              </h3>
              
              {/* GPS picker trigger */}
              <button
                type="button"
                onClick={handleGPSDetect}
                disabled={gpsDetecting}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold tracking-tight shadow-xs transition-colors cursor-pointer"
              >
                {gpsDetecting ? (
                  <>
                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                    <span>Resolving satellite link...</span>
                  </>
                ) : (
                  <>
                    <Compass className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    <span>Use Current GPS Location</span>
                  </>
                )}
              </button>
            </div>

            {/* Address input with local autocomplete */}
            <div className="relative mb-4">
              <label className="block text-[11px] text-slate-500 font-semibold mb-1">Search Address (with interactive autocomplete)</label>
              <div className="relative">
                <input
                  type="text"
                  value={pickupLocation}
                  onChange={(e) => {
                    setPickupLocation(e.target.value);
                    setAddressSearch(e.target.value);
                    if (e.target.value.length > 2) {
                      setShowSuggestions(true);
                    } else {
                      setShowSuggestions(false);
                    }
                  }}
                  onFocus={() => {
                    if (pickupLocation.length > 0) setShowSuggestions(true);
                  }}
                  placeholder="Type street number, avenue, block, or building..."
                  className="w-full pl-9 pr-12 py-2.5 bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-slate-800 rounded-xl text-xs focus:outline-none transition-colors"
                />
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                
                {pickupLocation && (
                  <button
                    type="button"
                    onClick={() => {
                      setPickupLocation("");
                      setAddressSearch("");
                      setShowSuggestions(false);
                    }}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 text-xs font-semibold"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Suggestions Overlay list */}
              {showSuggestions && (
                <div className="absolute left-0 right-0 top-18 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 overflow-hidden text-left py-1 animate-fadeIn">
                  <div className="px-3.5 py-1.5 bg-slate-50 text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-400">
                    Suggested Autocomplete Results
                  </div>
                  {ADDR_SUGGESTIONS.filter(item => 
                    item.address.toLowerCase().includes(addressSearch.toLowerCase())
                  ).map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setPickupLocation(item.address);
                        setDistrict(item.district);
                        setState(item.state);
                        setPincode(item.pincode);
                        setUserPin({ x: item.x, y: item.y });
                        setShowSuggestions(false);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-xs flex items-center space-x-2 transition-colors border-b border-slate-50 last:border-b-0 cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <div>
                        <span className="font-semibold text-slate-800 block leading-tight">{item.address}</span>
                        <span className="text-[10px] text-slate-450 font-mono italic leading-none">
                          {item.district}, {item.state} • ZIP {item.pincode}
                        </span>
                      </div>
                    </button>
                  ))}
                  {ADDR_SUGGESTIONS.filter(item => 
                    item.address.toLowerCase().includes(addressSearch.toLowerCase())
                  ).length === 0 && (
                    <div className="p-3 text-xs text-slate-400 italic text-center">
                      No matching verified system routes. Finish typing or drop a marker below.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Address fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-[11px] text-slate-500 font-semibold mb-1">State / Province</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Central State"
                  className="w-full px-3 py-2 bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-slate-800 rounded-xl text-xs focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 font-semibold mb-1">District / Ward</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="e.g. Queenstown"
                  className="w-full px-3 py-2 bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-slate-800 rounded-xl text-xs focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 font-semibold mb-1">Pincode / Postal Code</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="e.g. 138637"
                  className="w-full px-3 py-2 bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-slate-800 rounded-xl text-xs focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Sub-Feature: Nearby Collection Points Clickables */}
            <div className="mb-4">
              <span className="block text-[10px] font-mono text-slate-400 uppercase font-extrabold mb-1 px-1">
                Select Nearby Collection Drops (Click to auto-fill)
              </span>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {NEARBY_COLLECTION_POINTS.map((pt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => selectCollectionPoint(pt)}
                    className="p-2.5 text-left bg-white border border-slate-150 hover:border-emerald-500 hover:text-emerald-800 rounded-xl transition-all cursor-pointer text-xs"
                  >
                    <span className="block font-bold text-[11px] text-slate-800 lines-clamp-1">{pt.name}</span>
                    <span className="block text-[9px] text-slate-400 font-mono mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                      {pt.address}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-Feature: SVG Interactive map select */}
            <div className="relative border border-slate-200 rounded-3xl overflow-hidden mb-4 bg-slate-100/40" id="interactive-map">
              
              <div className="p-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 flex items-center">
                  <MapIcon className="w-3.5 h-3.5 text-slate-500 mr-1.5" />
                  Interactive Blueprint Map Selection
                </span>
                <span className="text-[10px] font-mono text-slate-405 font-medium">
                  Click blueprint zone to configure dispatch pin coordinates
                </span>
              </div>

              {/* Map grid canvas simulation representing spatial layout */}
              <div 
                className="relative h-44 cursor-crosshair overflow-hidden bg-slate-900 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.05)_1px,_transparent_1px)] bg-[size:16px_16px]"
                onClick={handleMapClick}
              >
                
                {/* Visual landmark 1 */}
                <div className="absolute top-6 left-12 opacity-30 text-[9px] font-mono text-white/50 flex items-center space-x-1 pointer-events-none">
                  <Building2 className="w-3 h-3" />
                  <span>North Station Depot</span>
                </div>

                {/* Visual landmark 2 */}
                <div className="absolute bottom-6 right-16 opacity-30 text-[9px] font-mono text-white/50 flex items-center space-x-1 pointer-events-none">
                  <Building2 className="w-3 h-3" />
                  <span>East Logistics Port</span>
                </div>

                {/* Fixed Receiver Node Pin on map */}
                <div 
                  className="absolute transition-transform flex flex-col items-center pointer-events-none"
                  style={{ left: `${receiverPin.x}%`, top: `${receiverPin.y}%`, transform: "translate(-50%, -100%)" }}
                >
                  <div className="flex bg-slate-950 text-white px-2 py-0.5 rounded text-[8px] font-mono whitespace-nowrap mb-0.5 uppercase tracking-wide border border-white/20 select-none shadow-sm font-semibold">
                    [Recipient] {receiverInfo.name.slice(0, 10)}...
                  </div>
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-white ring-4 ring-emerald-500/20 shadow-lg">
                    <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
                  </div>
                </div>

                {/* User dropping Pin on map */}
                <div 
                  className="absolute flex flex-col items-center pointer-events-none transition-all duration-300"
                  style={{ left: `${userPin.x}%`, top: `${userPin.y}%`, transform: "translate(-50%, -100%)" }}
                >
                  <div className="flex bg-emerald-600 text-white px-2 py-0.5 rounded text-[8px] font-mono whitespace-nowrap mb-0.5 uppercase tracking-wider select-none shadow-sm font-bold animate-fadeIn">
                    My Pickup Location
                  </div>
                  <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center border-2 border-white ring-4 ring-red-500/20 shadow-xl">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  </div>
                </div>

                {/* Dotted vector Route connection line for visuals */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                  <line 
                    x1={`${userPin.x}%`} 
                    y1={`${userPin.y - 4}%`} 
                    x2={`${receiverPin.x}%`} 
                    y2={`${receiverPin.y - 4}%`} 
                    stroke="#10b981" 
                    strokeWidth="2" 
                    strokeDasharray="4 4"
                    className="shimmer-path"
                  />
                </svg>

              </div>

              {/* Distance tracker stats footer */}
              <div className="p-3 bg-slate-900 border-t border-slate-800 text-white flex justify-between items-center text-xs font-mono">
                <span className="flex items-center text-slate-400">
                  <Navigation className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                  Spatial Metrics: S$ Registered Address Link
                </span>
                <span className="text-right">
                  Distance: <span className="text-emerald-400 font-bold">{calculatedDistance} km away</span>
                </span>
              </div>

            </div>
          </div>

          {/* Section 5: Logistics Details Preferred Dates */}
          <div>
            <h3 className="text-xs font-bold text-slate-450 uppercase tracking-wider font-mono mb-3">4. Preferred Date & Logistic Dispatch</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div>
                <label className="block text-[11px] text-slate-500 font-semibold mb-1">Logistics Method</label>
                <div className="relative">
                  <select
                    value={deliveryMethod}
                    onChange={(e) => setDeliveryMethod(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-slate-800 rounded-xl text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="Volunteer Pickup">Volunteer Dispatch (Free pickup)</option>
                    <option value="Courier Delivery">Courier Cargo Delivery (Instant route)</option>
                    <option value="Self Pickup">Self Drop-off (In-person depot)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 font-semibold mb-1">Preferred Pickup Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={preferredPickupDate}
                    onChange={(e) => setPreferredPickupDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-slate-800 rounded-xl text-xs focus:outline-none cursor-pointer"
                  />
                  <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 font-semibold mb-1">Preferred Time block</label>
                <div className="relative">
                  <select
                    value={preferredPickupTime}
                    onChange={(e) => setPreferredPickupTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-slate-800 rounded-xl text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="Morning (9am - 12pm)">Morning (9:00 AM - 12:00 PM)</option>
                    <option value="Afternoon (1pm - 5pm)">Afternoon (1:00 PM - 5:00 PM)</option>
                    <option value="Evening (6pm - 9pm)">Evening (6:00 PM - 9:00 PM)</option>
                  </select>
                </div>
              </div>

            </div>
          </div>

          {/* Form Trigger Footer buttons */}
          <div className="flex gap-4 pt-5 border-t border-slate-100 flex-row">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-3 border border-slate-200 hover:bg-slate-50 text-slate-650 rounded-xl text-xs font-bold transition-all cursor-pointer font-sans"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-2/3 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/10 flex items-center justify-center space-x-2 cursor-pointer font-sans"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing secure logistics ledger...</span>
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4 fill-white text-emerald-100" />
                  <span>Authorize Sponsorship & Record Ledger</span>
                </>
              )}
            </button>
          </div>

        </form>
      )}

    </div>
  );
}
