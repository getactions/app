import { findById } from "#workflows";
import { err, ok } from "neverthrow";
import { getBaseUrl } from "~/utils/get-base-url.server";
import { Workflow } from "./model";

export async function getWorkflow(
  request: Request,
  category: string,
  slug: string,
) {
  const baseUrl = getBaseUrl(request);
  const resultOfGettingWorkflow = await findById(`${category}/${slug}`);

  if (resultOfGettingWorkflow.isErr()) {
    return err(resultOfGettingWorkflow.error);
  }

  const dao = resultOfGettingWorkflow.value;

  const workflow = Workflow.safeParse({
    id: dao.id,
    category: dao.category,
    name: dao.name,
    title: dao.title,
    readme: dao.readme,
    installCommand: `curl -s ${baseUrl}/${dao.id} | bash`,
  });

  if (!workflow.success) {
    return err(new Error(`failed to prepare view model: ${workflow.error}`));
  }

  return ok(workflow.data);
}
