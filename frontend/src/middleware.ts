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
  const routes = {
    unauthenticated: new Routes(["/auth/*", "/"]),
    public: new Routes(["/share/*", "/s/*", "/upload/*", "/error"]),
    admin: new Routes(["/admin/*"]),
    account: new Routes(["/account*"]),
    disabled: new Routes([]),
  };

  // Get config from backend
  const apiUrl = process.env.API_URL || "http://localhost:8080";
  const config = await (await fetch(`${apiUrl}/api/configs`)).json();

  const getConfig = (key: string) => {
    return configService.get(key, config);
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

  if (!getConfig("share.allowRegistration")) {
    routes.disabled.routes.push("/auth/signUp");
  }

  if (getConfig("share.allowUnauthenticatedShares")) {
    routes.public.routes = ["*"];
  }

  if (!getConfig("smtp.enabled")) {
    routes.disabled.routes.push("/auth/resetPassword*");
  }

  // prettier-ignore
  const rules = [
    // Disabled routes
    {
      condition: routes.disabled.contains(route),
      path: "/",
    },
     // Authenticated state
     {
      condition: user && routes.unauthenticated.contains(route) && !getConfig("share.allowUnauthenticatedShares"),
      path: "/upload",
    },
    // Unauthenticated state
    {
      condition: !user && !routes.public.contains(route) && !routes.unauthenticated.contains(route),
      path: "/auth/signIn",
    },
    {
      condition: !user && routes.account.contains(route),
      path: "/upload",
    },
    // Admin privileges
    {
      condition: routes.admin.contains(route) && !user?.isAdmin,
      path: "/upload",
    },
    // Home page
    {
      condition: (!getConfig("general.showHomePage") || user) && route == "/",
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

// Helper class to check if a route matches a list of routes
class Routes {
  // eslint-disable-next-line no-unused-vars
  constructor(public routes: string[]) {}

  contains(_route: string) {
    for (const route of this.routes) {
      if (new RegExp("^" + route.replace(/\*/g, ".*") + "$").test(_route))
        return true;
    }
    return false;
  }
}
