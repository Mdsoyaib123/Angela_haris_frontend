import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import AdminLayout from "@/Layout/AdminLayout";
import AdminDashboardPage from "@/pages/Admin/AdminDashboardPage";
import SettingsPage from "@/pages/Admin/SettingsPage";
import ClientDashboardPage from "@/pages/Client/ClientDashboardPage";
import ClientLayout from "@/Layout/ClientLayout";
import UserSubscriptionPage from "@/pages/Client/UserSubscriptionPage";
import UsersAndAthletesPage from "@/pages/Admin/UsersAndAthletesPage";
import GenerateLinksPage from "@/pages/Admin/GenerateLinksPage";
import SubscriptionPage from "@/pages/Admin/SubscriptionPage";
import MediaMonitoringPage from "@/pages/Admin/MediaMonitoringPage";
// import UserSettings from "@/components/ClientDashboard/UserSettings/UserSettings";
// import HomePage from "@/pages/HomePage";
import DiscoverPage from "@/pages/DiscoverPage";
import NotificationPage from "@/pages/Home/NotificationPage";
import ProfilePage from "@/pages/Home/ProfilePage";
import SubscriptionAndBillingPage from "@/pages/Client/SubscriptionAndBillingPage";
import MessagePage from "@/pages/Home/MessagePage";
import UserSettingsPages from "@/pages/Client/UserSettingsPages";
// import HomeLayout from "@/Layout/HomeLayout";
import CheckoutSuccessPage from "@/pages/Client/CheckoutSuccessPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import AdminRoute from "./AdminRoutes";
import ProtectedRoute from "@/components/Shared/ProtectedRoute";
import UserProfileDetails from "@/components/Home/Profile/UserProfileDetails";
import OtpVerificationPage from "@/pages/OtpVerificationPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import OnboardingSuccessPage from "@/pages/Admin/OnboardingSuccessPage";
import LandingPage from "@/pages/LandingPage";
import Layout from "@/Layout/Layout";
import ReelCreator from "@/components/Home/Profile/ReelCreator";
import CancelRetuenPage from "@/pages/Client/CancelRetuenPage";
import AboutUs from "@/pages/AboutUs";
import LandingPageLayout from "@/Layout/LandingPageLayout";
import JoinNetworkProgram from "@/pages/Joinnework/JoinNetworkProgram";
import TwoStepVerificationPage from "@/pages/TwoStepVerificationPage";
import ContactUsPage from "@/pages/ContactUsPage";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    children: [
      // other public routes
      {
        element: <LandingPageLayout />,
        children: [
          {
            index: true,
            element: <LandingPage />,
          },
          {
            path: "about-us",
            element: <AboutUs />,
          },
          {
            path: "join-network-program",
            element: <JoinNetworkProgram />,
          },
          {
            path: "contact-us",
            element: <ContactUsPage />,
          },
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "signup",
            element: <Signup />,
          },
          {
            path: "forgot-password",
            element: <ForgotPasswordPage />,
          },
          {
            path: "verify-otp",
            element: <OtpVerificationPage />,
          },
          {
            path: "verify-2fa",
            element: <TwoStepVerificationPage />,
          },
          {
            path: "reset-password",
            element: <ResetPasswordPage />,
          },
        ],
      },

      {
        path: "user/:id",
        element: <UserProfileDetails />,
      },
      // private routes
      {
        element: (
          <ProtectedRoute requiredRole={["ADMIN", "ATHLATE", "PARENT"]}>
            <Layout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "profile",
            element: <ProfilePage />,
          },
          {
            path: "discover",
            element: <DiscoverPage />,
          },
          {
            path: "create-reel",
            element: <ReelCreator />,
          },
          {
            path: "message",
            element: <MessagePage />,
          },
          {
            path: "notifications",
            element: <NotificationPage />,
          },
        ],
      },
    ],
  },

  /* Client Dashboard */
  {
    path: "/user-dashboard",
    element: (
      <ProtectedRoute requiredRole={["ATHLATE", "PARENT"]}>
        <ClientLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <ClientDashboardPage />,
      },
      {
        path: "subscription",
        element: <UserSubscriptionPage />,
      },
      {
        path: "subscription-and-billing",
        element: <SubscriptionAndBillingPage />,
      },
      {
        path: "settings",
        element: <UserSettingsPages />,
      },
      {
        path: "subscription-success",
        element: <CheckoutSuccessPage />,
      },
      {
        path: "subscription-cancel",
        element: <CancelRetuenPage />,
      },
      // {
      //   path: "settings",
      //   element: <UserSettings />,
      // },
    ],
  },

  /* Admin   */
  {
    path: "/admin-dashboard",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboardPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
      {
        path: "user-and-athletes",
        element: <UsersAndAthletesPage />,
      },
      {
        path: "generate-links",
        element: <GenerateLinksPage />,
      },
      {
        path: "subscription",
        element: <SubscriptionPage />,
      },
      {
        path: "media-monitoring",
        element: <MediaMonitoringPage />,
      },
      {
        path: "onboarding-success",
        element: <OnboardingSuccessPage />,
      },
      {
        path: "notifications",
        element: <NotificationPage />,
      },
    ],
  },

  {
    path: "/organization/connect/return",
    element: <Navigate to="/admin-dashboard/onboarding-success" />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
