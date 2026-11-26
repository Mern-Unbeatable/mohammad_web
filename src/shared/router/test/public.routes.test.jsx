import { describe, expect, it } from "vitest";
import { matchRoutes } from "react-router";
import TermsOfServiceView from "@/modules/public/legal/pages/TermsOfServiceView";
import PrivacyPolicyView from "@/modules/public/legal/pages/PrivacyPolicyView";
import { PRIVACY_PATH, TERMS_PATH } from "@/modules/public/legal";
import PublicGeneralView from "@/modules/public/general/pages/PublicGeneralView";
import PublicGeneralPostDetailView from "@/modules/public/general/pages/PublicGeneralPostDetailView";
import { PUBLIC_GENERAL_PATH } from "@/modules/public/general";
import { publicRoutes } from "../routes/public.routes";
import { authRoutes } from "../routes/auth.routes";

const routes = [publicRoutes, ...authRoutes];

describe("legal routes", () => {
  it.each([
    [TERMS_PATH, TermsOfServiceView],
    [PRIVACY_PATH, PrivacyPolicyView],
  ])("%s renders its page without any auth guard", (path, page) => {
    const matches = matchRoutes(routes, path) || [];
    expect(matches.at(-1)?.route.element?.type).toBe(page);
    for (const { route } of matches) {
      expect(route.handle?.guestOnly).toBeFalsy();
      expect(route.handle?.requiredRole).toBeFalsy();
    }
  });
});

describe("public general routes", () => {
  it.each([
    [PUBLIC_GENERAL_PATH, PublicGeneralView],
    [`${PUBLIC_GENERAL_PATH}/00000000-0000-4000-8000-000000000001`, PublicGeneralPostDetailView],
  ])("%s is ungated", (path, page) => {
    const matches = matchRoutes(routes, path) || [];
    expect(matches.at(-1)?.route.element?.type).toBe(page);
    for (const { route } of matches) {
      expect(route.handle?.guestOnly).toBeFalsy();
      expect(route.handle?.requiredRole).toBeFalsy();
    }
  });
});
