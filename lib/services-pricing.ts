/**
 * Brasil Legalize - Service Pricing Data
 * Packages and services for expecting parents
 */

export interface ServiceItem {
  id: string;
  nameKey: string; // Translation key
  descriptionKey: string;
  icon: string; // Remix icon class (e.g., 'ri-file-text-line')
  category: 'core' | 'housing' | 'legal' | 'support' | 'emergency';
  includedInBasic: boolean;
  includedInComplete: boolean;
  additionalFee?: number; // If additional fee applies
}

export interface PackageType {
  id: 'basic' | 'complete';
  nameKey: string;
  descriptionKey: string;
  basePrice: number; // USD for 2 adults + 1 newborn
  additionalPersonPrice: number; // Per additional person
  paymentTerms: {
    upfront: number; // Percentage
    milestone1: number;
    milestone1Key: string;
    milestone2: number;
    milestone2Key: string;
  };
  features: string[]; // Translation keys
  icon: string;
}

export const serviceItems: ServiceItem[] = [
  // CORE SERVICES
  {
    id: 'cpf',
    nameKey: 'services.cpf.name',
    descriptionKey: 'services.cpf.description',
    icon: 'ri-bank-card-line',
    category: 'core',
    includedInBasic: true,
    includedInComplete: true,
  },
  {
    id: 'sus',
    nameKey: 'services.sus.name',
    descriptionKey: 'services.sus.description',
    icon: 'ri-heart-pulse-line',
    category: 'core',
    includedInBasic: true,
    includedInComplete: true,
  },
  {
    id: 'birth-certificate',
    nameKey: 'services.birthCertificate.name',
    descriptionKey: 'services.birthCertificate.description',
    icon: 'ri-file-text-line',
    category: 'core',
    includedInBasic: true,
    includedInComplete: true,
  },
  {
    id: 'rnm',
    nameKey: 'services.rnm.name',
    descriptionKey: 'services.rnm.description',
    icon: 'ri-shield-user-line',
    category: 'core',
    includedInBasic: true,
    includedInComplete: true,
  },
  {
    id: 'rg',
    nameKey: 'services.rg.name',
    descriptionKey: 'services.rg.description',
    icon: 'ri-id-card-line',
    category: 'core',
    includedInBasic: true,
    includedInComplete: true,
  },
  {
    id: 'passport',
    nameKey: 'services.passport.name',
    descriptionKey: 'services.passport.description',
    icon: 'ri-passport-line',
    category: 'core',
    includedInBasic: true,
    includedInComplete: true,
  },

  // HOUSING & ACCOMMODATION
  {
    id: 'airport-pickup',
    nameKey: 'services.airportPickup.name',
    descriptionKey: 'services.airportPickup.description',
    icon: 'ri-plane-line',
    category: 'housing',
    includedInBasic: false,
    includedInComplete: true,
  },
  {
    id: 'housing-assistance',
    nameKey: 'services.housingAssistance.name',
    descriptionKey: 'services.housingAssistance.description',
    icon: 'ri-home-4-line',
    category: 'housing',
    includedInBasic: false,
    includedInComplete: true,
  },

  // LEGAL & DOCUMENTATION
  {
    id: 'document-translation',
    nameKey: 'services.documentTranslation.name',
    descriptionKey: 'services.documentTranslation.description',
    icon: 'ri-translate-2',
    category: 'legal',
    includedInBasic: false,
    includedInComplete: true,
  },
  {
    id: 'document-legalization',
    nameKey: 'services.documentLegalization.name',
    descriptionKey: 'services.documentLegalization.description',
    icon: 'ri-file-shield-line',
    category: 'legal',
    includedInBasic: false,
    includedInComplete: true,
  },

  // SUPPORT SERVICES
  {
    id: 'financial-advice',
    nameKey: 'services.financialAdvice.name',
    descriptionKey: 'services.financialAdvice.description',
    icon: 'ri-money-dollar-circle-line',
    category: 'support',
    includedInBasic: false,
    includedInComplete: true,
  },
  {
    id: 'bank-account',
    nameKey: 'services.bankAccount.name',
    descriptionKey: 'services.bankAccount.description',
    icon: 'ri-bank-line',
    category: 'support',
    includedInBasic: false,
    includedInComplete: true,
  },
  {
    id: 'cultural-orientation',
    nameKey: 'services.culturalOrientation.name',
    descriptionKey: 'services.culturalOrientation.description',
    icon: 'ri-global-line',
    category: 'support',
    includedInBasic: false,
    includedInComplete: true,
  },
  {
    id: 'language-assistance',
    nameKey: 'services.languageAssistance.name',
    descriptionKey: 'services.languageAssistance.description',
    icon: 'ri-character-recognition-line',
    category: 'support',
    includedInBasic: false,
    includedInComplete: true,
  },
  {
    id: 'local-guidance',
    nameKey: 'services.localGuidance.name',
    descriptionKey: 'services.localGuidance.description',
    icon: 'ri-map-pin-line',
    category: 'support',
    includedInBasic: false,
    includedInComplete: true,
  },

  // EMERGENCY SERVICES
  {
    id: 'emergency-24-7',
    nameKey: 'services.emergency247.name',
    descriptionKey: 'services.emergency247.description',
    icon: 'ri-alarm-warning-line',
    category: 'emergency',
    includedInBasic: false,
    includedInComplete: true,
  },
  {
    id: 'emergency-transport',
    nameKey: 'services.emergencyTransport.name',
    descriptionKey: 'services.emergencyTransport.description',
    icon: 'ri-ambulance-line',
    category: 'emergency',
    includedInBasic: false,
    includedInComplete: true,
  },
];

export const packages: PackageType[] = [
  {
    id: 'basic',
    nameKey: 'pricing.packages.basic.name',
    descriptionKey: 'pricing.packages.basic.description',
    basePrice: 3000,
    additionalPersonPrice: 500,
    paymentTerms: {
      upfront: 20,
      milestone1: 50,
      milestone1Key: 'pricing.paymentTerms.susCompletion',
      milestone2: 30,
      milestone2Key: 'pricing.paymentTerms.rnmSubmission',
    },
    features: [
      'pricing.packages.basic.feature1',
      'pricing.packages.basic.feature2',
      'pricing.packages.basic.feature3',
      'pricing.packages.basic.feature4',
      'pricing.packages.basic.feature5',
      'pricing.packages.basic.feature6',
    ],
    icon: 'ri-user-heart-line',
  },
  {
    id: 'complete',
    nameKey: 'pricing.packages.complete.name',
    descriptionKey: 'pricing.packages.complete.description',
    basePrice: 5000,
    additionalPersonPrice: 800,
    paymentTerms: {
      upfront: 50,
      milestone1: 25,
      milestone1Key: 'pricing.paymentTerms.susCompletion',
      milestone2: 25,
      milestone2Key: 'pricing.paymentTerms.rnmSubmission',
    },
    features: [
      'pricing.packages.complete.feature1',
      'pricing.packages.complete.feature2',
      'pricing.packages.complete.feature3',
      'pricing.packages.complete.feature4',
      'pricing.packages.complete.feature5',
      'pricing.packages.complete.feature6',
      'pricing.packages.complete.feature7',
      'pricing.packages.complete.feature8',
    ],
    icon: 'ri-vip-crown-line',
  },
];

export const categories = {
  core: {
    nameKey: 'pricing.categories.core',
    icon: 'ri-shield-check-line',
  },
  housing: {
    nameKey: 'pricing.categories.housing',
    icon: 'ri-home-4-line',
  },
  legal: {
    nameKey: 'pricing.categories.legal',
    icon: 'ri-file-shield-line',
  },
  support: {
    nameKey: 'pricing.categories.support',
    icon: 'ri-customer-service-2-line',
  },
  emergency: {
    nameKey: 'pricing.categories.emergency',
    icon: 'ri-emergency-line',
  },
} as const;

// Helper functions
export function getServiceById(id: string): ServiceItem | undefined {
  return serviceItems.find((item) => item.id === id);
}

export function getPackageById(id: 'basic' | 'complete'): PackageType | undefined {
  return packages.find((pkg) => pkg.id === id);
}

export function calculatePackagePrice(
  packageId: 'basic' | 'complete',
  additionalPersons: number = 0
): number {
  const pkg = getPackageById(packageId);
  if (!pkg) return 0;
  return pkg.basePrice + additionalPersons * pkg.additionalPersonPrice;
}

export function getServicesForPackage(packageId: 'basic' | 'complete'): ServiceItem[] {
  if (packageId === 'basic') {
    return serviceItems.filter((item) => item.includedInBasic);
  }
  return serviceItems.filter((item) => item.includedInComplete);
}

export function getServicesByCategory(category: string): ServiceItem[] {
  return serviceItems.filter((item) => item.category === category);
}
