import { useMemo, useState } from 'react';
import { Building2, Mail } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import Pagination from '@/components/common/Pagination/Pagination';
import SegmentedTabs from '@/components/common/SegmentedTabs/SegmentedTabs';
import ContactCard from '@/components/data-display/ContactCard/ContactCard';
import JobCard from '@/components/data-display/JobCard/JobCard';
import GeneralPostCard from '@/components/data-display/GeneralPostCard/GeneralPostCard';
import ListingCard from '@/components/data-display/ListingCard/ListingCard';
import DataTable from '@/components/data-display/DataTable/DataTable';
import StatusBadge from '@/components/data-display/DataTable/StatusBadge';
import StatCard from '@/components/data-display/StatCard/StatCard';
import BlogAdminCard from '@/components/data-display/BlogAdminCard/BlogAdminCard';
import JobDetailCard from '@/components/data-display/JobDetailCard/JobDetailCard';
import CategoryPill from '@/components/data-display/CategoryPill/CategoryPill';
import ProfileHero, {
  InfoTile,
  ContactInfoCard,
  ProfessionalInfoCard,
} from '@/components/data-display/ProfileHero/ProfileHero';
import ProfileSetupForm from '@/components/forms/ProfileSetupForm/ProfileSetupForm';
import AdminAccountForm from '@/components/forms/AdminAccountForm/AdminAccountForm';
import Messenger from '@/components/data-display/Messenger/Messenger';
import ContactProfileHero from '@/components/data-display/ContactProfileHero/ContactProfileHero';
import ActivitySection from '@/components/data-display/ActivitySection/ActivitySection';
import ProfilePageContent from '@/components/data-display/ProfilePageContent/ProfilePageContent';
import ContactProfilePageContent from '@/components/data-display/ContactProfilePageContent/ContactProfilePageContent';
import BlogsPageContent from '@/shared/pages/blogs/BlogsPageContent';
import BlogDetailPageContent from '@/shared/pages/blogs/BlogDetailPageContent';
import NotificationsPageContent from '@/shared/pages/notifications/NotificationsPageContent';
import { SubscriptionDetailsCard } from '@/modules/user/components/profile/ProfileSections';
import {
  DEMO_ADMIN_PASSWORD,
  DEMO_ADMIN_PROFILE,
  DEMO_AD_TABLE_ROWS,
  DEMO_BLOG_ADMIN,
  DEMO_CONTACT,
  DEMO_CONTACT_CONNECTED,
  DEMO_CONTACT_PENDING,
  DEMO_GENERAL_POST,
  DEMO_GENERAL_POST_MINE,
  DEMO_JOB_BROWSE,
  DEMO_JOB_DETAIL,
  DEMO_JOB_MINE,
  DEMO_LISTING,
  DEMO_LISTING_MINE,
  DEMO_PROFILE_FORM,
  DEMO_PROFILE_USER,
  DEMO_STAT_CARDS,
  DEMO_TABLE_FILTERS,
  DEMO_TABLE_MENU_ACTIONS,
  DEMO_TABLE_TABS,
  DEMO_USER_TABLE_ROWS,
  directChats,
  groupChats,
  feedPosts,
} from '@/data/demoData';
import { generalPosts } from '@/modules/user/data/general';
import { featuredArticle } from '@/modules/user/data/blogs';
import { profileCountries } from '@/modules/user/data/subscription';

function AvatarPreview({ variantId }) {
  if (variantId === 'initials') {
    return (
      <Avatar initials="TV" alt="Thomas Vermeulen" size="lg" className="bg-[#E8F3FB] text-primary" />
    );
  }
  return (
    <Avatar
      src={DEMO_CONTACT.avatar}
      initials={DEMO_CONTACT.initials}
      alt={DEMO_CONTACT.name}
      size="lg"
      className="bg-[#E8F3FB]"
    />
  );
}

function BadgePreview({ variantId }) {
  if (variantId === 'post') return <Badge variant="post">Mid-level</Badge>;
  return <Badge variant="fulltime">Full-time</Badge>;
}

function CardPreview() {
  return (
    <Card className="max-w-sm p-5">
      <p className="text-[14px] font-semibold text-deep-blue">Card surface</p>
      <p className="mt-1 text-[13px] text-[#64748B]">
        Rounded border container shared by grid and list cards.
      </p>
    </Card>
  );
}

function ContactCardPreview({ variantId }) {
  if (variantId === 'pending') {
    return (
      <div className="max-w-[240px]">
        <ContactCard contact={DEMO_CONTACT_PENDING} pending onConnect={() => {}} />
      </div>
    );
  }
  if (variantId === 'connected') {
    return (
      <div className="max-w-[240px]">
        <ContactCard contact={DEMO_CONTACT_CONNECTED} connected onConnect={() => {}} />
      </div>
    );
  }
  return (
    <div className="max-w-[240px]">
      <ContactCard contact={DEMO_CONTACT} onConnect={() => {}} />
    </div>
  );
}

function JobCardPreview({ variantId }) {
  if (variantId === 'mine') {
    return <JobCard job={DEMO_JOB_MINE} variant="mine" onEdit={() => {}} onDelete={() => {}} />;
  }
  if (variantId === 'highlighted') return <JobCard job={DEMO_JOB_BROWSE} highlighted />;
  return <JobCard job={DEMO_JOB_BROWSE} />;
}

function GeneralPostCardPreview({ variantId }) {
  if (variantId === 'mine') {
    return (
      <div className="max-w-[280px]">
        <GeneralPostCard
          post={DEMO_GENERAL_POST_MINE}
          variant="mine"
          onEdit={() => {}}
          onDelete={() => {}}
        />
      </div>
    );
  }
  const post =
    variantId === 'document'
      ? generalPosts.find((item) => item.type === 'document')
      : DEMO_GENERAL_POST;
  return (
    <div className="max-w-[280px]">
      <GeneralPostCard post={post} />
    </div>
  );
}

function ListingCardPreview({ variantId }) {
  if (variantId === 'mine') {
    return (
      <div className="max-w-[280px]">
        <ListingCard listing={DEMO_LISTING_MINE} variant="mine" onEdit={() => {}} onDelete={() => {}} />
      </div>
    );
  }
  if (variantId === 'saved') {
    return (
      <div className="max-w-[280px]">
        <ListingCard listing={DEMO_LISTING} saved onToggleSave={() => {}} />
      </div>
    );
  }
  return (
    <div className="max-w-[280px]">
      <ListingCard listing={DEMO_LISTING} onToggleSave={() => {}} />
    </div>
  );
}

function AdCell({ value, row }) {
  return (
    <div>
      <p className="font-semibold text-deep-blue">{row.title}</p>
      <CategoryPill label={row.category} className="mt-1" />
    </div>
  );
}

function DataTablePreview({ variantId }) {
  const [tab, setTab] = useState('supplier');
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(
    DEMO_TABLE_FILTERS.map((f) => ({ ...f, value: f.value ?? 'all' }))
  );

  const adColumns = useMemo(
    () => [
      { key: 'title', header: 'Advertisement', render: (_, row) => <AdCell row={row} /> },
      {
        key: 'status',
        header: 'Status',
        render: (value) => <StatusBadge status={value} />,
      },
      { key: 'views', header: 'Views' },
      { key: 'clicks', header: 'Clicks' },
      { key: 'duration', header: 'Duration' },
      { key: 'uploadDate', header: 'Upload date' },
    ],
    []
  );

  const userColumns = useMemo(
    () => [
      { key: 'userName', header: 'User Name', className: 'font-semibold' },
      { key: 'userType', header: 'User Type' },
      { key: 'company', header: 'Company/Organization' },
      { key: 'role', header: 'Role' },
      { key: 'joinedDate', header: 'Joined Date' },
      {
        key: 'status',
        header: 'Status',
        render: (value) => <StatusBadge status={value} />,
      },
    ],
    []
  );

  const filteredUsers = useMemo(() => {
    if (tab === 'supplier') {
      return DEMO_USER_TABLE_ROWS.filter((row) => row.userType === 'Supplier');
    }
    return DEMO_USER_TABLE_ROWS;
  }, [tab]);

  const filterConfigs = filters.map((filter) => ({
    ...filter,
    onChange: (value) =>
      setFilters((prev) =>
        prev.map((item) => (item.id === filter.id ? { ...item, value } : item))
      ),
  }));

  if (variantId === 'loading') {
    return (
      <DataTable
        columns={userColumns}
        data={[]}
        loading
        showActions
        actions={DEMO_TABLE_MENU_ACTIONS}
      />
    );
  }

  if (variantId === 'users') {
    return (
      <DataTable
        showTabs
        tabs={DEMO_TABLE_TABS}
        activeTab={tab}
        onTabChange={setTab}
        showFilters
        filterLabel=""
        filters={filterConfigs}
        columns={userColumns}
        data={filteredUsers}
        showActions
        actions={DEMO_TABLE_MENU_ACTIONS}
        showPagination
        pagination={{
          page,
          pageSize: 7,
          total: filteredUsers.length,
          onPageChange: setPage,
        }}
      />
    );
  }

  return (
    <DataTable
      showFilters
      filterLabel="Sort by:"
      filters={[
        {
          id: 'status',
          value: 'all',
          options: [
            { value: 'all', label: 'All Status' },
            { value: 'active', label: 'Active' },
            { value: 'pending', label: 'Pending' },
          ],
          onChange: () => {},
        },
      ]}
      columns={adColumns}
      data={DEMO_AD_TABLE_ROWS}
      showActions
      actions={DEMO_TABLE_MENU_ACTIONS}
      tableMinWidth="1000px"
    />
  );
}

function StatusBadgePreview({ variantId }) {
  const map = {
    active: 'Active',
    pending: 'Pending',
    expired: 'Expired',
    rejected: 'Rejected',
    suspend: 'Suspend',
  };
  return <StatusBadge status={map[variantId] || 'Active'} />;
}

function SegmentedTabsPreview() {
  const [tab, setTab] = useState('supplier');
  return <SegmentedTabs tabs={DEMO_TABLE_TABS} activeTab={tab} onTabChange={setTab} />;
}

function PaginationPreview({ variantId }) {
  const totalPages = variantId === 'few' ? 4 : 28;
  const [page, setPage] = useState(variantId === 'few' ? 2 : 5);
  return <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />;
}

function StatCardPreview({ variantId }) {
  if (variantId === 'grid') {
    return (
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        {DEMO_STAT_CARDS.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>
    );
  }
  const stat = DEMO_STAT_CARDS[0];
  return <StatCard icon={stat.icon} label={stat.label} value={stat.value} tone={stat.tone} />;
}

function BlogAdminCardPreview() {
  return (
    <div className="max-w-[280px]">
      <BlogAdminCard article={DEMO_BLOG_ADMIN} onEdit={() => {}} onDelete={() => {}} />
    </div>
  );
}

function JobDetailCardPreview() {
  return <JobDetailCard job={DEMO_JOB_DETAIL} applyHref={DEMO_JOB_DETAIL.applyLink} />;
}

function ProfileHeroPreview({ variantId }) {
  if (variantId === 'contact') {
    return (
      <ProfileHero
        user={DEMO_CONTACT}
        showMessage
        messageHref="/chat"
        showEdit={false}
      />
    );
  }
  return <ProfileHero user={DEMO_PROFILE_USER} editHref="/profile/edit" />;
}

function InfoTilePreview() {
  return (
    <div className="grid max-w-lg grid-cols-2 gap-3">
      <InfoTile icon={Building2} label="Laboratory / Company" value={DEMO_PROFILE_USER.company} />
      <InfoTile icon={Mail} label="Email" value={DEMO_PROFILE_USER.email} />
    </div>
  );
}

function ProfileSetupFormPreview() {
  const [form, setForm] = useState(DEMO_PROFILE_FORM);
  return (
    <ProfileSetupForm
      values={form}
      onChange={(key, value) => setForm((prev) => ({ ...prev, [key]: value }))}
      onSubmit={(e) => e.preventDefault()}
      countries={profileCountries}
    />
  );
}

function AdminAccountFormPreview() {
  const [profile, setProfile] = useState(DEMO_ADMIN_PROFILE);
  const [passwords, setPasswords] = useState(DEMO_ADMIN_PASSWORD);
  return (
    <AdminAccountForm
      profileValues={profile}
      passwordValues={passwords}
      onProfileChange={(key, value) => setProfile((prev) => ({ ...prev, [key]: value }))}
      onPasswordChange={(key, value) => setPasswords((prev) => ({ ...prev, [key]: value }))}
      onUpdateProfile={(e) => e.preventDefault()}
      onChangePassword={(e) => e.preventDefault()}
    />
  );
}

function CategoryPillPreview({ variantId }) {
  const labels = {
    product: 'Product Showcase',
    service: 'Service Offering',
    promo: 'Promotional Offer',
    webinar: 'Webinar/Event',
  };
  return <CategoryPill label={labels[variantId] || labels.product} />;
}

function MessengerPreview({ variantId }) {
  const [tab, setTab] = useState(variantId === 'groups' ? 'groups' : 'messages');
  const [activeId, setActiveId] = useState(
    variantId === 'groups' ? groupChats[0].id : directChats[0].id
  );
  const [draft, setDraft] = useState('');
  const chats = tab === 'messages' ? directChats : groupChats;
  const activeChat = chats.find((c) => c.id === activeId) || chats[0];

  return (
    <Messenger
      tab={tab}
      onTabChange={(id) => {
        setTab(id);
        setActiveId(id === 'messages' ? directChats[0].id : groupChats[0].id);
      }}
      chats={chats}
      activeChat={activeChat}
      activeChatId={activeId}
      onSelectChat={setActiveId}
      draft={draft}
      onDraftChange={setDraft}
      onSend={() => setDraft('')}
      showCreateGroupButton={tab === 'groups'}
      mobilePanel="chat"
    />
  );
}

function ContactProfileHeroPreview({ variantId }) {
  if (variantId === 'pending') {
    return (
      <ContactProfileHero contact={DEMO_CONTACT_PENDING} pending messageHref="/chat" />
    );
  }
  if (variantId === 'connected') {
    return (
      <ContactProfileHero
        contact={DEMO_CONTACT_CONNECTED}
        connected
        messageHref="/chat"
      />
    );
  }
  return (
    <ContactProfileHero contact={DEMO_CONTACT} onConnect={() => {}} messageHref="/chat" />
  );
}

function ActivitySectionPreview({ variantId }) {
  const posts =
    variantId === 'empty'
      ? []
      : feedPosts.filter((post) => post.author.name !== DEMO_PROFILE_USER.name).slice(0, 2);
  return (
    <ActivitySection
      posts={posts}
      onReport={() => {}}
      emptyName={DEMO_CONTACT.name.split(' ')[0]}
    />
  );
}

function ProfilePageContentPreview({ variantId }) {
  const posts = feedPosts.filter((p) => p.author.name !== DEMO_PROFILE_USER.name).slice(0, 2);
  if (variantId === 'premium') {
    return (
      <ProfilePageContent
        user={{ ...DEMO_PROFILE_USER, membershipStatus: 'premium' }}
        posts={posts}
        onReport={() => {}}
        isPremium
        subscriptionSlot={<SubscriptionDetailsCard />}
      />
    );
  }
  return (
    <ProfilePageContent user={DEMO_PROFILE_USER} posts={posts} onReport={() => {}} />
  );
}

function ContactProfilePageContentPreview({ variantId }) {
  const posts =
    variantId === 'empty-activity'
      ? []
      : feedPosts.filter((post) => DEMO_CONTACT.postIds?.includes(post.id));
  return (
    <ContactProfilePageContent
      contact={DEMO_CONTACT}
      posts={posts}
      onReport={() => {}}
      onConnect={() => {}}
      messageHref="/chat"
    />
  );
}

function BlogsPageContentPreview() {
  return (
    <div className="-mx-4 max-h-[720px] overflow-y-auto sm:-mx-6">
      <BlogsPageContent blogBasePath="/developer/blogs" />
    </div>
  );
}

function BlogDetailPageContentPreview() {
  return (
    <div className="-mx-4 max-h-[720px] overflow-y-auto sm:-mx-6">
      <BlogDetailPageContent
        blogBasePath="/developer/blogs"
        slug={featuredArticle.slug}
      />
    </div>
  );
}

function NotificationsPageContentPreview() {
  return (
    <div className="max-w-[760px]">
      <NotificationsPageContent />
    </div>
  );
}

/** Live preview for a catalog component id (+ optional variantId) */
export default function ComponentPreview({ previewId, variantId }) {
  switch (previewId) {
    case 'avatar':
      return <AvatarPreview variantId={variantId || 'image'} />;
    case 'badge':
      return <BadgePreview variantId={variantId || 'fulltime'} />;
    case 'card':
      return <CardPreview />;
    case 'contact-card':
      return <ContactCardPreview variantId={variantId || 'default'} />;
    case 'job-card':
      return <JobCardPreview variantId={variantId || 'browse'} />;
    case 'general-post-card':
      return <GeneralPostCardPreview variantId={variantId || 'news'} />;
    case 'listing-card':
      return <ListingCardPreview variantId={variantId || 'browse'} />;
    case 'data-table':
      return <DataTablePreview variantId={variantId || 'advertisement'} />;
    case 'status-badge':
      return <StatusBadgePreview variantId={variantId || 'active'} />;
    case 'segmented-tabs':
      return <SegmentedTabsPreview />;
    case 'pagination':
      return <PaginationPreview variantId={variantId || 'middle'} />;
    case 'stat-card':
      return <StatCardPreview variantId={variantId || 'single'} />;
    case 'blog-admin-card':
      return <BlogAdminCardPreview />;
    case 'job-detail-card':
      return <JobDetailCardPreview />;
    case 'profile-hero':
      return <ProfileHeroPreview variantId={variantId || 'owner'} />;
    case 'info-tile':
      return <InfoTilePreview />;
    case 'profile-setup-form':
      return <ProfileSetupFormPreview />;
    case 'admin-account-form':
      return <AdminAccountFormPreview />;
    case 'category-pill':
      return <CategoryPillPreview variantId={variantId || 'product'} />;
    case 'messenger':
      return <MessengerPreview variantId={variantId || 'direct'} />;
    case 'contact-profile-hero':
      return <ContactProfileHeroPreview variantId={variantId || 'default'} />;
    case 'activity-section':
      return <ActivitySectionPreview variantId={variantId || 'with-posts'} />;
    case 'profile-page-content':
      return <ProfilePageContentPreview variantId={variantId || 'trial'} />;
    case 'contact-profile-page-content':
      return <ContactProfilePageContentPreview variantId={variantId || 'with-activity'} />;
    case 'blogs-page-content':
      return <BlogsPageContentPreview />;
    case 'blog-detail-page-content':
      return <BlogDetailPageContentPreview />;
    case 'notifications-page-content':
      return <NotificationsPageContentPreview />;
    default:
      return <p className="text-sm text-[#64748B]">No preview available.</p>;
  }
}

export { ContactInfoCard, ProfessionalInfoCard };
