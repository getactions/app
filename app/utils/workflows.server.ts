import fs from "node:fs";
import path from "node:path";

import frontmatter from "front-matter";
import { z } from "zod";

const GitHubActionsLogo = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><path fill="#2088ff" d="M26.666 0C11.97 0 0 11.97 0 26.666c0 12.87 9.181 23.651 21.334 26.13v37.87c0 11.77 9.68 21.334 21.332 21.334h.195c1.302 9.023 9.1 16 18.473 16C71.612 128 80 119.612 80 109.334s-8.388-18.668-18.666-18.668c-9.372 0-17.17 6.977-18.473 16h-.195c-8.737 0-16-7.152-16-16V63.779a18.514 18.514 0 0 0 13.24 5.555h2.955c1.303 9.023 9.1 16 18.473 16 9.372 0 17.169-6.977 18.47-16h11.057c1.303 9.023 9.1 16 18.473 16 10.278 0 18.666-8.39 18.666-18.668C128 56.388 119.612 48 109.334 48c-9.373 0-17.171 6.977-18.473 16H79.805c-1.301-9.023-9.098-16-18.471-16s-17.171 6.977-18.473 16h-2.955c-6.433 0-11.793-4.589-12.988-10.672 14.58-.136 26.416-12.05 26.416-26.662C53.334 11.97 41.362 0 26.666 0zm0 5.334A21.292 21.292 0 0 1 48 26.666 21.294 21.294 0 0 1 26.666 48 21.292 21.292 0 0 1 5.334 26.666 21.29 21.29 0 0 1 26.666 5.334zm-5.215 7.541C18.67 12.889 16 15.123 16 18.166v17.043c0 4.043 4.709 6.663 8.145 4.533l13.634-8.455c3.257-2.02 3.274-7.002.032-9.045l-13.635-8.59a5.024 5.024 0 0 0-2.725-.777zm-.117 5.291 13.635 8.588-13.635 8.455V18.166zm40 35.168a13.29 13.29 0 0 1 13.332 13.332A13.293 13.293 0 0 1 61.334 80 13.294 13.294 0 0 1 48 66.666a13.293 13.293 0 0 1 13.334-13.332zm48 0a13.29 13.29 0 0 1 13.332 13.332A13.293 13.293 0 0 1 109.334 80 13.294 13.294 0 0 1 96 66.666a13.293 13.293 0 0 1 13.334-13.332zm-42.568 6.951a2.667 2.667 0 0 0-1.887.78l-6.3 6.294-2.093-2.084a2.667 2.667 0 0 0-3.771.006 2.667 2.667 0 0 0 .008 3.772l3.974 3.96a2.667 2.667 0 0 0 3.766-.001l8.185-8.174a2.667 2.667 0 0 0 .002-3.772 2.667 2.667 0 0 0-1.884-.78zm48 0a2.667 2.667 0 0 0-1.887.78l-6.3 6.294-2.093-2.084a2.667 2.667 0 0 0-3.771.006 2.667 2.667 0 0 0 .008 3.772l3.974 3.96a2.667 2.667 0 0 0 3.766-.001l8.185-8.174a2.667 2.667 0 0 0 .002-3.772 2.667 2.667 0 0 0-1.884-.78zM61.334 96a13.293 13.293 0 0 1 13.332 13.334 13.29 13.29 0 0 1-13.332 13.332A13.293 13.293 0 0 1 48 109.334 13.294 13.294 0 0 1 61.334 96zM56 105.334c-2.193 0-4 1.807-4 4 0 2.195 1.808 4 4 4s4-1.805 4-4c0-2.193-1.807-4-4-4zm10.666 0c-2.193 0-4 1.807-4 4 0 2.195 1.808 4 4 4s4-1.805 4-4c0-2.193-1.807-4-4-4zM56 108c.75 0 1.334.585 1.334 1.334 0 .753-.583 1.332-1.334 1.332-.75 0-1.334-.58-1.334-1.332 0-.75.585-1.334 1.334-1.334zm10.666 0c.75 0 1.334.585 1.334 1.334 0 .753-.583 1.332-1.334 1.332-.75 0-1.332-.58-1.332-1.332 0-.75.583-1.334 1.332-1.334z"/><path fill="#79b8ff" d="M109.334 90.666c-9.383 0-17.188 6.993-18.477 16.031a2.667 2.667 0 0 0-.265-.011l-2.7.09a2.667 2.667 0 0 0-2.578 2.751 2.667 2.667 0 0 0 2.752 2.578l2.7-.087a2.667 2.667 0 0 0 .097-.006C92.17 121.029 99.965 128 109.334 128c10.278 0 18.666-8.388 18.666-18.666s-8.388-18.668-18.666-18.668zm0 5.334a13.293 13.293 0 0 1 13.332 13.334 13.29 13.29 0 0 1-13.332 13.332A13.293 13.293 0 0 1 96 109.334 13.294 13.294 0 0 1 109.334 96z"/></svg>
`;

const Workflow = z.object({
  id: z.string(),
  category: z.string(),
  name: z.string(),
  logo: z.string().optional(),

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
    frontmatter<
      Readonly<{ id: string; name: string; description: string; emoji: string }>
    >(contents);

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

      const logoPath = path.join(categoryDirectory, `${name}/logo.svg`);
      const logoExists = fs.existsSync(logoPath);
      const logoContents = logoExists
        ? fs.readFileSync(logoPath, "utf-8")
        : GitHubActionsLogo;

      const parsedReadme =
        frontmatter<
          Readonly<{
            title: string;
            description: string;
          }>
        >(readmeContents);

      const parsedWorkflow = frontmatter<{
        secrets?: Readonly<{
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

export function findAll() {
  return Object.values(workflows);
}

export function findByCategory(category: string) {
  const workflowsInCategory = Object.keys(workflows)
    .filter((id) => workflows[id].category === category)
    .map((id) => workflows[id]);

  return workflowsInCategory;
}
