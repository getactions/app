import { ok } from "neverthrow";
import fs from "node:fs";
import path from "node:path";

import frontmatter from "front-matter";
import { z } from "zod";

const Workflow = z.object({
  id: z.string(),
  filename: z.string(),
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

const __dirname = "./workflows";

const categoryDirectories = fs
  .readdirSync(__dirname, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

const categories = categoryDirectories.map((categoryDirectory) => {
  const contents = fs.readFileSync(
    path.join(__dirname, categoryDirectory, "category.json"),
    "utf-8",
  );

  const category = JSON.parse(contents) as Readonly<{
    id: string;
    name: string;
  }>;

  return category;
});

const result = categories.flatMap((category) => {
  const categoryDirectory = path.join(__dirname, category.id);
  // REFACTOR: Optimize extension type handling
  const templates = fs
    .readdirSync(categoryDirectory)
    .filter((file) => file.endsWith(".yaml"));

  return templates.map((filename) => {
    const name = path.basename(filename, ".yaml");

    const id = `${category.id}/${name}`;

    const workflowContents = fs.readFileSync(
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

    const workflow = Workflow.parse({
      id,
      category: category.id,
      filename,
      name: parsed.attributes.name,
      description: parsed.attributes.description,
      secrets: parsed.attributes.secrets,
      contents: parsed.body,
    });

    return { [id]: workflow } as { [id: string]: Workflow };
  });
});

const workflows = result
  .map((workflows) => workflows)
  .reduce((acc, workflow) => Object.assign(acc, workflow), {});

export async function getCategories() {
  return categories;
}

export async function findById(id: string) {
  return ok(workflows[id]);
}

export async function findByCategory(category: string) {
  const workflowsInCategory = Object.keys(workflows)
    .filter((id) => workflows[id].category === category)
    .map((id) => workflows[id]);

  return ok(workflowsInCategory);
}