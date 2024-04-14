import type { MetaFunction } from "@remix-run/node";

import { ErrorBoundary } from "~/components/error-boundary";

export const meta: MetaFunction = () => {
  return [{ title: "Oh no!" }];
};

export function loader() {
  throw new Response("Not found", {
    status: 404,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export { ErrorBoundary };

export default ErrorBoundary;
