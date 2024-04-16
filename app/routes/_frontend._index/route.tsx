import { PlusIcon } from "@radix-ui/react-icons";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <WorkflowCards workflows={loaderData.workflows} />
      <div className="rounded-sm flex justify-center items-center">
        <Link
          to="https://github.com/getactions/getactions?tab=readme-ov-file#-how-do-i-contribute"
          target="_blank"
        >
          <Button className="flex gap-2 text-primary" variant="outline">
            <PlusIcon className="h-4 w-4 text-primary" /> Add Workflow
          </Button>
        </Link>
      </div>
    </div>
  );
}
