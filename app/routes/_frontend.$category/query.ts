import { findByCategory } from "#workflows";
import { err, ok } from "neverthrow";
import { getBaseUrl } from "~/utils/get-base-url.server";
import { Workflows } from "./model";

export async function getWorkflows(request: Request, category: string) {
  const baseUrl = getBaseUrl(request);

  const result = await findByCategory(category);

  if (result.isErr()) {
    return err(result.error);
  }

  const daos = result.value;

  const validation = Workflows.safeParse(
    daos.map((dao) => ({
      id: dao.id,
      name: dao.name,
      category: dao.category,
      title: dao.title,
      description: dao.description,
    })),
  );

  if (!validation.success) {
    return err(new Error(`failed to prepare view model: ${validation.error}`));
  }

  return ok(validation.data);
}
