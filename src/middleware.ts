import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public
     */
    "/((?!api/|_next/|_static/|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  const hostname = req.headers.get("host")!;

  const path = url.pathname;

  let subdomain = hostname.split(".")[0];

  subdomain = subdomain.replace("localhost:3000", "");

  // handle no subdomain or www with base path
  if (subdomain === "www" || subdomain === "") {
    return NextResponse.next();
  }

  // subdomains
  if (subdomain !== "app") {
    return NextResponse.rewrite(
      new URL(`/users/${subdomain}${path === "/" ? "" : path}`, req.url)
    );
  }

  return NextResponse.next();
}
