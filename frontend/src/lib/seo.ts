/**
 * SEO meta per route. Used by PageSEO with react-helmet-async.
 * Titles kept 50–60 chars; descriptions 150–160 chars (Google best practices).
 */
const SITE_URL = "https://globalmediasports.es";

export const routeMeta: Record<
  string,
  { title: string; description: string; noindex?: boolean }
> = {
  "/": {
    title: "Global Media Sports - Elevate Your Athletic Career",
    description:
      "Professional sports marketing agency specializing in athlete social media management, video editing, and brand exposure. We help talented athletes reach their full potential.",
  },
  "/register": {
    title: "Register - Global Media Sports",
    description:
      "Create your account and start your journey with Global Media Sports. Professional social media management and video editing for athletes.",
  },
  "/login": {
    title: "Login - Global Media Sports",
    description: "Sign in to your Global Media Sports account to manage your athlete profile and services.",
  },
  "/terms": {
    title: "Terms and Conditions - Global Media Sports",
    description:
      "Terms and conditions of service for Global Media Sports. Read our policies for using our sports marketing and social media management services.",
  },
  "/privacy": {
    title: "Privacy Policy - Global Media Sports",
    description:
      "Privacy policy of Global Media Sports. How we collect, use and protect your personal data.",
  },
  "/legal": {
    title: "Legal Notice - Global Media Sports",
    description: "Legal notice and company information for Global Media Sports.",
  },
  "/clauses": {
    title: "Contract Clauses - Global Media Sports",
    description: "Contract clauses and legal terms for athlete representation and services.",
  },
  "/contract": {
    title: "Sports Representation Contract - Global Media Sports",
    description:
      "Sports representation contract terms for athletes working with Global Media Sports.",
  },
  "/forgot-password": {
    title: "Reset Password - Global Media Sports",
    description: "Reset your Global Media Sports account password.",
  },
  "/dashboard": {
    title: "Dashboard - Global Media Sports",
    description: "Athlete dashboard",
    noindex: true,
  },
  "/admin": {
    title: "Admin - Global Media Sports",
    description: "Admin panel",
    noindex: true,
  },
  "/editor": {
    title: "Editor - Global Media Sports",
    description: "Editor panel",
    noindex: true,
  },
};

export function getMetaForPath(pathname: string) {
  // Exact match first
  if (routeMeta[pathname]) return routeMeta[pathname];
  // Match /admin/users/:id
  if (pathname.startsWith("/admin/users/")) {
    return { title: "User Profile - Global Media Sports", description: "Admin user profile", noindex: true };
  }
  // Auth callback / payment - minimal, noindex
  if (pathname === "/auth/callback" || pathname === "/payment-success") {
    return { title: "Global Media Sports", description: "Global Media Sports", noindex: true };
  }
  // Default: homepage meta
  return routeMeta["/"];
}

export { SITE_URL };
