import { Building2, Mail, MapPin, Phone } from 'lucide-react';
import Card from '@/components/ui/Card';
import ContactProfileHero from '@/components/data-display/ContactProfileHero/ContactProfileHero';
import ActivitySection from '@/components/data-display/ActivitySection/ActivitySection';
import { InfoTile } from '@/components/data-display/ProfileHero/ProfileHero';

/**
 * Composed contact-profile page content: hero, about, contact grid, activity.
 */
const ContactProfilePageContent = ({
  contact,
  posts = [],
  onReport,
  connected = false,
  pending = false,
  onConnect,
  onMessage,
  messageHref = '/chat',
}) => (
  <div className="space-y-4">
    <ContactProfileHero
      contact={contact}
      connected={connected}
      pending={pending}
      onConnect={onConnect}
      onMessage={onMessage}
      messageHref={messageHref}
    />

    <Card>
      <div className="border-b border-[#E4E7EC] px-5 py-4 sm:px-6">
        <h2 className="text-[16px] font-bold text-deep-blue">Professional information</h2>
      </div>
      <div className="px-5 py-5 sm:px-6">
        <p className="text-[14px] leading-[1.7] text-[#475467]">{contact.about}</p>
      </div>
    </Card>

    <Card>
      <div className="border-b border-[#E4E7EC] px-5 py-4 sm:px-6">
        <h2 className="text-[16px] font-bold text-deep-blue">Contact information</h2>
      </div>
      <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:gap-3 sm:p-5">
        <InfoTile icon={Building2} label="Laboratory / Company" value={contact.company} />
        <InfoTile icon={MapPin} label="Country" value={contact.country} />
        <InfoTile icon={Mail} label="Email" value={contact.email} />
        <InfoTile icon={Phone} label="Phone" value={contact.phone} />
      </div>
    </Card>

    <ActivitySection
      posts={posts}
      onReport={onReport}
      emptyName={contact.name.split(' ')[0]}
    />
  </div>
);

export default ContactProfilePageContent;
