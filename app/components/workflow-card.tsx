import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { WorkflowIcon } from "./workflow-icon";

type Props = Readonly<{
  workflow: Readonly<{
    id: string;
    name: string;

    title: string;
    description: string;
  }>;
  footer: React.ReactNode;
}>;

export function WorkflowCard({ workflow, footer }: Props) {
  return (
    <Card key={workflow.id} className="hover:shadow-xl transition-shadow">
      <CardHeader>
        <div className="w-10 h-10">
          <WorkflowIcon id={workflow.id} name={workflow.name} />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <CardTitle className="text-xl">{workflow.title}</CardTitle>
        <CardDescription>{workflow.description}</CardDescription>
      </CardContent>
      <CardFooter className="flex justify-end">{footer}</CardFooter>
    </Card>
  );
}
