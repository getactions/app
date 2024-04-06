import { findByCategory } from "#workflows";
import { err, ok } from "neverthrow";
import { Workflows } from "./model";

export async function getWorkflows(request: Request, category: string) {
  const daos = findByCategory(category);

  const validation = Workflows.safeParse(
    daos.map((dao) => ({
      id: dao.id,
      name: dao.name,
      category: category,
      title: dao.title,
      description: dao.description,
    })),
  );

  if (!validation.success) {
    return err(new Error(`failed to prepare view model: ${validation.error}`));
  }

  return ok(validation.data);
}
