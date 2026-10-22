import {
  Briefcase,
  CalendarDays,
  FlaskConical,
  GraduationCap,
  Newspaper,
} from 'lucide-react';

export const HOME_PATH = '/';
export const JOIN_PATH = '/join';
export const LOGIN_PATH = '/login';

/** In-page anchors; the public navbar links to these as `/#id`. */
export const HOME_SECTIONS = {
  PLATFORM: 'platform',
  COMMUNITY: 'community',
  MARKETPLACE: 'marketplace',
};

/** "Explore Network" in the hero scrolls here. */
export const EXPLORE_SECTION_ID = HOME_SECTIONS.COMMUNITY;

export const HERO_FEATURES = [
  'Research-focused',
  'Professional community',
  'Built for the laboratory industry',
];

export const DISCOVER_TAGS = [
  { label: 'Research', icon: FlaskConical, color: 'text-pink-light', bg: 'bg-[#FDF0F6]' },
  { label: 'Jobs', icon: Briefcase, color: 'text-primary', bg: 'bg-[#E8F3FB]' },
  { label: 'Events', icon: CalendarDays, color: 'text-green-primary', bg: 'bg-green-secondary' },
  { label: 'Training', icon: GraduationCap, color: 'text-[#6B7280]', bg: 'bg-[#F3F4F6]' },
  { label: 'Industry News', icon: Newspaper, color: 'text-primary', bg: 'bg-[#E8F3FB]' },
];

export const CONNECT_AVATARS = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&h=160&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=face',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqy5ShEFSxwHTFMoD48GNhTteRdlLb51azWU0ibObL5g&s=10',
];

export const NETWORK_NODES = [
  {
    role: 'Researcher',
    label: 'Biochemistry',
    avatar:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&crop=face',
    className: 'left-0 top-[6%] sm:left-[4%]',
  },
  {
    role: 'Laboratory',
    label: 'Nordic Analytics',
    avatar:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=80&h=80&fit=crop&crop=face',
    className: 'right-0 top-[6%] sm:right-[4%]',
  },
  {
    role: 'Supplier',
    label: 'Chromatography',
    avatar:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqy5ShEFSxwHTFMoD48GNhTteRdlLb51azWU0ibObL5g&s=10',
    className: 'bottom-[4%] left-1/2 -translate-x-1/2',
  },
];

export const NETWORK_STATS = [
  { value: '2,500+', label: 'LABORATORIES' },
  { value: '12K+', label: 'PROFESSIONALS' },
  { value: '120+', label: 'COUNTRIES' },
];

export const MARKETPLACE_ITEMS = [
  { title: 'Agilent 1260 HPLC System', price: 'Refurbished · €14,500' },
  { title: 'Benchtop Centrifuge 5810R', price: 'Used · €3,200' },
];

export const KNOWLEDGE_TAGS = ['Analytica 2026 · Munich', 'GMP Training · Online'];
