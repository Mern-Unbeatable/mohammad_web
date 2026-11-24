import { feedPosts } from '@/modules/dash/user/data/dashboard';

const coverPhoto =
  'https://images.unsplash.com/photo-1504805572947-34fad45aed93?fm=jpg&q=60&w=3000&auto=format&fit=crop';

export const ADMIN_USER_ROWS = [
  {
    id: 'albert-flores',
    userName: 'Albert Flores',
    userType: 'Laboratory',
    company: 'BioLabParis',
    role: 'Quality Control Manager',
    subscription: 'Monthly',
    joinedDate: '2024-03-12',
    status: 'Active',
  },
  {
    id: 'marvin-mckinney',
    userName: 'Marvin McKinney',
    userType: 'Hospital',
    company: 'Medisupply GmbH',
    role: 'Assistant Manager',
    subscription: 'Yearly',
    joinedDate: '2024-05-20',
    status: 'Active',
  },
  {
    id: 'theresa-webb',
    userName: 'Theresa Webb',
    userType: 'Clinic',
    company: 'NovaLab Sciences',
    role: 'QC Manager',
    subscription: 'Free',
    joinedDate: '2024-03-12',
    status: 'Active',
  },
  {
    id: 'ronald-richards',
    userName: 'Ronald Richards',
    userType: 'Laboratory',
    company: 'SynLab Diagnostics',
    role: 'Lab Director',
    subscription: 'Yearly',
    joinedDate: '2023-11-08',
    status: 'Suspend',
  },
  {
    id: 'amina-haddad',
    userName: 'Amina Haddad',
    userType: 'Laboratory',
    company: 'Institut Pasteur Lille',
    role: 'Senior Microbiologist',
    subscription: 'Monthly',
    joinedDate: '2024-06-18',
    status: 'Active',
  },
  {
    id: 'courtney-henry',
    userName: 'Courtney Henry',
    userType: 'Hospital',
    company: 'EuroLab Sciences',
    role: 'Validation Engineer',
    subscription: 'Monthly',
    joinedDate: '2025-01-15',
    status: 'Active',
  },
  {
    id: 'dianne-russell',
    userName: 'Dianne Russell',
    userType: 'Clinic',
    company: 'PharmaNord AB',
    role: 'QA Specialist',
    subscription: 'Free',
    joinedDate: '2024-09-02',
    status: 'Active',
  },
];

export const ADMIN_SUPPLIER_ROWS = [
  {
    id: 'albert-flores',
    userName: 'Albert Flores',
    userType: 'Laboratory',
    company: 'BioLabParis',
    role: 'Quality Control Manager',
    joinedDate: '2024-03-12',
    status: 'Active',
  },
  {
    id: 'marvin-mckinney',
    userName: 'Marvin McKinney',
    userType: 'Hospital',
    company: 'Medisupply GmbH',
    role: 'Assistant Manager',
    joinedDate: '2024-05-20',
    status: 'Active',
  },
  {
    id: 'theresa-webb',
    userName: 'Theresa Webb',
    userType: 'Clinic',
    company: 'NovaLab Sciences',
    role: 'QC Manager',
    joinedDate: '2024-03-12',
    status: 'Active',
  },
  {
    id: 'ronald-richards',
    userName: 'Ronald Richards',
    userType: 'Laboratory',
    company: 'SynLab Diagnostics',
    role: 'Lab Director',
    joinedDate: '2023-11-08',
    status: 'Suspend',
  },
  {
    id: 'ravi-kumar',
    userName: 'Ravi Kumar',
    userType: 'Supplier',
    company: 'SynLab Diagnostics',
    role: 'Lab Director',
    joinedDate: '2023-11-08',
    status: 'Suspend',
  },
  {
    id: 'meridian-lab',
    userName: 'Meridian Lab Instruments',
    userType: 'Supplier',
    company: 'Meridian Lab Instruments',
    role: 'Product Showcase',
    joinedDate: '2024-02-14',
    status: 'Active',
  },
  {
    id: 'bio-supply-eu',
    userName: 'BioSupply EU',
    userType: 'Supplier',
    company: 'BioSupply EU GmbH',
    role: 'Equipment Supplier',
    joinedDate: '2024-08-01',
    status: 'Active',
  },
];

/** Full profile records for admin detail pages — keyed by row id */
export const ADMIN_MEMBER_PROFILES = {
  'amina-haddad': {
    id: 'amina-haddad',
    kind: 'user',
    initials: 'AH',
    name: 'Amina Haddad',
    firstName: 'Amina',
    title: 'Senior Microbiologist',
    company: 'Institut Pasteur Lille',
    location: 'France',
    country: 'France',
    email: 'amina.haddad@pasteur-lille.fr',
    phone: '+33 3 20 87 78 00',
    connections: 331,
    membershipStatus: 'premium',
    coverPhoto,
    avatar:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=160&h=160&fit=crop&crop=face',
    about:
      'Microbiology specialist in sterility testing, environmental monitoring and rapid detection methods for pharmaceutical and clinical laboratories.',
    aboutExtended:
      'I collaborate with QC teams across France on Annex 1 readiness, EM programme revisions and audit documentation. Passionate about sharing practical guidance with the Lab Unity community.',
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
    postIds: ['q1', 'i1'],
  },
  'albert-flores': {
    id: 'albert-flores',
    kind: 'supplier',
    initials: 'AF',
    name: 'Albert Flores',
    title: 'Quality Control Manager',
    company: 'BioLabParis',
    location: 'France',
    country: 'France',
    email: 'albert.flores@biolabparis.fr',
    phone: '+33 1 42 88 12 04',
    connections: 284,
    coverPhoto,
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&h=160&fit=crop&crop=face',
    about:
      'Quality control manager overseeing analytical release testing, method transfer and supplier qualification for a high-throughput clinical laboratory in Paris.',
    aboutExtended:
      'Focused on building scalable QC processes and mentoring junior analysts. On Lab Unity I share equipment sourcing tips and compliance checklists for ISO 17025 labs.',
    postIds: ['s1'],
  },
  'marvin-mckinney': {
    id: 'marvin-mckinney',
    kind: 'supplier',
    initials: 'MM',
    name: 'Marvin McKinney',
    title: 'Assistant Manager',
    company: 'Medisupply GmbH',
    location: 'Germany',
    country: 'Germany',
    email: 'marvin.mckinney@medisupply.de',
    phone: '+49 30 1234 5678',
    connections: 198,
    coverPhoto,
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=face',
    about:
      'Assistant manager at Medisupply GmbH, coordinating hospital laboratory consumables, reagent logistics and vendor partnerships across DACH markets.',
    postIds: ['s1'],
  },
  'meridian-lab': {
    id: 'meridian-lab',
    kind: 'supplier',
    initials: 'ML',
    name: 'Meridian Lab Instruments',
    title: 'Product Showcase',
    company: 'Meridian Lab Instruments',
    location: 'Stuttgart, Germany',
    country: 'Germany',
    email: 'sales@meridian-lab.eu',
    phone: '+49 711 123 4567',
    connections: 512,
    coverPhoto,
    avatar:
      'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=160&h=160&fit=crop&crop=face',
    about:
      'European distributor of centrifuges, incubators and routine QC instruments for pharmaceutical and research laboratories.',
    postIds: ['s1'],
  },
};

export const getAdminMemberProfile = (id) => {
  if (ADMIN_MEMBER_PROFILES[id]) return ADMIN_MEMBER_PROFILES[id];

  const row =
    ADMIN_USER_ROWS.find((item) => item.id === id) ||
    ADMIN_SUPPLIER_ROWS.find((item) => item.id === id);

  if (!row) return null;

  const initials = row.userName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const isSupplier =
    row.userType === 'Supplier' ||
    ADMIN_SUPPLIER_ROWS.some((item) => item.id === id && !ADMIN_USER_ROWS.some((u) => u.id === id));

  return {
    id: row.id,
    kind: isSupplier ? 'supplier' : 'user',
    initials,
    name: row.userName,
    firstName: row.userName.split(' ')[0],
    title: row.role,
    company: row.company,
    location: 'Europe',
    country: 'Europe',
    email: `${row.userName.toLowerCase().replace(/\s+/g, '.')}@labunity.eu`,
    phone: '+32 471 22 88 04',
    connections: 200,
    membershipStatus: isSupplier ? undefined : 'premium',
    coverPhoto,
    avatar: undefined,
    about: `${row.role} at ${row.company}. Active member of the Lab Unity laboratory community.`,
    subscription: {
      planName: 'Lab Unity Membership',
      status: 'Active',
      startDate: '13 March 2026',
      renewalDate: '13 April 2026',
      amount: '€19.99',
      billingCycle: row.subscription || 'Monthly',
      nextPayment: '13 April 2026',
      paymentMethod: 'Visa ending 9427',
    },
    postIds: isSupplier ? ['s1'] : ['i1'],
  };
};

export const getAdminMemberPosts = (profile) => {
  if (!profile?.postIds?.length) return [];
  return feedPosts.filter((post) => profile.postIds.includes(post.id));
};

export const SUBSCRIPTION_PILL_STYLES = {
  Monthly: 'bg-secondary text-primary',
  Yearly: 'bg-pink-secondary text-pink-light',
  Free: 'bg-[#F3F4F6] text-[#64748B]',
};
