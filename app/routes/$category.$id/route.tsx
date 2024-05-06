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

  try {
    const response = await fetch(
      "https://plausible.openformation.io/api/event",
      {
        method: "POST",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          "X-Forwarded-For": request.headers.get("X-Forwarded-For") ?? "",
          "Content-Type": "application/json",
          "X-Debug-Requested": "true",
        },
        body: JSON.stringify({
          name: "InstallScriptWasDownloaded",
          domain,
          url: request.url,
        }),
      },
    );

    console.log(response.status, await response.text());
    console.log(response.headers);

    console.log(await response.text());
  } catch (cause) {
    console.error(`failed to send event to Plausible: ${cause}`);
  }

  const response = new Response(script, {
    headers: {
      "Content-Type": "text/x-sh",
    },
  });

  return response;
}
