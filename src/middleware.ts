import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

function getSubdomain(req: NextRequest) {
  const hostname = req.headers.get("host") ?? req.nextUrl.host; // e.g. app.localhost:3000
  const subdomain = hostname?.includes(".") ? hostname?.split(".")[0] : null; // e.g. app
  return subdomain;
}

function isCustomDomain(req: NextRequest) {
  const hostname = req.headers.get("host") ?? req.nextUrl.host; // e.g. links.finnelliott.com
  const isStandardDomain = hostname.includes(`localhost:3000` || `thyl.ink`)
  return !isStandardDomain;
}


async function rewrites(req: NextRequest) {
  const { nextUrl: url } = req;
  const pathname = url.pathname; // e.g. /about
  const subdomain = getSubdomain(req); // e.g. app

  // If request is for the api, serve the api folder
  if (pathname.startsWith("/api")) {
    return NextResponse.rewrite(new URL(`${pathname}`, req.url));
  }

  if (isCustomDomain(req)) {
    const slug = await fetch(`/api/username-for-custom-domain?url=${req.nextUrl.host}`).then(res => res.text())
    return NextResponse.rewrite(new URL(`/sites/${slug}${pathname}`, req.url));
  }

  // Redirect site requests from edit site page in app
  if (pathname.startsWith("/sites")) {
    const slug = pathname.split("sites/")[1]
    return NextResponse.redirect(new URL(req.nextUrl.protocol + slug + "." + req.nextUrl.host.replace("app.", "")))
  }

  // If the user is on the app subdomain, serve the app subfolder
  if (subdomain === "app") {
    return NextResponse.rewrite(new URL(`/app${pathname}`, req.url));
  }

  // If the user is on the root domain, serve the root folder
  if (subdomain === "www") {
    return NextResponse.next();
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
      return redirectToSignIn({ returnBackUrl: req.url.replace("localhost", "app.localhost") });
    } else {
      return NextResponse.next();
    }
  },
  apiRoutes: ["/api"]
});