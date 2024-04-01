import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { WorkflowDialog } from "./workflow-dialog";
import { WorkflowIcon } from "./workflow-icon";

type Props = Readonly<{
  workflow: Readonly<{
    id: string;
    name: string;
    description: string;
    readme: string;
    installCommand: string;
  }>;
}>;

export function WorkflowCard({ workflow }: Props) {
  return (
    <Card key={workflow.id}>
      <CardHeader>
        <div className="w-7 h-7">
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
  );
}
