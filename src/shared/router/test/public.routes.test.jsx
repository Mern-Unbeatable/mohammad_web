import { describe, expect, it } from "vitest";
import { matchRoutes } from "react-router";
import TermsOfServiceView from "@/modules/public/pages/legal/TermsOfServiceView";
import PrivacyPolicyView from "@/modules/public/pages/legal/PrivacyPolicyView";
import { PRIVACY_PATH, TERMS_PATH } from "@/modules/public/pages/legal/constant/constants";
import { publicRoutes } from "../public.routes";
import { authRoutes } from "../auth.routes";

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
