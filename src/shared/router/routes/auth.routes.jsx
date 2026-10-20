import AuthLayout from "@/layouts/AuthLayout";
import { GuestOnly } from "@/shared/router/guards";
import LoginView from "@/modules/auth/login/pages/LoginView";
import RegisterView from "@/modules/auth/register/pages/RegisterView";
import ForgotPasswordView from "@/modules/auth/forgot-password/pages/ForgotPasswordView";
import ResetPasswordView from "@/modules/auth/reset-password/pages/ResetPasswordView";
import ContactSupportView from "@/modules/auth/contact-support/pages/ContactSupportView";
import { CONTACT_SUPPORT_PATH } from "@/shared/constants/support";

/**
 * Guest pages share one `AuthLayout` instance. Contact support also uses the
 * auth shell but stays outside `GuestOnly`: suspended, signed-in users must reach it.
 */
export const authRoutes = [
  {
    element: <GuestOnly />,
    handle: { guestOnly: true },
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: "/login", element: <LoginView />, handle: { title: "Sign in" } },
          { path: "/join", element: <RegisterView />, handle: { title: "Create account" } },
          {
            path: "/forgot-password",
            element: <ForgotPasswordView />,
            handle: { title: "Forgot password" },
          },
          {
            path: "/reset-password",
            element: <ResetPasswordView />,
            handle: { title: "Reset password" },
          },
        ],
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: CONTACT_SUPPORT_PATH,
        element: <ContactSupportView />,
        handle: { title: "Contact support" },
      },
    ],
  },
];
