/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { User, DonationAction, DonationCategory, DonationStatus } from "../types";
import { 
  Heart, ShieldCheck, Mail, Share2, Award, Calendar, MapPin, 
  Settings, CheckCircle, Clock, Eye, Edit2, MessageSquare, 
  Lock, Globe, Users, TrendingUp, Sparkles, BookOpen, Gift, Coffee, Plus, ChevronRight, Search, ListFilter,
  Camera, Image as ImageIcon, Upload
} from "lucide-react";

interface DonorProfileProps {
  currentUser: User;
  actions: DonationAction[];
  onClose?: () => void;
  onUpdateUser?: (updated: Partial<User>) => void;
}

interface SampleDonor {
  id: string;
  name: string;
  username: string;
  bio: string;
  location: string;
  memberSince: string;
  isVerified: boolean;
  avatar: string;
  followerCount: number;
  isFollowing: boolean;
  donationStreak: string;
  totalDonationsCount: number;
  totalAmountDonated: number;
  beneficiariesCount: number;
  ngosSupportedCount: number;
  impactScore: number;
  supportedCauses: {
    education: boolean;
    healthcare: boolean;
    foodAssistance: boolean;
    disasterRelief: boolean;
    elderlyCare: boolean;
    childWelfare: boolean;
  };
  timelineEvents: Array<{
    id: string;
    type: string;
    title: string;
    desc: string;
    date: string;
    tag: string;
  }>;
  reviewsAppreciation: Array<{
    id: string;
    author: string;
    role: string;
    text: string;
    date: string;
  }>;
}

export default function DonorProfile({ currentUser, actions, onClose, onUpdateUser }: DonorProfileProps) {
  // 1. STATEFUL DONORS DATABASE
  // We initialize the list of sample donors, with Dr. Sarah Jenkins mapped directly to the active logged-in User
  const [donorsList, setDonorsList] = useState<SampleDonor[]>([
    {
      id: currentUser.id,
      name: currentUser.name || "Dr. Sarah Jenkins",
      username: currentUser.username || "sarah_jenkins_impact",
      bio: currentUser.bio || "Surgical Specialist dedicated to global pediatric healthcare support and digital education parity. Sponsoring textbook routes and direct medical supplies tracking since 2024.",
      location: currentUser.region || "San Francisco, CA",
      memberSince: "February 24, 2024",
      isVerified: true,
      avatar: currentUser.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
      followerCount: 38,
      isFollowing: false,
      donationStreak: "4 Months",
      totalDonationsCount: actions.filter(act => act.donorId === currentUser.id).length || 7,
      totalAmountDonated: actions.filter(act => act.donorId === currentUser.id).reduce((sum, act) => sum + (act.amount || 0), 0) || 12450,
      beneficiariesCount: Math.ceil((actions.filter(act => act.donorId === currentUser.id).length || 7) * 1.4) || 6,
      ngosSupportedCount: 4,
      impactScore: 920,
      supportedCauses: {
        education: true,
        healthcare: true,
        foodAssistance: true,
        disasterRelief: false,
        elderlyCare: true,
        childWelfare: true
      },
      timelineEvents: [
        {
          id: "event-1",
          type: "milestone",
          title: "Monthly Hero Medal Awarded",
          desc: "Achieved the 3+ Month Continuous Support streak on direct aid.",
          date: "June 2026",
          tag: "Milestone"
        },
        {
          id: "event-2",
          type: "donation",
          title: "Dispatched S$ 1,200 dry groceries cargo package",
          desc: "Routed cargo directly to Hope Pioneer Foundation central food depot.",
          date: "May 18, 2026",
          tag: "Dispatched"
        },
        {
          id: "event-3",
          type: "ngo",
          title: "Validated Educational Material Route Partnership",
          desc: "Established textbook delivery logistics mapping with Singapore Youth Scholars.",
          date: "March 11, 2026",
          tag: "Verification"
        },
        {
          id: "event-4",
          type: "donation",
          title: "First Donation of S$ 2,500 via Money Ledger",
          desc: "Successfully sponsored clean water purification units campaign.",
          date: "February 25, 2024",
          tag: "First Donation"
        }
      ],
      reviewsAppreciation: [
        {
          id: "review-1",
          author: "Director, Hope Pioneer Foundation",
          role: "NGO Representative",
          text: "Thanks to Sarah's consistent educational book drives, over 120 primary grade children at Eldoret School received mathematics textbooks in pristine condition. Live tracking visual logs were bulletproof.",
          date: "3 weeks ago"
        },
        {
          id: "review-2",
          author: "Rahman Family Hub",
          role: "Beneficiary Family",
          text: "Our children received the study table package safely yesterday. A heartfelt message of deep gratitude for providing books and household items directly to our dispatch hub.",
          date: "April 2026"
        },
        {
          id: "review-3",
          author: "Integrity Lead",
          role: "Community Feedback",
          text: "A model donor profile setting the template for direct-aid social responsibility on Donare.",
          date: "January 2026"
        }
      ]
    },
    {
      id: "marcus_vance_builds",
      name: "Marcus Vance",
      username: "marcus_vance_builds",
      bio: "Software architect supporting agricultural technology grants, sustainable vertical farming equipment, and local organic food distribution networks.",
      location: "Singapore",
      memberSince: "January 15, 2025",
      isVerified: true,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      followerCount: 48,
      isFollowing: false,
      donationStreak: "6 Months",
      totalDonationsCount: 15,
      totalAmountDonated: 24700,
      beneficiariesCount: 22,
      ngosSupportedCount: 6,
      impactScore: 1855,
      supportedCauses: {
        education: false,
        healthcare: true,
        foodAssistance: true,
        disasterRelief: true,
        elderlyCare: true,
        childWelfare: false
      },
      timelineEvents: [
        {
          id: "marcus-ev-1",
          type: "milestone",
          title: "AgriTech Micro-Grants Completed",
          desc: "Funded automatic solar-powered water pump controllers with integrated cellular logging.",
          date: "June 2026",
          tag: "AgriTech"
        },
        {
          id: "marcus-ev-2",
          type: "donation",
          title: "S$ 5,000 Organic Fertilizer Dispatch",
          desc: "Routed organic crop boosters directly via Singapore Youth Scholars logistics network.",
          date: "April 10, 2026",
          tag: "Dispatched"
        },
        {
          id: "marcus-ev-3",
          type: "milestone",
          title: "Signed Platform Trust Manifesto",
          desc: "Granted and verified automated high-reliability hardware developer ledger credentials.",
          date: "January 15, 2025",
          tag: "Joined"
        }
      ],
      reviewsAppreciation: [
        {
          id: "marcus-rev-1",
          author: "Eco-Lead, Green Earth Hub",
          role: "Partner Specialist",
          text: "Marcus's automated irrigation sensors helped three vertical greenhouses save 40% water this semester. Sincere respect for open telemetry transparency.",
          date: "2 months ago"
        }
      ]
    },
    {
      id: "amina_gives",
      name: "Amina Al-Mansoor",
      username: "amina_gives",
      bio: "Philanthropist focused on clean water infrastructure pipelines, emergency disaster relief, and child educational supplies globally.",
      location: "Dubai, UAE",
      memberSince: "August 10, 2024",
      isVerified: true,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      followerCount: 124,
      isFollowing: false,
      donationStreak: "12 Months",
      totalDonationsCount: 42,
      totalAmountDonated: 98500,
      beneficiariesCount: 160,
      ngosSupportedCount: 11,
      impactScore: 5200,
      supportedCauses: {
        education: true,
        healthcare: false,
        foodAssistance: true,
        disasterRelief: true,
        elderlyCare: false,
        childWelfare: true
      },
      timelineEvents: [
        {
          id: "amina-ev-1",
          type: "donation",
          title: "Two Water Reverse-Osmosis Stations Dispatched",
          desc: "Transferred heavy-duty purification units to arid community clusters.",
          date: "June 05, 2026",
          tag: "Dispatched"
        },
        {
          id: "amina-ev-2",
          type: "ngo",
          title: "Educational Scholarship Match",
          desc: "Completed full-year tuition sponsorship for 50 primary students in partnered routes.",
          date: "January 2026",
          tag: "Endorsement"
        }
      ],
      reviewsAppreciation: [
        {
          id: "amina-rev-1",
          author: "Singapore Youth Scholars Corp",
          role: "NGO Representative",
          text: "Amina sponsored 50 primary scholarship stipends without any administrative noise or delays. Truly setting an amazing blueprint on Donare.",
          date: "January 2026"
        }
      ]
    },
    {
      id: "elena_care",
      name: "Elena Rostova",
      username: "elena_care",
      bio: "Social worker championing senior village care systems, companion tablet trials, and physical rehabilitation helper equipment.",
      location: "Berlin, Germany",
      memberSince: "November 05, 2025",
      isVerified: false,
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
      followerCount: 29,
      isFollowing: false,
      donationStreak: "2 Months",
      totalDonationsCount: 6,
      totalAmountDonated: 8400,
      beneficiariesCount: 9,
      ngosSupportedCount: 2,
      impactScore: 680,
      supportedCauses: {
        education: false,
        healthcare: true,
        foodAssistance: false,
        disasterRelief: false,
        elderlyCare: true,
        childWelfare: false
      },
      timelineEvents: [
        {
          id: "elena-ev-1",
          type: "donation",
          title: "Elderly Rehabilitation Support Package",
          desc: "Procured and delivered 10 advanced multi-grip smart walking canes to care hosts.",
          date: "May 22, 2026",
          tag: "Delivered"
        }
      ],
      reviewsAppreciation: [
        {
          id: "elena-rev-1",
          author: "Eldoret Community Medical Corps",
          role: "Recipients Lead",
          text: "Safe shipment of walking accessories received on target. Sincere greetings of joy!",
          date: "May 2026"
        }
      ]
    }
  ]);

  // 2. ACTIVE SELECTION MANAGEMENT
  const [selectedDonorId, setSelectedDonorId] = useState<string>(currentUser.id);
  
  // Find current active donor details
  const activeDonor = useMemo(() => {
    return donorsList.find(d => d.id === selectedDonorId) || donorsList[0];
  }, [donorsList, selectedDonorId]);

  // Search state variables
  const [searchQuery, setSearchQuery] = useState("");
  const [causeFilter, setCauseFilter] = useState<string>("all");

  // Filter list of donors dynamically
  const filteredDonors = useMemo(() => {
    return donorsList.filter(donor => {
      const matchQuery = 
        donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        donor.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        donor.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        donor.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchCause = 
        causeFilter === "all" || 
        (donor.supportedCauses[causeFilter as keyof typeof donor.supportedCauses] === true);

      return matchQuery && matchCause;
    });
  }, [donorsList, searchQuery, causeFilter]);

  // View Mode selection: Owner Edit View vs Public Visitor View
  // Owner view is only available when the logged-in owner donor is selected
  const [viewMode, setViewMode] = useState<"owner" | "visitor">("owner");

  // Force visitor mode if switching to another donor
  const handleSelectDonor = (donorId: string) => {
    setSelectedDonorId(donorId);
    if (donorId === currentUser.id) {
      setViewMode("owner");
    } else {
      setViewMode("visitor");
    }
  };

  // Follow/Unfollow toggle per donor (which counts their followers recursively!)
  const handleFollowClick = () => {
    setDonorsList(prev => prev.map(d => {
      if (d.id === activeDonor.id) {
        const nextIsFollowing = !d.isFollowing;
        return {
          ...d,
          isFollowing: nextIsFollowing,
          followerCount: nextIsFollowing ? d.followerCount + 1 : d.followerCount - 1
        };
      }
      return d;
    }));
  };

  // State elements for contact overlay and lists
  const [showShareToast, setShowShareToast] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSuccess, setContactSuccess] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);

  // Editable fields for Owner profile
  // We keep this synced to the donorsList state and propagate to currentUser
  const handleUpdateOwnerField = (field: keyof SampleDonor, value: any) => {
    setDonorsList(prev => prev.map(d => {
      if (d.id === currentUser.id) {
        return { ...d, [field]: value };
      }
      return d;
    }));

    if (onUpdateUser) {
      if (field === "name") {
        onUpdateUser({ name: value });
      } else if (field === "username") {
        onUpdateUser({ username: value });
      } else if (field === "bio") {
        onUpdateUser({ bio: value });
      } else if (field === "location") {
        onUpdateUser({ region: value });
      } else if (field === "avatar") {
        onUpdateUser({ avatar: value });
      }
    }
  };

  const handleToggleCauseOwner = (cause: keyof SampleDonor["supportedCauses"]) => {
    setDonorsList(prev => prev.map(d => {
      if (d.id === currentUser.id) {
        return {
          ...d,
          supportedCauses: {
            ...d.supportedCauses,
            [cause]: !d.supportedCauses[cause]
          }
        };
      }
      return d;
    }));
  };

  // Choose from preset highly realistic avatars
  const avatarPresets = [
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
  ];

  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryCategory, setGalleryCategory] = useState("Medical & Science");
  const [customAvatarUrl, setCustomAvatarUrl] = useState("");
  const [urlSuccessMsg, setUrlSuccessMsg] = useState("");

  const avatarGallery = [
    {
      category: "Medical & Science",
      images: [
        { url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=350", label: "Dr. Sarah Jenkins" },
        { url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=350", label: "Dr. Catherine Lin" },
        { url: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=350", label: "Dr. Aris Vance" },
        { url: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=350", label: "Dr. Jordan Blake" },
        { url: "https://images.unsplash.com/photo-1594824813573-246434de83fb?w=350", label: "Dr. Priya Patel" },
        { url: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=350", label: "Dr. Kenji Sato" }
      ]
    },
    {
      category: "Community & Activists",
      images: [
        { url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=350", label: "Mateo Silva" },
        { url: "https://images.unsplash.com/photo-1548142813-c348350df52b?w=350", label: "Aisya Rahman" },
        { url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=350", label: "Amina Al-Mansoor" },
        { url: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=350", label: "Lucas Kim" },
        { url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=350", label: "Chloe Zhao" },
        { url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=350", label: "Nia Mwangi" }
      ]
    },
    {
      category: "NGO Leaders & Coordinators",
      images: [
        { url: "https://images.unsplash.com/photo-1579208575657-c595a05383b7?w=350", label: "SBR Red Cross Rep" },
        { url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=350", label: "Elena Rostova" },
        { url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=350", label: "Marcus Vance" },
        { url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=350", label: "Sophia Sterling" },
        { url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=350", label: "David Finch" },
        { url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=350", label: "Robert Chen" }
      ]
    },
    {
      category: "Abstract & Nature",
      images: [
        { url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=350", label: "Cosmic Code Web" },
        { url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=350", label: "Forest Sunlight" },
        { url: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=350", label: "Green Oasis Roots" },
        { url: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=350", label: "Mischief Pug Dog" },
        { url: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=350", label: "Golden Autumn Leaf" },
        { url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=350", label: "Mountain Mist Ridge" }
      ]
    }
  ];

  // Global Privacy Settings state (as requested)
  const [isPublicProfile, setIsPublicProfile] = useState(true);
  const [isAnonymousDonation, setIsAnonymousDonation] = useState(false);
  const [hideDonationAmounts, setHideDonationAmounts] = useState(false);
  const [hideContactInfo, setHideContactInfo] = useState(false);

  // Share profile Link copy mock
  const handleShareClick = () => {
    const mockUrl = `${window.location.origin}/donors/${activeDonor.username}`;
    navigator.clipboard.writeText(mockUrl);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3000);
  };

  // Direct mock contact action
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSuccess(true);
    setTimeout(() => {
      setContactSuccess(false);
      setShowContactModal(false);
      setContactSubject("");
      setContactMessage("");
    }, 2500);
  };

  // Simple Helper to find appropriate user name representation in visitor vs owner rules
  const renderDisplayName = () => {
    if (activeDonor.id === currentUser.id && isAnonymousDonation && viewMode === "visitor") {
      return "Anonymous Contributor";
    }
    return activeDonor.name;
  };

  const renderUsername = () => {
    if (activeDonor.id === currentUser.id && isAnonymousDonation && viewMode === "visitor") {
      return "anonymous_donor";
    }
    return activeDonor.username;
  };

  // List of generated mock registered followers we can display to "count" the followers literally!
  const getFollowersList = () => {
    // Generates a mock list based on followerCount
    return [
      { name: "Direct Response NGO Asia", handle: "direct_reply", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100", verified: true },
      { name: "Sponsor Scholars Hub", handle: "scholars_unite", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100", verified: true },
      { name: "Singapore Health Watch", handle: "sg_health_audits", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", verified: true },
      { name: "Care Volunteers Circle", handle: "care_volunteers", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100", verified: false }
    ].slice(0, Math.min(activeDonor.followerCount, 4));
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 font-sans" id="donor-profile-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TOP REGISTRY HEADER & INTEGRATED SEARCH BAR */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            
            {/* Title Block */}
            <div>
              <div className="flex items-center space-x-2">
                <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
                  <Globe className="w-5 h-5" />
                </span>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Verified Donors Registry</h1>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Explore verified change-makers, trace dispatch history lists, and follow real-time social metrics.
              </p>
            </div>

            {/* Quick Stats on overall database */}
            <div className="flex items-center space-x-6 text-xs text-slate-500 font-sans">
              <div className="bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100 text-center">
                <span className="font-bold text-slate-800 text-sm block">{donorsList.length}</span>
                <span>Active Donors</span>
              </div>
              <div className="bg-emerald-50/50 px-4 py-2.5 rounded-2xl border border-emerald-100/50 text-emerald-800 text-center">
                <span className="font-bold text-emerald-950 text-sm block">100%</span>
                <span>Direct Verified</span>
              </div>
            </div>

          </div>

          {/* DEDICATED SEARCH ROW */}
          <div className="mt-6 pt-6 border-t border-slate-50 grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Input Element */}
            <div className="md:col-span-6 relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search donors by name, location, handle, or bio keywords..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-2xl text-xs focus:outline-none transition-all placeholder:text-slate-400"
                id="donor-search-input"
              />
            </div>

            {/* Cause Filtering Selector */}
            <div className="md:col-span-3 relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <ListFilter className="w-4 h-4" />
              </span>
              <select
                value={causeFilter}
                onChange={(e) => setCauseFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-2xl text-xs focus:outline-none transition-all cursor-pointer text-slate-700"
                id="donor-cause-select"
              >
                <option value="all">🌐 Any Supported Cause</option>
                <option value="education">📚 Education</option>
                <option value="healthcare">🏥 Healthcare</option>
                <option value="foodAssistance">🍲 Food Assistance</option>
                <option value="disasterRelief">🌋 Disaster Relief</option>
                <option value="elderlyCare">👵 Elderly Care</option>
                <option value="childWelfare">👶 Child Welfare</option>
              </select>
            </div>

            {/* Switch view logic when looking at own profile */}
            <div className="md:col-span-3 flex justify-end">
              {selectedDonorId === currentUser.id ? (
                <div className="flex items-center bg-slate-100 p-1 rounded-2xl w-full">
                  <button
                    id="btn-view-owner"
                    onClick={() => setViewMode("owner")}
                    className={`flex-1 flex items-center justify-center space-x-1.5 py-2.5 rounded-xl text-xs font-bold tracking-tight transition-all cursor-pointer ${
                      viewMode === "owner" 
                        ? "bg-white text-slate-900 shadow-xs" 
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-600" />
                    <span>My Settings</span>
                  </button>
                  <button
                    id="btn-view-visitor"
                    onClick={() => setViewMode("visitor")}
                    className={`flex-1 flex items-center justify-center space-x-1.5 py-2.5 rounded-xl text-xs font-bold tracking-tight transition-all cursor-pointer ${
                      viewMode === "visitor" 
                        ? "bg-emerald-600 text-white shadow-xs" 
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Public View</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full px-4 py-2 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-100/60 text-xs text-center font-semibold">
                  <span>✨ Viewing public visitor profile</span>
                </div>
              )}
            </div>

          </div>

          {/* SEARCH RESULTS MATCHES SUB GRID */}
          <div className="mt-4">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-2">Matching Directory profiles ({filteredDonors.length})</span>
            <div className="flex flex-wrap gap-2.5">
              {filteredDonors.map((donor) => {
                const isSelected = donor.id === selectedDonorId;
                return (
                  <button
                    key={donor.id}
                    id={`donor-card-select-${donor.id}`}
                    onClick={() => handleSelectDonor(donor.id)}
                    className={`flex items-center space-x-3 p-2 px-3.5 rounded-2xl border transition-all cursor-pointer text-left ${
                      isSelected 
                        ? "bg-slate-900 border-slate-900 text-white shadow-md scale-102"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100/70 hover:border-slate-350"
                    }`}
                  >
                    <img
                      src={donor.avatar}
                      alt={donor.name}
                      className="w-7 h-7 rounded-full object-cover border"
                    />
                    <div>
                      <div className="flex items-center space-x-1 font-semibold text-xs font-sans">
                        <span>{donor.id === currentUser.id && isAnonymousDonation && isSelected && viewMode === "visitor" ? "Anonymous" : donor.name}</span>
                        {donor.isVerified && (
                          <ShieldCheck className="w-3.5 h-3.5 fill-current text-sky-400" />
                        )}
                        {donor.id === currentUser.id && (
                          <span className="text-[8px] uppercase tracking-wide bg-emerald-600 text-white px-1.5 py-0.2 rounded font-mono font-black">Hold</span>
                        )}
                      </div>
                      <span className={`text-[10px] font-mono block ${isSelected ? "text-slate-300" : "text-slate-400"}`}>
                        @{donor.id === currentUser.id && isAnonymousDonation && isSelected && viewMode === "visitor" ? "anonymous" : donor.username} • {donor.followerCount} followers
                      </span>
                    </div>
                  </button>
                );
              })}
              {filteredDonors.length === 0 && (
                <div className="text-xs text-slate-400 font-sans p-2">
                  No donors matched your filter parameters. Try searching for "Sarah", "Marcus", "Amina" or cause labels.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Global Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT 4 COLS: Profile Header Card & Basic Information Edit/View */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Primary Details Card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm relative overflow-hidden" id="donor-primary-overview-card">
              {/* Highlight background strip */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-emerald-500" />
              
              <div className="flex flex-col items-center text-center mt-3">
                {/* Avatar with optional ring */}
                <div className="relative group">
                  <img
                    src={activeDonor.avatar}
                    alt={activeDonor.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md ring-4 ring-emerald-50 transition-all duration-200 group-hover:scale-102"
                  />
                  {activeDonor.isVerified && (
                    <div 
                      className="absolute bottom-0 right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-xs z-10"
                      title="Identity Verified"
                    >
                      <ShieldCheck className="w-4 h-4 fill-current text-white" />
                    </div>
                  )}
                  {viewMode === "owner" && activeDonor.id === currentUser.id && (
                    <button
                      onClick={() => setShowGalleryModal(true)}
                      className="absolute inset-x-0 inset-y-0 bg-slate-900/60 hover:bg-slate-900/75 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-250 cursor-pointer border-4 border-white"
                      title="Browse Photo Gallery"
                    >
                      <Camera className="w-5 h-5 mb-0.5 text-emerald-300 animate-pulse" />
                      <span className="text-[8px] font-black tracking-widest font-mono uppercase bg-emerald-600 px-1.5 py-0.5 rounded-full">Gallery</span>
                    </button>
                  )}
                </div>

                {/* Core Name & Username */}
                <div className="mt-4">
                  <div className="flex items-center justify-center space-x-1">
                    <h2 className="text-xl font-bold font-sans text-slate-850">
                      {renderDisplayName()}
                    </h2>
                    {activeDonor.isVerified && (
                      <span className="text-[10px] bg-emerald-50 font-mono font-bold text-emerald-800 px-2 py-0.5 rounded-md uppercase">
                        Verified
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-slate-400 block mt-0.5" id="profile-donor-handle">
                    @{renderUsername()}
                  </span>
                </div>

                {/* Followers & Streaks bar with CLICKABLE FOLLOWER COUNT to count followers */}
                <div className="flex justify-center items-center space-x-4 mt-4 py-2 border-y border-slate-50 w-full text-xs text-slate-500 font-sans">
                  <button 
                    onClick={() => setShowFollowersModal(true)}
                    className="hover:bg-slate-50 p-1.5 rounded-xl transition-all cursor-pointer text-center group flex-1"
                    title="Click to view followers count ledger"
                    id="btn-trigger-followers"
                  >
                    <span className="font-sans font-black text-slate-850 text-base block group-hover:text-emerald-600 transition-colors" id="num-followers-count">
                      {activeDonor.followerCount}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wide block mt-0.5">Followers 👤</span>
                  </button>
                  <div className="border-l border-slate-200 h-6" />
                  <div className="flex-1 text-center">
                    <span className="font-bold text-slate-850 text-sm block flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5 mr-0.5 text-amber-500 fill-current" />
                      {activeDonor.donationStreak}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wide block mt-0.5">Streak</span>
                  </div>
                </div>

                {/* Bio Description Details */}
                <p className="mt-4 text-xs text-slate-600 leading-relaxed max-w-sm italic">
                  "{activeDonor.bio}"
                </p>

                {/* Metadata parameters */}
                <div className="mt-4 w-full space-y-2 border-t border-slate-50 pt-4 text-xs text-slate-500">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>Location: <strong className="text-slate-700">{activeDonor.location}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>Member Since: <strong className="text-slate-700">{activeDonor.memberSince}</strong></span>
                  </div>
                </div>

                {/* Action Buttons under Primary Column Card */}
                <div className="mt-6 flex gap-3.5 w-full">
                  <button
                    id="btn-follow-donor"
                    onClick={handleFollowClick}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                      activeDonor.isFollowing 
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100" 
                        : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/10"
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${activeDonor.isFollowing ? "fill-current text-emerald-600" : ""}`} />
                    <span>{activeDonor.isFollowing ? "Following" : "Follow"}</span>
                  </button>

                  <button
                    id="btn-share-profile"
                    onClick={handleShareClick}
                    className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 rounded-xl transition-all cursor-pointer"
                    title="Copy Profile Shareable Link"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  {(!hideContactInfo || viewMode === "owner") && (
                    <button
                      id="btn-contact-donor"
                      onClick={() => setShowContactModal(true)}
                      className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 rounded-xl transition-all cursor-pointer"
                      title="Send Message"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Copied alert pop-up toast */}
                {showShareToast && (
                  <div className="p-2 text-center bg-slate-900 text-white rounded-lg mt-3 text-[10px] w-full animate-fadeIn" id="toast-copied">
                    ✨ Share Link copied to clipboard!
                  </div>
                )}
              </div>
            </div>

            {/* OWNER MODIFIABLE EDIT FORMS & PRIVACY SECTION (Available only on own profile and in owner mode) */}
            {viewMode === "owner" && activeDonor.id === currentUser.id && (
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center space-x-2 pb-3 border-b border-slate-50">
                  <Settings className="w-4 h-4 text-slate-600" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">Profile Control Panel</h3>
                </div>

                {/* Edit Basic Fields */}
                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Display Name</label>
                    <input
                      type="text"
                      value={activeDonor.name}
                      onChange={(e) => handleUpdateOwnerField("name", e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-250 focus:border-slate-800 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Username Handle</label>
                    <input
                      type="text"
                      value={activeDonor.username}
                      onChange={(e) => handleUpdateOwnerField("username", e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-250 focus:border-slate-800 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Bio Outline</label>
                    <textarea
                      rows={3}
                      value={activeDonor.bio}
                      onChange={(e) => handleUpdateOwnerField("bio", e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-250 focus:border-slate-800 rounded-xl text-xs focus:outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Regional Coordinates</label>
                    <input
                      type="text"
                      value={activeDonor.location}
                      onChange={(e) => handleUpdateOwnerField("location", e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-250 focus:border-slate-800 rounded-xl text-xs focus:outline-none"
                    />
                  </div>

                  {/* Quick Avatar selection grid with Choose from Gallery trigger */}
                  <div>
                    <span className="block text-slate-550 font-bold mb-1.5">Select Profile Photo</span>
                    <div className="flex items-center space-x-2.5">
                      <div className="flex -space-x-1.5 overflow-hidden">
                        {avatarPresets.map((preset, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleUpdateOwnerField("avatar", preset)}
                            className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                              activeDonor.avatar === preset ? "border-emerald-500 scale-110 z-10" : "border-white opacity-85 hover:opacity-100 hover:z-10"
                            }`}
                          >
                            <img src={preset} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                      
                      {/* Browse Gallery trigger button */}
                      <button
                        type="button"
                        onClick={() => setShowGalleryModal(true)}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/50 hover:border-emerald-300 rounded-xl font-bold text-[11px] transition-all cursor-pointer"
                        id="btn-open-gallery"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Browse Gallery 🖼️</span>
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-1.5">
                      Choose from a categorized high-res archive of curated personas.
                    </span>
                  </div>
                </div>

                {/* Privacy Checkboxes */}
                <div className="pt-4 border-t border-slate-50 space-y-3">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Consent & Privacy Rules</h4>
                  
                  <label className="flex items-center space-x-2.5 cursor-pointer text-xs group">
                    <input
                      type="checkbox"
                      checked={isPublicProfile}
                      onChange={(e) => setIsPublicProfile(e.target.checked)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <span className="font-semibold text-slate-700 block group-hover:text-slate-900">Public Live Profile</span>
                      <p className="text-[10px] text-slate-400 leading-none mt-0.5">Allows beneficiaries and NGOs back-linking discoverability</p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-2.5 cursor-pointer text-xs group">
                    <input
                      type="checkbox"
                      checked={isAnonymousDonation}
                      onChange={(e) => setIsAnonymousDonation(e.target.checked)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <span className="font-semibold text-slate-700 block group-hover:text-slate-900">Anonymous Donations Mode</span>
                      <p className="text-[10px] text-slate-400 leading-none mt-0.5">Replaces clear text identifiers on direct shipment trackers</p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-2.5 cursor-pointer text-xs group">
                    <input
                      type="checkbox"
                      checked={hideDonationAmounts}
                      onChange={(e) => setHideDonationAmounts(e.target.checked)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <span className="font-semibold text-slate-700 block group-hover:text-slate-900">Hide Monetary Quantities</span>
                      <p className="text-[10px] text-slate-400 leading-none mt-0.5">Restricts actual grant amounts from visitor lists</p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-2.5 cursor-pointer text-xs group">
                    <input
                      type="checkbox"
                      checked={hideContactInfo}
                      onChange={(e) => setHideContactInfo(e.target.checked)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <span className="font-semibold text-slate-700 block group-hover:text-slate-900">Mute Visitor Messages</span>
                      <p className="text-[10px] text-slate-400 leading-none mt-0.5">Disable contact mailbox triggers temporarily</p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Supported Causes Section */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center space-x-1.5 pb-3 border-b border-slate-50 mb-4">
                <Heart className="w-4 h-4 text-emerald-600 mr-1" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">Supported Cause Focuses</h3>
              </div>

              {viewMode === "owner" && activeDonor.id === currentUser.id ? (
                <div className="space-y-2.5 text-xs">
                  {Object.entries(activeDonor.supportedCauses).map(([key, value]) => (
                    <label key={key} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors cursor-pointer capitalize font-sans">
                      <span className="text-slate-700 font-semibold">
                        {key.replace(/([A-Z])/g, " $1")}
                      </span>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={() => handleToggleCauseOwner(key as keyof SampleDonor["supportedCauses"])}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                      />
                    </label>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {Object.entries(activeDonor.supportedCauses)
                    .filter(([_, value]) => value)
                    .map(([key]) => (
                      <span 
                        key={key} 
                        className="text-[10px] font-bold font-sans bg-emerald-50 text-emerald-800 border border-emerald-100 px-3 py-1 rounded-full capitalize"
                      >
                        ✓ {key.replace(/([A-Z])/g, " $1")}
                      </span>
                    ))}
                  {Object.values(activeDonor.supportedCauses).filter(v => v).length === 0 && (
                    <span className="text-xs text-slate-400 italic">No cause filters activated.</span>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT 8 COLS: Stats, timeline, badges, list, reviews */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Impact Statistics Grid */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
              <span className="block text-[10px] bg-slate-100 font-mono tracking-widest text-slate-400 uppercase font-black px-2.5 py-1 rounded-md mb-4 w-max">
                Live Performance Metrics
              </span>
              <h3 className="text-lg font-bold text-slate-900 mb-6">Aggregate Social Trust Ledger</h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-mono uppercase tracking-wider">Total Donations</span>
                    <span className="text-2xl sm:text-3xl font-black text-slate-850 mt-1 block leading-tight">
                      {activeDonor.totalDonationsCount}
                    </span>
                  </div>
                  <div className="text-[9px] font-mono text-slate-400 mt-2 bg-slate-200/50 px-2 py-0.5 rounded w-max">
                    Immutable logs
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-mono uppercase tracking-wider">Total Sponsored</span>
                    <span className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1 block leading-tight">
                      {hideDonationAmounts && viewMode === "visitor" && activeDonor.id === currentUser.id ? "S$ ••••" : `S$ ${activeDonor.totalAmountDonated.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="text-[9px] font-mono text-emerald-800 mt-2 bg-emerald-50 px-2 py-0.5 rounded w-max font-bold font-sans">
                    100% receipted
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-mono uppercase tracking-wider">Beneficiaries Helped</span>
                    <span className="text-2xl sm:text-3xl font-black text-slate-850 mt-1 block leading-tight">
                      {activeDonor.beneficiariesCount}
                    </span>
                  </div>
                  <div className="text-[9px] font-mono text-violet-800 mt-2 bg-violet-50 px-2 py-0.5 rounded w-max font-bold font-sans">
                    Direct matched
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-mono uppercase tracking-wider">Humanitarian NGOs</span>
                    <span className="text-2xl sm:text-3xl font-black text-slate-850 mt-1 block leading-tight">
                      {activeDonor.ngosSupportedCount}
                    </span>
                  </div>
                  <div className="text-[9px] font-mono text-blue-800 mt-2 bg-blue-50 px-2 py-0.5 rounded w-max font-bold font-sans">
                    Audited partners
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-mono uppercase tracking-wider">AI Impact Score</span>
                    <span className="text-2xl sm:text-3xl font-black text-slate-800 mt-1 block leading-tight flex items-center">
                      <TrendingUp className="w-5 h-5 text-emerald-500 mr-1.5" />
                      {activeDonor.impactScore}
                    </span>
                  </div>
                  <div className="text-[9px] font-mono text-amber-800 mt-2 bg-amber-50 px-2 py-0.5 rounded w-max font-bold font-sans">
                    Trust Rating
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-mono uppercase tracking-wider">Active Streak</span>
                    <span className="text-2xl sm:text-3xl font-black text-indigo-700 mt-1 block leading-tight">
                      {activeDonor.donationStreak}
                    </span>
                  </div>
                  <div className="text-[9px] font-mono text-indigo-800 mt-2 bg-indigo-50 px-2 py-0.5 rounded w-max font-bold font-sans">
                    Continuous aid
                  </div>
                </div>

              </div>
            </div>

            {/* Achievements & Badges representation */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-4">Earned Impact Medals</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    id: "first_donation",
                    name: "First Donation",
                    desc: "Completed first verified contribution on blockchain cargo tracker",
                    icon: <Award className="w-5 h-5" />,
                    color: "bg-emerald-50 text-emerald-700 border-emerald-100",
                    unlocked: true
                  },
                  {
                    id: "comm_supporter",
                    name: "Community Supporter",
                    desc: "Sponsored over 5 separate verified regional NGO programs",
                    icon: <Users className="w-5 h-5" />,
                    color: "bg-blue-50 text-blue-700 border-blue-100",
                    unlocked: activeDonor.totalDonationsCount >= 5
                  },
                  {
                    id: "edu_champion",
                    name: "Education Champion",
                    desc: "Funded custom school desks, stationery, or library textbooks",
                    icon: <BookOpen className="w-5 h-5" />,
                    color: "bg-purple-50 text-purple-700 border-purple-100",
                    unlocked: activeDonor.supportedCauses.education
                  },
                  {
                    id: "food_donor",
                    name: "Food Donor",
                    desc: "Dispatched direct emergency organic food crop packages",
                    icon: <Gift className="w-5 h-5" />,
                    color: "bg-amber-50 text-amber-700 border-amber-100",
                    unlocked: activeDonor.supportedCauses.foodAssistance
                  },
                  {
                    id: "top_contributor",
                    name: "Top Contributor",
                    desc: "Contributed more than S$10,000 to public routes",
                    icon: <Sparkles className="w-5 h-5" />,
                    color: "bg-rose-50 text-rose-700 border-rose-100",
                    unlocked: activeDonor.totalAmountDonated >= 10000
                  },
                  {
                    id: "monthly_hero",
                    name: "Monthly Hero",
                    desc: "Maintained a continuous donation streak on platform ledger",
                    icon: <Coffee className="w-5 h-5" />,
                    color: "bg-teal-50 text-teal-700 border-teal-100",
                    unlocked: true
                  }
                ].map((badge) => (
                  <div 
                    key={badge.id}
                    className={`p-4 rounded-2xl border flex items-start space-x-3.5 transition-all ${
                      badge.unlocked 
                        ? `${badge.color} bg-opacity-70 shadow-2xs` 
                        : "bg-slate-50 border-slate-200 text-slate-400 opacity-60"
                    }`}
                  >
                    <div className="p-2.5 rounded-xl bg-white border border-slate-150 flex items-center justify-center shadow-2xs">
                      {badge.icon}
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-xs font-sans tracking-tight text-slate-800">
                          {badge.name}
                        </span>
                        {badge.unlocked && (
                          <span className="text-[8px] font-mono font-bold bg-white text-slate-800 px-1.5 py-0.2 rounded border">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] font-sans mt-0.5 leading-normal text-slate-600">
                        {badge.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline Column */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-6">Historical Impact Timeline</h3>
              
              <div className="relative border-l-2 border-slate-100 pl-6 ml-3 space-y-6">
                {activeDonor.timelineEvents.map((ev) => (
                  <div key={ev.id} className="relative group">
                    {/* Ring dot handle */}
                    <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-4 border-white ${
                      ev.type === "milestone" 
                        ? "bg-amber-400 ring-4 ring-amber-50" 
                        : ev.type === "ngo"
                        ? "bg-blue-500 ring-4 ring-blue-50"
                        : "bg-emerald-500 ring-4 ring-emerald-50"
                    }`} />

                    <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-400 uppercase">
                      <span>{ev.date}</span>
                      <span>•</span>
                      <span className="font-bold">{ev.tag}</span>
                    </div>

                    <h4 className="text-xs font-bold font-sans text-slate-800 mt-1">
                      {ev.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                      {ev.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews / Appreciation Section */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-6">NGO & Recipient Heartfelt Acknowledgments</h3>
              
              <div className="space-y-4">
                {activeDonor.reviewsAppreciation.map((rev) => (
                  <div key={rev.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl relative">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-bold text-xs text-slate-850 block">{rev.author}</span>
                        <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50/70 px-1.5 py-0.2 rounded-md font-extrabold uppercase mt-1 inline-block">
                          {rev.role}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400">{rev.date}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed mt-2.5 italic">
                      "{rev.text}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Donation Cargo Log List */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-50">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Verified Cargo Ledger Log</h3>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Physical and financial logs routed in this profile.</span>
                </div>
                <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  {activeDonor.id === currentUser.id && actions.filter(act => act.donorId === currentUser.id).length > 0 
                    ? actions.filter(act => act.donorId === currentUser.id).length 
                    : "Preloaded Log"} Entries
                </span>
              </div>

              {activeDonor.id === currentUser.id && actions.filter(act => act.donorId === currentUser.id).length > 0 ? (
                <div className="space-y-3 font-sans">
                  {actions.filter(act => act.donorId === currentUser.id).map((item) => (
                    <div key={item.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-800">{item.itemDescription}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          Routed to: <strong>{item.recipientName}</strong> • {item.timestamp}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-slate-800 block">
                          {item.amount && !hideDonationAmounts ? `S$ ${item.amount}` : item.quantity || "1 Pack"}
                        </span>
                        <span className="inline-block mt-0.5 bg-emerald-100 text-emerald-800 text-[9px] uppercase font-bold px-1.5 py-0.2 rounded-md">
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3 font-sans">
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800">Advanced Mathematics School Library Textbooks Sponsoring</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Routed to: <strong>Singapore Scholars Foundation</strong> • June 18, 2026
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-slate-800 block">
                        {hideDonationAmounts && viewMode === "visitor" ? "S$ ••••" : "S$ 2,500"}
                      </span>
                      <span className="inline-block mt-0.5 bg-emerald-100 text-emerald-800 text-[9px] uppercase font-bold px-1.5 py-0.2 rounded-md">
                        Delivered
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-850">Primary Ward Pediatric Clinical Sanitation Packages</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Routed to: <strong>Eldoret Community Medical Corps</strong> • May 22, 2026
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-slate-800 block">
                        {hideDonationAmounts && viewMode === "visitor" ? "S$ ••••" : "S$ 1,200"}
                      </span>
                      <span className="inline-block mt-0.5 bg-sky-100 text-sky-800 text-[9px] uppercase font-bold px-1.5 py-0.2 rounded-md">
                        Verified
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Message Contact Overlay/Modal (as requested) */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn" id="contact-donor-modal">
          <div className="relative w-full max-w-md bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex justify-between items-start pb-4 border-b border-slate-100 mb-6 font-sans">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Direct Messaging Ledger Route
                </span>
                <h3 className="text-lg font-bold text-slate-900 leading-tight mt-2.5">
                  Contact {renderDisplayName()}
                </h3>
              </div>
              <button
                id="btn-close-contact"
                onClick={() => setShowContactModal(false)}
                className="p-1 px-2 hover:bg-slate-150 text-slate-400 hover:text-slate-600 rounded-lg text-sm transition-colors cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            {contactSuccess ? (
              <div className="py-8 text-center" id="contact-success-overlay">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 animate-pulse">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Message Dispatched!</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Your communication ticket has been signed and dispatched securely via direct recipient channels to {renderDisplayName()}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4 text-xs text-slate-600">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-slate-500">Subject Header</label>
                  <input
                    type="text"
                    required
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    placeholder="e.g. Sincere Appreciation from Hope Foundation"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-slate-500">Inquiry / Gratitude Narrative</label>
                  <textarea
                    rows={4}
                    required
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Type your message of appreciation or direct verification inquiry..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl focus:outline-none resize-none transition-all text-xs"
                  />
                </div>

                <div className="flex gap-3 pt-4 font-sans">
                  <button
                    type="button"
                    onClick={() => setShowContactModal(false)}
                    className="w-1/3 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl cursor-pointer text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl cursor-pointer shadow-md shadow-emerald-500/10 text-xs"
                  >
                    Send Signed Message
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Followers Details Overlay Modal ("looks to followers - can count the followers") */}
      {showFollowersModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn" id="followers-ledger-modal">
          <div className="relative w-full max-w-sm bg-white border border-slate-100 rounded-3xl p-6 shadow-2xl font-sans">
            <div className="flex justify-between items-start pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-slate-400">Total Followers Count Ledger</span>
                <h3 className="text-base font-bold text-slate-900 leading-tight mt-1.5 flex items-center">
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-mono px-2 py-0.5 rounded-lg mr-2 font-black">{activeDonor.followerCount}</span>
                  <span>Followers for {renderDisplayName()}</span>
                </h3>
              </div>
              <button
                id="btn-close-followers"
                onClick={() => setShowFollowersModal(false)}
                className="p-1 px-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg text-sm transition-colors cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 my-2 max-h-64 overflow-y-auto pr-1">
              {getFollowersList().map((follower, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center space-x-2.5">
                    <img
                      src={follower.avatar}
                      alt={follower.name}
                      className="w-7 h-7 rounded-full object-cover border"
                    />
                    <div>
                      <span className="font-bold text-xs text-slate-800 block flex items-center">
                        {follower.name}
                        {follower.verified && <ShieldCheck className="w-3.5 h-3.5 text-sky-500 fill-current ml-1" />}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">@{follower.handle}</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono font-bold bg-white text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full">
                    Audited
                  </span>
                </div>
              ))}
              
              <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-400 leading-normal text-center bg-slate-50/50 p-2.5 rounded-xl italic">
                {activeDonor.followerCount > 4 
                  ? `Plus ${activeDonor.followerCount - 4} more anonymous verified organizations and direct individual accounts.`
                  : "All current immediate accounts in peer-to-peer trust networks listed above."}
              </div>
            </div>

            <button
              onClick={() => setShowFollowersModal(false)}
              className="w-full mt-4 py-2 bg-slate-900 hover:bg-slate-850 text-white text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* EXQUISITE PHOTO GALLERY POPUP MODAL */}
      {showGalleryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto" id="avatar-gallery-modal">
          <div className="relative w-full max-w-lg bg-white border border-slate-100 rounded-3xl p-6 shadow-2xl font-sans">
            
            {/* Header Area */}
            <div className="flex justify-between items-start pb-4 border-b border-slate-100 mb-5">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-slate-400">Curated Media Repository</span>
                <h3 className="text-lg font-bold text-slate-950 leading-tight mt-1">
                  Choose Live Persona Photo 🖼️
                </h3>
                <p className="text-xs text-slate-500 mt-1">Select from our beautiful high-resolution categorized personas or submit a custom URL.</p>
              </div>
              <button
                onClick={() => {
                  setShowGalleryModal(false);
                  setUrlSuccessMsg("");
                }}
                className="p-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {/* Live Preview Bar */}
            <div className="mb-5 p-3 rounded-2xl bg-amber-50/50 border border-amber-100 flex items-center space-x-3.5 animate-pulse">
              <div className="relative">
                <img
                  src={activeDonor.avatar}
                  alt="Live Preview"
                  className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shadow-sm"
                />
                <div className="absolute -bottom-1 -right-1 bg-amber-450 text-amber-950 p-0.5 rounded-full border border-white">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-bold text-amber-800 uppercase tracking-widest block font-mono">Current Live Avatar Preview</span>
                <span className="text-xs font-semibold text-slate-800 block mt-0.5 max-w-[280px] truncate" title={activeDonor.avatar}>
                  {activeDonor.avatar}
                </span>
              </div>
              <div className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase font-mono tracking-wider">
                Live
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-1 mb-4 pb-2 border-b border-slate-100">
              {avatarGallery.map((cat) => (
                <button
                  key={cat.category}
                  type="button"
                  onClick={() => setGalleryCategory(cat.category)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    galleryCategory === cat.category
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-150"
                  }`}
                >
                  {cat.category}
                </button>
              ))}
            </div>

            {/* Category Images Grid */}
            <div className="grid grid-cols-3 gap-3 mb-6 bg-slate-50 p-3 rounded-2xl border border-slate-100 max-h-[220px] overflow-y-auto">
              {avatarGallery
                .find((cat) => cat.category === galleryCategory)
                ?.images.map((item, idx) => {
                  const isSelected = activeDonor.avatar === item.url || activeDonor.avatar.startsWith(item.url.split("?")[0]);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        handleUpdateOwnerField("avatar", item.url);
                        setUrlSuccessMsg("");
                      }}
                      className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all cursor-pointer group hover:scale-[1.03] ${
                        isSelected 
                          ? "border-emerald-500 ring-2 ring-emerald-100/50" 
                          : "border-transparent opacity-85 hover:opacity-100 hover:shadow"
                      }`}
                    >
                      <img
                        src={item.url}
                        alt={item.label}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Label Hover Overlay */}
                      <div className="absolute bottom-0 inset-x-0 bg-slate-950/65 text-[8px] text-white p-1 text-center font-bold tracking-tight opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.label}
                      </div>

                      {/* Selected State Overlay Indicator */}
                      {isSelected && (
                        <div className="absolute top-1 right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow-sm">
                          <CheckCircle className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
            </div>

            {/* Custom URL pasting zone */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex items-center space-x-1.5 text-slate-550 font-bold">
                <Upload className="w-3.5 h-3.5 text-emerald-600" />
                <span>Link External Image Address URL</span>
              </div>
              
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={customAvatarUrl}
                  onChange={(e) => {
                    setCustomAvatarUrl(e.target.value);
                    setUrlSuccessMsg("");
                  }}
                  className="flex-1 px-3 py-2 bg-white border border-slate-250 focus:border-slate-800 rounded-xl text-xs focus:outline-none placeholder:text-slate-350"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customAvatarUrl.trim()) {
                      handleUpdateOwnerField("avatar", customAvatarUrl.trim());
                      setUrlSuccessMsg("Web Address URL loaded successfully!");
                      setCustomAvatarUrl("");
                    }
                  }}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all font-sans cursor-pointer text-xs"
                >
                  Apply
                </button>
              </div>
              {urlSuccessMsg && (
                <span className="text-[10px] text-emerald-600 font-bold block mt-1">✓ {urlSuccessMsg}</span>
              )}
            </div>

            {/* Confirm Actions */}
            <button
              onClick={() => {
                setShowGalleryModal(false);
                setUrlSuccessMsg("");
              }}
              className="w-full mt-4 py-3 bg-slate-900 hover:bg-slate-950 text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer text-center tracking-wide uppercase shadow-sm"
            >
              Verify & Lock Changes
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
