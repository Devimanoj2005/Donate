/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DonationCategory, DonationCampaign, DonationRequest, DonationAction, SuccessStory, User, UserRole, DonationStatus } from "./types";

export const INITIAL_NGO_PARTNERS: User[] = [
  {
    id: "ngo-1",
    email: "contact@hopepioneer.org",
    name: "Hope Pioneer Foundation",
    role: UserRole.NGO,
    isVerified: true,
    region: "Eldoret, Kenya",
    avatar: "https://images.unsplash.com/photo-1579208575657-c595a01f9117?w=150&auto=format&fit=crop&q=80",
    organizationName: "Hope Pioneer Foundation",
    registrationNumber: "NGO-REG-2015-883",
    bio: "Dedicated to advancing food security, maternal healthcare, and quality educational materials to marginalized communities across rural East Africa."
  },
  {
    id: "ngo-2",
    email: "info@classroomsforall.org",
    name: "Classrooms For All",
    role: UserRole.NGO,
    isVerified: true,
    region: "Southeastern Asia",
    avatar: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80",
    organizationName: "Classrooms For All",
    registrationNumber: "NGO-CN-9493",
    bio: "Providing standard learning notebooks, school bags, and refurbished laptops to young minds aiming for a tech-driven future."
  },
  {
    id: "ngo-3",
    email: "hello@greentomorrow.org",
    name: "Green Tomorrow",
    role: UserRole.NGO,
    isVerified: true,
    region: "Global Outreach",
    avatar: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=150&auto=format&fit=crop&q=80",
    organizationName: "Green Tomorrow Organization",
    registrationNumber: "NGO-GT-4820",
    bio: "Supporting ecological recovery, organic meal kitchens, and safe community shelters with zero plastic and absolute climate alignment."
  }
];

export const INITIAL_CAMPAIGNS: DonationCampaign[] = [
  {
    id: "camp-1",
    title: "100 Clean Classrooms Launchpad",
    description: "Equipping rural primary schools with modern textbooks, clean desks, solar reading lights, and sanitary stations to eliminate learning barriers.",
    category: DonationCategory.EDUCATIONAL,
    targetAmount: 15000,
    currentAmount: 9450,
    ngoId: "ngo-2",
    ngoName: "Classrooms For All",
    deadline: "2026-08-15",
    itemsNeeded: ["Laptops", "Textbooks", "Solar Reading Lights", "Notebooks"],
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80",
    isUrgent: true
  },
  {
    id: "camp-2",
    title: "Nourish Kenya Community Hot-Meal Center",
    description: "Financing raw ingredients, bulk dry food, grains, clean cooking gas, and training for local maternal hubs in Eldoret during dry seasons.",
    category: DonationCategory.FOOD,
    targetAmount: 8000,
    currentAmount: 5120,
    ngoId: "ngo-1",
    ngoName: "Hope Pioneer Foundation",
    deadline: "2026-07-30",
    itemsNeeded: ["Grains", "Cooking Pots", "Hygiene Supplies", "Infant Rice Packs"],
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80",
    isUrgent: false
  },
  {
    id: "camp-3",
    title: "Winter Relief Coat Drive",
    description: "Distributing thick wool coats, winter jackets, sleeping blankets, and warm boots to families residing in refugee settlements.",
    category: DonationCategory.CLOTHES,
    targetAmount: 4000,
    currentAmount: 3820,
    ngoId: "ngo-3",
    ngoName: "Green Tomorrow",
    deadline: "2026-07-10",
    itemsNeeded: ["Winter Coats", "Heavy Blankets", "Thermal Hoodies", "Safety Boots"],
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80",
    isUrgent: true
  }
];

export const INITIAL_BENEFICIARY_REQUESTS: DonationRequest[] = [
  {
    id: "req-1",
    beneficiaryId: "user-rec-1",
    beneficiaryName: "Aisya Rahman",
    title: "Children's General Math & Literacy Textbooks",
    description: "I am a community center teacher in an under-resourced neighborhood. We have 35 children aged 6 to 12 who literally share five worn-out books. Any children's storybooks, basic algebra manuals, or dictionary prints would completely revolutionize their learning progress.",
    category: DonationCategory.BOOKS,
    quantityRequested: "35 Books",
    urgency: "High",
    status: "Approved",
    aiMatchScore: 94,
    aiUrgencyReasoning: "Educational delay risk is critical. Recommending surplus books from educational textbook publishers.",
    aiFraudRisk: "Low",
    aiFraudAnalysis: "Text matches academic records, and beneficiary region matches previous verified outreach profiles with 100% compliance.",
    submittedAt: "2026-06-18"
  },
  {
    id: "req-2",
    beneficiaryId: "user-rec-2",
    beneficiaryName: "Marcus Vance",
    title: "Emergency Bedding & Household Supplies for Flooded Family",
    description: "Our rental ground floor was heavily washed out during the recent monsoon downpour. We lost our foam beds, children's sleeping bags, pots, and gas stoves. We are staying in local dry temporary shelters but urgently require heavy emergency bedding and hygiene packs.",
    category: DonationCategory.HOUSEHOLD,
    quantityRequested: "3 Heavy Beds & blankets",
    urgency: "Instant Relief",
    status: "Approved",
    aiMatchScore: 98,
    aiUrgencyReasoning: "Severe environmental crisis risk detected. Immediate medical safety and baseline housing support required.",
    aiFraudRisk: "Low",
    aiFraudAnalysis: "Cross-verified with local climate shelter registries and weather precipitation incident logs.",
    submittedAt: "2026-06-19"
  },
  {
    id: "req-3",
    beneficiaryId: "user-rec-3",
    beneficiaryName: "Chen Wei",
    title: "Maternal Nutrition Packs & Bulk Rice Staples",
    description: "Seeking nutrition formula milk, lentils, flour, and organic oats to support 15 local expectant mothers who are experiencing nutritional deficit right now.",
    category: DonationCategory.FOOD,
    quantityRequested: "15 Care Bundles",
    urgency: "High",
    status: "Approved",
    aiMatchScore: 91,
    aiUrgencyReasoning: "Health indicators require proactive maternal care support. Fits NGO-1 Hope Pioneer resources perfectly.",
    aiFraudRisk: "Low",
    aiFraudAnalysis: "Hospital outpatient status matches submitted document patterns.",
    submittedAt: "2026-06-15"
  }
];

export const INITIAL_ACTIONS: DonationAction[] = [
  {
    id: "act-1",
    donorId: "user-donor-1",
    donorName: "Dr. Sarah Jenkins",
    recipientId: "ngo-2",
    recipientName: "Classrooms For All",
    category: DonationCategory.MONEY,
    itemDescription: "Financial Support for 100 Classrooms Campaign",
    amount: 1500,
    status: DonationStatus.DELIVERED,
    trackingNumber: "TRK-DONARE-5830-10",
    timestamp: "2026-06-10T14:30:00Z",
    timeline: [
      { status: DonationStatus.PENDING, date: "2026-06-10", description: "Donation initiated and funds safely authorized into secure holding account." },
      { status: DonationStatus.VERIFIED, date: "2026-06-11", description: "Audit completed. Hope Pioneer verified allocation for Classrooms textbook print contracts." },
      { status: DonationStatus.SHIPPED, date: "2026-06-13", description: "Funds transferred to regional book printer with real-time receipt attached." },
      { status: DonationStatus.DELIVERED, date: "2026-06-15", description: "Books received by school. Target school headmaster stamped visual photo verification proof." }
    ]
  },
  {
    id: "act-2",
    donorId: "user-donor-1",
    donorName: "Dr. Sarah Jenkins",
    recipientId: "req-1",
    recipientName: "Aisya Rahman",
    category: DonationCategory.BOOKS,
    itemDescription: "Box of Grade 4 Maths and Literacy Notebooks",
    quantity: "1 Box (40 items)",
    status: DonationStatus.SHIPPED,
    trackingNumber: "TRK-DONARE-4921-99",
    timestamp: "2026-06-18T10:15:00Z",
    timeline: [
      { status: DonationStatus.PENDING, date: "2026-06-18", description: "Donation package registered and dropped off at secure Donare partner hub." },
      { status: DonationStatus.VERIFIED, date: "2026-06-19", description: "Package inspected. Contents verified to match high educational quality baseline." },
      { status: DonationStatus.SHIPPED, date: "2026-06-20", description: "Dispatched via verified rural logistics partner. Out for secure courier delivery." }
    ]
  },
  {
    id: "act-3",
    donorId: "user-donor-2",
    donorName: "Global Tech Solutions",
    recipientId: "ngo-2",
    recipientName: "Classrooms For All",
    category: DonationCategory.EDUCATIONAL,
    itemDescription: "5 Refurbished ThinkPad Laptops",
    quantity: "5 Laptops",
    status: DonationStatus.VERIFIED,
    trackingNumber: "TRK-DONARE-1104-52",
    timestamp: "2026-06-19T14:00:00Z",
    timeline: [
      { status: DonationStatus.PENDING, date: "2026-06-19", description: "Corporate donation pledge created." },
      { status: DonationStatus.VERIFIED, date: "2026-06-20", description: "Devices audited for specs, battery capacity, and operating system clean install certification." }
    ]
  }
];

export const INITIAL_SUCCESS_STORIES: SuccessStory[] = [
  {
    id: "story-1",
    title: "A Village Connected: How Laptops Lit Up Eldoret",
    description: "Through the digital literacy campaign, 12 pre-university girls learned programming, got admitted into Computer Science degrees, and received modern, refurbished laptops directly funded by remote tech sponsors.",
    ngoName: "Hope Pioneer Foundation",
    category: DonationCategory.EDUCATIONAL,
    livesImpacted: 45,
    date: "2026-05-12",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "story-2",
    title: "1,500 Nutritious Lunches After Monsoon Crisis",
    description: "During severe river-bank leaks last autumn, local partners immediately channeled money and staple foods into community wet-kitchens, serving nourishing dinners and organic oat porridge to thousands daily.",
    ngoName: "Green Tomorrow",
    category: DonationCategory.FOOD,
    livesImpacted: 1520,
    date: "2026-04-20",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80"
  }
];
