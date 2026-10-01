export const currentUser = {
  initials: 'EM',
  firstName: 'Élise',
  lastName: 'Moreau',
  name: 'Élise Moreau',
  title: 'Quality Control Manager',
  company: 'Novalab Diagnostics',
  location: 'Belgium',
  country: 'Belgium',
  email: 'elise.moreau@novalab.eu',
  phone: '+32 471 22 88 04',
  connections: 248,
  trialDaysLeft: 67,
  trialDaysTotal: 90,
  membershipStatus: 'trial',
  about:
    'I am a Quality Control Manager at Novalab Diagnostics, responsible for analytical method validation, equipment qualification and GMP compliance across our QC laboratory in Belgium.',
  aboutExtended:
    'I am passionate about building robust quality systems that protect patients and support laboratory teams. On Lab Unity I share practical insights on HPLC troubleshooting, environmental monitoring and audit readiness.',
  coverPhoto:
    'https://images.unsplash.com/photo-1504805572947-34fad45aed93?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bGlua2VkaW4lMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww',
  avatar:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqy5ShEFSxwHTFMoD48GNhTteRdlLb51azWU0ibObL5g&s=10',
  subscription: {
    planName: 'Lab Unity Membership',
    status: 'Active',
    startDate: '13 March 2026',
    renewalDate: '13 April 2026',
    amount: '€19.99',
    billingCycle: 'Monthly',
    nextPayment: '13 April 2026',
    paymentMethod: 'Visa ending 9427',
  },
};

export const navItems = [
  { id: 'home', label: 'Home', icon: 'home', to: '/feed' },
  { id: 'contacts', label: 'Contacts', icon: 'contacts', to: '/contacts' },
  { id: 'marketplace', label: 'Marketplace', icon: 'marketplace', to: '/marketplace' },
  { id: 'recruitment', label: 'Recruitment', icon: 'recruitment', to: '/recruitment' },
  { id: 'general', label: 'General', icon: 'general', to: '/general' },
  { id: 'messages', label: 'Messages', icon: 'messages', to: '/chat' },
  { id: 'blogs', label: 'Blogs', icon: 'blogs', to: '/blogs' },
  { id: 'notifications', label: 'Notifications', icon: 'notifications', to: '/notifications' },
];

export const quickLinks = [
  { id: 'sell', label: 'Sell equipment', icon: 'package', to: '/marketplace/create' },
  { id: 'job', label: 'Post a job', icon: 'briefcase', to: '/recruitment/create' },
  { id: 'network', label: 'Grow your network', icon: 'users', to: '/contacts' },
];

export const feedFilters = [
  { id: 'all', label: 'All' },
  { id: 'questions', label: 'Questions' },
  { id: 'information', label: 'Information' },
  { id: 'suppliers', label: 'Suppliers' },
];

export const suggestedPeople = [
  {
    id: 'thomas-vermeulen',
    initials: 'TV',
    name: 'Thomas Vermeulen',
    company: 'BioLab Corp',
    to: '/contacts/thomas-vermeulen',
    avatar:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&h=160&fit=crop&crop=face',
  },
  {
    id: 'amina-haddad',
    initials: 'AH',
    name: 'Amina Haddad',
    company: 'Institut Pasteur Lille',
    to: '/contacts/amina-haddad',
    avatar:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=160&h=160&fit=crop&crop=face',
  },
  {
    id: 'ravi-kumar',
    initials: 'RK',
    name: 'Ravi Kumar',
    company: 'SynLab Diagnostics',
    to: '/contacts/ravi-kumar',
    avatar:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqy5ShEFSxwHTFMoD48GNhTteRdlLb51azWU0ibObL5g&s=10',
  },
];

export const marketplaceItems = [
  {
    id: 'agilent-1260-hplc',
    title: 'Agilent 1260 Infinity II HPLC System',
    meta: 'Refurbished · Munich, Germany',
    price: '€14,500',
    to: '/marketplace/agilent-1260-hplc',
  },
  {
    id: 'thermo-sorvall-centrifuge',
    title: 'Benchtop Centrifuge 5810R',
    meta: 'Used · Brussels, Belgium',
    price: '€3,200',
    to: '/marketplace/thermo-sorvall-centrifuge',
  },
];

export const jobItems = [
  {
    id: 'analytical-chemist-eurofins',
    title: 'Senior QC Analyst',
    company: 'Eurofins Scientific',
    location: 'Ghent, Belgium',
    type: 'Full-time',
    to: '/recruitment/analytical-chemist-eurofins',
  },
  {
    id: 'microbiology-technician',
    title: 'Microbiology Laboratory Technician',
    company: 'Institut Pasteur Lille',
    location: 'Lille, France',
    type: 'Full-time',
    to: '/recruitment/microbiology-technician',
  },
];

export const feedPosts = [
  {
    id: 'q1',
    type: 'question',
    filter: 'questions',
    author: {
      initials: 'TV',
      name: 'Thomas Vermeulen',
      subtitle: 'Laboratory Manager · BioLab Corp',
      meta: 'Belgium · 2h',
    },
    content:
      'Does anyone have experience with Agilent 1260 Infinity II maintenance contracts in Belgium? We are evaluating renewal options and would appreciate recommendations.',
    stats: { reactions: 12, comments: 3, shares: 4 },
    comments: [
      {
        id: 'q1-c1',
        author: {
          initials: 'RK',
          name: 'Ravi Kumar',
          subtitle: 'Lab Director · SynLab Diagnostics',
          avatar:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqy5ShEFSxwHTFMoD48GNhTteRdlLb51azWU0ibObL5g&s=10',
        },
        content:
          'We renewed with Agilent last year through their Benelux partner — response times improved a lot compared to our previous vendor.',
        time: '1h',
        replies: 0,
        liked: false,
      },
      {
        id: 'q1-c2',
        author: {
          initials: 'SL',
          name: 'Sofia Lindström',
          subtitle: 'Validation Specialist · PharmaNord AB',
          avatar:
            'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&h=160&fit=crop&crop=face',
        },
        content:
          'Happy to share our SLA comparison sheet if useful — we benchmarked three providers in the EU.',
        time: '45m',
        replies: 1,
        liked: false,
      },
      {
        id: 'q1-c3',
        author: {
          initials: 'MD',
          name: 'Marc Dubois',
          subtitle: 'QC Manager · Eurofins Ghent',
          avatar:
            'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=160&h=160&fit=crop&crop=face',
        },
        content: 'Seconding Ravi — make sure uptime clauses are explicit in the contract.',
        time: '20m',
        replies: 0,
        liked: false,
      },
    ],
  },
  {
    id: 'i1',
    type: 'information',
    filter: 'information',
    author: {
      initials: 'AH',
      name: 'Amina Haddad',
      subtitle: 'Senior Microbiologist · Institut Pasteur Lille',
      meta: 'France · 5h',
    },
    content:
      'Sharing our internal summary of the revised EU environmental monitoring expectations for Grade A/B cleanrooms. It covers sampling frequency, action limits and the documentation trail that auditors asked us for last quarter.',
    attachment: {
      name: 'EM-Programme-Revision-2026.pdf',
      meta: 'PDF · 2.4 MB · 18 pages',
    },
    stats: { reactions: 87, comments: 2, shares: 21 },
    comments: [
      {
        id: 'c1',
        author: {
          initials: 'MD',
          name: 'Marc Dubois',
          subtitle: 'QC Manager · Eurofins Ghent',
          avatar:
            'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=160&h=160&fit=crop&crop=face',
        },
        content:
          'Very helpful — we had similar auditor questions on documentation trails last quarter. Saving this for our next internal review.',
        time: '1h',
        replies: 1,
        liked: false,
      },
      {
        id: 'c2',
        author: {
          initials: 'SL',
          name: 'Sofia Lindström',
          subtitle: 'Validation Specialist · PharmaNord AB',
          avatar:
            'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&h=160&fit=crop&crop=face',
        },
        content:
          'Could you share whether your sampling frequency table covers both passive and active air monitoring?',
        time: '45m',
        replies: 0,
        liked: false,
      },
    ],
  },
  {
    id: 's1',
    type: 'sponsored',
    filter: 'suppliers',
    author: {
      initials: 'ML',
      name: 'Meridian Lab Instruments',
      subtitle: 'Product Showcase · Stuttgart, Germany',
      meta: 'Sponsored',
    },
    title: 'ProCeler X-24 High-Speed Centrifuge',
    content:
      'Compact high-speed centrifuge designed for routine QC workflows. Includes rotor, imbalance detection and validated temperature control.',
    image:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=450&fit=crop',
    price: '€8,450 / unit',
    cta: 'Contact Seller',
    stats: { reactions: 34, comments: 2, shares: 9 },
    comments: [
      {
        id: 's1-c1',
        author: {
          initials: 'TV',
          name: 'Thomas Vermeulen',
          subtitle: 'Laboratory Manager · BioLab Corp',
          avatar:
            'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&h=160&fit=crop&crop=face',
        },
        content: 'Does this model support GLP-compliant audit trails out of the box?',
        time: '3h',
        replies: 0,
        liked: false,
      },
      {
        id: 's1-c2',
        author: {
          initials: 'AH',
          name: 'Amina Haddad',
          subtitle: 'Senior Microbiologist · Institut Pasteur Lille',
          avatar:
            'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=160&h=160&fit=crop&crop=face',
        },
        content: 'We use a similar unit in our QC lab — very reliable for daily runs.',
        time: '2h',
        replies: 0,
        liked: true,
      },
    ],
  },
  {
    id: 'p1',
    type: 'promo',
    filter: 'suppliers',
    author: {
      initials: 'ML',
      name: 'Meridian Lab Instruments',
      subtitle: 'Promotional Offer · Stuttgart, Germany',
      meta: 'Sponsored',
    },
    title: 'Q3 Restock — 25% Off PCR Master Mixes',
    content:
      'Limited-time restock on validated PCR master mixes for diagnostic workflows. Bulk pricing available for accredited laboratories.',
    image:
      'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=800&h=450&fit=crop',
    price: '$960',
    originalPrice: '$1,280',
    discount: 'Save 25%',
    validUntil: 'Valid until Sep 7, 2026',
    cta: 'Contact Seller',
    stats: { reactions: 56, comments: 1, shares: 14 },
    comments: [
      {
        id: 'p1-c1',
        author: {
          initials: 'RK',
          name: 'Ravi Kumar',
          subtitle: 'Lab Director · SynLab Diagnostics',
          avatar:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqy5ShEFSxwHTFMoD48GNhTteRdlLb51azWU0ibObL5g&s=10',
        },
        content: 'Is bulk pricing available for orders above 50 kits?',
        time: '4h',
        replies: 0,
        liked: false,
      },
    ],
  },
];

export const reportReasons = [
  'Harassment',
  'Fraud or scam',
  'Spam',
  'Misinformation',
  'Hateful speech',
  'Threats or violence',
  'Self-harm',
  'Dangerous or extremist organizations',
  'Graphic content',
  'Sexual content',
  'Fake account',
  'Child exploitation',
  'Restricted goods and services',
  'Nonconsensual intimate imagery',
];
