import { getCategories } from "~/utils/workflows.server";
import { err, ok } from "neverthrow";
import { Model } from "./model";

export async function getModel(category: string) {
  const dao = getCategories().find((c) => c.id === category);

  const model = Model.safeParse({
    id: dao?.id,
    name: dao?.name,
    description: dao?.description,
  });

  if (!model.success) {
    return err(new Error(`failed to prepare view model: ${model.error}`));
  }

  return ok(model.data);
}
