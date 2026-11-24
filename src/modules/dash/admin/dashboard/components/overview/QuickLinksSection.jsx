import { Link } from "react-router";
import {
  BarChart3,
  Briefcase,
  Megaphone,
  Receipt,
  Shield,
  ShoppingBag,
  Users,
} from "lucide-react";
import Card from "@/components/ui/Card";

const LINKS = [
  {
    to: "/admin/users",
    label: "Users",
    description: "Members & subscriptions",
    icon: Users,
    tone: "bg-secondary text-primary",
  },
  {
    to: "/admin/reports",
    label: "Reports",
    description: "Moderation queue",
    icon: Shield,
    tone: "bg-[#FEF3E8] text-[#E67E22]",
  },
  {
    to: "/admin/advertisement",
    label: "Advertisements",
    description: "Review sponsored ads",
    icon: Megaphone,
    tone: "bg-pink-secondary text-pink-light",
  },
  {
    to: "/admin/payments",
    label: "Payments",
    description: "Invoices & revenue",
    icon: Receipt,
    tone: "bg-green-secondary text-green-primary",
  },
  {
    to: "/admin/marketplace",
    label: "Marketplace",
    description: "Listings overview",
    icon: ShoppingBag,
    tone: "bg-[#E6FFFA] text-[#0D9488]",
  },
  {
    to: "/admin/recruitment",
    label: "Recruitment",
    description: "Jobs & applicants",
    icon: Briefcase,
    tone: "bg-[#F3E8FF] text-[#7C3AED]",
  },
  {
    to: "/admin/statistics",
    label: "Statistics",
    description: "Trends & reports",
    icon: BarChart3,
    tone: "bg-secondary text-primary",
  },
];

/** Shortcut cards into the most-used admin areas. */
const QuickLinksSection = () => (
  <div>
    <div className="mb-3">
      <h2 className="text-[15px] font-bold text-deep-blue">Quick links</h2>
      <p className="text-[12px] text-[#64748B]">Jump to the areas you manage most often</p>
    </div>
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
      {LINKS.map((link) => {
        const Icon = link.icon;
        return (
          <Link key={link.to} to={link.to} className="group">
            <Card className="h-full p-4 transition-colors group-hover:border-primary/30 group-hover:bg-[#F8FBFF]">
              <span
                className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${link.tone}`}
              >
                <Icon className="h-4 w-4" strokeWidth={1.8} />
              </span>
              <p className="mt-3 text-[13px] font-semibold text-deep-blue">{link.label}</p>
              <p className="mt-0.5 text-[12px] text-[#64748B]">{link.description}</p>
            </Card>
          </Link>
        );
      })}
    </div>
  </div>
);

export default QuickLinksSection;
