import { findById, getCategories } from "#workflows";
import { err, ok } from "neverthrow";
import { getBaseUrl } from "~/utils/get-base-url.server";
import { Model } from "./model";

export async function getModel(
  request: Request,
  category: string,
  slug: string,
) {
  const baseUrl = getBaseUrl(request);
  const id = `${category}/${slug}`;

  const workflow = findById(id);

  const installCommand = `curl -s ${baseUrl}/${id} | sh`;

  const currentCatgory = getCategories().find((c) => c.id === category);

  const model = Model.safeParse({
    id,
    category: currentCatgory,
    title: workflow.title,
    description: workflow.description,
    installCommand,
  });

  if (!model.success) {
    return err(new Error(`failed to prepare view model: ${model.error}`));
  }

  return ok(model.data);
}
