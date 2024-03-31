import { CopyIcon } from "@radix-ui/react-icons";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { getWorkflows } from "./query";

export const meta: MetaFunction = () => {
  return [{ title: "getactions.dev" }];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const category = String(params.category);

  if (!category) {
    throw new Response("Bad Request", { status: 400 });
  }

  const resultOfGettingWorkflows = await getWorkflows(category);

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
    <div className="grid grid-cols-3 gap-4">
      {loaderData.workflows.map((workflow) => (
        <Card key={workflow.id}>
          <CardHeader>
            <div className="w-9 h-9">
              <img
                src="https://fly.io/static/images/brand/brandmark.svg"
                alt="Fly.io"
                className="w-full h-full"
              />
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <CardTitle className="text-xl">{workflow.name}</CardTitle>
            <CardDescription>{workflow.description}</CardDescription>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Dialog>
              <DialogTrigger className="text-primary">
                Use Workflow
              </DialogTrigger>
              <DialogContent>
                <DialogHeader className="flex flex-col gap-5 pb-10">
                  <DialogTitle className="flex flex-col items-center gap-4 text-2xl">
                    <div className="w-9 h-9">
                      <img
                        src="https://fly.io/static/images/brand/brandmark.svg"
                        alt="Fly.io"
                        className="w-full h-full"
                      />
                    </div>
                    <p>{workflow.name}</p>
                  </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-10">
                  <div className="flex flex-col gap-2">
                    <h3 className="font-bold text-md text-primary">
                      Description
                    </h3>
                    <p className="text-muted-foreground">
                      {workflow.description}
                    </p>
                  </div>

                  <div className="flex flex-col gap-5">
                    <h3 className="font-bold text-md text-primary">Install</h3>
                    <pre className="overflow-x-auto rounded-lg border flex justify-between items-center px-4 py-2">
                      <code className="text-sm">
                        curl -s https://getactions.dev/{workflow.id} | bash
                      </code>
                      <CopyIcon className="text-primary cursor-pointer" />
                    </pre>
                    {/* 
                    <Tabs defaultValue="curl">
                      <TabsList>
                        <TabsTrigger value="curl">cURL</TabsTrigger>
                        <TabsTrigger value="cli">CLI</TabsTrigger>
                        <TabsTrigger value="bun">bun</TabsTrigger>
                        <TabsTrigger value="npm">npm</TabsTrigger>
                        <TabsTrigger value="pnpm">pnpm</TabsTrigger>
                        <TabsTrigger value="yarn">yarn</TabsTrigger>
                        <TabsTrigger value="source">source</TabsTrigger>
                      </TabsList>
                      <TabsContent value="curl" className="mt-5">
                        <pre className="overflow-x-auto rounded-lg border flex justify-between items-center px-4 py-2">
                          <code className="text-sm">
                            curl -s https://getactions.dev/fly-io | bash
                          </code>
                          <CopyIcon className="text-primary cursor-pointer" />
                        </pre>
                      </TabsContent>
                      <TabsContent value="cli" className="mt-5">
                        <pre className="overflow-x-auto rounded-lg border flex justify-between items-center px-4 py-2">
                          <code className="text-sm">getactions fly-io</code>
                          <CopyIcon className="text-primary cursor-pointer" />
                        </pre>

                        <p className="text-right pt-2 text-primary underline">
                          <Link to="/">
                            <small>Where do I get the CLI?</small>
                          </Link>
                        </p>
                      </TabsContent>

                      <TabsContent value="bun" className="mt-5">
                        <pre className="overflow-x-auto rounded-lg border flex justify-between items-center px-4 py-2">
                          <code className="text-sm">
                            bunx getactions -- fly-io
                          </code>
                          <CopyIcon className="text-primary cursor-pointer" />
                        </pre>
                      </TabsContent>

                      <TabsContent value="npm" className="mt-5">
                        <pre className="overflow-x-auto rounded-lg border flex justify-between items-center px-4 py-2">
                          <code className="text-sm">
                            npx getactions -- fly-io
                          </code>
                          <CopyIcon className="text-primary cursor-pointer" />
                        </pre>
                      </TabsContent>

                      <TabsContent value="pnpm" className="mt-5">
                        <pre className="overflow-x-auto rounded-lg border flex justify-between items-center px-4 py-2">
                          <code className="text-sm">
                            pnpm exec getactions -- fly-io
                          </code>
                          <CopyIcon />
                        </pre>
                      </TabsContent>

                      <TabsContent value="yarn" className="mt-5">
                        <pre className="overflow-x-auto rounded-lg border flex justify-between items-center px-4 py-2">
                          <code className="text-sm">
                            yarnx getactions -- fly-io
                          </code>
                          <CopyIcon className="text-primary cursor-pointer" />
                        </pre>
                      </TabsContent>

                      <TabsContent value="source" className="mt-5">
                        <pre className="overflow-x-auto rounded-lg border flex justify-between items-center px-4 py-2">
                          <code className="text-sm">
                            yarnx getactions -- fly-io
                          </code>
                          <CopyIcon className="text-primary cursor-pointer" />
                        </pre>
                      </TabsContent>
                    </Tabs> */}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
