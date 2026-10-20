import { Link } from "react-router";
import { Check, Clock, UserPlus } from "lucide-react";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import { CardSkeleton } from "@/components/common/Skeleton";
import { SIDEBAR_LIMIT } from "../../constant/constants";
import { EmptyRow, SectionTitle } from "./SidebarSection";

const PeopleYouMayKnow = ({ people, connectingId, onConnect, loading }) => (
  <Card>
    <SectionTitle icon={UserPlus}>People you may know</SectionTitle>
    {loading && !people.length ? (
      <CardSkeleton
        variant="sidebarPerson"
        count={SIDEBAR_LIMIT}
        as="ul"
        className="divide-y divide-[#E4E7EC]"
      />
    ) : people.length ? (
      <ul className="divide-y divide-[#E4E7EC]">
        {people.map((person) => {
          const isConnected = person.connected;
          const isPending = person.pending || connectingId === person.id;

          return (
            <li key={person.id} className="flex items-center gap-2 px-4 py-2">
              <Link to={person.to} className="shrink-0">
                <Avatar
                  src={person.avatar}
                  alt={person.name}
                  initials={person.initials}
                  size="sm"
                />
              </Link>
              <div className="min-w-0 flex-1">
                <Link
                  to={person.to}
                  className="block truncate text-[13px] font-semibold text-deep-blue hover:text-primary"
                >
                  {person.name}
                </Link>
                <p className="truncate text-[12px] text-[#64748B]">
                  {person.company}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onConnect(person)}
                disabled={isConnected || isPending}
                className={`inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-semibold transition-colors ${
                  isConnected || isPending
                    ? "bg-green-secondary text-green-primary"
                    : "bg-primary text-white hover:opacity-90"
                }`}
              >
                {isConnected ? (
                  <>
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    Connected
                  </>
                ) : isPending ? (
                  <>
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    Pending
                  </>
                ) : (
                  <>
                    <UserPlus className="h-3.5 w-3.5" aria-hidden="true" />
                    Connect
                  </>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    ) : (
      <EmptyRow message="No suggestions right now." />
    )}
  </Card>
);

export default PeopleYouMayKnow;
