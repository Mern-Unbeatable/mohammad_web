export const AD_CATEGORIES = [
  {
    id: 'product',
    label: 'Product Showcase',
    description: 'Highlight a specific lab product with images and pricing.',
    icon: 'microscope',
  },
  {
    id: 'service',
    label: 'Service Offering',
    description: 'Promote maintenance, calibration, or lab services.',
    icon: 'settings',
  },
  {
    id: 'promo',
    label: 'Promotional Offer',
    description: 'Limited-time discounts and special deals.',
    icon: 'tag',
  },
  {
    id: 'webinar',
    label: 'Webinar / Event',
    description: 'Promote an educational webinar or industry event.',
    icon: 'graduation',
  },
];

export const REJECTION_MESSAGE =
  "The advertisement does not meet Lab Unity's advertising guidelines. Please review the product information and update the required details before resubmitting.";

export const SUPPLIER_AD_ROWS = [
  {
    id: 'ad-1',
    title: 'Automated Blood Gas Analyzer',
    category: 'Product Showcase',
    status: 'Active',
    views: '1,240',
    clicks: '86',
    duration: '7 Days',
    uploadDate: '2026-05-01',
  },
  {
    id: 'ad-2',
    title: 'ISO 17025 Consulting Services',
    category: 'Service Offering',
    status: 'Pending',
    views: '—',
    clicks: '—',
    duration: '14 Days',
    uploadDate: '2026-05-03',
  },
  {
    id: 'ad-3',
    title: 'Summer Lab Equipment Sale',
    category: 'Promotional Offer',
    status: 'Expired',
    views: '3,420',
    clicks: '210',
    duration: '30 Days',
    uploadDate: '2026-04-01',
  },
  {
    id: 'ad-4',
    title: 'GMP Webinar Series 2026',
    category: 'Webinar/Event',
    status: 'Rejected',
    views: '—',
    clicks: '—',
    duration: '7 Days',
    uploadDate: '2026-05-05',
  },
  {
    id: 'ad-5',
    title: 'ProCeler X-24 High-Speed Centrifuge',
    category: 'Product Showcase',
    status: 'Active',
    views: '892',
    clicks: '54',
    duration: '14 Days',
    uploadDate: '2026-05-08',
  },
  {
    id: 'ad-6',
    title: 'Annual Calibration Package',
    category: 'Service Offering',
    status: 'Pending',
    views: '—',
    clicks: '—',
    duration: '30 Days',
    uploadDate: '2026-05-10',
  },
  {
    id: 'ad-7',
    title: 'LC-MS Maintenance Workshop',
    category: 'Webinar/Event',
    status: 'Active',
    views: '560',
    clicks: '41',
    duration: '7 Days',
    uploadDate: '2026-05-12',
  },
];

export const SUPPLIER_AD_DETAILS = {
  'ad-1': {
    id: 'ad-1',
    company: 'Meridian Lab Instruments',
    companyInitials: 'ML',
    category: 'Product Showcase',
    location: 'Stuttgart, Germany',
    title: 'ProCeler X-24 High-Speed Centrifuge',
    description:
      'Reach 24,000 xg with whisper-quiet operation and a sealed biocontainment rotor — now shipping to research and clinical labs.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=450&fit=crop',
    startDate: '8/18/2026',
    expiryDate: '8/25/2026',
    price: '€8,450 / unit',
    status: 'Active',
    stats: { reactions: 87, comments: 1, shares: 21 },
  },
  'ad-4': {
    id: 'ad-4',
    company: 'Meridian Lab Instruments',
    companyInitials: 'ML',
    category: 'Webinar/Event',
    location: 'Stuttgart, Germany',
    title: 'ProCeler X-24 High-Speed Centrifuge',
    description:
      'Reach 24,000 xg with whisper-quiet operation and a sealed biocontainment rotor — now shipping to research and clinical labs.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=450&fit=crop',
    startDate: '8/18/2026',
    expiryDate: '8/25/2026',
    price: '€8,450 / unit',
    status: 'Rejected',
    rejectionReason: REJECTION_MESSAGE,
    stats: { reactions: 12, comments: 0, shares: 3 },
  },
};

export const DEMO_AD_COMMENTS = [
  {
    id: 'c1',
    author: {
      name: 'Marc Dubois',
      initials: 'MD',
      subtitle: 'Regional Sales Manager · EuroLab Supplies GmbH',
      avatar: null,
    },
    content:
      'We have been running this unit in our QC lab for six months — very reliable throughput and low noise footprint.',
    time: '1h',
    liked: false,
    replies: 0,
  },
  {
    id: 'c2',
    author: {
      name: 'Sofia Rinaldi',
      initials: 'SR',
      subtitle: 'Laboratory Director · BioResearch Italia',
      avatar: null,
    },
    content:
      'Could you share rotor compatibility details for clinical sample types? Interested in a demo for our Milan facility.',
    time: '35m',
    liked: true,
    replies: 1,
  },
];

export const getSupplierAdById = (id) => {
  if (SUPPLIER_AD_DETAILS[id]) return SUPPLIER_AD_DETAILS[id];

  const row = SUPPLIER_AD_ROWS.find((item) => item.id === id);
  if (!row) return null;

  return {
    id: row.id,
    company: 'Meridian Lab Instruments',
    companyInitials: 'ML',
    category: row.category,
    location: 'Stuttgart, Germany',
    title: row.title,
    description:
      'Sponsored laboratory industry advertisement managed through Lab Unity.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=450&fit=crop',
    startDate: row.uploadDate,
    expiryDate: row.uploadDate,
    price: row.category === 'Service Offering' ? 'Contact for pricing' : '€8,450 / unit',
    status: row.status,
    stats: { reactions: 0, comments: 0, shares: 0 },
    rejectionReason: row.status === 'Rejected' ? REJECTION_MESSAGE : undefined,
  };
};

export const getCategoryById = (id) => AD_CATEGORIES.find((item) => item.id === id);
