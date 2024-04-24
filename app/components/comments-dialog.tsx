import Giscus from "@giscus/react";

import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { ResponsiveDialog } from "./responsive-dialog";
import { Button } from "./ui/button";
import { WorkflowLogo } from "./workflow-logo";

type Props = Readonly<{
  id: string;
  title: string;
}>;

export function CommentsDialog({ id, title }: Props) {
  return (
    <ResponsiveDialog
      title={
        <div className="flex items-start gap-2 lg:gap-4">
          <span className="w-8 h-8">
            <WorkflowLogo id={id} title={title} />
          </span>
          <h2 className="text-lg lg:text-2xl font-bold">{title}</h2>
        </div>
      }
      trigger={
        <Button size="sm" variant="outline" className="flex gap-2">
          <ChatBubbleIcon /> Comments
        </Button>
      }
    >
      <div className="py-4 px-2.5 pr-3 max-h-[40vh] overflow-auto">
        <Giscus
          repo="getactions/comments"
          repoId="R_kgDOLwjfnA"
          categoryId="DIC_kwDOLwjfnM4Cezi4"
          strict="1"
          mapping="og:title"
          reactionsEnabled="0"
          emitMetadata="0"
          inputPosition="top"
          lang="en"
        />
      </div>
    </ResponsiveDialog>
  );
}
