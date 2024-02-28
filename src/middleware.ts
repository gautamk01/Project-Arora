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
    const pathWithSearchParams = `${url.pathname}${
      searchParams.length > 0 ? `?${searchParams}` : ""
    }`;

    //if subdomain exists
    const customSubDomain = hostname
      .get("host")
      ?.split(`${process.env.NEXT_PUBLIC_DOMAIN}`)
      .filter(Boolean)[0];

    if (customSubDomain) {
      return NextResponse.rewrite(
        new URL(`/${customSubDomain}${pathWithSearchParams}`, req.url)
      );
    }

    if (url.pathname === "/sign-in" || url.pathname === "/sign-up") {
      return NextResponse.redirect(new URL(`/agency/sign-in`, req.url));
    }

    if (
      url.pathname === "/" ||
      (url.pathname === "/site" && url.host === process.env.NEXT_PUBLIC_DOMAIN)
    ) {
      return NextResponse.rewrite(new URL("/site", req.url));
    }

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
