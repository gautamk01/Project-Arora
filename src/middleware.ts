import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: ["/site", "/api/uploadthing"],
  async beforeAuth(auth, req) {},
  async afterAuth(auth, req) {
    //rewrite for domains
    const url = req.nextUrl; //Gets a NextUrl object representing the current URL of the request.
    const searchParams = url.searchParams.toString(); //Converts any query parameters in the URL into a string format
    let hostname = req.headers; //Gets the headers from the incoming request.

    //Constructing the Full Path
    //Concatenates the path from the URL (url.pathname) and, if there are query parameters, adds them (e.g., /somepath?param1=value1)
    /** Here's a small example to illustrate:
     * Let's say the incoming request URL is https://example.com/products?category=shoes&color=black.
     * The pathname would be /products.
     * The searchParams would be a URLSearchParams object, and searchParams.toString() would give you category=shoes&color=black.
     * Thus, pathWithSearchParams would be /products?category=shoes&color=black.
     * */
    const pathWithSearchParams = `${url.pathname}${
      searchParams.length > 0 ? `?${searchParams}` : ""
    }`;

    //if subdomain exists
    const customSubDomain = hostname
      .get("host")
      ?.split(`${process.env.NEXT_PUBLIC_DOMAIN}`)
      .filter(Boolean)[0];

    //this part is mainly for the CustomSubDomain that is mainly used in the website Creation section
    if (customSubDomain) {
      return NextResponse.rewrite(
        new URL(`/${customSubDomain}${pathWithSearchParams}`, req.url)
      );
    }

    //If the path is /sign-in or /sign-up, it redirects the user to the /agency/sign-in page.
    if (url.pathname === "/sign-in" || url.pathname === "/sign-up") {
      return NextResponse.redirect(new URL(`/agency/sign-in`, req.url));
    }

    //If the request is for the root path (/) or for /site and the host matches the
    // public domain environment variable, it rewrites the URL to /site.
    if (
      url.pathname === "/" ||
      (url.pathname === "/site" && url.host === process.env.NEXT_PUBLIC_DOMAIN)
    ) {
      return NextResponse.rewrite(new URL("/site", req.url));
    }

    //If the request starts with /agency or /subaccount, it rewrites the request URL to the same path with search parameters (if any).
    if (
      url.pathname.startsWith("/agency") ||
      url.pathname.startsWith("/subaccount")
    ) {
      return NextResponse.rewrite(new URL(`${pathWithSearchParams}`, req.url));
    }
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
