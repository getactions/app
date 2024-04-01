import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link, Outlet, json, useLoaderData } from "@remix-run/react";
import { WorkflowCard } from "~/components/workflow-card";
import { getWorkflows } from "./query";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const category = String(params.category);

  if (!category) {
    throw new Response("Bad Request", { status: 400 });
  }

  const resultOfGettingWorkflows = await getWorkflows(request, category);

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
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {loaderData.workflows.map((workflow) => {
          const detailsPath = `/${workflow.category}/${workflow.name}/details`;

          return (
            <Link key={workflow.id} to={detailsPath}>
              <WorkflowCard
                key={workflow.id}
                workflow={workflow}
                footer={
                  <Link
                    className="text-primary text-sm"
                    prefetch="intent"
                    to={detailsPath}
                  >
                    Use Workflow
                  </Link>
                }
              />
            </Link>
          );
        })}
      </div>
      <Outlet />
    </>
  );
}
