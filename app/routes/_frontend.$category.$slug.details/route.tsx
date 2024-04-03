import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";

import { json } from "@remix-run/node";

import { useLoaderData, useNavigate } from "@remix-run/react";
import { WorkflowDialog } from "~/components/workflow-dialog";
import { getWorkflow } from "./query";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title: `GitHub Actions Starter Workflows: ${data?.workflow.title} - getactions.dev`,
    },
  ];
};

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
