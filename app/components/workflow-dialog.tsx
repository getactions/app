import { CopyIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { WorkflowIcon } from "./workflow-icon";

type Props = Readonly<{
  workflow: Readonly<{
    id: string;
    name: string;
    description: string;
  }>;
}>;

export function WorkflowDialog({ workflow }: Props) {
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

  const installCommand = `curl -s https://getactions.dev/${workflow.id} | bash`;

  return (
    <Dialog>
      <DialogTrigger className="text-primary">Use Workflow</DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex flex-col gap-5 pb-10">
          <DialogTitle className="flex flex-col items-center gap-4 text-2xl">
            <div className="w-9 h-9">
              <WorkflowIcon id={workflow.id} name={workflow.name} />
            </div>
            <p>{workflow.name}</p>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-md text-primary">Description</h3>
            <p className="text-muted-foreground">{workflow.description}</p>
          </div>

          <div className="flex flex-col gap-5">
            <h3 className="font-bold text-md text-primary">Install</h3>
            <pre className="overflow-x-auto rounded-lg border flex justify-between items-center px-4 py-2 relative">
              <code className="text-sm">{installCommand}</code>

              <CopyIcon
                className="text-primary cursor-pointer"
                onClick={handleCopy(installCommand)}
              />

              {wasCopied ? (
                <span className="text-xs text-primary">Copied</span>
              ) : null}
            </pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
