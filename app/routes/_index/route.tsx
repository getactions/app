import { json, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Footer } from "~/components/footer";
import { IntroductionBanner } from "~/components/introduction-banner";
import { Logo } from "~/components/logo";
import { SuggestionsDialog } from "~/components/suggestions-dialog";
import { WorkflowCards } from "~/components/workflow-cards";
import { getWorkflows } from "./query";

export async function loader() {
  const resultOfGettingWorkflows = await getWorkflows();

  if (resultOfGettingWorkflows.isErr()) {
    console.error(resultOfGettingWorkflows.error);

    throw new Response("Internal Server Error", { status: 500 });
  }

  const workflows = resultOfGettingWorkflows.value;

  return json({ workflows });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title: "GitHub Actions Starter Workflows - getactions.dev",
    },
  ];
};

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <>
      <IntroductionBanner />

      <div className="h-screen flex flex-col gap-24">
        <header className="container flex flex-col gap-4 pt-24 py-16">
          <div className="w-fit">
            <Logo hero />
          </div>

          <h2 className="text-midnight text-4xl lg:text-8xl font-extrabold tracking-tight lg:w-3/4">
            Don't Copy & Paste. Install GitHub Actions Workflows.
          </h2>

          <p className="text-lg lg:text-2xl text-gray-500 lg:w-3/4 leading-relaxed">
            We all know that situation: You start a new project and need to
            configure your GitHub Actions workflows. You could copy and paste
            from another project, but why not install them instead?
          </p>
        </header>
        <main className="container flex-1 flex flex-col gap-20">
          <div className="flex justify-between">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl text-primary font-extrabold tracking-tight">
                Recently added workflows
              </h2>
              <p className="text-muted-foreground">
                Here are some of the latest workflows added to the collection.
              </p>
            </div>
            <span className="hidden lg:block">
              <SuggestionsDialog />
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <WorkflowCards workflows={loaderData.workflows} />

            <div className="lg:hidden rounded-sm flex flex-col gap-4 justify-center items-center">
              <p>Don't see the workflow you need?</p>
              <SuggestionsDialog />
              <p className="text-xs w-3/4 text-center text-muted-foreground">
                We're super excited to hear your ideas.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
