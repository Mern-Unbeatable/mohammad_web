export const ADMIN_AD_ROWS = [
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
];

export const ADMIN_AD_DETAILS = {
  'ad-1': {
    id: 'ad-1',
    company: 'Meridian Lab Instruments',
    companyInitials: 'ML',
    category: 'Product Showcase',
    location: 'Stuttgart, Germany',
    title: 'ProCeler X-24 High-Speed Centrifuge',
    description:
      'Reach 24,000 xg with whisper-quiet operation and a sealed biocontainment rotor — now shipping to research and clinical labs.',
    image:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=450&fit=crop',
    startDate: '8/18/2026',
    expiryDate: '8/25/2026',
    price: '€8,450 / unit',
    status: 'Active',
  },
};

export const getAdminAdById = (id) => {
  if (ADMIN_AD_DETAILS[id]) return ADMIN_AD_DETAILS[id];

  const row = ADMIN_AD_ROWS.find((item) => item.id === id);
  if (!row) return null;

  return {
    id: row.id,
    company: 'Lab Unity Partner',
    companyInitials: 'LU',
    category: row.category,
    location: 'Europe',
    title: row.title,
    description: 'Sponsored laboratory industry advertisement managed through Lab Unity.',
    image:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=450&fit=crop',
    startDate: row.uploadDate,
    expiryDate: row.uploadDate,
    price: 'Contact for pricing',
    status: row.status,
  };
};
