import { findById } from "#workflows";
import { err, ok } from "neverthrow";
import { Workflow } from "./model";

export async function getWorkflow(id: string) {
  const result = await findById(id);

  if (result.isErr()) {
    return err(result.error);
  }

  const workflow = result.value;

  if (!workflow) {
    return ok(undefined);
  }

  const model = Workflow.safeParse({
    id: workflow.id,
    filename: workflow.filename,
    category: workflow.category,
    name: workflow.name,
    description: workflow.description,
    secrets: workflow.secrets,
    contents: workflow.contents,
  });

  if (!model.success) {
    return err(model.error);
  }

  return ok(model.data);
}