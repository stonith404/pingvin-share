import jwtDecode from "jwt-decode";
import { NextRequest, NextResponse } from "next/server";
import configService from "./services/config.service";

// This middleware redirects based on different conditions:
// - Authentication state
// - Setup status
// - Admin privileges

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};

export async function middleware(request: NextRequest) {
  // Get config from backend
  const config = await (
    await fetch("http://localhost:8080/api/configs")
  ).json();

  const getConfig = (key: string) => {
    return configService.get(key, config);
  };

  const containsRoute = (routes: string[], url: string) => {
    for (const route of routes) {
      if (new RegExp("^" + route.replace(/\*/g, ".*") + "$").test(url))
        return true;
    }
    return false;
  };

  const route = request.nextUrl.pathname;
  let user: { isAdmin: boolean } | null = null;
  const accessToken = request.cookies.get("access_token")?.value;

  try {
    const claims = jwtDecode<{ exp: number; isAdmin: boolean }>(
      accessToken as string
    );
    if (claims.exp * 1000 > Date.now()) {
      user = claims;
    }
  } catch {
    user = null;
  }

  const unauthenticatedRoutes = ["/auth/signIn", "/"];
  let publicRoutes = ["/share/*", "/upload/*"];
  const setupStatusRegisteredRoutes = ["/auth/*", "/admin/setup"];
  const adminRoutes = ["/admin/*"];
  const accountRoutes = ["/account/*"];

  if (getConfig("ALLOW_REGISTRATION")) {
    unauthenticatedRoutes.push("/auth/signUp");
  }

  if (getConfig("ALLOW_UNAUTHENTICATED_SHARES")) {
    publicRoutes = ["*"];
  }

  const isPublicRoute = containsRoute(publicRoutes, route);
  const isUnauthenticatedRoute = containsRoute(unauthenticatedRoutes, route);
  const isAdminRoute = containsRoute(adminRoutes, route);
  const isAccountRoute = containsRoute(accountRoutes, route);
  const isSetupStatusRegisteredRoute = containsRoute(
    setupStatusRegisteredRoutes,
    route
  );

  // prettier-ignore
  const rules = [
    // Setup status
    {
      condition: getConfig("SETUP_STATUS") == "STARTED" && route != "/auth/signUp",
      path: "/auth/signUp",
    },
    {
      condition: getConfig("SETUP_STATUS") == "REGISTERED" && !isSetupStatusRegisteredRoute,
      path: user ? "/admin/setup" : "/auth/signIn",
    },
     // Authenticated state
     {
      condition: user && isUnauthenticatedRoute,
      path: "/upload",
    },
    // Unauthenticated state
    {
      condition: !user && !isPublicRoute && !isUnauthenticatedRoute,
      path: "/auth/signIn",
    },
    {
      condition: !user && isAccountRoute,
      path: "/upload",
    },
    // Admin privileges
    {
      condition: isAdminRoute && !user?.isAdmin,
      path: "/upload",
    },
    // Home page
    {
      condition: (!getConfig("SHOW_HOME_PAGE") || user) && route == "/",
      path: "/upload",
    },
  ];

  for (const rule of rules) {
    if (rule.condition) {
      let { path } = rule;

      if (path == "/auth/signIn") {
        path = path + "?redirect=" + encodeURIComponent(route);
      }
      return NextResponse.redirect(new URL(path, request.url));
    }
  }
}
