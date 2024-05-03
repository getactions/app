import { StarFilledIcon } from "@radix-ui/react-icons";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { WorkflowLogo } from "./workflow-logo";

type Props = Readonly<{
  workflow: Readonly<{
    id: string;
    new: boolean;
    category: Readonly<{
      id: string;
      name: string;
    }>;
    name: string;
    title: string;
    description: string;
  }>;
  footer: React.ReactNode;
}>;

export function WorkflowCard({ workflow, footer }: Props) {
  return (
    <Card
      key={workflow.id}
      className="hover:shadow-xl transition-shadow relative"
    >
      {workflow.new ? (
        <Badge className="absolute right-3 -top-3 flex items-center gap-1">
          <StarFilledIcon className="w-3 h-3" />
          New
        </Badge>
      ) : null}
      <CardHeader>
        <div className="w-10 h-10">
          <WorkflowLogo id={workflow.id} title={workflow.title} />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <CardTitle className="text-xl">{workflow.title}</CardTitle>
        <CardDescription>{workflow.description}</CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between">
        <>
          <Badge variant="outline">{workflow.category.name}</Badge>

          {footer}
        </>
      </CardFooter>
    </Card>
  );
}
