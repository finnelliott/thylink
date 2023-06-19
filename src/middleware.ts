import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

function getSubdomain(req: NextRequest) {
  const hostname = req.headers.get("host") ?? req.headers.get(":Authority:"); // e.g. app.localhost:3000
  const subdomain = hostname?.includes(".") ? hostname?.split(".")[0] : null; // e.g. app
  return subdomain;
}

function rewrites(req: NextRequest) {
  const { nextUrl: url } = req;
  const pathname = url.pathname; // e.g. /about
  const subdomain = getSubdomain(req); // e.g. app

  // If request is for the api, serve the api folder
  if (pathname.startsWith("/api")) {
    return NextResponse.rewrite(new URL(`${pathname}`, req.url));
  }

  // Redirect site requests from edit site page in app
  if (pathname.startsWith("/sites")) {
    const slug = pathname.split("sites/")[1]
    return NextResponse.redirect(new URL(req.nextUrl.protocol + slug + "." + req.nextUrl.host))
  }

  // If the user is on the app subdomain, serve the app subfolder
  if (subdomain === "app") {
    return NextResponse.rewrite(new URL(`/app${pathname}`, req.url));
  }

  // If the user is on another subdomain, serve the _sites folder
  if (subdomain !== null) {
    return NextResponse.rewrite(new URL(`/sites/${subdomain}${pathname}`, req.url));
  }

  // If the user is on the root domain, serve the root folder
  return NextResponse.next();
}

export default authMiddleware({
  beforeAuth(req) {
    return rewrites(req);
  },
  afterAuth(auth, req) {
    const subdomain = getSubdomain(req);
    const { protocol, host, pathname, search } = req.nextUrl;
    if (!auth.userId && subdomain == "app") {
      return redirectToSignIn({ returnBackUrl: `${protocol}app.${host}${pathname}${search}` });
    } else {
      return NextResponse.next();
    }
  },
  apiRoutes: ["/api"]
});