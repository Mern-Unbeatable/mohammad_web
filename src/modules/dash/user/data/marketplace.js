import { withListingImages } from './productImages';

export const categories = [
  'All',
  'Chromatography',
  'Spectroscopy',
  'Incubation',
  'Centrifugation',
  'Weighing',
  'Safety',
  'Consumables',
  'Microscopy',
  'Other',
];

export const conditions = ['New', 'Like New', 'Good', 'Refurbished', 'For Parts'];

export const years = ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017'];

const rawListings = [
  {
    id: 'agilent-1260-hplc',
    title: 'Agilent 1260 Infinity II HPLC System',
    description:
      'Complete HPLC system with quaternary pump, autosampler and DAD detector. Recently serviced and validated for pharmaceutical QC workflows.',
    condition: 'Refurbished',
    year: '2019',
    price: 12400,
    category: 'Chromatography',
    location: 'Ghent, Belgium',
    seller: {
      id: 'thomas-vermeulen',
      name: 'Thomas Vermeulen',
      initials: 'TV',
      title: 'Laboratory Director',
      company: 'Ghent BioAnalytics',
      avatarClass: 'bg-[#E8F3FB] text-primary',
    },
    image:
      'https://images.unsplash.com/photo-1532187863486-abf9db881935?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1532187863486-abf9db881935?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1581093458791-9f302e6d64fb?w=800&h=500&fit=crop',
    ],
    listedAt: 'February 2026',
    ownerId: 'current-user',
  },
  {
    id: 'thermo-sorvall-centrifuge',
    title: 'Thermo Scientific Sorvall ST 16R Centrifuge',
    description:
      'Refrigerated benchtop centrifuge with rotor set included. Ideal for clinical and research sample preparation.',
    condition: 'Good',
    year: '2021',
    price: 4250,
    category: 'Centrifugation',
    location: 'Rotterdam, Netherlands',
    seller: {
      id: 'ravi-kumar',
      name: 'Ravi Kumar',
      initials: 'RK',
      title: 'Lab Director',
      company: 'SynLab Diagnostics',
      avatarClass: 'bg-[#E8F3FB] text-primary',
    },
    image:
      'https://images.unsplash.com/photo-1581093458791-9f302e6d64fb?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1581093458791-9f302e6d64fb?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1532187863486-abf9db881935?w=800&h=500&fit=crop',
    ],
    listedAt: 'January 2026',
    ownerId: 'current-user',
  },
  {
    id: 'mettler-xsr205-balance',
    title: 'METTLER TOLEDO XSR205 Analytical Balance',
    description:
      'High-precision analytical balance with internal calibration. Suitable for formulation and reference standard weighing.',
    condition: 'Like New',
    year: '2020',
    price: 2850,
    category: 'Weighing',
    location: 'Ghent, Belgium',
    seller: {
      id: 'marc-dubois',
      name: 'Marc Dubois',
      initials: 'MD',
      title: 'QC Manager',
      company: 'Eurofins Ghent',
      avatarClass: 'bg-[#E8F3FB] text-primary',
    },
    image:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1532187863486-abf9db881935?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1581093458791-9f302e6d64fb?w=800&h=500&fit=crop',
    ],
    listedAt: 'March 2026',
    ownerId: 'current-user',
  },
  {
    id: 'shimadzu-uv1900i',
    title: 'Shimadzu UV-1900i UV-Vis Spectrophotometer',
    description:
      'Double-beam UV-Vis system with enhanced validation package. Includes cuvette set and IQ/OQ documentation.',
    condition: 'Good',
    year: '2018',
    price: 8500,
    category: 'Spectroscopy',
    location: 'Brussels, Belgium',
    seller: {
      id: 'sophie-renard',
      name: 'Sophie Renard',
      initials: 'SR',
      title: 'QA Specialist',
      company: 'NovaLab Sciences',
      avatarClass: 'bg-pink-secondary text-pink-light',
    },
    image:
      'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&h=500&fit=crop',
    ],
    listedAt: 'February 2026',
    ownerId: 'current-user',
  },
  {
    id: 'sartorius-biostat-btec',
    title: 'Sartorius Biostat B-TEC Bioreactor 2L',
    description:
      'Single-use bioreactor system for upstream process development. Controller, vessel and documentation included.',
    condition: 'Refurbished',
    year: '2017',
    price: 18200,
    category: 'Consumables',
    location: 'Munich, Germany',
    seller: {
      id: 'jonas-kramer',
      name: 'Jonas Kramer',
      initials: 'JK',
      title: 'Validation Engineer',
      company: 'BioNova Labs',
      avatarClass: 'bg-[#E8F3FB] text-primary',
    },
    image:
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=500&fit=crop',
    ],
    listedAt: 'January 2026',
  },
  {
    id: 'esco-airstream-ac2',
    title: 'Esco Airstream AC2 Class II Biosafety Cabinet',
    description:
      'Class II Type A2 biosafety cabinet with annual certification. Suitable for microbiology and cell culture labs.',
    condition: 'Good',
    year: '2020',
    price: 3900,
    category: 'Safety',
    location: 'Lille, France',
    seller: {
      id: 'amina-haddad',
      name: 'Amina Haddad',
      initials: 'AH',
      title: 'Senior Microbiologist',
      company: 'Institut Pasteur Lille',
      avatarClass: 'bg-green-secondary text-green-primary',
    },
    image:
      'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&h=500&fit=crop',
    ],
    listedAt: 'March 2026',
  },
  {
    id: 'eppendorf-mastercycler-x50',
    title: 'Eppendorf Mastercycler X50 PCR System',
    description:
      '96-well thermal cycler with gradient function. Low usage hours and full service history available.',
    condition: 'Like New',
    year: '2022',
    price: 6750,
    category: 'Consumables',
    location: 'Stockholm, Sweden',
    seller: {
      id: 'sofia-lindstrom',
      name: 'Sofia Lindström',
      initials: 'SL',
      title: 'Validation Specialist',
      company: 'PharmaNord AB',
      avatarClass: 'bg-pink-secondary text-pink-light',
    },
    image:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=500&fit=crop',
    ],
    listedAt: 'February 2026',
  },
  {
    id: 'leica-dm500-microscope',
    title: 'Leica DM500 LED Trinocular Microscope',
    description:
      'Educational and routine microscopy setup with LED illumination and trinocular head for camera adapter.',
    condition: 'Good',
    year: '2019',
    price: 1950,
    category: 'Microscopy',
    location: 'Milan, Italy',
    seller: {
      id: 'isabella-bianchi',
      name: 'Isabella Bianchi',
      initials: 'IB',
      title: 'Lab Manager',
      company: 'Milano Diagnostics',
      avatarClass: 'bg-green-secondary text-green-primary',
    },
    image:
      'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&h=500&fit=crop',
    ],
    listedAt: 'January 2026',
  },
  {
    id: 'thermo-heratherm-incubator',
    title: 'Thermo Heratherm Laboratory Incubator 180L',
    description:
      'Reliable 180L microbiological incubator with digital temperature control. Recently calibrated and ready for sterility testing workflows.',
    condition: 'Good',
    year: '2021',
    price: 1850,
    category: 'Incubation',
    location: 'Lille, France',
    seller: {
      id: 'amina-haddad',
      name: 'Amina Haddad',
      initials: 'AH',
      title: 'Senior Microbiologist',
      company: 'Institut Pasteur Lille',
      avatarClass: 'bg-green-secondary text-green-primary',
    },
    image:
      'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1532187863486-abf9db881935?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1581093458791-9f302e6d64fb?w=800&h=500&fit=crop',
    ],
    listedAt: 'March 2026',
  },
];

export const listings = withListingImages(rawListings);

export const defaultSavedIds = [
  'agilent-1260-hplc',
  'thermo-sorvall-centrifuge',
  'mettler-xsr205-balance',
  'shimadzu-uv1900i',
  'sartorius-biostat-btec',
  'esco-airstream-ac2',
  'eppendorf-mastercycler-x50',
  'leica-dm500-microscope',
];

export const filterListings = (items, query, category) => {
  const q = query.trim().toLowerCase();
  return items.filter((item) => {
    const matchesCategory = category === 'All' || item.category === category;
    const matchesQuery =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q) ||
      item.seller.company.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });
};

export const getListingById = (id) => listings.find((item) => item.id === id);

export const getMyListings = () => listings.filter((item) => item.ownerId === 'current-user');

export const formatPrice = (price) =>
  new Intl.NumberFormat('en-BE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(price);
