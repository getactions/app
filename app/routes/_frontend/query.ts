import { getCategories } from "~/utils/workflows.server";
import { ok } from "neverthrow";

export async function getWorkflowCategories() {
  const categories = await getCategories();

  return ok(categories);
}
