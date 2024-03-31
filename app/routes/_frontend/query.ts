import { getCategories } from "#workflows";
import { ok } from "neverthrow";

export async function getWorkflowCategories() {
  const categories = await getCategories();

  return ok(categories);
}
