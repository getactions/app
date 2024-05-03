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

  const baseUrl = new URL(getBaseUrl(request));

  const domain = baseUrl.host;

  console.log(
    JSON.stringify({
      headers: {
        "User-Agent": request.headers.get("User-Agent") ?? "",
        "X-Forwarded-For": request.headers.get("X-Forwarded-For") ?? "",
        "Content-Type": "application/json",
      },
      body: {
        name: "InstallScriptWasDownloaded",
        domain,
        url: `${baseUrl.origin}${new URL(request.url).pathname}`,
      },
    }),
  );

  fetch("https://plausible.openformation.io/api/event", {
    method: "POST",
    headers: {
      "User-Agent": request.headers.get("User-Agent") ?? "",
      "X-Forwarded-For": request.headers.get("X-Forwarded-For") ?? "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "InstallScriptWasDownloaded",
      domain,
      url: `${baseUrl.origin}${new URL(request.url).pathname}`,
    }),
  }).catch((err) => {
    console.error(
      `Was unable to send InstallScriptWasDownloaded event to Plausible: ${err}`,
    );
  });

  return response;
}
