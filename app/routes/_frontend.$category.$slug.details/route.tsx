import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";

import { ChevronDownIcon } from "@radix-ui/react-icons";
import { NavLink, json, useLoaderData } from "@remix-run/react";
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
import { getModel } from "./query";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title: `GitHub Actions Starter Workflows: ${data?.currentWorkflow.title} - getactions.dev`,
    },
  ];
};

export async function loader({ params, request }: LoaderFunctionArgs) {
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

  return json(model);
}

export default function WorkflowDetails() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <div className="lg:container lg:w-3/4 flex flex-col gap-8">
      <div className="flex justify-center">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">All Workflows</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-primary" />
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  {loaderData.currentCategory.name}
                  <ChevronDownIcon />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {loaderData.categories.map((category) => (
                    <DropdownMenuItem asChild key={category.id}>
                      <NavLink
                        prefetch="intent"
                        to={`/${category.id}`}
                        className={cn(
                          "w-full cursor-pointer hover:bg-midnight/5 [&.active]:text-primary",
                        )}
                      >
                        {category.name}
                      </NavLink>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-primary" />
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  {loaderData.currentWorkflow.title}
                  <ChevronDownIcon />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {loaderData.workflows.map((workflow) => (
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
                  ))}
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
