import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { WorkflowCards } from "~/components/workflow-cards";
import { getWorkflows } from "./query";

export async function loader() {
  const resultOfGettingWorkflows = await getWorkflows();

  if (resultOfGettingWorkflows.isErr()) {
    console.error(resultOfGettingWorkflows.error);

    throw new Response("Internal Server Error", { status: 500 });
  }

  const workflows = resultOfGettingWorkflows.value;

  return json({ workflows });
}

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <WorkflowCards workflows={loaderData.workflows} />
    </div>
  );
}
