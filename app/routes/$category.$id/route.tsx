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

  const baseUrl = new URL(getBaseUrl(request));

  const domain = baseUrl.host;

  const headers = new Headers();

  for (const [key, value] of request.headers) {
    const normalizedKey = key.toLowerCase();
    const isHost = normalizedKey === "host";
    const isCookie = normalizedKey === "cookie";

    const isAddable = !isHost && !isCookie;

    if (isAddable) {
      console.log("Adding", key, value);
      headers.append(key, value);
    }
  }

  fetch("https://plausible.openformation.io/api/event", {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: "InstallScriptWasDownloaded",
      domain,
      url: request.url,
    }),
  }).catch((cause) => {
    console.error(`failed to send event to Plausible: ${cause}`);
  });

  const response = new Response(script, {
    headers: {
      "Content-Type": "text/x-sh",
    },
  });

  return response;
}
