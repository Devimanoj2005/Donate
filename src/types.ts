/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  DONOR = "donor",
  NGO = "ngo",
  RECEIVER = "receiver",
  ADMIN = "admin"
}

export enum DonationCategory {
  MONEY = "Money",
  CLOTHES = "Clothes",
  BOOKS = "Books",
  FOOD = "Food",
  EDUCATIONAL = "Educational",
  HOUSEHOLD = "Household"
}

export enum DonationStatus {
  PENDING = "Pending",
  VERIFIED = "Verified",
  SHIPPED = "Out for Delivery",
  DELIVERED = "Delivered"
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isVerified: boolean;
  region: string;
  avatar?: string;
  organizationName?: string;
  registrationNumber?: string;
  bio?: string;
  username?: string;
}

export interface VerificationDocument {
  id: string;
  userId: string;
  title: string;
  documentType: "ID Card" | "NGO Registration" | "Financial Statement" | "Medical Report" | "Tax Form";
  fileUrl: string;
  status: "Pending" | "Approved" | "Rejected";
  riskScore: number; // 0 to 100 calculated by AI
  aiFlags: string[];
  submittedAt: string;
  aiReport?: string;
}

export interface DonationCampaign {
  id: string;
  title: string;
  description: string;
  category: DonationCategory;
  targetAmount?: number;
  currentAmount?: number;
  ngoId: string;
  ngoName: string;
  deadline?: string;
  itemsNeeded: string[];
  image: string;
  isUrgent: boolean;
}

export interface DonationRequest {
  id: string;
  beneficiaryId: string;
  beneficiaryName: string;
  title: string;
  description: string;
  category: DonationCategory;
  quantityRequested: string;
  urgency: "Instant Relief" | "High" | "Medium" | "Standard";
  status: "Pending" | "Approved" | "Rejected" | "Fulfilled";
  aiMatchScore?: number;
  aiUrgencyReasoning?: string;
  aiFraudRisk?: "Low" | "Moderate" | "High";
  aiFraudAnalysis?: string;
  submittedAt: string;
}

export interface DonationAction {
  id: string;
  donorId: string;
  donorName: string;
  recipientId: string; // NGO id or Beneficiary id
  recipientName: string;
  category: DonationCategory;
  itemDescription: string;
  amount?: number;
  quantity?: string;
  status: DonationStatus;
  trackingNumber: string;
  timestamp: string;
  timeline: { status: DonationStatus; date: string; description: string }[];
}

export interface SuccessStory {
  id: string;
  title: string;
  description: string;
  ngoName: string;
  category: DonationCategory;
  livesImpacted: number;
  date: string;
  image: string;
}

export interface AIChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  suggestions?: string[];
}
