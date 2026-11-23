import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import RejectionNotice from "../components/detail/RejectionNotice";
import BackToAdsLink from "../components/detail/BackToAdsLink";
import AdDetailCard from "../components/detail/AdDetailCard";
import { DEFAULT_REJECTION } from "../constant/constants";

const ad = {
  companyInitials: "NL",
  company: "Novagen Labs",
  category: "Product",
  location: "Paris",
  title: "New HPLC column",
  description: "Sharper peaks.",
  image: null,
  startDate: "Oct 1, 2026",
  expiryDate: "Oct 15, 2026",
  price: "€60",
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
});
