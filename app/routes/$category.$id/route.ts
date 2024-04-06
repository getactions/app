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
    throw new Response("Not Found", { status: 404 });
  }

  const script = renderInstallScript(workflow);

  const response = new Response(script, {
    headers: {
      "Content-Type": "text/x-sh",
    },
  });

  console.log("HEADERS");
  console.log(request.headers);

  const baseUrl = getBaseUrl(request);

  const domain = new URL(baseUrl).host;

  fetch("https://plausible.openformation.io/api/event", {
    method: "POST",
    headers: request.headers,
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
