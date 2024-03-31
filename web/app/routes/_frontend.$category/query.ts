import { findByCategory } from "#workflows";
import { err, ok } from "neverthrow";
import { Workflows } from "./model";

export async function getWorkflows(category: string) {
  const result = await findByCategory(category);

  if (result.isErr()) {
    return err(result.error);
  }

  const daos = result.value;

  const validation = Workflows.safeParse(
    daos.map((dao) => ({
      id: dao.id,
      name: dao.name,
      description: dao.description,
    })),
  );

  if (!validation.success) {
    return err(new Error(`failed to prepare view model: ${validation.error}`));
  }

  return ok(validation.data);
}
