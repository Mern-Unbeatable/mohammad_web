import { withProductImages } from './productImages';

export const generalCategories = ['All', 'News', 'Document'];

export const generalAuthor = {
  initials: 'SM',
  name: 'Sophie Mercier',
  company: 'EuroLab Sciences',
  avatar:
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&h=160&fit=crop&crop=face',
};

export const generalPosts = withProductImages(
  [
  {
    id: 'eu-annex-1',
    type: 'news',
    title: 'EU Annex 1 Implementation: What Laboratories Must Know',
    summary:
      'Key changes to contamination control strategy, risk management and environmental monitoring for sterile manufacturing.',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=360&fit=crop',
    date: 'September 12, 2024',
    displayDate: 'August 2024',
    category: 'Documentation',
    source: 'EMA',
    body: [
      'The revised EU GMP Annex 1 introduces stricter requirements for contamination control strategy, risk management and environmental monitoring in sterile manufacturing.',
      'Laboratories supporting pharmaceutical production must align their EM programmes, media fill validation and data integrity practices with the updated guidance.',
      'This article summarises the most impactful changes for QC and microbiology teams preparing for inspections in 2024–2026.',
    ],
  },
  {
    id: 'fda-analytical-guidance',
    type: 'news',
    title: 'FDA Issues New Draft Guidance on Analytical Procedures',
    summary:
      'Updated expectations for method validation, lifecycle management and post-approval change control.',
    image:
      'https://images.unsplash.com/photo-1495474472284-4dafbc5d8821?w=600&h=360&fit=crop',
    date: 'September 10, 2024',
    displayDate: 'August 2024',
    category: 'Documentation',
    source: 'FDA',
    body: [
      'The FDA has published draft guidance outlining modern expectations for analytical procedure development and validation.',
      'The document emphasises quality-by-design principles, enhanced method understanding and robust change management throughout the product lifecycle.',
      'QC laboratories should review existing HPLC, GC and spectroscopic methods against the new recommendations.',
    ],
  },
  {
    id: 'iso-17025-guide',
    type: 'document',
    title: 'ISO 17025:2017 Implementation Guide',
    summary:
      'Step-by-step guidance for accreditation readiness, document control and management review.',
    image:
      'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&h=360&fit=crop',
    date: 'September 12, 2024',
    displayDate: 'August 2024',
    category: 'Documentation',
    body: [
      'This implementation guide supports laboratories preparing for ISO 17025:2017 accreditation with practical templates and checklists.',
      'It covers document control, equipment management, method validation and management review requirements with real-world examples.',
      'Use this resource to gap-assess your quality system before engaging an accreditation body.',
    ],
    ownerId: 'current-user',
  },
  {
    id: 'iso-17025-guide-2',
    type: 'document',
    title: 'ISO 17025:2017 Implementation Guide',
    summary:
      'Companion checklist for internal audits, corrective actions and competency records.',
    image:
      'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&h=360&fit=crop',
    date: 'September 8, 2024',
    displayDate: 'August 2024',
    category: 'Documentation',
    body: [
      'A practical companion to the main ISO 17025 implementation guide, focused on audit preparation.',
      'Includes sample forms for corrective actions, competency assessments and equipment calibration records.',
    ],
    ownerId: 'current-user',
  },
  {
    id: 'gmp-data-integrity',
    type: 'news',
    title: 'MHRA Data Integrity Expectations for QC Laboratories',
    summary:
      'Updated inspection focus areas for chromatography data systems and audit trails.',
    image:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=360&fit=crop',
    date: 'September 5, 2024',
    displayDate: 'July 2024',
    category: 'Documentation',
    source: 'MHRA',
    body: [
      'MHRA inspectors are placing increased emphasis on chromatography data integrity and audit trail review during QC laboratory inspections.',
      'Laboratories should ensure user access controls, backup procedures and review workflows are documented and routinely tested.',
    ],
    ownerId: 'current-user',
  },
  {
    id: 'sop-hplc-validation',
    type: 'document',
    title: 'HPLC Method Validation SOP v2.1',
    summary:
      'Standard operating procedure for analytical method validation in GMP environments.',
    image:
      'https://images.unsplash.com/photo-1532187863486-abf9db881935?w=600&h=360&fit=crop',
    date: 'August 28, 2024',
    displayDate: 'August 2024',
    category: 'Documentation',
    body: [
      'This SOP defines the process for validating HPLC methods including specificity, linearity, accuracy and precision studies.',
      'It aligns with ICH Q2(R2) and internal quality standards for pharmaceutical QC laboratories.',
    ],
    ownerId: 'current-user',
  },
  {
    id: 'lab-safety-training',
    type: 'news',
    title: 'New EMA Training Module on Laboratory Safety Culture',
    summary:
      'Free e-learning module covering chemical hygiene, biosafety and incident reporting.',
    image:
      'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600&h=360&fit=crop',
    date: 'August 22, 2024',
    displayDate: 'July 2024',
    category: 'Training',
    source: 'EMA',
    body: [
      'EMA has launched a free training module to strengthen laboratory safety culture across the pharmaceutical supply chain.',
      'The module covers chemical hygiene plans, biosafety cabinet use and effective incident reporting workflows.',
    ],
  },
  {
    id: 'em-programme-template',
    type: 'document',
    title: 'Environmental Monitoring Programme Template',
    summary:
      'Editable template for cleanroom EM schedules, action limits and trend analysis.',
    image:
      'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&h=360&fit=crop',
    date: 'August 15, 2024',
    displayDate: 'July 2024',
    category: 'Documentation',
    body: [
      'A ready-to-use template for designing environmental monitoring programmes in Grade A–D cleanrooms.',
      'Includes sampling frequency tables, action limit examples and trend analysis worksheets.',
    ],
    ownerId: 'current-user',
  },
  ],
  600,
  360
);

export const filterGeneralPosts = (items, category) => {
  if (category === 'All') return items;
  return items.filter((post) => post.type === category.toLowerCase());
};

export const getGeneralPostById = (id) => generalPosts.find((post) => post.id === id);

export const getMyGeneralPosts = () =>
  generalPosts.filter((post) => post.ownerId === 'current-user');
