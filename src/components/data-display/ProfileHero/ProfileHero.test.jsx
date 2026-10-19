import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import ProfileHero from "./ProfileHero";

const user = {
  name: "Élises Moreaus",
  initials: "EM",
  title: "Quality Control Manager",
  company: "Novagen Labs",
  location: "Lyon, France",
  country: "France",
  connections: 10,
  membershipStatus: "premium",
  coverPhoto: "https://example.com/cover.png",
};

const render = (props) =>
  renderToStaticMarkup(
    <MemoryRouter>
      <ProfileHero user={user} {...props} />
    </MemoryRouter>,
  );

describe("ProfileHero", () => {
  it("shows each detail with its own icon", () => {
    const html = render();

    for (const icon of ["briefcase", "building2", "map-pin", "users", "crown", "pencil"]) {
      expect(html).toContain(`lucide-${icon}`);
    }
    expect(html).toContain("Quality Control Manager");
    expect(html).toContain("Novagen Labs");
    expect(html).toContain("Lyon, France");
    expect(html).toMatch(/>10<\/span> connections/);
    expect(html).toContain("Premium Member");
  });

  it("skips missing details instead of leaving empty separators", () => {
    const html = render({
      user: { name: "New Member", connections: 1, location: "", country: "", coverPhoto: "" },
    });

    expect(html).not.toContain("lucide-briefcase");
    expect(html).not.toContain("lucide-building2");
    expect(html).not.toContain("lucide-map-pin");
    expect(html).not.toContain(" · ");
    expect(html).toMatch(/>1<\/span> connection</);
    expect(html).not.toContain("<img src=\"\"");
  });

  it("falls back to the country and the trial badge", () => {
    const html = render({ user: { ...user, location: "", membershipStatus: "trial" } });

    expect(html).toContain(">France<");
    expect(html).toContain("lucide-sparkles");
    expect(html).toContain("Free trial member");
  });

  it("opens a dialog from Message instead of linking when a handler is given", () => {
    const html = render({
      showMessage: true,
      messageHref: "/chat",
      onMessage: () => {},
      showEdit: false,
    });

    expect(html).toMatch(/<button type="button" aria-haspopup="dialog"[^>]*>.*Message<\/button>/);
    expect(html).not.toContain('href="/chat"');
  });

  it("shows Message with an icon when enabled", () => {
    const html = render({ showMessage: true, messageHref: "/chat", showEdit: false });

    expect(html).toContain("lucide-message-circle");
    expect(html).not.toContain("Edit profile");
  });
});
