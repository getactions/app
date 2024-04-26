import Giscus from "@giscus/react";

import { PlusIcon } from "@radix-ui/react-icons";
import { LoadingIndicator } from "./loading-indicator";
import { ResponsiveDialog } from "./responsive-dialog";
import { Button } from "./ui/button";

type Props = Readonly<{
  trigger?: React.ReactNode;
}>;

export function SuggestionsDialog(props: Props) {
  return (
    <ResponsiveDialog
      title={
        <div className="flex justify-center pt-8">
          <div className="flex items-center gap-2 lg:gap-4">
            <h2 className="text-lg lg:text-2xl font-bold">
              Suggest a Workflow
            </h2>
          </div>
        </div>
      }
      description={
        <p className="text-center pb-8">
          Have a workflow in mind that you'd like to see here? Suggest it below!
        </p>
      }
      trigger={
        props.trigger ? (
          props.trigger
        ) : (
          <Button size="lg" className="flex gap-2">
            <PlusIcon /> Suggest a Workflow
          </Button>
        )
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
            strict="1"
            mapping="number"
            term="15"
            reactionsEnabled="0"
            emitMetadata="0"
            inputPosition="top"
            lang="en"
          />
        </div>
      </div>
    </ResponsiveDialog>
  );
}
