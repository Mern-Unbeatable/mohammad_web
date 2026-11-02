import { feedPosts } from '@/modules/dash/user/data/dashboard';

export const REPORT_STAT_CARDS = [
  { id: 'total', label: 'Total Reports', value: '9', tone: 'blue' },
  { id: 'pending', label: 'Pending Reports', value: '5', tone: 'orange' },
  { id: 'review', label: 'Under Review', value: '2', tone: 'blue' },
  { id: 'resolved', label: 'Resolved Reports', value: '1', tone: 'green' },
];

export const ADMIN_REPORT_ROWS = [
  {
    id: 'rep-1024',
    reportedBy: 'Albert Flores',
    reportedItem: 'Dr. Victor Vance posted unsolicited sales pitches…',
    type: 'Post',
    reason: 'Harassment',
    reportedUser: 'Jerome Bell',
    reportCount: 5,
    reportedDate: '01/02/2026',
    status: 'Resolved',
  },
  {
    id: 'rep-1025',
    reportedBy: 'Marvin McKinney',
    reportedItem: 'Does anyone have experience with refurbished…',
    type: 'Comment',
    reason: 'Fraud or scam',
    reportedUser: 'Jerome Bell',
    reportCount: 5,
    reportedDate: '01/02/2026',
    status: 'Pending',
  },
  {
    id: 'rep-1026',
    reportedBy: 'Theresa Webb',
    reportedItem: 'EXCLUSIVE LIQUIDATION: 10x Refurbished Roche…',
    type: 'Post',
    reason: 'Spam',
    reportedUser: 'Dr. Victor Vance',
    reportCount: 7,
    reportedDate: '01/02/2026',
    status: 'Pending',
  },
  {
    id: 'rep-1027',
    reportedBy: 'Ronald Richards',
    reportedItem: 'Sharing unverified Annex 1 guidance links…',
    type: 'Post',
    reason: 'Misinformation',
    reportedUser: 'Dr. Victor Vance',
    reportCount: 7,
    reportedDate: '01/02/2026',
    status: 'Under Review',
  },
  {
    id: 'rep-1028',
    reportedBy: 'Courtney Henry',
    reportedItem: 'Repeated hostile replies in recruitment thread…',
    type: 'Comment',
    reason: 'Harassment',
    reportedUser: 'Jerome Bell',
    reportCount: 5,
    reportedDate: '01/02/2026',
    status: 'Pending',
  },
  {
    id: 'rep-1029',
    reportedBy: 'Dianne Russell',
    reportedItem: 'Self-harm references in group discussion…',
    type: 'Comment',
    reason: 'Self-harm',
    reportedUser: 'Jerome Bell',
    reportCount: 5,
    reportedDate: '01/02/2026',
    status: 'Under Review',
  },
  {
    id: 'rep-1030',
    reportedBy: 'Amina Haddad',
    reportedItem: 'Misleading centrifuge pricing in sponsored post…',
    type: 'Post',
    reason: 'Fraud or scam',
    reportedUser: 'Dr. Victor Vance',
    reportCount: 7,
    reportedDate: '01/02/2026',
    status: 'Pending',
  },
  {
    id: 'rep-1031',
    reportedBy: 'Albert Flores',
    reportedItem: 'Offensive language directed at QC managers…',
    type: 'Comment',
    reason: 'Harassment',
    reportedUser: 'Dr. Victor Vance',
    reportCount: 7,
    reportedDate: '01/02/2026',
    status: 'Pending',
  },
  {
    id: 'rep-1032',
    reportedBy: 'Marvin McKinney',
    reportedItem: 'Duplicate promotional listings across marketplace…',
    type: 'Post',
    reason: 'Spam',
    reportedUser: 'Jerome Bell',
    reportCount: 5,
    reportedDate: '01/02/2026',
    status: 'Pending',
  },
];

const harassmentPost = feedPosts.find((post) => post.id === 'q1');

export const ADMIN_REPORT_DETAILS = {
  'rep-1024': {
    id: 'rep-1024',
    reason: 'Harassment',
    reasonDetail:
      'Continuous pattern of hostility against female lab managers and recurrent unverified sales pitches.',
    reporter: {
      id: 'claire-moreau',
      name: 'Claire Moreau',
      title: 'Molecular Diagnostics Lab Manager',
      company: 'Institut Pasteur',
      country: 'France',
      initials: 'CM',
      avatar:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&h=160&fit=crop&crop=face',
      badge: 'Whistleblower',
    },
    reportedUser: {
      id: 'victor-vance',
      name: 'Dr. Victor Vance',
      title: 'Independent Lab Equipment Broker',
      company: 'BioTech Surplus Exchange LLC',
      country: 'United States',
      email: 'vvance@biotechsurplus.com',
      joinedDate: 'Jan 14, 2025',
      initials: 'VV',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&h=160&fit=crop&crop=face',
      status: 'Active',
      totalReports: 7,
      warnings: 2,
    },
    post: harassmentPost
      ? {
          ...harassmentPost,
          stats: { reactions: 24, comments: 2, shares: 3 },
        }
      : null,
    moderationCases: [
      {
        id: 'REP-1024',
        category: 'Fraud / Scam',
        snippet: 'EXCLUSIVE LIQUIDATION: 10x Refurbished Roche Cobas…',
        date: 'Aug 18, 2026 10:32 AM',
      },
      {
        id: 'REP-1018',
        category: 'Harassment',
        snippet: 'Your QC team clearly has no idea what they are doing…',
        date: 'Aug 12, 2026 3:14 PM',
      },
      {
        id: 'REP-1011',
        category: 'Offensive Language',
        snippet: 'Stop wasting everyone\'s time with these amateur questions…',
        date: 'Aug 5, 2026 9:48 AM',
      },
      {
        id: 'REP-1004',
        category: 'Spam',
        snippet: 'DM me for off-platform deals on refurbished HPLC systems…',
        date: 'Jul 29, 2026 11:05 AM',
      },
    ],
  },
};

export const getAdminReportById = (id) => {
  const detail = ADMIN_REPORT_DETAILS[id];
  if (detail) return detail;

  const row = ADMIN_REPORT_ROWS.find((item) => item.id === id);
  if (!row) return null;

  return {
    id: row.id,
    reason: row.reason,
    reasonDetail: `Report filed for ${row.reason.toLowerCase()} regarding ${row.reportedUser}.`,
    reporter: {
      name: row.reportedBy,
      title: 'Lab Unity Member',
      company: 'Member organisation',
      country: 'Europe',
      initials: row.reportedBy
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2),
    },
    reportedUser: {
      name: row.reportedUser,
      title: 'Platform member',
      company: 'Independent',
      country: 'Europe',
      status: 'Active',
      totalReports: row.reportCount,
      warnings: 0,
    },
    post: harassmentPost,
    moderationCases: [],
  };
};
