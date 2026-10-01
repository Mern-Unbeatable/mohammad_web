/**
 * Component documentation catalog for /developer.
 * Keep in sync when adding shared UI used across the app.
 *
 * Demo payloads: `src/data/demoData.js`
 */

export const DOC_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'ui', label: 'UI Primitives' },
  { id: 'common', label: 'Common' },
  { id: 'pages', label: 'Shared Pages' },
  { id: 'data-display', label: 'Data Display' },
  { id: 'forms', label: 'Forms' },
];

export const COMPONENT_DOCS = [
  {
    id: 'avatar',
    name: 'Avatar',
    category: 'ui',
    summary: 'Circular user avatar with image fallback to initials.',
    path: 'src/components/ui/Avatar.jsx',
    importExample: "import Avatar from '@/components/ui/Avatar'",
    props: [
      {
        name: 'src',
        type: 'string',
        required: false,
        description: 'Image URL. Falls back to initials when missing or broken.',
      },
      {
        name: 'alt',
        type: 'string',
        required: false,
        description: 'Accessible label for the image.',
      },
      {
        name: 'initials',
        type: 'string',
        required: false,
        description: 'Two-letter fallback when no image.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        required: false,
        defaultValue: "'md'",
        description: 'Preset diameter.',
      },
      {
        name: 'className',
        type: 'string',
        required: false,
        defaultValue: "''",
        description: 'Extra classes on the outer circle.',
      },
    ],
    requiredExample: `<Avatar initials="EM" alt="Élise Moreau" size="lg" />`,
    optionalExample: `<Avatar
  src={user.avatar}
  initials={user.initials}
  alt={user.name}
  size="md"
  className="border-2 border-white"
/>`,
    previewId: 'avatar',
    variants: [
      {
        id: 'image',
        name: 'With image',
        description: 'Photo avatar at large size.',
      },
      {
        id: 'initials',
        name: 'Initials fallback',
        description: 'No image — shows initials on tinted background.',
      },
    ],
  },
  {
    id: 'badge',
    name: 'Badge',
    category: 'ui',
    summary: 'Small pill label for employment type, post type, and status tags.',
    path: 'src/components/ui/Badge.jsx',
    importExample: "import Badge from '@/components/ui/Badge'",
    props: [
      {
        name: 'children',
        type: 'ReactNode',
        required: true,
        description: 'Badge label text.',
      },
      {
        name: 'variant',
        type: "'fulltime' | 'post' | string",
        required: false,
        defaultValue: "'fulltime'",
        description: 'Color preset.',
      },
      {
        name: 'className',
        type: 'string',
        required: false,
        defaultValue: "''",
        description: 'Extra utility classes.',
      },
    ],
    requiredExample: `<Badge variant="fulltime">Full-time</Badge>`,
    optionalExample: `<Badge variant="post" className="normal-case">Mid-level</Badge>`,
    previewId: 'badge',
    variants: [
      { id: 'fulltime', name: 'Full-time', description: 'Blue employment badge.' },
      { id: 'post', name: 'Level / post', description: 'Neutral level badge.' },
    ],
  },
  {
    id: 'card',
    name: 'Card',
    category: 'ui',
    summary: 'White bordered surface used as the base for list and grid cards.',
    path: 'src/components/ui/Card.jsx',
    importExample: "import Card from '@/components/ui/Card'",
    props: [
      {
        name: 'children',
        type: 'ReactNode',
        required: true,
        description: 'Card content.',
      },
      {
        name: 'className',
        type: 'string',
        required: false,
        defaultValue: "''",
        description: 'Padding, layout, and border overrides.',
      },
    ],
    requiredExample: `<Card className="p-4">\n  <p>Card content</p>\n</Card>`,
    optionalExample: `<Card className="flex flex-col overflow-hidden">\n  …\n</Card>`,
    previewId: 'card',
  },
  {
    id: 'contact-card',
    name: 'ContactCard',
    category: 'data-display',
    summary: 'Directory grid card for laboratory professionals with Profile and Connect actions.',
    path: 'src/components/data-display/ContactCard/',
    importExample:
      "import ContactCard from '@/components/data-display/ContactCard/ContactCard'\nimport { DEMO_CONTACT } from '@/data/demoData'",
    props: [
      {
        name: 'contact',
        type: 'object',
        required: true,
        description: 'Contact record: id, name, title, company, country, avatar, initials, avatarClass.',
      },
      {
        name: 'connected',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: 'Shows Connected state on the action button.',
      },
      {
        name: 'pending',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: 'Shows Pending state while a request is in flight.',
      },
      {
        name: 'onConnect',
        type: '(contactId: string) => void',
        required: false,
        description: 'Fired when Connect is clicked.',
      },
    ],
    requiredExample: `<ContactCard contact={contact} onConnect={(id) => connect(id)} />`,
    optionalExample: `<ContactCard
  contact={contact}
  connected={isConnected}
  pending={isPending}
  onConnect={handleConnect}
/>`,
    previewId: 'contact-card',
    variants: [
      {
        id: 'default',
        name: 'Default',
        description: 'Connect button ready to click.',
      },
      {
        id: 'pending',
        name: 'Pending',
        description: 'Connection request sent.',
      },
      {
        id: 'connected',
        name: 'Connected',
        description: 'Already connected.',
      },
    ],
  },
  {
    id: 'job-card',
    name: 'JobCard',
    category: 'data-display',
    summary: 'Horizontal recruitment listing with badges and View Details action.',
    path: 'src/components/data-display/JobCard/',
    importExample:
      "import JobCard from '@/components/data-display/JobCard/JobCard'\nimport { DEMO_JOB_BROWSE } from '@/data/demoData'",
    props: [
      {
        name: 'job',
        type: 'object',
        required: true,
        description: 'Job record with title, company, location, employmentType, level, salary, postedAgo, id.',
      },
      {
        name: 'variant',
        type: "'browse' | 'mine'",
        required: false,
        defaultValue: "'browse'",
        description: 'browse → blue View Details; mine → green View Details + edit/delete.',
      },
      {
        name: 'highlighted',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: 'Orange border for featured listings.',
      },
      {
        name: 'onEdit',
        type: '(jobId: string) => void',
        required: false,
        description: 'Mine variant — edit icon clicked.',
      },
      {
        name: 'onDelete',
        type: '(jobId: string) => void',
        required: false,
        description: 'Mine variant — delete icon clicked.',
      },
    ],
    requiredExample: `<JobCard job={job} />`,
    optionalExample: `<JobCard
  job={job}
  variant="mine"
  onEdit={(id) => editJob(id)}
  onDelete={(id) => deleteJob(id)}
/>`,
    previewId: 'job-card',
    variants: [
      {
        id: 'browse',
        name: 'Browse',
        description: 'Recruitment directory — primary View Details button.',
      },
      {
        id: 'highlighted',
        name: 'Browse · highlighted',
        description: 'Featured job with orange border.',
      },
      {
        id: 'mine',
        name: 'My jobs',
        description: 'Owner view with edit and delete icon buttons.',
      },
    ],
  },
  {
    id: 'general-post-card',
    name: 'GeneralPostCard',
    category: 'data-display',
    summary: 'News and document card for the General hub grid.',
    path: 'src/components/data-display/GeneralPostCard/',
    importExample:
      "import GeneralPostCard from '@/components/data-display/GeneralPostCard/GeneralPostCard'\nimport { DEMO_GENERAL_POST } from '@/data/demoData'",
    props: [
      {
        name: 'post',
        type: 'object',
        required: true,
        description: 'Post with id, type (news|document), title, summary, image, date.',
      },
      {
        name: 'variant',
        type: "'browse' | 'mine'",
        required: false,
        defaultValue: "'browse'",
        description: 'mine → Edit and Delete buttons at the bottom.',
      },
      {
        name: 'onEdit',
        type: '(postId: string) => void',
        required: false,
        description: 'Mine variant — Edit clicked.',
      },
      {
        name: 'onDelete',
        type: '(postId: string) => void',
        required: false,
        description: 'Mine variant — Delete clicked.',
      },
    ],
    requiredExample: `<GeneralPostCard post={post} />`,
    optionalExample: `<GeneralPostCard
  post={post}
  variant="mine"
  onEdit={(id) => editPost(id)}
  onDelete={(id) => deletePost(id)}
/>`,
    previewId: 'general-post-card',
    variants: [
      {
        id: 'news',
        name: 'News',
        description: 'Orange News badge on cover image.',
      },
      {
        id: 'document',
        name: 'Document',
        description: 'Pink Document badge on cover image.',
      },
      {
        id: 'mine',
        name: 'My posts',
        description: 'Owner grid with Edit and Delete actions.',
      },
    ],
  },
  {
    id: 'listing-card',
    name: 'ListingCard',
    category: 'data-display',
    summary: 'Marketplace equipment listing card with save heart and price.',
    path: 'src/components/data-display/ListingCard/',
    importExample:
      "import ListingCard from '@/components/data-display/ListingCard/ListingCard'\nimport { DEMO_LISTING } from '@/data/demoData'",
    props: [
      {
        name: 'listing',
        type: 'object',
        required: true,
        description: 'Listing with id, title, image, condition, year, price, seller, location.',
      },
      {
        name: 'variant',
        type: "'browse' | 'mine'",
        required: false,
        defaultValue: "'browse'",
        description: 'browse → save heart + View details; mine → Edit/Delete.',
      },
      {
        name: 'saved',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: 'Filled heart when listing is saved.',
      },
      {
        name: 'onToggleSave',
        type: '(listingId: string) => void',
        required: false,
        description: 'Browse variant — heart clicked.',
      },
      {
        name: 'onEdit',
        type: '(listingId: string) => void',
        required: false,
        description: 'Mine variant — Edit clicked.',
      },
      {
        name: 'onDelete',
        type: '(listingId: string) => void',
        required: false,
        description: 'Mine variant — Delete clicked.',
      },
    ],
    requiredExample: `<ListingCard listing={listing} saved={saved} onToggleSave={toggleSave} />`,
    optionalExample: `<ListingCard
  listing={listing}
  variant="mine"
  onEdit={(id) => editListing(id)}
  onDelete={(id) => deleteListing(id)}
/>`,
    previewId: 'listing-card',
    variants: [
      {
        id: 'browse',
        name: 'Browse',
        description: 'Marketplace grid with save heart.',
      },
      {
        id: 'saved',
        name: 'Browse · saved',
        description: 'Heart filled — listing is saved.',
      },
      {
        id: 'mine',
        name: 'My listings',
        description: 'Owner view with Edit and Delete.',
      },
    ],
  },
  {
    id: 'data-table',
    name: 'DataTable',
    category: 'data-display',
    summary:
      'Prop-driven table with tabs, search, filters, status badges, row actions menu, and pagination.',
    path: 'src/components/data-display/DataTable/',
    importExample:
      "import DataTable from '@/components/data-display/DataTable/DataTable'\nimport StatusBadge from '@/components/data-display/DataTable/StatusBadge'\nimport { DEMO_USER_TABLE_ROWS } from '@/data/demoData'",
    props: [
      { name: 'columns', type: 'Column[]', required: true, description: 'Column defs with key, header, optional render().' },
      { name: 'data', type: 'object[]', required: true, description: 'Row data array.' },
      { name: 'showTabs', type: 'boolean', required: false, defaultValue: 'false', description: 'Show SegmentedTabs toolbar.' },
      { name: 'tabs / activeTab / onTabChange', type: '—', required: false, description: 'Tab configuration when showTabs is true.' },
      { name: 'showFilters', type: 'boolean', required: false, defaultValue: 'false', description: 'Show filter dropdowns.' },
      { name: 'filters', type: 'Filter[]', required: false, description: 'Filter select configs with id, value, options, onChange.' },
      { name: 'showActions', type: 'boolean', required: false, defaultValue: 'false', description: 'Show action column.' },
      { name: 'actions / getActions', type: 'Action[] | (row) => Action[]', required: false, description: 'Row menu or button actions.' },
      { name: 'showPagination', type: 'boolean', required: false, defaultValue: 'false', description: 'Show prev/next footer.' },
      { name: 'pagination', type: 'object', required: false, description: 'page, pageSize, total, onPageChange, summaryLabel.' },
      { name: 'loading', type: 'boolean', required: false, defaultValue: 'false', description: 'Skeleton loading state.' },
    ],
    requiredExample: `<DataTable
  columns={columns}
  data={rows}
  showActions
  actions={menuActions}
/>`,
    optionalExample: `<DataTable
  showTabs
  tabs={tabs}
  activeTab={tab}
  onTabChange={setTab}
  showFilters
  filterLabel="Sort by:"
  filters={filters}
  columns={columns}
  data={rows}
  showActions
  actions={menuActions}
  showPagination
  pagination={{ page: 1, pageSize: 7, total: 7, onPageChange: setPage }}
/>`,
    previewId: 'data-table',
    variants: [
      { id: 'advertisement', name: 'Advertisement table', description: 'Title + category pill + status badges.' },
      { id: 'users', name: 'Users & Subscriptions', description: 'Tabs, filters, pagination, action menu.' },
      { id: 'loading', name: 'Loading skeleton', description: 'Skeleton rows while data loads.' },
    ],
  },
  {
    id: 'status-badge',
    name: 'StatusBadge',
    category: 'data-display',
    summary: 'Table status pill for Active, Pending, Expired, Rejected, Suspend.',
    path: 'src/components/data-display/DataTable/StatusBadge.jsx',
    importExample: "import StatusBadge from '@/components/data-display/DataTable/StatusBadge'",
    props: [
      { name: 'status', type: 'string', required: false, description: 'Status key for color mapping.' },
      { name: 'label', type: 'string', required: false, description: 'Display label (falls back to status).' },
    ],
    requiredExample: `<StatusBadge status="Active" />`,
    optionalExample: `<StatusBadge status="Pending" label="Pending review" />`,
    previewId: 'status-badge',
    variants: [
      { id: 'active', name: 'Active', description: 'Green badge.' },
      { id: 'pending', name: 'Pending', description: 'Amber badge.' },
      { id: 'expired', name: 'Expired', description: 'Grey badge.' },
      { id: 'rejected', name: 'Rejected', description: 'Pink badge.' },
      { id: 'suspend', name: 'Suspend', description: 'Purple badge.' },
    ],
  },
  {
    id: 'segmented-tabs',
    name: 'SegmentedTabs',
    category: 'common',
    summary: 'Pill-style tab switcher used in DataTable toolbars.',
    path: 'src/components/common/SegmentedTabs/',
    importExample: "import SegmentedTabs from '@/components/common/SegmentedTabs/SegmentedTabs'",
    props: [
      { name: 'tabs', type: '{ id, label }[]', required: true, description: 'Tab items.' },
      { name: 'activeTab', type: 'string', required: true, description: 'Currently selected tab id.' },
      { name: 'onTabChange', type: '(id) => void', required: false, description: 'Tab click handler.' },
    ],
    requiredExample: `<SegmentedTabs tabs={tabs} activeTab={tab} onTabChange={setTab} />`,
    optionalExample: `<SegmentedTabs tabs={tabs} activeTab={tab} onTabChange={setTab} standalone />`,
    previewId: 'segmented-tabs',
  },
  {
    id: 'pagination',
    name: 'Pagination',
    category: 'common',
    summary: 'Numbered page control with first/prev/next/last.',
    path: 'src/components/common/Pagination/',
    importExample: "import Pagination from '@/components/common/Pagination/Pagination'",
    props: [
      { name: 'page', type: 'number', required: true, description: 'Current page (1-based).' },
      { name: 'totalPages', type: 'number', required: true, description: 'Total page count.' },
      { name: 'onPageChange', type: '(page) => void', required: false, description: 'Page change handler.' },
    ],
    requiredExample: `<Pagination page={page} totalPages={12} onPageChange={setPage} />`,
    optionalExample: `<Pagination page={5} totalPages={28} onPageChange={setPage} className="mt-8" />`,
    previewId: 'pagination',
    variants: [
      { id: 'middle', name: 'Middle page', description: 'Ellipsis on both sides.' },
      { id: 'few', name: 'Few pages', description: 'All numbers visible.' },
    ],
  },
  {
    id: 'stat-card',
    name: 'StatCard',
    category: 'data-display',
    summary: 'Analytics metric tile with icon, label, and bold value.',
    path: 'src/components/data-display/StatCard/',
    importExample:
      "import StatCard from '@/components/data-display/StatCard/StatCard'\nimport { Users } from 'lucide-react'",
    props: [
      { name: 'icon', type: 'LucideIcon', required: true, description: 'Icon component.' },
      { name: 'label', type: 'string', required: true, description: 'Metric label.' },
      { name: 'value', type: 'string', required: true, description: 'Metric value.' },
      { name: 'tone', type: "'blue' | 'pink' | 'green' | 'orange' | 'purple'", required: false, defaultValue: "'blue'", description: 'Icon background color.' },
    ],
    requiredExample: `<StatCard icon={Users} label="Active Users" value="11,840" tone="blue" />`,
    optionalExample: `<div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">\n  {stats.map((s) => <StatCard key={s.id} {...s} />)}\n</div>`,
    previewId: 'stat-card',
    variants: [
      { id: 'single', name: 'Single metric', description: 'One stat card.' },
      { id: 'grid', name: 'Stats grid', description: 'Six-card analytics row.' },
    ],
  },
  {
    id: 'blog-admin-card',
    name: 'BlogAdminCard',
    category: 'data-display',
    summary: 'Admin blog grid card with Edit and Delete actions. Typography matches BlogGridCard via blogCardTheme.',
    path: 'src/components/data-display/BlogAdminCard/',
    importExample:
      "import BlogAdminCard from '@/components/data-display/BlogAdminCard/BlogAdminCard'\nimport { DEMO_BLOG_ADMIN } from '@/data/demoData'",
    props: [
      { name: 'article', type: 'object', required: true, description: 'Blog with id, title, excerpt, image, readTime, author.' },
      { name: 'onEdit', type: '(id) => void', required: false, description: 'Edit button clicked.' },
      { name: 'onDelete', type: '(id) => void', required: false, description: 'Delete button clicked.' },
    ],
    requiredExample: `<BlogAdminCard article={article} onEdit={edit} onDelete={remove} />`,
    optionalExample: `<BlogAdminCard article={article} />`,
    previewId: 'blog-admin-card',
  },
  {
    id: 'job-detail-card',
    name: 'JobDetailCard',
    category: 'data-display',
    summary: 'Recruitment job detail panel with requirements list and apply CTA.',
    path: 'src/components/data-display/JobDetailCard/',
    importExample:
      "import JobDetailCard from '@/components/data-display/JobDetailCard/JobDetailCard'\nimport { DEMO_JOB_DETAIL } from '@/data/demoData'",
    props: [
      { name: 'job', type: 'object', required: true, description: 'Full job record with requirements array.' },
      { name: 'applyHref', type: 'string', required: false, description: 'External apply link.' },
      { name: 'onApply', type: '(job) => void', required: false, description: 'Apply button handler when no href.' },
      { name: 'showApplyButton', type: 'boolean', required: false, defaultValue: 'true', description: 'Hide apply CTA when false.' },
    ],
    requiredExample: `<JobDetailCard job={job} applyHref={job.applyLink} />`,
    optionalExample: `<JobDetailCard job={job} showApplyButton={false} />`,
    previewId: 'job-detail-card',
  },
  {
    id: 'profile-hero',
    name: 'ProfileHero',
    category: 'data-display',
    summary: 'Profile header with cover photo, avatar, and optional Message / Edit actions.',
    path: 'src/components/data-display/ProfileHero/',
    importExample:
      "import ProfileHero from '@/components/data-display/ProfileHero/ProfileHero'\nimport { DEMO_PROFILE_USER } from '@/data/demoData'",
    props: [
      { name: 'user', type: 'object', required: true, description: 'User/contact with name, title, company, avatar, coverPhoto, connections.' },
      { name: 'editHref', type: 'string', required: false, description: 'Edit profile link.' },
      { name: 'messageHref', type: 'string', required: false, description: 'Message link for admin contact view.' },
      { name: 'showMessage', type: 'boolean', required: false, defaultValue: 'false', description: 'Show Message button.' },
      { name: 'showEdit', type: 'boolean', required: false, defaultValue: 'true', description: 'Show Edit profile button.' },
    ],
    requiredExample: `<ProfileHero user={user} editHref="/profile/edit" />`,
    optionalExample: `<ProfileHero user={contact} showMessage messageHref="/chat" showEdit={false} />`,
    previewId: 'profile-hero',
    variants: [
      { id: 'owner', name: 'Own profile', description: 'Edit profile button.' },
      { id: 'contact', name: 'Contact view', description: 'Message button for admin.' },
    ],
  },
  {
    id: 'info-tile',
    name: 'InfoTile',
    category: 'data-display',
    summary: 'Contact info grid tile with icon, label, and value.',
    path: 'src/components/data-display/ProfileHero/ProfileHero.jsx',
    importExample: "import { InfoTile } from '@/components/data-display/ProfileHero/ProfileHero'",
    props: [
      { name: 'icon', type: 'LucideIcon', required: true, description: 'Tile icon.' },
      { name: 'label', type: 'string', required: true, description: 'Field label.' },
      { name: 'value', type: 'string', required: true, description: 'Field value.' },
    ],
    requiredExample: `<InfoTile icon={Mail} label="Email" value={user.email} />`,
    optionalExample: `<div className="grid grid-cols-2 gap-3">\n  <InfoTile icon={Building2} label="Company" value={user.company} />\n  …\n</div>`,
    previewId: 'info-tile',
  },
  {
    id: 'profile-setup-form',
    name: 'ProfileSetupForm',
    category: 'forms',
    summary: 'Professional profile setup form with profile-style cover and avatar uploads.',
    path: 'src/components/forms/ProfileSetupForm/',
    importExample:
      "import ProfileSetupForm from '@/components/forms/ProfileSetupForm/ProfileSetupForm'\nimport { DEMO_PROFILE_FORM } from '@/data/demoData'",
    props: [
      { name: 'values', type: 'object', required: true, description: 'Controlled form values.' },
      { name: 'onChange', type: '(key, value) => void', required: true, description: 'Field change handler.' },
      { name: 'onSubmit', type: '(event) => void', required: true, description: 'Form submit handler.' },
      { name: 'countries', type: 'string[]', required: false, description: 'Country select options.' },
    ],
    requiredExample: `<ProfileSetupForm values={form} onChange={update} onSubmit={save} countries={countries} />`,
    optionalExample: `<ProfileSetupForm values={form} onChange={update} onSubmit={save} submitLabel="Save profile" />`,
    previewId: 'profile-setup-form',
  },
  {
    id: 'admin-account-form',
    name: 'AdminAccountForm',
    category: 'forms',
    summary: 'Admin My Profile page with account info and change password sections.',
    path: 'src/components/forms/AdminAccountForm/',
    importExample: "import AdminAccountForm from '@/components/forms/AdminAccountForm/AdminAccountForm'",
    props: [
      { name: 'profileValues', type: 'object', required: true, description: 'displayName, displayEmail, name, email.' },
      { name: 'passwordValues', type: 'object', required: true, description: 'current, next, confirm password fields.' },
      { name: 'onProfileChange', type: '(key, value) => void', required: true, description: 'Account field handler.' },
      { name: 'onPasswordChange', type: '(key, value) => void', required: true, description: 'Password field handler.' },
      { name: 'onUpdateProfile', type: '(event) => void', required: true, description: 'Update profile submit.' },
      { name: 'onChangePassword', type: '(event) => void', required: true, description: 'Change password submit.' },
    ],
    requiredExample: `<AdminAccountForm
  profileValues={profile}
  passwordValues={passwords}
  onProfileChange={setProfileField}
  onPasswordChange={setPasswordField}
  onUpdateProfile={saveProfile}
  onChangePassword={savePassword}
/>`,
    optionalExample: `<AdminAccountForm … title="Store settings" subtitle="Update admin credentials." />`,
    previewId: 'admin-account-form',
  },
  {
    id: 'category-pill',
    name: 'CategoryPill',
    category: 'data-display',
    summary: 'Advertisement category tag for table rows.',
    path: 'src/components/data-display/CategoryPill/',
    importExample: "import CategoryPill from '@/components/data-display/CategoryPill/CategoryPill'",
    props: [
      { name: 'label', type: 'string', required: true, description: 'Category label text.' },
    ],
    requiredExample: `<CategoryPill label="Product Showcase" />`,
    optionalExample: `<CategoryPill label="Webinar/Event" />`,
    previewId: 'category-pill',
    variants: [
      { id: 'product', name: 'Product Showcase', description: 'Blue pill.' },
      { id: 'service', name: 'Service Offering', description: 'Green pill.' },
      { id: 'promo', name: 'Promotional Offer', description: 'Orange pill.' },
      { id: 'webinar', name: 'Webinar/Event', description: 'Pink pill.' },
    ],
  },
  {
    id: 'messenger',
    name: 'Messenger',
    category: 'data-display',
    summary: 'Two-panel chat UI with conversation list, message thread, and composer.',
    path: 'src/components/data-display/Messenger/',
    importExample:
      "import Messenger from '@/components/data-display/Messenger/Messenger'\nimport { directChats } from '@/data/demoData'",
    props: [
      { name: 'chats', type: 'Chat[]', required: true, description: 'Filtered conversation list.' },
      { name: 'activeChat', type: 'Chat', required: true, description: 'Currently open chat with messages array.' },
      { name: 'activeChatId', type: 'string', required: true, description: 'Selected chat id.' },
      { name: 'onSelectChat', type: '(id) => void', required: false, description: 'Conversation clicked.' },
      { name: 'tab / onTabChange', type: "'messages' | 'groups'", required: false, description: 'Sidebar tab state.' },
      { name: 'query / onSearchChange', type: 'string / fn', required: false, description: 'Search filter.' },
      { name: 'draft / onDraftChange / onSend', type: '—', required: false, description: 'Composer state.' },
      { name: 'mobilePanel / onMobileBack', type: '—', required: false, description: 'Mobile list ↔ chat navigation.' },
    ],
    requiredExample: `<Messenger
  chats={chats}
  activeChat={activeChat}
  activeChatId={activeId}
  onSelectChat={setActiveId}
  draft={draft}
  onDraftChange={setDraft}
  onSend={send}
/>`,
    optionalExample: `<Messenger
  tab={tab}
  onTabChange={setTab}
  query={query}
  onSearchChange={setQuery}
  showCreateGroupButton={tab === 'groups'}
  onCreateGroup={openModal}
  mobilePanel={panel}
  onMobileBack={() => setPanel('list')}
  …
/>`,
    previewId: 'messenger',
    variants: [
      { id: 'direct', name: 'Direct messages', description: 'Messages tab with online indicators.' },
      { id: 'groups', name: 'Groups', description: 'Groups tab with create button.' },
    ],
  },
  {
    id: 'contact-profile-hero',
    name: 'ContactProfileHero',
    category: 'data-display',
    summary: 'Contact profile header with Connect and Message actions.',
    path: 'src/components/data-display/ContactProfileHero/',
    importExample:
      "import ContactProfileHero from '@/components/data-display/ContactProfileHero/ContactProfileHero'\nimport { DEMO_CONTACT } from '@/data/demoData'",
    props: [
      { name: 'contact', type: 'object', required: true, description: 'Contact record with avatar, title, company, connections.' },
      { name: 'connected', type: 'boolean', required: false, defaultValue: 'false', description: 'Connected state.' },
      { name: 'pending', type: 'boolean', required: false, defaultValue: 'false', description: 'Pending connection state.' },
      { name: 'onConnect', type: '() => void', required: false, description: 'Connect button clicked.' },
      { name: 'messageHref', type: 'string', required: false, description: 'Link for Message button.' },
    ],
    requiredExample: `<ContactProfileHero contact={contact} onConnect={connect} messageHref="/chat" />`,
    optionalExample: `<ContactProfileHero contact={contact} connected pending onConnect={connect} />`,
    previewId: 'contact-profile-hero',
    variants: [
      { id: 'default', name: 'Default', description: 'Connect + Message ready.' },
      { id: 'pending', name: 'Pending', description: 'Connection request sent.' },
      { id: 'connected', name: 'Connected', description: 'Already connected.' },
    ],
  },
  {
    id: 'activity-section',
    name: 'ActivitySection',
    category: 'data-display',
    summary: 'Profile activity feed with FeedPost list or empty state.',
    path: 'src/components/data-display/ActivitySection/',
    importExample:
      "import ActivitySection from '@/components/data-display/ActivitySection/ActivitySection'\nimport { feedPosts } from '@/data/demoData'",
    props: [
      { name: 'posts', type: 'Post[]', required: false, defaultValue: '[]', description: 'Feed posts to render.' },
      { name: 'onReport', type: '(post) => void', required: false, description: 'Report handler passed to FeedPost.' },
      { name: 'emptyName', type: 'string', required: false, defaultValue: "'This member'", description: 'Name in empty state copy.' },
      { name: 'title', type: 'string', required: false, defaultValue: "'Activity'", description: 'Section heading.' },
    ],
    requiredExample: `<ActivitySection posts={posts} onReport={setReportPost} emptyName="Amina" />`,
    optionalExample: `<ActivitySection posts={[]} emptyName="Thomas" />`,
    previewId: 'activity-section',
    variants: [
      { id: 'with-posts', name: 'With posts', description: 'Activity feed with posts.' },
      { id: 'empty', name: 'Empty', description: 'No activity empty state.' },
    ],
  },
  {
    id: 'profile-page-content',
    name: 'ProfilePageContent',
    category: 'data-display',
    summary: 'Composed own-profile page: hero, info cards, and activity feed.',
    path: 'src/components/data-display/ProfilePageContent/',
    importExample:
      "import ProfilePageContent from '@/components/data-display/ProfilePageContent/ProfilePageContent'\nimport { currentUser, feedPosts } from '@/data/demoData'",
    props: [
      { name: 'user', type: 'object', required: false, description: 'Profile user; defaults to currentUser.' },
      { name: 'posts', type: 'Post[]', required: false, description: 'Activity feed posts.' },
      { name: 'onReport', type: '(post) => void', required: false, description: 'Report handler.' },
      { name: 'isPremium', type: 'boolean', required: false, description: 'Premium layout with subscription slot.' },
      { name: 'subscriptionSlot', type: 'ReactNode', required: false, description: 'Subscription card for premium users.' },
      { name: 'sidebarSlot', type: 'ReactNode', required: false, description: 'Left-column content under the subscription card; enables the two-column layout (info + posts on the right).' },
      { name: 'postsTitle', type: 'string', required: false, description: 'Heading for the posts section (default "Activity").' },
    ],
    requiredExample: `<ProfilePageContent user={user} posts={posts} onReport={setReportPost} />`,
    optionalExample: `<ProfilePageContent isPremium subscriptionSlot={<SubscriptionDetailsCard />} … />`,
    previewId: 'profile-page-content',
    variants: [
      { id: 'trial', name: 'Free trial member', description: 'Extended about + contact grid + activity.' },
      { id: 'premium', name: 'Premium member', description: 'Subscription + contact with professional info.' },
    ],
  },
  {
    id: 'contact-profile-page-content',
    name: 'ContactProfilePageContent',
    category: 'data-display',
    summary: 'Composed contact profile: hero, about, contact grid, and activity.',
    path: 'src/components/data-display/ContactProfilePageContent/',
    importExample:
      "import ContactProfilePageContent from '@/components/data-display/ContactProfilePageContent/ContactProfilePageContent'\nimport { DEMO_CONTACT, feedPosts } from '@/data/demoData'",
    props: [
      { name: 'contact', type: 'object', required: true, description: 'Contact profile record.' },
      { name: 'posts', type: 'Post[]', required: false, description: 'Activity posts for this contact.' },
      { name: 'connected / pending', type: 'boolean', required: false, description: 'Connection button states.' },
      { name: 'onConnect', type: '() => void', required: false, description: 'Connect handler.' },
      { name: 'messageHref', type: 'string', required: false, defaultValue: "'/chat'", description: 'Message link.' },
    ],
    requiredExample: `<ContactProfilePageContent contact={contact} posts={posts} onConnect={connect} />`,
    optionalExample: `<ContactProfilePageContent contact={contact} connected messageHref="/chat" />`,
    previewId: 'contact-profile-page-content',
    variants: [
      { id: 'with-activity', name: 'With activity', description: 'Contact with feed posts.' },
      { id: 'empty-activity', name: 'Empty activity', description: 'No posts yet.' },
    ],
  },
  {
    id: 'blogs-page-content',
    name: 'BlogsPageContent',
    category: 'pages',
    summary: 'Shared blogs hub: hero search, latest carousel/grid, and archive grid. Used by user and supplier routes.',
    path: 'src/shared/pages/blogs/BlogsPageContent.jsx',
    importExample:
      "import BlogsPageContent from '@/shared/pages/blogs/BlogsPageContent'\n\n<BlogsPageContent blogBasePath=\"/supplier/blogs\" />",
    props: [
      {
        name: 'blogBasePath',
        type: 'string',
        required: false,
        defaultValue: "'/blogs'",
        description: 'Route prefix for article links (e.g. /blogs or /supplier/blogs).',
      },
    ],
    requiredExample: `<BlogsPageContent blogBasePath="/blogs" />`,
    optionalExample: `<div className="-m-4 sm:-m-5 lg:-m-6">\n  <BlogsPageContent blogBasePath="/supplier/blogs" />\n</div>`,
    previewId: 'blogs-page-content',
  },
  {
    id: 'blog-detail-page-content',
    name: 'BlogDetailPageContent',
    category: 'pages',
    summary: 'Shared article detail with sidebar popular posts. Reads slug from route params.',
    path: 'src/shared/pages/blogs/BlogDetailPageContent.jsx',
    importExample:
      "import BlogDetailPageContent from '@/shared/pages/blogs/BlogDetailPageContent'\n\n<BlogDetailPageContent blogBasePath=\"/blogs\" />",
    props: [
      {
        name: 'blogBasePath',
        type: 'string',
        required: false,
        defaultValue: "'/blogs'",
        description: 'Route prefix for back link and popular post links.',
      },
      {
        name: 'slug',
        type: 'string',
        required: false,
        description: 'Optional slug override for previews outside a routed context.',
      },
    ],
    requiredExample: `<BlogDetailPageContent blogBasePath="/blogs" />`,
    optionalExample: `<BlogDetailPageContent blogBasePath="/supplier/blogs" />`,
    previewId: 'blog-detail-page-content',
  },
  {
    id: 'notifications-page-content',
    name: 'NotificationsPageContent',
    category: 'pages',
    summary: 'Shared notifications list card with mark-read actions. Wrap in Container or PanelPage per layout.',
    path: 'src/shared/pages/notifications/NotificationsPageContent.jsx',
    importExample:
      "import NotificationsPageContent from '@/shared/pages/notifications/NotificationsPageContent'\n\n<PanelPage className=\"max-w-[760px]\">\n  <NotificationsPageContent />\n</PanelPage>",
    props: [],
    requiredExample: `<NotificationsPageContent />`,
    optionalExample: `<Container className="max-w-[760px]">\n  <NotificationsPageContent />\n</Container>`,
    previewId: 'notifications-page-content',
  },
];

export function getComponentDoc(id) {
  return COMPONENT_DOCS.find((doc) => doc.id === id) || null;
}

export function filterComponentDocs({ category = 'all', query = '' } = {}) {
  const q = query.trim().toLowerCase();
  return COMPONENT_DOCS.filter((doc) => {
    const catOk = category === 'all' || doc.category === category;
    if (!catOk) return false;
    if (!q) return true;
    const hay = [
      doc.name,
      doc.summary,
      doc.path,
      doc.category,
      ...doc.props.map((p) => `${p.name} ${p.description}`),
    ]
      .join(' ')
      .toLowerCase();
    return hay.includes(q);
  });
}
