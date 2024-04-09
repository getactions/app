import { CopyIcon } from "@radix-ui/react-icons";
import { Link } from "@remix-run/react";
import { useState } from "react";
import Markdown from "react-markdown";
import { Card, CardContent, CardHeader } from "./ui/card";
import { WorkflowLogo } from "./workflow-logo";

type Props = Readonly<{
  workflow: Readonly<{
    id: string;
    name: string;
    logo: string;
    title: string;
    readme: string;
    installCommand: string;
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
            code: ({ node, children, ...props }) => (
              <code className="border-midnight/50 border rounded text-xs text-midnight px-1.5 py-0.5">
                {children}
              </code>
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
            to={`https://github.com/openformation/getactions/tree/main/workflows/${workflow.id}.yaml`}
          >
            source
          </Link>{" "}
          of the template in our{" "}
          <Link
            className="text-primary"
            to="https://github.com/openformation/getactions"
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
    <Card className="lg:p-10 shadow-lg">
      <CardHeader>
        <div className="flex flex-col items-center gap-4">
          <span className="w-12 h-12">
            <WorkflowLogo title={workflow.title} logo={workflow.logo} />
          </span>

          <h2 className="text-3xl font-bold text-center text-midnight">
            {workflow.title}
          </h2>
        </div>
      </CardHeader>
      <CardContent>
        <Instructions workflow={workflow} />
      </CardContent>
    </Card>
  );
}
