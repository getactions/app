import { PlusIcon } from "@radix-ui/react-icons";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Footer } from "~/components/footer";
import { IntroductionBanner } from "~/components/introduction-banner";
import { Logo } from "~/components/logo";
import { Button } from "~/components/ui/button";
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
            Don't Copy & Paste. Install GitHub Action Workflows.
          </h2>

          <p className="text-lg lg:text-2xl text-gray-500 lg:w-3/4 leading-relaxed">
            We all know that situation: You start a new project and need to
            configure your GitHub Actions workflows. You could copy and paste
            from another project, but why not install them instead?
          </p>
        </header>
        <main className="container flex-1 flex flex-col gap-20">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl text-primary font-extrabold tracking-tight">
              Recently added workflows
            </h2>
            <p className="text-muted-foreground">
              Here are some of the latest workflows added to the collection.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <WorkflowCards workflows={loaderData.workflows} />
            <div className="rounded-sm flex flex-col gap-4 justify-center items-center">
              <p>Don't see the workflow you need?</p>
              <Link
                to="https://github.com/getactions/getactions?tab=readme-ov-file#-how-do-i-contribute"
                target="_blank"
              >
                <Button className="flex gap-2 text-primary" variant="outline">
                  <PlusIcon className="h-4 w-4 text-primary" /> Add Workflow
                </Button>
              </Link>
              <p className="text-xs w-3/4 text-center text-muted-foreground">
                We're super excited to see your workflows. Share them with the
                world.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
