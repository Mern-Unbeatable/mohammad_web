import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import ContactProfileHero from "./ContactProfileHero";

const contact = {
  id: "anna",
  name: "Anna Berg",
  initials: "AB",
  title: "Quality Control Manager",
  company: "Berg Labs",
  country: "Sweden",
  connections: 12,
};

const render = (props = {}) =>
  renderToStaticMarkup(
    <MemoryRouter>
      <ContactProfileHero contact={contact} messageHref="/chat" {...props} />
    </MemoryRouter>,
  );

describe("ContactProfileHero", () => {
  it("shows title, company, country and connections with their icons", () => {
    const html = render();

    expect(html).toContain("Quality Control Manager");
    expect(html).toContain("Berg Labs");
    expect(html).toContain("Sweden");
    expect(html).toContain(">12</span> connections");
    for (const icon of ["briefcase", "building2", "map-pin", "users"]) {
      expect(html).toContain(`lucide-${icon}`);
    }
  });

  it("hides placeholder company and country rows and uses the singular", () => {
    const html = render({ contact: { ...contact, company: "—", country: "—", connections: 1 } });

    expect(html).not.toContain("lucide-building2");
    expect(html).not.toContain("lucide-map-pin");
    expect(html).not.toContain("—");
    expect(html).toContain(">1</span> connection<");
  });

  it("links Message to the chat when no handler is given", () => {
    expect(render()).toMatch(/<a[^>]*href="\/chat"[^>]*>.*Message<\/a>/);
  });

  it("opens a dialog from Message instead of linking when a handler is given", () => {
    const html = render({ onMessage: () => {} });
    expect(html).toMatch(/<button type="button" aria-haspopup="dialog"[^>]*>.*Message<\/button>/);
    expect(html).not.toContain('href="/chat"');
  });

  it("marks connected and pending members on the action button", () => {
    expect(render({ connected: true })).toContain("Connected");
    expect(render({ connected: true })).toContain("lucide-check");
    expect(render({ pending: true })).toContain("Pending");
    expect(render()).toContain("Connect");
  });
});
