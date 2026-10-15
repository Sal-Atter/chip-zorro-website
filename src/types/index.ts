export type DamageType = 
  | 'rock_chip_bullseye' // Single smooth circular bullseye under 1 inch
  | 'rock_chip_starburst' // Starburst with radiating micro-fractures under 1.5 inches
  | 'combination_break' // Combined pit and radiating legs
  | 'crack_small' // Short linear crack up to 6 inches
  | 'multiple_chips'; // 2 or 3 distinct stone chips

export type ServiceLocationType = 'mobile' | 'in_shop';

export type PaymentMethodType = 'insurance' | 'self_pay';

export interface VehicleInfo {
  year: string;
  make: string;
  model: string;
  bodyType: string;
  vin?: string;
  glassLocation: 'Driver Line of Sight' | 'Passenger Side' | 'Center / Mirror Area' | 'Lower Wiper Zone';
}

export interface BookingAppointment {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  damageType: DamageType;
  chipCount: number;
  locationType: ServiceLocationType;
  vehicle: VehicleInfo;
  appointmentDate: string;
  timeSlot: string; // e.g. "08:00 AM - 11:00 AM"
  paymentMethod: PaymentMethodType;
  insuranceCarrier?: string;
  insurancePolicyNumber?: string;
  insuranceDeductible?: number;
  estimatedCost: number;
  technicianId?: string;
  status: 'confirmed' | 'dispatched' | 'en_route' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  repairMethodCode: string; // e.g. "WSR-1 / RESIN-INJECT"
  insuranceClaimStatus?: 'not_submitted' | 'queued' | 'in_review' | 'approved' | 'paid';
  insuranceClaimRef?: string;
  notes?: string;
}

export interface MobileTechnician {
  id: string;
  name: string;
  title: string;
  vanNumber: string;
  phone: string;
  photoUrl: string;
  certifications: string[];
  currentLocationName: string;
  activeStatus: 'on_route' | 'on_site' | 'available' | 'off_duty';
  completedJobsToday: number;
  rating: number;
  currentOrderId?: string;
}

export interface CustomerReview {
  id: string;
  author: string;
  location: string;
  rating: number; // 1-5
  date: string;
  vehicle: string;
  serviceCategory: 'Bullseye Chip' | 'Starburst Break' | 'Short Crack Fix' | 'Mobile Driveway Service' | 'Insurance $0 Deductible';
  title: string;
  comment: string;
  savedReplacementCost: number;
  verifiedRepair: boolean;
  technicianMentioned?: string;
}

export interface EdiClaimRecord {
  id: string;
  workOrderNumber: string;
  claimControlNumber: string; // EDI standard 837 reference
  carrierName: string;
  policyNumber: string;
  insuredName: string;
  vehicleVin: string;
  ediServiceCode: string; // "WSR-1" for 1st chip, "WSR-2" for 2nd chip
  damageDescription: string;
  totalClaimAmount: number;
  deductiblePaid: number; // Almost always $0 waived by insurer for repair!
  netBilledAmount: number;
  submissionDate: string;
  filingChannel: 'Direct Carrier Billing' | 'Chip Zorro Claims Desk';
  status: 'Queued' | 'Approved' | 'Settled' | 'In review';
  responseAuthCode?: string;
}

export interface PricingConfig {
  baseBullseye: number;
  baseStarburst: number;
  baseCombination: number;
  baseSmallCrack: number;
  additionalChipRate: number;
  waiveDeductibleWithInsurance: boolean;
}

export interface SiteSettings {
  businessName: string;
  phone: string;
  phoneDisplay: string;
  dispatchEmail: string;
  serviceRadiusMiles: number;
  serviceHours: string;
  announcementText: string;
  announcementActive: boolean;
  dispatchEtaMinutes: string;
  pricing: PricingConfig;
  adminPassword?: string;
}
