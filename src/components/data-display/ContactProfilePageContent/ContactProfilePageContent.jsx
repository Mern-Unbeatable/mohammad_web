import { Building2, Mail, MapPin, Phone } from "lucide-react";
import Card from "@/components/ui/Card";
import ContactProfileHero from "@/components/data-display/ContactProfileHero/ContactProfileHero";
import ActivitySection from "@/components/data-display/ActivitySection/ActivitySection";
import { InfoTile } from "@/components/data-display/ProfileHero/ProfileHero";
import ExpandableRichText from "@/components/data-display/RichText/ExpandableRichText";

/**
 * Composed contact-profile page content: hero, then contact details on the
 * left and about + activity on the right on large screens. Small screens stack
 * as about → contact details → activity.
 */
const ContactProfilePageContent = ({
  contact,
  posts = [],
  postsLoading = false,
  hasMorePosts = false,
  loadingMorePosts = false,
  onLoadMorePosts,
  onReport,
  connected = false,
  pending = false,
  onConnect,
  onMessage,
  messageHref = "/chat",
  showConnect = true,
}) => (
  <div className="space-y-4">
    <ContactProfileHero
      contact={contact}
      showConnect={showConnect}
      connected={connected}
      pending={pending}
      onConnect={onConnect}
      onMessage={onMessage}
      messageHref={messageHref}
    />

    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:items-start">
      <Card className="order-2 min-w-0 lg:order-none">
        <div className="border-b border-[#E4E7EC] px-5 py-4 sm:px-6">
          <h2 className="text-[16px] font-bold text-deep-blue">
            Contact information
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:gap-3 sm:p-5 lg:grid-cols-1">
          <InfoTile
            icon={Building2}
            label="Laboratory / Company"
            value={contact.company}
          />
          <InfoTile icon={MapPin} label="Country" value={contact.country} />
          <InfoTile icon={Mail} label="Email" value={contact.email} />
          <InfoTile icon={Phone} label="Phone" value={contact.phone} />
        </div>
      </Card>

      <div className="contents lg:flex lg:min-w-0 lg:flex-col lg:gap-4">
        <Card className="order-1 lg:order-none">
          <div className="border-b border-[#E4E7EC] px-5 py-4 sm:px-6">
            <h2 className="text-[16px] font-bold text-deep-blue">
              Professional information
            </h2>
          </div>
          <div className="px-5 py-5 sm:px-6">
            <ExpandableRichText
              text={contact.about}
              className="text-[14px] leading-[1.7] text-[#475467]"
            />
          </div>
        </Card>

        <ActivitySection
          posts={posts}
          loading={postsLoading}
          hasMore={hasMorePosts}
          loadingMore={loadingMorePosts}
          onLoadMore={onLoadMorePosts}
          onReport={onReport}
          emptyName={contact.name.split(" ")[0]}
          className="order-3 min-w-0 lg:order-none"
        />
      </div>
    </div>
  </div>
);

export default ContactProfilePageContent;
