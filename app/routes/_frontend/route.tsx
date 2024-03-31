import { Outlet, json, useLoaderData } from "@remix-run/react";
import { WorkflowSwitcher } from "~/components/workflow-switcher";
import { getWorkflowCategories } from "./query";

export async function loader() {
  const resultOfGettingCategories = await getWorkflowCategories();

  if (resultOfGettingCategories.isErr()) {
    console.error(resultOfGettingCategories.error);

    throw new Response("Internal Server Error", { status: 500 });
  }

  const categories = resultOfGettingCategories.value;

  return json({ categories });
}

export default function FrontendLayout() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-24">
      <header className="container flex flex-col gap-4 pt-16">
        <h1 className="text-center font-extrabold text-2xl">
          get<span className="text-primary">actions</span>
        </h1>
        <h2 className="text-center text-4xl font-extrabold">
          Easy to use GitHub Actions Starter Workflows
        </h2>

        <p className="text-center text-2xl text-gray-500">
          Don't waste time setting up initial workflows for your project.
        </p>
      </header>
      <main className="container flex flex-col gap-20">
        <div className="flex justify-center">
          <WorkflowSwitcher categories={loaderData.categories} />
        </div>

        <Outlet />
      </main>
    </div>
  );
}
