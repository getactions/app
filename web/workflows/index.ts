import { ResultAsync, err, ok } from "neverthrow";
import fs from "node:fs/promises";
import path from "node:path";
import url from "node:url";

import frontmatter from "front-matter";
import { z } from "zod";

const Workflow = z.object({
  category: z.string(),
  name: z.string(),
  description: z.string(),
  secrets: z.record(
    z.string(),
    z.object({
      description: z.string(),
    }),
  ),
  contents: z.string(),
});

type Workflow = z.infer<typeof Workflow>;

const Workflows = z.record(z.string(), Workflow);

type Workflows = z.infer<typeof Workflows>;

// TODO: Read from the filesystem
const categories = ["deployment"];

function buildWorkflows() {
  let workflows: Workflows;

  return async function getWorkflow(id: string) {
    if (!workflows) {
      const currentDirectory = url.fileURLToPath(new URL(".", import.meta.url));

      const result = await ResultAsync.fromPromise(
        Promise.all(
          categories.flatMap(async (category) => {
            const categoryDirectory = path.join(currentDirectory, category);
            const templates = await fs.readdir(categoryDirectory);

            return Promise.all(
              templates.flatMap(async (filename) => {
                const name = path.basename(filename, ".yaml");
                console.log("name", name);
                const id = `${category}/${name}`;

                console.log(id);
                const workflowContents = await fs.readFile(
                  path.join(categoryDirectory, filename),
                  "utf-8",
                );

                const parsed = frontmatter<{
                  name: string;
                  description: string;
                  secrets: Readonly<{
                    [name: string]: { description: string };
                  }>;
                }>(workflowContents);

                console.log(parsed.attributes.secrets);

                const workflow = Workflow.parse({
                  category,
                  name,
                  description: parsed.attributes.description,
                  secrets: parsed.attributes.secrets,
                  contents: parsed.body,
                });

                return { [id]: workflow } as { [id: string]: Workflow };
              }),
            );
          }),
        ),
        (unknownError) =>
          new Error(`failed to read workflows: ${unknownError}`),
      );

      if (result.isErr()) {
        return err(result.error);
      }

      workflows = result.value
        .flatMap((workflows) => workflows)
        .reduce((acc, workflow) => Object.assign(acc, workflow), {});
    }

    return ok(workflows[id]);
  };
}

export const workflows = buildWorkflows();
