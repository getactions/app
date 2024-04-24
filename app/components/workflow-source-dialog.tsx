import { CodeIcon } from "@radix-ui/react-icons";

import { InlineCode } from "./inline-code";
import { ResponsiveDialog } from "./responsive-dialog";
import { Button } from "./ui/button";
import { WorkflowLogo } from "./workflow-logo";

type Props = Readonly<{
  id: string;
  title: string;
  source: string;
}>;

function Code({ source }: Readonly<{ source: string }>) {
  return (
    <section className="flex flex-col gap-4">
      <pre className="bg-midnight rounded-xl p-6 overflow-auto h-[40vh]">
        <code className="whitespace-pre-wrap text-xs lg:text-sm text-white">
          {source}
        </code>
      </pre>

      <div className="flex justify-center">
        <p className="text-xs lg:text-sm text-center leading-loose lg:w-3/4">
          Certain workflows incorporate the{" "}
          <InlineCode>getactions.*</InlineCode> placeholders. These values are
          intended to be replaced when the workflow is installed using the
          installation script.
        </p>
      </div>
    </section>
  );
}

function Headline({ id, title }: Pick<Props, "id" | "title">) {
  return (
    <div className="flex items-start gap-2 lg:gap-4">
      <span className="w-8 h-8">
        <WorkflowLogo id={id} title={title} />
      </span>
      <h2 className="text-lg lg:text-2xl font-bold">{title}</h2>
    </div>
  );
}

export function WorkflowSourceDialog(props: Props) {
  const { id, title, source } = props;

  return (
    <ResponsiveDialog
      title={<Headline id={id} title={title} />}
      trigger={
        <Button size="sm" variant="outline" className="flex gap-2 group">
          <CodeIcon /> View Source
        </Button>
      }
      description={
        <p>
          When you utilize the installation script, this workflow file will be
          rendered into your project.
        </p>
      }
    >
      <Code source={source} />
    </ResponsiveDialog>
  );
}
