import Giscus from "@giscus/react";

import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { LoadingIndicator } from "./loading-indicator";
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
      {/* We render a loading animation here, which lives under the comments component.
          When the comments component is ready, it will be overlaid on top of the loading animation. */}
      <div className="max-h-[40vh] min-h-[320px] overflow-auto relative">
        <div className="absolute left-0 right-0 top-20 flex items-center justify-center -z-10">
          <div className="h-16 w-16">
            <LoadingIndicator />
          </div>
        </div>
        <div className="pl-3.5 py-4 pr-4">
          <Giscus
            repo="getactions/comments"
            host="https://comments.getactions.dev"
            repoId="R_kgDOLwjfnA"
            categoryId="DIC_kwDOLwjfnM4Cezi4"
            strict="1"
            mapping="og:title"
            reactionsEnabled="0"
            emitMetadata="0"
            inputPosition="bottom"
            lang="en"
          />
        </div>
      </div>
    </ResponsiveDialog>
  );
}
