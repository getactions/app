import type { LoaderFunctionArgs } from "@remix-run/node";

import { renderInstallScript } from "./install.sh";
import { getWorkflow } from "./query";

export async function loader({ params }: LoaderFunctionArgs) {
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

  return new Response(script, {
    headers: {
      "Content-Type": "text/x-sh",
    },
  });
}
