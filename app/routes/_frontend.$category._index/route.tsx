import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";

import { json, redirect, useLoaderData } from "@remix-run/react";
import { CategorySwitcher } from "~/components/category-switcher";
import { WorkflowCards } from "~/components/workflow-cards";
import { getBaseUrl } from "~/utils/get-base-url.server";
import { getCategories } from "~/utils/workflows.server";
import { getWorkflows } from "./query";

export const meta: MetaFunction<typeof loader> = ({ params, data }) => {
  const name = `${data?.category?.name} Workflows - getactions.dev`;

  return [
    {
      title: `GitHub Actions Starter Workflows: ${data?.category?.name} Workflows - getactions.dev`,
    },
    {
      name: "description",
      content: data?.category?.description,
    },
    {
      property: "og:site_name",
      content: "getactions.dev",
    },
    {
      property: "og:type",
      content: "article",
    },
    {
      property: "og:title",
      content: name,
    },
    {
      property: "og:description",
      content: data?.category?.description,
    },
    {
      property: "og:url",
      content: `${data?.baseUrl}/${data?.category?.id}`,
    },
    {
      property: "og:image",
      content: `${data?.baseUrl}/api/${data?.category?.id}.png`,
    },
    {
      property: "twitter:card",
      content: "summary_large_image",
    },
    {
      property: "twitter:title",
      content: name,
    },
    {
      property: "twitter:description",
      content: data?.category?.description,
    },
    {
      property: "twitter:image",
      content: `${data?.baseUrl}/api/${data?.category?.id}.png`,
    },
  ];
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const baseUrl = getBaseUrl(request);
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

  return json({ baseUrl, category, categories, workflows });
}

export default function WorkflowCategoryIndex() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <>
      <div className="flex justify-center">
        <CategorySwitcher categories={loaderData.categories} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <WorkflowCards workflows={loaderData.workflows} />
      </div>
    </>
  );
}
