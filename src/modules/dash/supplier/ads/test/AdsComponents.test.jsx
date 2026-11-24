import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import RejectionNotice from "../components/detail/RejectionNotice";
import BackToAdsLink from "../components/detail/BackToAdsLink";
import AdDetailCard from "../components/detail/AdDetailCard";
import AdHeader from "../components/detail/AdHeader";
import AdStatusSidebar from "../components/detail/AdStatusSidebar";
import { DEFAULT_REJECTION } from "../constant/constants";

const ad = {
  companyInitials: "NL",
  company: "Novagen Labs",
  category: "Product Showcase",
  location: "Paris",
  title: "New HPLC column",
  description: "Sharper peaks.",
  image: null,
  startDate: "Oct 1, 2026",
  expiryDate: "Oct 15, 2026",
  price: "€60",
  status: "Pending",
  views: 12,
  clicks: 3,
  durationDays: 14,
  rejectionReason: "",
  stats: null,
};

describe("ads detail components", () => {
  it("shows the given rejection reason, or the default one", () => {
    expect(renderToStaticMarkup(<RejectionNotice reason="Blurry image" />)).toContain("Blurry image");
    expect(renderToStaticMarkup(<RejectionNotice />)).toContain(
      DEFAULT_REJECTION.replace("'", "&#x27;"),
    );
  });

  it("links back to the ads list", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <BackToAdsLink />
      </MemoryRouter>,
    );
    expect(html).toContain('href="/supplier/ads"');
  });

  it("renders the ad card without social actions when there are no stats", () => {
    const html = renderToStaticMarkup(<AdDetailCard ad={ad} />);
    expect(html).toContain("New HPLC column");
    expect(html).toContain("Expiry Date: Oct 15, 2026");
    expect(html).not.toContain("Comment");
  });

  it("renders the split detail header and status sidebar", () => {
    const header = renderToStaticMarkup(<AdHeader ad={ad} />);
    expect(header).toContain("Novagen Labs");
    expect(header).toContain("Sponsored");

    const sidebar = renderToStaticMarkup(
      <AdStatusSidebar ad={ad} busy={false} onAction={() => {}} />,
    );
    expect(sidebar).toContain("Status");
    expect(sidebar).toContain("Pending");
    expect(sidebar).toContain("Cancel advertisement");
  });
});
