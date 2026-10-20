import { withProductImages } from './productImages';

export const categoryStyles = {
  'Industry News': 'bg-green-secondary text-green-primary',
  Research: 'bg-[#FEF3E8] text-[#E67E22]',
  'Laboratory Technology': 'bg-pink-secondary text-pink-light',
  Equipment: 'bg-secondary text-primary',
  Training: 'bg-[#E8F3FB] text-primary',
  Events: 'bg-[#FEF9E6] text-[#B8860B]',
  Careers: 'bg-green-secondary text-green-primary',
  Resources: 'bg-pink-secondary text-pink-light',
};

const latestArticlesRaw = [
  {
    id: 'hplc-service-signs',
    slug: 'hplc-service-signs',
    category: 'Industry News',
    title: '5 Signs Your Lab HPLC System Needs Professional Service',
    excerpt:
      'From baseline drift to pressure fluctuations — learn the early warning signs before a small issue becomes a costly outage.',
    image:
      'https://images.unsplash.com/photo-1581093458791-9f302e6d64fb?w=400&h=400&fit=crop',
    date: 'August 3, 2026',
    author: 'Mohamed',
    readTime: '4 min read',
  },
  {
    id: 'rapid-sterility-research',
    slug: 'rapid-sterility-research',
    category: 'Research',
    title: 'Rapid Sterility Testing: What the Latest Studies Show',
    excerpt:
      'A concise review of growth-based and alternative rapid methods gaining traction in sterile manufacturing QC.',
    image:
      'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&h=400&fit=crop',
    date: 'August 2, 2026',
    author: 'Mohamed',
    readTime: '6 min read',
  },
  {
    id: 'em-programme-2026',
    slug: 'em-programme-2026',
    category: 'Laboratory Technology',
    title: 'Building a Risk-Based Environmental Monitoring Programme',
    excerpt:
      'How to align sampling plans, action limits and trend analysis with Annex 1 expectations.',
    image:
      'https://images.unsplash.com/photo-1532187863486-abf9db881935?w=400&h=400&fit=crop',
    date: 'August 1, 2026',
    author: 'Mohamed',
    readTime: '5 min read',
  },
  {
    id: 'balance-qualification',
    slug: 'balance-qualification',
    category: 'Equipment',
    title: 'When to Re-Qualify Analytical Balances in GMP Labs',
    excerpt:
      'Practical triggers for recalibration and performance verification beyond the annual schedule.',
    image:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=400&fit=crop',
    date: 'July 30, 2026',
    author: 'Mohamed',
    readTime: '3 min read',
  },
  {
    id: 'gmp-training-path',
    slug: 'gmp-training-path',
    category: 'Training',
    title: 'Essential GMP Training Paths for New QC Analysts',
    excerpt:
      'Structured onboarding modules covering documentation, deviations and laboratory safety culture.',
    image:
      'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&h=400&fit=crop',
    date: 'July 28, 2026',
    author: 'Mohamed',
    readTime: '4 min read',
  },
  {
    id: 'lab-innovation-summit',
    slug: 'lab-innovation-summit',
    category: 'Events',
    title: 'Lab Innovation Summit 2026: Sessions Worth Your Time',
    excerpt:
      'Highlights from automation, digital lab and sustainability tracks at this year\'s Brussels event.',
    image:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=400&fit=crop',
    date: 'July 25, 2026',
    author: 'Mohamed',
    readTime: '3 min read',
  },
];

export const latestArticles = withProductImages(latestArticlesRaw, 400, 400);

const archiveArticlesRaw = [
  {
    id: 'csv-lifecycle',
    slug: 'csv-lifecycle',
    category: 'Training',
    title: 'CSV Lifecycle Management for QC Data Systems',
    excerpt:
      'From URS to retirement — a practical framework for chromatography and LIMS platforms in regulated labs.',
    image:
      'https://images.unsplash.com/photo-1532187863486-abf9db881935?w=600&h=340&fit=crop',
    date: 'Aug 8, 2026',
    author: 'Mohamed',
    readTime: '7 min read',
    authorInitials: 'MO',
  },
  {
    id: 'pharma-career-paths',
    slug: 'pharma-career-paths',
    category: 'Events',
    title: 'Navigating Career Paths in Pharmaceutical QC',
    excerpt:
      'Panel insights from senior analysts on progression from bench work to team leadership roles.',
    image:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=340&fit=crop',
    date: 'Aug 6, 2026',
    author: 'Mohamed',
    readTime: '5 min read',
    authorInitials: 'MO',
  },
  {
    id: 'method-transfer-guide',
    slug: 'method-transfer-guide',
    category: 'Careers',
    title: 'Method Transfer Between Sites: A QC Lead\'s Checklist',
    excerpt:
      'Critical steps for successful analytical method transfer without compromising data integrity.',
    image:
      'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600&h=340&fit=crop',
    date: 'Aug 4, 2026',
    author: 'Mohamed',
    readTime: '6 min read',
    authorInitials: 'MO',
  },
  {
    id: 'iso-17025-templates',
    slug: 'iso-17025-templates',
    category: 'Resources',
    title: 'Free ISO 17025 Gap-Assessment Templates for Testing Labs',
    excerpt:
      'Downloadable checklists covering document control, equipment management and management review.',
    image:
      'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&h=340&fit=crop',
    date: 'Aug 2, 2026',
    author: 'Mohamed',
    readTime: '4 min read',
    authorInitials: 'MO',
  },
  {
    id: 'stability-chamber-qual',
    slug: 'stability-chamber-qual',
    category: 'Training',
    title: 'Qualifying Stability Chambers: Mapping and Monitoring',
    excerpt:
      'Temperature mapping protocols and ongoing monitoring strategies for ICH-compliant stability studies.',
    image:
      'https://images.unsplash.com/photo-1581093458791-9f302e6d64fb?w=600&h=340&fit=crop',
    date: 'Jul 30, 2026',
    author: 'Mohamed',
    readTime: '8 min read',
    authorInitials: 'MO',
  },
  {
    id: 'audit-readiness',
    slug: 'audit-readiness',
    category: 'Events',
    title: 'Audit Readiness Workshop: Key Takeaways for Lab Managers',
    excerpt:
      'How to prepare your team, documentation and equipment records before an unannounced inspection.',
    image:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=340&fit=crop',
    date: 'Jul 28, 2026',
    author: 'Mohamed',
    readTime: '5 min read',
    authorInitials: 'MO',
  },
  {
    id: 'oos-investigation',
    slug: 'oos-investigation',
    category: 'Careers',
    title: 'Leading OOS Investigations: Skills Every QC Supervisor Needs',
    excerpt:
      'Root cause analysis techniques and communication strategies during regulatory scrutiny.',
    image:
      'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&h=340&fit=crop',
    date: 'Jul 26, 2026',
    author: 'Mohamed',
    readTime: '6 min read',
    authorInitials: 'MO',
  },
  {
    id: 'lab-safety-culture',
    slug: 'lab-safety-culture',
    category: 'Resources',
    title: 'Building a Strong Laboratory Safety Culture in 2026',
    excerpt:
      'Practical initiatives that move beyond compliance checklists to genuine behavioural change.',
    image:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=340&fit=crop',
    date: 'Jul 24, 2026',
    author: 'Mohamed',
    readTime: '4 min read',
    authorInitials: 'MO',
  },
];

export const archiveArticles = withProductImages(archiveArticlesRaw, 600, 340);

const popularPostsRaw = [
  {
    id: 'electrician-lab-power',
    slug: 'electrician-lab-power',
    title: 'When Should You Upgrade Your Lab Power Infrastructure?',
    excerpt: 'Signs your electrical setup is limiting instrument performance and safety.',
    image:
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&h=200&fit=crop',
    readTime: '10 Minutes',
    author: 'Ahmed Awad',
  },
  {
    id: 'cleanroom-classification',
    slug: 'cleanroom-classification',
    title: 'Understanding Cleanroom Classification Changes Under Annex 1',
    excerpt: 'What Grade A–D really means for your environmental monitoring programme.',
    image:
      'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=200&h=200&fit=crop',
    readTime: '8 Minutes',
    author: 'Sara Benali',
  },
  {
    id: 'data-integrity-lims',
    slug: 'data-integrity-lims',
    title: 'Data Integrity in LIMS: Common Pitfalls and Fixes',
    excerpt: 'Audit trail gaps and access control issues seen during recent MHRA inspections.',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=200&fit=crop',
    readTime: '6 Minutes',
    author: 'Thomas Vermeulen',
  },
];

export const popularPosts = withProductImages(popularPostsRaw, 200, 200);

export const allArticles = [...latestArticles, ...archiveArticles];

export const getArticleBySlug = (slug) => allArticles.find((a) => a.slug === slug);

export const featuredArticle = {
  ...latestArticles[0],
  authorDisplay: 'Jordan Mirchev',
  publishedOn: 'November 14, 2022',
  readTime: '2 min read',
  body: [
    'Laboratory equipment problems rarely appear overnight. More often, they start as small changes — a slightly longer run time, a faint drift in baseline, or a valve that takes a second longer to switch. Catching these early can save weeks of downtime and prevent costly batch delays.',
    'One of the most common early signs is inconsistent peak retention times. If your chromatography method suddenly requires frequent recalibration, the pump seals, mixer, or column may be degrading. Addressing this promptly avoids out-of-specification results downstream.',
    'Unusual pressure readings are another red flag. A gradual increase often points to column blockage or contaminated mobile phase, while sudden drops may indicate a leak in the flow path. Regular system suitability checks help spot these trends before they affect release testing.',
    'Low sensitivity or poor repeatability in assay results can signal detector issues, carry-over, or sample preparation problems. Document every deviation and investigate root cause rather than simply re-running samples — regulators expect structured follow-up.',
    'Finally, visible moisture, corrosion, or unusual noise from instruments should never be ignored. Preventive maintenance contracts and qualified service engineers are investments that protect data integrity and keep your laboratory audit-ready.',
  ],
};
