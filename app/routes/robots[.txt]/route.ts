import type { LoaderFunctionArgs } from "@remix-run/node";
import { getBaseUrl } from "~/utils/get-base-url.server";

export function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(getBaseUrl(request));

  const isFlyIoHostname = url.host.endsWith("fly.dev");

  let contents: string;

  // Don't allow indexing of the app when running on fly.io
  if (isFlyIoHostname) {
    contents = `User-agent: *
Disallow: /  
`;
  } else {
    contents = `User-agent: *
Allow: /
`;
  }

  return new Response(contents, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
