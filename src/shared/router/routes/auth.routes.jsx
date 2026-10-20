import AuthLayout from "@/layouts/AuthLayout";
import { GuestOnly } from "@/shared/router/guards";
import LoginView from "@/modules/auth/login/pages/LoginView";
import RegisterView from "@/modules/auth/register/pages/RegisterView";
import ForgotPasswordView from "@/modules/auth/forgot-password/pages/ForgotPasswordView";
import ResetPasswordView from "@/modules/auth/reset-password/pages/ResetPasswordView";
import ContactSupportView from "@/modules/auth/contact-support/pages/ContactSupportView";
import { CONTACT_SUPPORT_PATH } from "@/shared/constants/support";

export const authRoutes = [
  {
    element: <GuestOnly />,
    handle: { guestOnly: true },
    children: [
      {
        path: "/login",
        element: <AuthLayout />,
        handle: { title: "Sign in" },
        children: [{ index: true, element: <LoginView /> }],
      },
      {
        path: "/join",
        element: <AuthLayout />,
        handle: { title: "Create account" },
        children: [{ index: true, element: <RegisterView /> }],
      },
      {
        path: "/forgot-password",
        element: <AuthLayout />,
        handle: { title: "Forgot password" },
        children: [{ index: true, element: <ForgotPasswordView /> }],
      },
      {
        path: "/reset-password",
        element: <AuthLayout />,
        handle: { title: "Reset password" },
        children: [{ index: true, element: <ResetPasswordView /> }],
      },
    ],
  },
  {
    path: CONTACT_SUPPORT_PATH,
    element: <AuthLayout />,
    handle: { title: "Contact support" },
    children: [{ index: true, element: <ContactSupportView /> }],
  },
];
