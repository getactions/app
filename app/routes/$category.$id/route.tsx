import type { LoaderFunctionArgs } from "@remix-run/node";

import { getBaseUrl } from "~/utils/get-base-url.server";
import { renderInstallScript } from "./install.sh";
import { getWorkflow } from "./query";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const id = String(params.id);
  const category = String(params.category);

  if (!id || !category) {
    throw new Response("Bad Request", { status: 400 });
  }

  const workflowResult = await getWorkflow(`${category}/${id}`);

  if (workflowResult.isErr()) {
    console.error(workflowResult.error);

    throw new Response("Internal Server Error", { status: 500 });
  }

  const workflow = workflowResult.value;

  if (!workflow) {
    throw new Response(null, { status: 404 });
  }

  const script = renderInstallScript(workflow);

  const response = new Response(script, {
    headers: {
      "Content-Type": "text/x-sh",
    },
  });

  const baseUrl = getBaseUrl(request);

  const domain = new URL(baseUrl).host;

  // Might be possible that the reverse proxy adds more IP addresses. We pick the first one
  // as this is the one from the client.
  const xForwardedFor = request.headers
    .get("x-forwarded-for")
    ?.split(",")
    .at(0);

  fetch("http://plausible.openformation.io/api/event", {
    method: "POST",
    headers: {
      ...request.headers,
      "X-Forwarded-For": xForwardedFor ?? "",
      "Content-Type": "application/json",
      "User-Agent": request.headers.get("user-agent") ?? "node-fetch",
    },
    body: JSON.stringify({
      name: "InstallScriptWasDownloaded",
      domain,
      url: request.url,
    }),
  }).catch((err) => {
    console.error(
      `Was unable to track InstallScriptWasDownloaded event to Plausible: ${err}`,
    );
  });

  return response;
}
