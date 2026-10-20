import { Link } from "react-router";
import { Briefcase } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { CardSkeleton } from "@/components/loader";
import { SIDEBAR_LIMIT } from "../../constant/constants";
import { EmptyRow, SectionTitle } from "./SidebarSection";

const JobsList = ({ items, loading }) => (
  <Card>
    <SectionTitle icon={Briefcase}>Jobs for you</SectionTitle>
    {loading && !items.length ? (
      <CardSkeleton
        variant="sidebarJob"
        count={SIDEBAR_LIMIT}
        as="ul"
        className="divide-y divide-[#E4E7EC]"
      />
    ) : items.length ? (
      <ul className="divide-y divide-[#E4E7EC]">
        {items.map(({ id, title, company, location, type, image, to }) => (
          <li key={id}>
            <Link
              to={to}
              className="flex items-start gap-3 px-4 py-2 transition-colors hover:bg-[#F9FAFB]"
            >
              {image ? (
                <img
                  src={image}
                  alt=""
                  className="mt-0.5 h-10 w-10 shrink-0 rounded-lg border border-[#E4E7EC] bg-white object-contain p-0.5"
                />
              ) : null}
              <div className="min-w-0 flex-1">
                <p className="text-[13px] text-deep-blue hover:text-primary">
                  {title}
                </p>
                <p className="mt-0.5 text-[12px] text-[#64748B]">
                  {[company, location].filter(Boolean).join(" · ")}
                </p>
                {type ? (
                  <Badge variant="fulltime" className="mt-2 normal-case">
                    {type}
                  </Badge>
                ) : null}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    ) : (
      <EmptyRow message="No jobs yet." />
    )}
  </Card>
);

export default JobsList;
