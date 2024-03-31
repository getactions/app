import { useLoaderData } from "@remix-run/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { WorkflowDialog } from "~/components/workflow-dialog";
import { WorkflowIcon } from "~/components/workflow-icon";
import type { loader } from "./route";

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <div className="grid grid-cols-3 gap-4">
      {loaderData.workflows.map((workflow) => (
        <Card key={workflow.id}>
          <CardHeader>
            <div className="w-9 h-9">
              <WorkflowIcon id={workflow.id} name={workflow.name} />
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
