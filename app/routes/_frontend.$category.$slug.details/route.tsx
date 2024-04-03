import { json, type LoaderFunctionArgs } from "@remix-run/node";

import { useLoaderData, useNavigate } from "@remix-run/react";
import { WorkflowDialog } from "~/components/workflow-dialog";
import { getWorkflow } from "./query";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const category = String(params.category);
  const slug = String(params.slug);

  if (!category || !slug) {
    throw new Response("Bad Request", { status: 400 });
  }

  const resultOfGettingWorkflow = await getWorkflow(request, category, slug);

  if (resultOfGettingWorkflow.isErr()) {
    console.error(resultOfGettingWorkflow.error);

    throw new Response("Internal Server Error", { status: 500 });
  }

  const workflow = resultOfGettingWorkflow.value;

  return json({ workflow });
}

export default function WorkflowDetails() {
  const navigate = useNavigate();
  const loaderData = useLoaderData<typeof loader>();

  function handleClose() {
    navigate(`/${loaderData.workflow.category}`, { preventScrollReset: true });
  }

  return (
    <WorkflowDialog workflow={loaderData.workflow} onClose={handleClose} />
  );
}
