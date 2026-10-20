import { AlertTriangle, CheckCircle2, Clock, Eye, Megaphone, Send } from 'lucide-react';
import { DEMO_CHART_MONTHS } from '@/data/demoData';

export const SUPPLIER_DASHBOARD_STATS = [
  {
    id: 'active',
    icon: Megaphone,
    label: 'Active Advertisements',
    value: '12',
    tone: 'green',
    hint: 'Currently running',
  },
  {
    id: 'pending',
    icon: Clock,
    label: 'Pending Approval',
    value: '03',
    tone: 'orange',
    hint: 'Awaiting admin review',
  },
  {
    id: 'views',
    icon: Eye,
    label: 'Total Views',
    value: '8,420',
    tone: 'blue',
    hint: 'Across all advertisements',
  },
  {
    id: 'clicks',
    icon: Send,
    label: 'Total Clicks',
    value: '1,284',
    tone: 'purple',
    hint: 'Advertisement interactions',
  },
];

export const SUPPLIER_AD_PERFORMANCE_CHART = {
  title: 'Advertisement Performance',
  yMax: 800,
  yTicks: [0, 200, 400, 600, 800],
  series: [
    {
      id: 'views',
      label: 'View',
      color: '#EC4899',
      values: [320, 410, 380, 520, 480, 560, 620, 590, 640, 710, 680, 760],
    },
    {
      id: 'clicks',
      label: 'Clicks',
      color: '#22C55E',
      values: [80, 95, 88, 120, 110, 130, 145, 138, 152, 168, 160, 175],
    },
  ],
};

export const SUPPLIER_CHART_MONTHS = DEMO_CHART_MONTHS;

export const SUPPLIER_DASHBOARD_NOTIFICATIONS = [
  {
    id: 'dn1',
    icon: CheckCircle2,
    iconClass: 'bg-green-secondary text-green-primary',
    title: 'Advertisement Approved',
    subtitle:
      'Your advertisement "Real-Time PCR Machine" has been approved by admin.',
    time: '2 hours ago',
  },
  {
    id: 'dn2',
    icon: Clock,
    iconClass: 'bg-secondary text-primary',
    title: 'Ad Now Live',
    subtitle:
      'Your advertisement "Real-Time PCR Machine" is now live and visible to users.',
    time: 'Yesterday',
  },
  {
    id: 'dn3',
    icon: AlertTriangle,
    iconClass: 'bg-[#FEF3E8] text-[#E67E22]',
    title: 'Ad Rejected',
    subtitle:
      'Your advertisement "GMP Webinar Series 2026" was rejected. Please review and resubmit.',
    time: '1 day ago',
  },
  {
    id: 'dn4',
    icon: AlertTriangle,
    iconClass: 'bg-[#FEF3E8] text-[#E67E22]',
    title: 'Ad Expiring Soon',
    subtitle:
      'Your advertisement "Summer Lab Equipment Sale" will expire in 3 days.',
    time: '2 days ago',
  },
];
