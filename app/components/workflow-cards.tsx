import { Link } from "@remix-run/react";
import { WorkflowCard } from "./workflow-card";

type Props = Readonly<{
  workflows: ReadonlyArray<{
    id: string;
    name: string;
    logo: string;
    description: string;
    category: string;
    title: string;
  }>;
}>;

export function WorkflowCards(props: Props) {
  return props.workflows.map((workflow) => (
    <Link
      key={workflow.id}
      to={`/${workflow.category}/${workflow.name}/details`}
      prefetch="intent"
    >
      <WorkflowCard
        workflow={workflow}
        footer={<span className="text-primary text-sm">Use Workflow</span>}
      />
    </Link>
  ));
}
