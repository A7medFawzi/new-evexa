import { NextRequest, NextResponse } from "next/server";

/**
 * Language routing: /en/... and /ar/... carry the full site.
 * Any unprefixed path is redirected to the visitor's current language:
 *
 *  1. NEXT_LOCALE cookie — set by the runtime on every page mount, so it
 *     always reflects the language the visitor is actually browsing
 *     (switching EN -> AR updates it; browsing /en keeps it "en").
 *  2. Fallback for first-time visitors: the Accept-Language header
 *     (Arabic browsers -> /ar, everyone else -> /en).
 */
export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/en" || pathname.startsWith("/en/")) return NextResponse.next();
  if (pathname === "/ar" || pathname.startsWith("/ar/")) return NextResponse.next();

  const cookieLang = req.cookies.get("NEXT_LOCALE")?.value;
  const lang = cookieLang === "ar" || cookieLang === "en"
    ? cookieLang
    : (req.headers.get("accept-language") || "")
        .toLowerCase()
        .split(",")
        .some((l) => l.trim().startsWith("ar"))
      ? "ar"
      : "en";

  const url = req.nextUrl.clone();
  url.pathname = `/${lang}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next|images|fonts|videos|fills|favicon|robots\\.txt|.*\\..*).*)"],
};
