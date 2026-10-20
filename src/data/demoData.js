/**
 * Demo payloads for /developer live previews.
 * Import: `import { DEMO_* } from '@/data/demoData'`
 */
import {
  Briefcase,
  CheckCircle2,
  Euro,
  Home,
  Star,
  Users,
} from 'lucide-react';
import { contacts } from '@/modules/dash/user/data/contacts';
import { jobs } from '@/modules/dash/user/data/recruitment';
import { generalPosts } from '@/modules/dash/user/data/general';
import { listings } from '@/modules/dash/user/data/marketplace';
import { latestArticles } from '@/modules/dash/user/data/blogs';
import { currentUser } from '@/modules/dash/user/data/dashboard';

export const DEMO_CONTACT = contacts[0];
export const DEMO_CONTACT_PENDING = { ...contacts[1], pending: true };
export const DEMO_CONTACT_CONNECTED = contacts[2];

export const DEMO_JOB_BROWSE = jobs[0];
export const DEMO_JOB_HIGHLIGHTED = jobs[0];
export const DEMO_JOB_MINE = jobs.find((job) => job.ownerId === 'current-user');
export const DEMO_JOB_DETAIL = jobs[0];

export const DEMO_GENERAL_POST = generalPosts[0];
export const DEMO_GENERAL_POST_MINE = generalPosts.find((post) => post.ownerId === 'current-user');

export const DEMO_LISTING = listings[2] ?? listings[0];
export const DEMO_LISTING_MINE = listings.find((listing) => listing.ownerId === 'current-user');

export const DEMO_BLOG_ADMIN = latestArticles[0];

export const DEMO_PROFILE_USER = currentUser;

export const DEMO_PROFILE_FORM = {
  firstName: currentUser.firstName,
  lastName: currentUser.lastName,
  title: currentUser.title,
  company: currentUser.company,
  country: currentUser.country,
  email: currentUser.email,
  phone: currentUser.phone,
  about: `${currentUser.about} ${currentUser.aboutExtended || ''}`.trim(),
};

export const DEMO_ADMIN_PROFILE = {
  displayName: 'Chowdhury Group Of Industries',
  displayEmail: 'chowdhury@gmail.com',
  name: 'John Industries',
  email: 'admin@johnindustries.com',
};

export const DEMO_ADMIN_PASSWORD = {
  current: '••••••••',
  next: '',
  confirm: '',
};

export const DEMO_STAT_CARDS = [
  { id: 'users', icon: Users, label: 'Active Users', value: '11,840', tone: 'blue' },
  { id: 'subs', icon: Star, label: 'New Subscribers', value: '372', tone: 'pink' },
  {
    id: 'active-subs',
    icon: CheckCircle2,
    label: 'Active Subscriptions',
    value: '2,214',
    tone: 'green',
  },
  { id: 'revenue', icon: Euro, label: 'Monthly Revenue', value: '€38,400', tone: 'green' },
  { id: 'jobs', icon: Briefcase, label: 'New Job Listings', value: '86', tone: 'orange' },
  { id: 'market', icon: Home, label: 'Marketplace Listings', value: '1,204', tone: 'purple' },
];

export const DEMO_CHART_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const DEMO_USER_GROWTH_CHART = {
  title: 'User Growth',
  yMax: 12000,
  yTicks: [0, 3000, 6000, 9000, 12000],
  series: [
    {
      id: 'new-users',
      label: 'New Users',
      color: '#F97316',
      values: [400, 520, 680, 1200, 900, 1100, 950, 1050, 880, 920, 1000, 1150],
    },
    {
      id: 'active-users',
      label: 'Active Users',
      color: '#22C55E',
      values: [6200, 6800, 7200, 8400, 8800, 9200, 9600, 10000, 10400, 10800, 11200, 11840],
    },
    {
      id: 'subscribers',
      label: 'Subscribers',
      color: '#EC4899',
      values: [80, 95, 110, 120, 135, 150, 165, 180, 195, 210, 230, 250],
    },
  ],
};

export const DEMO_REVENUE_CHART = {
  title: 'Revenue',
  yMax: 40000,
  yTicks: [0, 10000, 20000, 30000, 40000],
  series: [
    {
      id: 'monthly',
      label: 'Monthly Subscription',
      color: '#F97316',
      values: [8200, 9100, 9800, 12000, 11500, 12800, 13200, 14100, 13800, 14500, 15200, 16000],
    },
    {
      id: 'yearly',
      label: 'Yearly Subscription',
      color: '#22C55E',
      values: [18000, 19500, 21000, 32000, 28000, 29500, 31000, 30500, 32000, 33500, 35000, 36800],
    },
    {
      id: 'sponsored',
      label: 'Sponsored Post',
      color: '#EC4899',
      values: [4200, 4800, 5200, 12000, 6800, 7200, 7600, 8100, 7900, 8400, 8800, 9200],
    },
  ],
};

export const DEMO_NEW_USER_CHART = {
  title: 'New User',
  yMax: 1500,
  yTicks: [0, 500, 1000, 1500],
  series: [
    {
      id: 'new-user',
      label: 'New User',
      color: '#F97316',
      values: [420, 520, 680, 1200, 900, 1100, 950, 1050, 880, 920, 1000, 1150],
    },
  ],
};

export const DEMO_MONTHLY_SUB_REVENUE_CHART = {
  title: 'Monthly Subscription Revenue',
  yMax: 20000,
  yTicks: [0, 5000, 10000, 15000, 20000],
  series: [
    {
      id: 'monthly-rev',
      label: 'Monthly Subscription Revenue',
      color: '#F97316',
      values: [8200, 9100, 9800, 12000, 11500, 12800, 13200, 14100, 13800, 14500, 15200, 16000],
    },
  ],
};

export const DEMO_NEW_SUBSCRIBERS_CHART = {
  title: 'New Subscribers',
  yMax: 400,
  yTicks: [0, 100, 200, 300, 400],
  series: [
    {
      id: 'new-subs',
      label: 'New Subscribers',
      color: '#EC4899',
      values: [80, 95, 110, 120, 135, 150, 165, 180, 195, 210, 230, 250],
    },
  ],
};

export const DEMO_YEARLY_SUB_REVENUE_CHART = {
  title: 'Yearly Subscriber Revenue',
  yMax: 40000,
  yTicks: [0, 10000, 20000, 30000, 40000],
  series: [
    {
      id: 'yearly-rev',
      label: 'Yearly Subscriber Revenue',
      color: '#22C55E',
      values: [18000, 19500, 21000, 32000, 28000, 29500, 31000, 30500, 32000, 33500, 35000, 36800],
    },
  ],
};

export const DEMO_AD_TABLE_ROWS = [
  {
    id: 1,
    title: 'Automated Blood Gas Analyzer',
    category: 'Product Showcase',
    status: 'Active',
    views: '1,240',
    clicks: '86',
    duration: '7 Days',
    uploadDate: '2026-05-01',
  },
  {
    id: 2,
    title: 'ISO 17025 Consulting Services',
    category: 'Service Offering',
    status: 'Pending',
    views: '—',
    clicks: '—',
    duration: '14 Days',
    uploadDate: '2026-05-03',
  },
  {
    id: 3,
    title: 'Summer Lab Equipment Sale',
    category: 'Promotional Offer',
    status: 'Expired',
    views: '3,420',
    clicks: '210',
    duration: '30 Days',
    uploadDate: '2026-04-01',
  },
  {
    id: 4,
    title: 'GMP Webinar Series 2026',
    category: 'Webinar/Event',
    status: 'Rejected',
    views: '—',
    clicks: '—',
    duration: '7 Days',
    uploadDate: '2026-05-05',
  },
];

export const DEMO_USER_TABLE_ROWS = [
  {
    id: 1,
    userName: 'Thomas Vermeulen',
    userType: 'Supplier',
    company: 'Ghent BioAnalytics',
    role: 'Laboratory Director',
    joinedDate: '2024-03-12',
    status: 'Active',
  },
  {
    id: 2,
    userName: 'Amina Haddad',
    userType: 'User',
    company: 'Institut Pasteur Lille',
    role: 'Senior Microbiologist',
    joinedDate: '2024-05-20',
    status: 'Active',
  },
  {
    id: 3,
    userName: 'Ravi Kumar',
    userType: 'Supplier',
    company: 'SynLab Diagnostics',
    role: 'Lab Director',
    joinedDate: '2023-11-08',
    status: 'Suspend',
  },
  {
    id: 4,
    userName: 'Sophie Renard',
    userType: 'User',
    company: 'EuroLab Sciences',
    role: 'QC Manager',
    joinedDate: '2025-01-15',
    status: 'Active',
  },
];

export const DEMO_TABLE_TABS = [
  { id: 'all', label: 'All Users' },
  { id: 'supplier', label: 'Supplier' },
];

export const DEMO_TABLE_FILTERS = [
  {
    id: 'subscription',
    value: 'all',
    options: [
      { value: 'all', label: 'All Subscription' },
      { value: 'monthly', label: 'Monthly' },
      { value: 'yearly', label: 'Yearly' },
    ],
  },
  {
    id: 'status',
    value: 'all',
    options: [
      { value: 'all', label: 'All Statuses' },
      { value: 'active', label: 'Active' },
      { value: 'suspend', label: 'Suspended' },
    ],
  },
];

export const DEMO_TABLE_MENU_ACTIONS = [
  { id: 'view', label: 'View details', onClick: () => {} },
  { id: 'edit', label: 'Edit', onClick: () => {} },
  { id: 'delete', label: 'Delete', variant: 'danger', onClick: () => {} },
];

export { directChats, groupChats } from '@/modules/dash/user/data/messages';
export { feedPosts } from '@/modules/dash/user/data/dashboard';
