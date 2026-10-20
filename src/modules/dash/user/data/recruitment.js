import { withProductImages } from './productImages';

export const levels = ['All', 'Entry-level', 'Mid-level', 'Senior'];

export const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];

export const jobs = withProductImages(
  [
  {
    id: 'qc-analyst-sanofi',
    title: 'Quality Control Analyst — Pharmaceutical',
    company: 'Sanofi',
    location: 'Lyon, France',
    employmentType: 'Full-time',
    level: 'Mid-level',
    salary: '€38,000 – €48,000',
    postedAgo: 'Posted 2 days ago',
    applyLink: 'https://www.sanofi.com/careers',
    image:
      'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=200&h=200&fit=crop',
    about:
      'Join our Lyon manufacturing site as a QC Analyst supporting batch release, stability testing and method transfer activities in a GMP-regulated pharmaceutical environment.',
    requirements: [
      'BSc in Chemistry, Pharmacy or Biochemistry',
      '3+ years QC experience in pharma',
      'HPLC proficiency',
      'GMP knowledge',
      'French & English',
    ],
  },
  {
    id: 'microbiology-technician',
    title: 'Microbiology Lab Technician',
    company: 'Ghent BioAnalytics',
    location: 'Ghent, Belgium',
    employmentType: 'Full-time',
    level: 'Entry-level',
    salary: '€28,000 – €34,000',
    postedAgo: 'Posted 4 days ago',
    applyLink: 'https://www.ghentbio.com/careers',
    image:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=200&h=200&fit=crop',
    about:
      'Support sterility testing, environmental monitoring and media preparation in a fast-paced microbiology laboratory.',
    requirements: [
      'Degree in Microbiology or Life Sciences',
      'Experience with aseptic technique',
      'Attention to detail and documentation',
      'Dutch & English',
    ],
    ownerId: 'current-user',
  },
  {
    id: 'validation-engineer-bionova',
    title: 'Validation Engineer — CSV & Equipment',
    company: 'BioNova Labs',
    location: 'Munich, Germany',
    employmentType: 'Full-time',
    level: 'Senior',
    salary: '€55,000 – €68,000',
    postedAgo: 'Posted 1 week ago',
    applyLink: 'https://www.bionova-labs.de/jobs',
    image:
      'https://images.unsplash.com/photo-1532187863486-abf9db881935?w=200&h=200&fit=crop',
    about:
      'Lead equipment qualification and computer system validation projects for new analytical and production systems.',
    requirements: [
      '5+ years validation experience',
      'CSV and GAMP 5 knowledge',
      'IQ/OQ/PQ protocol authoring',
      'German & English',
    ],
    ownerId: 'current-user',
  },
  {
    id: 'lab-manager-pasteur',
    title: 'Laboratory Manager — Research Facility',
    company: 'Institut Pasteur Lille',
    location: 'Paris, France',
    employmentType: 'Full-time',
    level: 'Senior',
    salary: '€52,000 – €62,000',
    postedAgo: 'Posted 1 week ago',
    applyLink: 'https://www.pasteur.fr/careers',
    image:
      'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=200&h=200&fit=crop',
    about:
      'Manage daily operations, staffing and budget for a research microbiology laboratory supporting clinical trials.',
    requirements: [
      'MSc or PhD in Life Sciences',
      '5+ years lab management experience',
      'Budget and team leadership skills',
      'French & English',
    ],
    ownerId: 'current-user',
  },
  {
    id: 'qa-specialist-novalab',
    title: 'Quality Assurance Specialist — GMP',
    company: 'NovaLab Sciences',
    location: 'Brussels, Belgium',
    employmentType: 'Full-time',
    level: 'Mid-level',
    salary: '€40,000 – €50,000',
    postedAgo: 'Posted 2 weeks ago',
    applyLink: 'https://www.novalab-sciences.be/jobs',
    image:
      'https://images.unsplash.com/photo-1581093458791-9f302e6d64fb?w=200&h=200&fit=crop',
    about:
      'Support deviation management, CAPA investigations and internal audit preparation in a GMP manufacturing site.',
    requirements: [
      '3+ years QA experience in pharma',
      'GMP and documentation skills',
      'Audit preparation experience',
      'French, Dutch & English',
    ],
    ownerId: 'current-user',
  },
  {
    id: 'analytical-chemist-eurofins',
    title: 'Analytical Chemist — HPLC / QC',
    company: 'Eurofins Ghent',
    location: 'Ghent, Belgium',
    employmentType: 'Full-time',
    level: 'Mid-level',
    salary: '€36,000 – €44,000',
    postedAgo: 'Posted 3 weeks ago',
    applyLink: 'https://www.eurofins.com/careers',
    image:
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=200&h=200&fit=crop',
    about:
      'Perform routine and non-routine HPLC analysis for pharmaceutical clients in an ISO 17025 accredited laboratory.',
    requirements: [
      'BSc in Chemistry or equivalent',
      'HPLC method development experience',
      'OOS investigation experience',
      'Dutch & English',
    ],
    ownerId: 'current-user',
  },
  ],
  500
);

export const filterJobs = (items, query, level) => {
  const q = query.trim().toLowerCase();
  return items.filter((job) => {
    const matchesLevel = level === 'All' || job.level === level;
    const matchesQuery =
      !q ||
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.location.toLowerCase().includes(q);
    return matchesLevel && matchesQuery;
  });
};

export const getJobById = (id) => jobs.find((job) => job.id === id);

export const getMyJobs = () => jobs.filter((job) => job.ownerId === 'current-user');
