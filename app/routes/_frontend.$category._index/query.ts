import { err, ok } from "neverthrow";
import { findByCategory, getCategories } from "~/utils/workflows.server";
import { Workflows } from "./model";

export async function getWorkflows(request: Request, category: string) {
  const daos = findByCategory(category);

  const categories = getCategories();

  const validation = Workflows.safeParse(
    daos.map((dao) => ({
      id: dao.id,
      name: dao.name,
      category: categories.find((category) => category.id === dao.category),
      title: dao.title,
      description: dao.description,
    })),
  );

  if (!validation.success) {
    return err(new Error(`failed to prepare view model: ${validation.error}`));
  }

  return ok(validation.data);
}
