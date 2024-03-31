import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { WorkflowDialog } from "~/components/workflow-dialog";
import { getWorkflows } from "./query";

export const meta: MetaFunction = () => {
  return [{ title: "getactions.dev" }];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const category = String(params.category);

  if (!category) {
    throw new Response("Bad Request", { status: 400 });
  }

  const resultOfGettingWorkflows = await getWorkflows(category);

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
    <div className="grid grid-cols-3 gap-4">
      {loaderData.workflows.map((workflow) => (
        <Card key={workflow.id}>
          <CardHeader>
            <div className="w-9 h-9">
              <img
                src="https://fly.io/static/images/brand/brandmark.svg"
                alt="Fly.io"
                className="w-full h-full"
              />
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <CardTitle className="text-xl">{workflow.name}</CardTitle>
            <CardDescription>{workflow.description}</CardDescription>
          </CardContent>
          <CardFooter className="flex justify-end">
            <WorkflowDialog workflow={workflow} />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
