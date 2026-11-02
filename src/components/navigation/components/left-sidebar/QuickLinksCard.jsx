import { Link } from "react-router";
import Card from "@/components/ui/Card";
import { QUICK_LINKS } from "../../constant/constants";

const QuickLinksCard = () => (
  <Card className="p-2">
    {QUICK_LINKS.map((link) => (
      <Link
        key={link.id}
        to={link.to}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium text-[#475467] transition-colors hover:bg-[#F9FAFB] hover:text-deep-blue"
      >
        <link.icon className="h-4 w-4 text-primary" />
        {link.label}
      </Link>
    ))}
  </Card>
);

export default QuickLinksCard;
