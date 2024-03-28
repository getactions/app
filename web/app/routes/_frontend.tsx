import { CopyIcon } from "@radix-ui/react-icons";
import type { MetaFunction } from "@remix-run/node";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export const meta: MetaFunction = () => {
  return [{ title: "New Open Formation Remix App" }];
};

export default function FrontendLayout() {
  return (
    <div className="flex flex-col gap-24">
      <header className="container flex flex-col gap-4 pt-16">
        <h1 className="text-center font-extrabold text-2xl">
          get<span className="text-primary">actions</span>
        </h1>
        <h2 className="text-center text-4xl font-extrabold">
          Easy to use GitHub Actions Starter Workflows
        </h2>

        <p className="text-center text-2xl text-gray-500">
          Don't waste time setting up initial workflows for your project.
        </p>
      </header>
      <main className="container flex flex-col gap-20">
        <div className="flex justify-center">
          <div className="flex items-center gap-4 text-xl bg-white shadow-xl border-[1px] rounded-full py-6 px-14">
            <p>I need a </p>

            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Deployment" />
              </SelectTrigger>
              <SelectContent className="text-2xl">
                <SelectItem value="light">Deployment</SelectItem>
                <SelectItem value="dark">CI</SelectItem>
                <SelectItem value="system">QA</SelectItem>
              </SelectContent>
            </Select>

            <p>Workflow.</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            "fly.io",
            "fly.io with Supabase",
            "fly.io with Supabase Functions",
            "Vercel",
            "AWS Lambda",
            "AWS Fargate",
            "Google Cloud Run",
          ].map((_, index) => (
            <Card key={index}>
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
                <CardTitle className="text-xl">{_}</CardTitle>
                <CardDescription>
                  Deploy your next app on fly.io - Workflow takes your existing
                  Dockerfile, builds the container on fly.io and deploys it to
                  the edge.
                </CardDescription>
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
                        <p>{_}</p>
                      </DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col gap-10">
                      <div className="flex flex-col gap-2">
                        <h3 className="font-bold text-md text-primary">
                          Description
                        </h3>
                        <p className="text-muted-foreground">
                          Deploy your next app on fly.io - Workflow takes your
                          existing Dockerfile, builds the container on fly.io
                          and deploys it to the edge.
                        </p>
                      </div>

                      <div className="flex flex-col gap-5">
                        <h3 className="font-bold text-md text-primary">
                          Install
                        </h3>
                        <Tabs defaultValue="curl">
                          <TabsList>
                            <TabsTrigger value="curl">cURL</TabsTrigger>
                            <TabsTrigger value="cli">CLI</TabsTrigger>
                            <TabsTrigger value="bun">bun</TabsTrigger>
                            <TabsTrigger value="npm">npm</TabsTrigger>
                            <TabsTrigger value="pnpm">pnpm</TabsTrigger>
                            <TabsTrigger value="yarn">yarn</TabsTrigger>
                          </TabsList>
                          <TabsContent value="curl" className="mt-5">
                            <pre className="overflow-x-auto rounded-lg border flex justify-between items-center px-4 py-2">
                              <code className="text-sm">
                                curl https://getactions.dev/fly-io | bash
                              </code>
                              <CopyIcon />
                            </pre>
                          </TabsContent>
                          <TabsContent value="cli" className="mt-5">
                            <pre className="overflow-x-auto rounded-lg border flex justify-between items-center px-4 py-2">
                              <code className="text-sm">
                                actions -id fly-io
                              </code>
                              <CopyIcon />
                            </pre>
                          </TabsContent>

                          <TabsContent value="bun" className="mt-5">
                            <pre className="overflow-x-auto rounded-lg border flex justify-between items-center px-4 py-2">
                              <code className="text-sm">
                                bunx getactions -- fly-io
                              </code>
                              <CopyIcon />
                            </pre>
                          </TabsContent>

                          <TabsContent value="npm" className="mt-5">
                            <pre className="overflow-x-auto rounded-lg border flex justify-between items-center px-4 py-2">
                              <code className="text-sm">
                                npx getactions -- fly-io
                              </code>
                              <CopyIcon />
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
                              <CopyIcon />
                            </pre>
                          </TabsContent>
                        </Tabs>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
