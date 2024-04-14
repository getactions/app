import fs from "node:fs";
import path from "node:path";

import frontmatter from "front-matter";
import { z } from "zod";

const Workflow = z.object({
  id: z.string(),
  category: z.string(),
  name: z.string(),
  logo: z.string(),

  title: z.string(),
  description: z.string(),
  readme: z.string(),

  parameters: z
    .record(
      z.string(),
      z.object({
        description: z.string(),
      }),
    )
    .optional(),

  secrets: z
    .record(
      z.string(),
      z.object({
        description: z.string(),
      }),
    )
    .optional(),
  contents: z.string(),
});

type Workflow = z.infer<typeof Workflow>;

const __dirname = "./workflows";

const categoryDirectories = fs
  .readdirSync(__dirname, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .filter((dirent) => !dirent.name.startsWith("."))
  .map((dirent) => dirent.name);

const categories = categoryDirectories.map((categoryDirectory) => {
  const contents = fs.readFileSync(
    path.join(__dirname, categoryDirectory, "readme.md"),
    "utf-8",
  );

  const parsed =
    frontmatter<Readonly<{ id: string; name: string; description: string }>>(
      contents,
    );

  const category = parsed.attributes;

  return category;
});

const result = categories.flatMap((category) => {
  const categoryDirectory = path.join(__dirname, category.id);
  // REFACTOR: Optimize extension type handling
  const templates = fs.readdirSync(categoryDirectory);

  return templates
    .filter((name) =>
      fs.lstatSync(path.join(categoryDirectory, name)).isDirectory(),
    )
    .map((name) => {
      const id = `${category.id}/${name}`;

      const readmeContents = fs.readFileSync(
        path.join(categoryDirectory, `${name}/readme.md`),
        "utf-8",
      );
      const workflowContents = fs.readFileSync(
        path.join(categoryDirectory, `${name}/workflow.yaml`),
        "utf-8",
      );

      const logoContents = fs.readFileSync(
        path.join(categoryDirectory, `${name}/logo.svg`),
        "utf-8",
      );

      const parsedReadme =
        frontmatter<
          Readonly<{
            title: string;
            description: string;
          }>
        >(readmeContents);

      const parsedWorkflow = frontmatter<{
        secrets: Readonly<{
          [name: string]: { description: string };
        }>;
        parameters?: Readonly<{
          [name: string]: { description: string };
        }>;
      }>(workflowContents);

      const workflow = Workflow.parse({
        id,
        name,
        logo: logoContents,
        category: category.id,

        title: parsedReadme.attributes.title,
        description: parsedReadme.attributes.description,
        readme: parsedReadme.body,

        secrets: parsedWorkflow.attributes.secrets,
        parameters: parsedWorkflow.attributes.parameters,
        contents: parsedWorkflow.body,
      });

      return { [id]: workflow } as { [id: string]: Workflow };
    });
});

const workflows = result
  .map((workflows) => workflows)
  .reduce((acc, workflow) => Object.assign(acc, workflow), {});

export function getCategories() {
  return categories;
}

export function findById(id: string) {
  return workflows[id];
}

export function findByCategory(category: string) {
  const workflowsInCategory = Object.keys(workflows)
    .filter((id) => workflows[id].category === category)
    .map((id) => workflows[id]);

  return workflowsInCategory;
}
