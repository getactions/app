import { CopyIcon } from "@radix-ui/react-icons";
import { Link } from "@remix-run/react";
import { useState } from "react";
import Markdown from "react-markdown";
import { InlineCode } from "./inline-code";
import { Card, CardContent, CardHeader } from "./ui/card";
import { WorkflowLogo } from "./workflow-logo";
import { WorkflowSourceDialog } from "./workflow-source-dialog";

type Props = Readonly<{
  workflow: Readonly<{
    id: string;
    name: string;
    logo?: string;
    title: string;
    readme: string;
    installCommand: string;
    source: string;
  }>;
}>;

function Instructions({ workflow }: Props) {
  const [wasCopied, setWasCopied] = useState(false);

  function handleCopy(contents: string) {
    return async function copy() {
      try {
        await navigator.clipboard.writeText(contents);

        setWasCopied(true);

        await new Promise((resolve) => setTimeout(resolve, 2000));

        setWasCopied(false);
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
    };
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <Markdown
          className="text-gray-500"
          components={{
            a: ({ node, children, ...props }) => (
              <Link
                className="text-primary"
                to={props.href ?? ""}
                target="_blank"
              >
                {children}
              </Link>
            ),
            ol: ({ node, children }) => (
              <ol className="list-decimal list-outside px-8">{children}</ol>
            ),
            code: ({ node, children, ...props }) => (
              <InlineCode>{children}</InlineCode>
            ),
            p: ({ node, children }) => (
              <p className="py-2 leading-loose">{children}</p>
            ),
          }}
        >
          {workflow.readme}
        </Markdown>
      </div>

      <div className="flex flex-col gap-5">
        <h3 className="font-bold text-md text-primary">Install</h3>

        <div className="text-sm rounded-lg border flex flex-col lg:flex-row justify-between items-center gap-4 px-4 py-2">
          <pre className="whitespace-pre-line break-all">
            {workflow.installCommand}
          </pre>

          <div className="flex gap-2">
            <CopyIcon
              className="text-primary cursor-pointer"
              onClick={handleCopy(workflow.installCommand)}
            />

            {wasCopied ? (
              <span className="text-xs text-primary">Copied!</span>
            ) : null}
          </div>
        </div>
        <p className="text-xs text-center text-gray-700">
          You can find the{" "}
          <Link
            className="text-primary"
            target="_blank"
            to={`https://github.com/getactions/getactions/tree/main/${workflow.id}.yaml`}
          >
            source
          </Link>{" "}
          of the template in our{" "}
          <Link
            className="text-primary"
            to="https://github.com/getactions/getactions"
          >
            repository
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

export function WorkflowDetailCard({ workflow }: Props) {
  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-col gap-8">
        <div className="flex justify-end">
          <WorkflowSourceDialog
            id={workflow.id}
            title={workflow.title}
            source={workflow.source}
          />
        </div>
        <div className="flex flex-col items-center gap-4">
          <span className="w-12 h-12">
            <WorkflowLogo id={workflow.id} title={workflow.title} />
          </span>

          <h2 className="text-3xl font-bold text-center text-midnight">
            {workflow.title}
          </h2>
        </div>
      </CardHeader>
      <CardContent className="lg:p-10 ">
        <Instructions workflow={workflow} />
      </CardContent>
    </Card>
  );
}
