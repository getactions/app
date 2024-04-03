import { CopyIcon } from "@radix-ui/react-icons";
import { Link } from "@remix-run/react";
import { useState } from "react";
import Markdown from "react-markdown";
import { useMediaQuery } from "usehooks-ts";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./ui/drawer";
import { WorkflowIcon } from "./workflow-icon";

type Props = Readonly<{
  workflow: Readonly<{
    id: string;
    name: string;
    title: string;
    readme: string;
    installCommand: string;
  }>;
  onClose: () => void;
}>;

function Instructions({ workflow, onClose }: Props) {
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
          className="text-muted-foreground"
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
          }}
        >
          {workflow.readme}
        </Markdown>
      </div>

      <div className="flex flex-col gap-5">
        <h3 className="font-bold text-md text-primary">Install</h3>

        <div className="text-sm rounded-lg border flex flex-col lg:flex-row justify-between items-center gap-4 px-4 py-2">
          <pre className="whitespace-break-spaces">
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

export function WorkflowDialog(props: Props) {
  const [open, setOpen] = useState(true);

  const { workflow, onClose } = props;
  const isDesktop = useMediaQuery("(min-width: 768px)");

  async function onOpenChange(open: boolean) {
    setOpen(open);

    if (!open) {
      // Give the close animation a little bit more time to finish
      await new Promise((resolve) => setTimeout(resolve, 500));

      onClose();
    }
  }

  if (isDesktop) {
    return (
      <Dialog open onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader className="flex flex-col gap-5 pb-4">
            <DialogTitle className="flex flex-col items-center gap-4 text-2xl">
              <div className="w-9 h-9">
                <WorkflowIcon id={workflow.id} name={workflow.name} />
              </div>
              <p>{workflow.title}</p>
            </DialogTitle>
          </DialogHeader>

          <Instructions {...props} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle className="flex flex-col items-center gap-4 text-2xl">
            <div className="w-9 h-9">
              <WorkflowIcon id={workflow.id} name={workflow.name} />
            </div>
            <p className="w-3/4 text-center">{workflow.title}</p>
          </DrawerTitle>
        </DrawerHeader>
        <div className="p-8">
          <Instructions {...props} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
