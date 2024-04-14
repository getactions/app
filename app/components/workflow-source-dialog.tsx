import { CodeIcon } from "@radix-ui/react-icons";
import { useMediaQuery } from "usehooks-ts";

import clsx from "clsx";
import { useState } from "react";
import { InlineCode } from "./inline-code";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "./ui/drawer";
import { WorkflowLogo } from "./workflow-logo";

type Props = Readonly<{
  id: string;
  title: string;
  source: string;
}>;

function Code({ source, className }: Props & Readonly<{ className: string }>) {
  return (
    <section className="flex flex-col gap-4">
      <pre
        className={clsx("bg-midnight rounded-xl p-6 overflow-auto", className)}
      >
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
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { id, title } = props;

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline" className="flex gap-2 group">
            <CodeIcon /> View Source
          </Button>
        </DialogTrigger>

        <DialogContent className="p-8 max-w-[1200px]">
          <DialogTitle asChild>
            <Headline id={id} title={title} />
          </DialogTitle>
          <DialogDescription>
            When you utilize the installation script, this workflow file will be
            rendered into your project.
          </DialogDescription>

          <Code
            {...props}
            className="max-h-[150px] sm:max-h-[200px] lg:max-h-[400px] xl:max-h-[500px] 2xl:max-h-[600px]"
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size="sm" variant="outline" className="flex gap-2 group">
          <CodeIcon /> View Source
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left sm:py-1">
          <Headline id={id} title={title} />
        </DrawerHeader>

        <div className="py-2 px-4">
          <Code {...props} className="max-h-[450px] sm:max-h-[120px]" />
        </div>

        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
