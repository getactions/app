import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";

import { ChevronDownIcon } from "@radix-ui/react-icons";
import { NavLink, json, useLoaderData } from "@remix-run/react";
import { ErrorBoundary } from "~/components/error-boundary";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { WorkflowDetailCard } from "~/components/workflow-detail-card";
import { cn } from "~/utils/cn";
import { getBaseUrl } from "~/utils/get-base-url.server";
import { getModel } from "./query";

export { ErrorBoundary };

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const name = `${data?.currentWorkflow.title} - getactions.dev`;

  return [
    {
      title: `GitHub Actions Starter Workflows: ${data?.currentWorkflow.title} - getactions.dev`,
    },
    {
      name: "description",
      content: data?.currentWorkflow.description,
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
      content: `${data?.category.name}: ${data?.currentWorkflow.title} - getactions.dev`,
    },
    {
      property: "og:description",
      content: data?.currentWorkflow.description,
    },
    {
      property: "og:url",
      content: `${data?.baseUrl}/${data?.currentWorkflow.id}/details`,
    },
    {
      property: "og:image",
      content: `${data?.baseUrl}/api/${data?.currentWorkflow.id}.png`,
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
      content: data?.currentWorkflow.description,
    },
    {
      property: "twitter:image",
      content: `${data?.baseUrl}/api/${data?.currentWorkflow.id}.png`,
    },
  ];
};

export async function loader({ params, request }: LoaderFunctionArgs) {
  const baseUrl = getBaseUrl(request);
  const category = String(params.category);
  const slug = String(params.slug);

  if (!category || !slug) {
    throw new Response("Bad Request", { status: 400 });
  }

  const result = await getModel(request, category, slug);

  if (result.isErr()) {
    console.error(result.error);

    throw new Response("Internal Server Error", { status: 500 });
  }

  const model = result.value;

  if (!model) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ baseUrl, ...model });
}

export default function WorkflowDetails() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <div className="lg:container lg:w-3/4 flex flex-col gap-8">
      <div className="flex justify-center">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Workflows</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-primary" />
            <BreadcrumbItem>{loaderData.category.name}</BreadcrumbItem>
            <BreadcrumbSeparator className="text-primary" />
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  {loaderData.currentWorkflow.title}
                  <ChevronDownIcon />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {loaderData.otherWorkflowsInCurrentCategory.map(
                    (workflow) => (
                      <DropdownMenuItem asChild key={workflow.id}>
                        <NavLink
                          prefetch="intent"
                          to={`/${workflow.id}/details`}
                          className={cn(
                            "w-full cursor-pointer hover:bg-midnight/5 [&.active]:text-primary",
                          )}
                        >
                          {workflow.title}
                        </NavLink>
                      </DropdownMenuItem>
                    ),
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <WorkflowDetailCard workflow={loaderData.currentWorkflow} />
    </div>
  );
}
