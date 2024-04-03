import { getCategories } from "#workflows";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, Outlet, json, redirect, useLoaderData } from "@remix-run/react";
import { WorkflowCard } from "~/components/workflow-card";
import { getWorkflows } from "./query";

export const meta: MetaFunction<typeof loader> = ({ params, data }) => {
  return [
    {
      title: `GitHub Actions Starter Workflows: ${data?.category?.name} Workflows - getactions.dev`,
    },
  ];
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const requestedCategory = String(params.category);

  if (!requestedCategory) {
    throw new Response("Bad Request", { status: 400 });
  }

  const resultOfGettingWorkflows = await getWorkflows(
    request,
    requestedCategory,
  );

  if (resultOfGettingWorkflows.isErr()) {
    console.error(resultOfGettingWorkflows.error);

    throw new Response("Internal Server Error", { status: 500 });
  }

  const workflows = resultOfGettingWorkflows.value;

  if (!workflows.length) {
    return redirect("/deployment");
  }

  const categories = await getCategories();
  const category = categories.find(
    (category) => category.id === requestedCategory,
  );

  return json({ category, workflows });
}

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {loaderData.workflows.map((workflow) => (
          <Link
            key={workflow.id}
            to={`/${workflow.category}/${workflow.name}/details`}
            preventScrollReset={true}
            prefetch="intent"
          >
            <WorkflowCard
              workflow={workflow}
              footer={
                <span className="text-primary text-sm">Use Workflow</span>
              }
            />
          </Link>
        ))}
      </div>
      <Outlet />
    </>
  );
}
